<!--
* @description 
* @fileName NavBar.vue
* @author zheng yuanhou
* @date 2024/12/30 11:32:45
!-->
<template>
  <van-nav-bar
    v-show="!hidden"
    v-bind="data"
    :title="title"
    :right-text="rightText"
    left-arrow
    safe-area-inset-top
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template v-if="leftIcon" #left>
      <van-icon :name="leftIcon" :size="size" :color="color" />
    </template>
    <template v-if="rightIcon" #right>
      <van-icon :name="rightIcon" :size="size" :color="color" />
    </template>
  </van-nav-bar>
</template>

<script>
import { NavBar, Icon } from "vant";
import { bridge } from "hips-wx-utils";
import mixin from "@/mixin/index";
export default {
  // 组件名称
  name: "NavBar",
  // 组件参数 接收来自父组件的数据
  props: {
    navbar: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mixins: [mixin],
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
  },
  computed: {
    data() {
      const { data = {} } = this.navbar;
      return data;
    },
    title() {
      const { title } = this.data;
      return this.i18n(title);
    },
    rightText() {
      const { rightText } = this.data;

      return this.i18n(rightText);
    },
    webView() {
      const { webView } = this.data;
      if (webView) {
        return true;
      }
      try {
        let { webView: a = false } = this.$route.params;
        let { webView: b = false } = this.$route.query;
        return a || b;
      } catch {
        return false;
      }
    },
    leftIcon() {
      const { leftIcon = "" } = this.data;
      return leftIcon;
    },
    rightIcon() {
      const { rightIcon = "" } = this.data;
      return rightIcon;
    },
    size() {
      const { size = 24 } = this.data;
      return size;
    },
    color() {
      const { color = "#1989fa" } = this.data;
      return color;
    },
    hidden() {
      const { hidden = false } = this.data;
      return hidden;
    },
  },
  // 组件方法
  methods: {
    onClickLeft(event) {
      const { clickLeft } = this.$attrs;
      if (typeof clickLeft === "function") {
        clickLeft(event);
      } else {
        if (this.webView) {
          bridge.closeWebView();
        } else {
          this.$router.back();
        }
      }
      this.$emit("click-left", event);
    },
    onClickRight(event) {
      const { clickRight } = this.$attrs;
      if (typeof clickRight === "function") {
        clickRight(event);
      } else {
        if (this.rightIcon === "search") {
          this.$emit("search", event);
        }
      }
      this.$emit("click-right", event);
    },
  },
};
</script>

<style lang="less" scoped></style>
