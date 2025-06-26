<template>
  <div class="hips-page">
    <van-nav-bar
      :title="_title"
      :right-text="rightText"
      left-arrow
      safe-area-inset-top
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <template #left>
        <slot name="nav-bar-left"></slot>
      </template>
      <template #right>
        <slot name="nav-bar-right"></slot>
      </template>
    </van-nav-bar>
    <div ref="content" class="content">
      <slot></slot>
    </div>
    <div ref="footer" class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import { NavBar } from "vant";

export default {
  name: "HipsWxPage",
  props: {
    title: {
      type: String,
      default: "",
    },
    rightText: {
      type: [String, Number],
      default: "",
    },
  },
  components: {
    [NavBar.name]: NavBar,
  },
  computed: {
    _title() {
      return this.title || this.$route?.meta?.title || "默认标题";
    },
  },
  methods: {
    onClickLeft(e) {
      this.$emit("click-left", e);
    },
    onClickRight(e) {
      this.$emit("click-right", e);
    },
    onFocus(e) {
      const target = e.target;
      if (!["INPUT", "TEXTAREA"].includes(target.tagName)) {
        return false;
      }

      setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    },
  },

  mounted() {
    this.$el.addEventListener("focusin", this.onFocus);
  },
  beforeDestroy() {
    // 移除事件监听（避免内存泄漏）
    this.$el.removeEventListener("focusin", this.onFocus);
  },
};
</script>

<style lang="less" scoped>
@width: calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right));
@height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));

.hips-page {
  // 防止某些机型不支持计算css  属性
  height: 100vh;
  width: 100vw;
  height: @height;
  width: @width;
  display: flex;
  flex-direction: column;
  margin: 0; /* 避免默认 margin 影响 */
  .content {
    flex: 1;
    overflow: auto;
  }
  .footer {
    width: 100vw;
    display: flex;
    .van-button {
      flex: 1;
    }
  }
}
</style>
