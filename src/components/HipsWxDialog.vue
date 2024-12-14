<!--
* @description 确认框
* @fileName HipsWxDialog.vue
* @author zheng yuanhou
* @date 2024/06/26 08:23:18
!-->
<template>
  <van-popup
    v-model="show"
    round
    safe-area-inset-bottom
    :get-container="getContainer"
  >
    <slot name="title">
      <van-nav-bar :title="title" />
    </slot>
    <div class="content">
      <slot></slot>
    </div>
    <div class="footer">
      <slot name="footer">
        <van-button v-if="showCancelButton" @click="onCancel">
          取消
        </van-button>
        <van-button v-if="showSkipButton" type="warning" @click="onSkip">
          跳过
        </van-button>
        <van-button v-if="showConfirmButton" type="info" @click="onConfirm">
          确认
        </van-button>
      </slot>
    </div>
  </van-popup>
</template>

<script>
import { Button, Popup, NavBar } from "vant";

export default {
  // 组件名称
  name: "HipsWxDialog",
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    getContainer: [String, () => Element],
    showConfirmButton: {
      type: Boolean,
      default: true,
    },
    showCancelButton: {
      type: Boolean,
      default: true,
    },
    showSkipButton: {
      type: Boolean,
      default: false,
    },
  },
  // 局部注册的组件
  components: {
    [Button.name]: Button,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
  },
  // 计算属性
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      },
    },
  },
  // 组件方法
  methods: {
    onCancel(e) {
      this.$emit("cancel", e);
    },
    onSkip(e) {
      this.$emit("skip", e);
    },
    onConfirm(e) {
      this.$emit("confirm", e);
    },
  },
};
</script>

<style lang="less" scoped>
.van-popup {
  display: flex;
  width: 80vw;
  flex-direction: column;
  .content {
    display: flex;
    flex-direction: column;
    padding: 2vw;
  }
  .footer {
    display: flex;
    height: 10vw;
    .van-button {
      height: 100%;
      flex: 1;
    }
  }
}
</style>
