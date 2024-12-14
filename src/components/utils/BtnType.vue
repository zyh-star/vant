<!--
* @description 
* @fileName BtnType.vue
* @author zheng yuanhou
* @date 2024/12/12 17:13:23
!-->
<template>
  <div class="btns">
    <van-button
      v-for="(item, index) in showBtns"
      :key="index"
      v-bind="initBtnProps(item)"
      @click="(event) => onClick(event, item.click)"
    >
      {{ initBtnProps(item).text }}
    </van-button>
    <van-button
      v-if="value.length > 3"
      size="large"
      native-type="button"
      @click="show = true"
    >
      更多
    </van-button>

    <van-popup v-model="show" position="bottom" class="btn-more">
      <van-button
        v-for="(item, index) in value"
        :key="index"
        v-bind="initBtnProps(item)"
        @click="(event) => onClick(event, item.click)"
      >
        {{ initBtnProps(item).text }}
      </van-button>
    </van-popup>
  </div>
</template>

<script>
import { Button, Popup } from "vant";
export default {
  // 组件名称
  name: "BtnType",
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  // 局部注册的组件
  components: {
    [Button.name]: Button,
    [Popup.name]: Popup,
  },
  // 组件状态值
  data() {
    return {
      show: false,
    };
  },
  // 计算属性
  computed: {
    showBtns() {
      if (this.value.length > 3) {
        return this.value.slice(0, 2);
      }
      return this.value.slice(0, 3);
    },
  },
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    initBtnProps(item) {
      if (typeof item === "string") {
        switch (item) {
          case "reset":
            return {
              size: "large",
              nativeType: "reset",
              text: "重置",
            };
          case "search":
            return {
              size: "large",
              type: "info",
              nativeType: "submit",
              text: "查询",
            };
          case "submit":
            return {
              size: "large",
              type: "info",
              nativeType: "submit",
              text: "提交",
            };
          default:
            return {
              size: "large",
              nativeType: "button",
              type: "warning",
              text: "未定义",
            };
        }
      } else if (typeof item === "object") {
        return {
          size: "large",
          nativeType: "button",
          text: "",
          ...item,
        };
      }
    },
    onClick(event, click) {
      if (typeof click === "function") {
        event.stopPropagation();
        event.prentDefault();
        click(event);
      }
      this.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
.btns {
  display: flex;
  width: 100%;
  position: absolute;
  bottom: 0;
  > .van-button {
    flex: 1;
  }
}
</style>
