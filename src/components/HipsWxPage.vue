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
    handleFocusIn(e) {
      const target = e.target;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        this.activeInput = target;
        // iOS 键盘弹出需要一定时间
        setTimeout(() => {
          this.scrollIntoView();
        }, 350);
      }
    },
    handleFocusOut() {
      this.activeInput = null;
    },
    scrollIntoView() {
      if (this.activeInput && this.$refs.content) {
        const rect = this.activeInput.getBoundingClientRect();
        const keyboardHeight = this.keyboardHeight;

        // 计算输入框底部到可视区域底部的距离
        const inputBottom = rect.bottom;
        const visibleBottom = window.innerHeight - keyboardHeight;

        // 如果输入框被键盘遮挡，滚动到可见位置
        if (inputBottom > visibleBottom - 20) {
          const scrollOffset = inputBottom - visibleBottom + 20;
          this.$refs.content.scrollBy({
            top: scrollOffset,
            behavior: "smooth",
          });
        }
      }
    },
    handleResize() {
      const visualViewport = window.visualViewport;
      if (visualViewport) {
        const keyboardHeight = window.innerHeight - visualViewport.height;

        if (keyboardHeight > 100) {
          // 键盘弹出
          this.keyboardHeight = keyboardHeight;
          // 添加底部 padding 防止内容被键盘遮挡
          if (this.$refs.content) {
            this.$refs.content.style.paddingBottom = keyboardHeight + "px";
          }
          // 滚动到聚焦的输入框
          this.scrollIntoView();
        } else {
          // 键盘收起
          this.keyboardHeight = 0;
          if (this.$refs.content) {
            this.$refs.content.style.paddingBottom = "0px";
          }
        }
      }
    },
  },

  data() {
    return {
      keyboardHeight: 0,
      activeInput: null,
    };
  },
  mounted() {
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", this.handleResize);
      window.visualViewport.addEventListener("scroll", this.handleResize);
    }
    // 监听输入框聚焦事件
    this.$refs.content.addEventListener("focusin", this.handleFocusIn);
    this.$refs.content.addEventListener("focusout", this.handleFocusOut);
  },
  beforeDestroy() {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", this.handleResize);
      window.visualViewport.removeEventListener("scroll", this.handleResize);
    }
    if (this.$refs.content) {
      this.$refs.content.removeEventListener("focusin", this.handleFocusIn);
      this.$refs.content.removeEventListener("focusout", this.handleFocusOut);
    }
  },
};
</script>

<style lang="less" scoped>
@width: calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right));
@height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));

.hips-page {
  height: 100vh;
  width: 100vw;
  height: @height;
  width: @width;
  display: flex;
  flex-direction: column;
  margin: 0;
  overflow: hidden;
  .content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
  .footer {
    width: 100vw;
    display: flex;
    flex-shrink: 0;
    .van-button {
      flex: 1;
    }
  }
}
</style>
