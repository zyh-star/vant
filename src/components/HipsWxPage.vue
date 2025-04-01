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
    // initContentStyle() {
    //   if (!document.querySelector(".hips-page")) return;

    //   let height = document.querySelector(".hips-page").offsetHeight - 46;
    //   if (this.$slots["footer"]) {
    //     const footer = this.$refs.footer;
    //     if (footer) {
    //       height -= footer.offsetHeight || footer.firstChild?.offsetHeight || 0;
    //     }
    //   }
    //   if (this.$refs.content && height > 0) {
    //     this.$refs.content.style.height = `${height}px`;
    //   }
    // },
    onFocus(e) {
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    },
  },
  mounted() {
    this.$nextTick(() => {
      // this.initContentStyle();
      const inputs = document.querySelectorAll("input");
      const textareas = document.querySelectorAll("textarea");
      inputs.forEach((item) => item.addEventListener("focus", this.onFocus));
      textareas.forEach((item) => item.addEventListener("focus", this.onFocus));
    });
  },
  updated() {
    this.$nextTick(() => {
      // this.initContentStyle();
    });
  },
  beforeDestroy() {
    const inputs = document.querySelectorAll("input");
    const textareas = document.querySelectorAll("textarea");
    inputs.forEach((item) => item.removeEventListener("focus", this.onFocus));
    textareas.forEach((item) =>
      item.removeEventListener("focus", this.onFocus)
    );
  },
};
</script>

<style lang="less" scoped>
@width: calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right));
@height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));

.hips-page {
  height: @height;
  width: @width;
  .content {
    overflow: auto;
    height: 85vh;
    height: calc(
      100vh - 46px - env(safe-area-inset-top) - env(safe-area-inset-bottom)
    );
  }
  .footer {
    width: 100vw;
    position: fixed;
    bottom: 0;
  }
}
</style>
