<!--
* @description 
* @fileName Search.vue
* @author zheng yuanhou
* @date 2024/12/31 14:28:54
!-->
<template>
  <van-search ref="search" v-bind="$attrs" v-model="_value" @search="onSearch">
    <template v-if="_rightIcon" #right-icon>
      <van-icon
        :name="_rightIcon"
        size="24"
        color="#1989fa"
        @click.stop.prevent="onRightIconClick"
      />
    </template>
  </van-search>
</template>

<script>
import { Search, Icon } from "vant";
import { bridge } from "hips-wx-utils";
export default {
  // 组件名称
  name: "SearchField",
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: String,
      default() {
        return "";
      },
    },
    field: {
      type: Object,
      default() {
        return {};
      },
    },
    onChange: {
      type: [Function, undefined],
      default() {
        return undefined;
      },
    },
  },
  // 局部注册的组件
  components: {
    [Search.name]: Search,
    [Icon.name]: Icon,
  },
  // 组件状态值
  data() {
    return {};
  },
  // 计算属性
  computed: {
    _value: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    _rightIcon() {
      return this.$attrs.rightIcon;
    },
  },
  // 组件方法
  methods: {
    async onRightIconClick() {
      try {
        if (this._rightIcon === "scan") {
          const value = await bridge.scan();
          this._value = value;
          this.onSearch(value);
        }
        if (this.$refs.search) {
          this.$emit("search-right-icon-click", this.$refs.search);
        } else {
          console.error("Search ref is not available");
        }
      } catch (error) {
        console.error("Error during scan operation:", error);
        // 可以选择在这里发出错误事件或进行其他处理
      }
    },
    onSearch(value) {
      if (typeof this.onChange == "function") {
        this.onChange(value);
      }
      this.$emit("search", value);
    },
  },
};
</script>

<style lang="less" scoped></style>
