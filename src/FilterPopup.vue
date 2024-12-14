<!--
* @description 筛选框
* @fileName filter.vue
* @author zheng yuanhou
* @date 2024/11/11 14:55:54
!-->
<template>
  <!-- 使用 van-popup 实现顶部弹出层 -->
  <van-popup
    v-model="show"
    class="filter-popup"
    position="top"
    :get-container="getContainer"
  >
    <div class="filter">
      <slot />
    </div>
    <div class="footer">
      <van-button type="warning" @click="onReset"> 重置 </van-button>
      <van-button type="info" @click="onFilter"> 查询 </van-button>
    </div>
  </van-popup>
</template>

<script>
import { Popup, Button } from "vant";
export default {
  // 组件名称
  name: "FilterPopup",
  // 组件参数 接收来自父组件的数据
  props: {
    // 定义 getContainer 属性，用于指定弹出层的父节点
    getContainer: [String, () => Element],
    value: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    [Popup.name]: Popup,
    [Button.name]: Button,
  },
  // 组件状态值
  data() {
    return {};
  },
  // 计算属性
  computed: {
    // 同步外部传入的 value 值
    show: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      },
    },
    _params: {
      get() {
        return this.params;
      },
      set(v) {
        this.$emit("update:params", v);
      },
    },
  },
  // 组件方法
  methods: {
    // 筛选方法，收集筛选条件并触发 filter 事件
    onFilter() {
      this.hiddenShow();
      this.$emit("filter");
    },
    // 重置方法，清空筛选条件并触发 reset 事件
    onReset() {
      for (let key in this._params) {
        this._params[key] = "";
      }
      this._params = { ...this._params };
      this.$emit("reset", this._params);
    },
    // 隐藏弹出层
    hiddenShow() {
      this.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
.filter-popup {
  padding-top: env(safe-area-inset-top);
}
// 设置筛选弹出层的样式
.filter {
  max-height: 60vh;
  overflow-y: auto;
}
.footer {
  display: flex;
  .van-button {
    flex: 1;
  }
}
</style>
