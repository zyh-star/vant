<!--
* @description 
* @fileName HipsWxPage.vue
* @author zheng yuanhou
* @date 2024/06/25 16:10:49
!-->
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
import { NavBar, Field } from "vant";
// import { detectOS } from "hips-wx-utils";
export default {
  // 组件名称
  name: "HipsWxPage",
  // 组件参数 接收来自父组件的数据
  props: {
    title: {
      type: String,
      default: "",
    },
    rightText: {
      type: String,
      default: "",
    },
  },
  // 局部注册的组件
  components: {
    [NavBar.name]: NavBar,
    [Field.name]: Field,
  },
  // 组件状态值
  data() {
    return {
      // t: null,
    };
  },
  // 计算属性
  computed: {
    _title() {
      return this.title || this.$route.meta.title;
    },
  },
  // 组件方法
  methods: {
    onClickLeft(e) {
      this.$emit("click-left", e);
    },
    onClickRight(e) {
      this.$emit("click-right", e);
    },
    initContentStyle() {
      if (!document.querySelector(".hips-page")) {
        return false;
      }
      let height = document.querySelector(".hips-page").offsetHeight - 46;
      if (this.$slots["footer"]) {
        const footer = this.$refs.footer;
        // const platform = detectOS();
        // const bottom = /[iI][oO][sS]/.test(platform)
        //   ? "calc(0 + env(safe-area-inset-bottom))"
        //   : 0;
        if (footer) {
          // footer.style.bottom = bottom;
          if (footer.offsetHeight > 0) {
            height -= footer.offsetHeight;
          } else if (footer.offsetHeight <= 0) {
            if (footer.firstChild) {
              height -= footer.firstChild.offsetHeight;
            }
          }
        }
      }
      if (this.$refs.content && height > 0) {
        const content = this.$refs.content;
        content.style.height = `${height}px`;
      }
    },
    onFocus(e) {
      setTimeout(() => {
        e.target.scrollIntoViewIfNeeded();
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initContentStyle();
      const inputs = document.querySelectorAll("input");
      const textareas = document.querySelectorAll("textarea");
      inputs.forEach((item) => {
        item.addEventListener("focus", this.onFocus);
      });
      textareas.forEach((item) => {
        item.addEventListener("focus", this.onFocus);
      });
    });
  },
  // unMounted() {
  //   clearInterval(this.t);
  // },
  // activated() {
  //   this.t = this.initContentStyle();
  // },
  // deactivated() {
  //   clearInterval(this.t);
  // },
  updated() {
    this.$nextTick(() => {
      this.initContentStyle();
      const inputs = document.querySelectorAll("input");
      const textareas = document.querySelectorAll("textarea");
      inputs.forEach((item) => {
        item.removeEventListener("focus", this.onFocus);
      });
      textareas.forEach((item) => {
        item.removeEventListener("focus", this.onFocus);
      });
      inputs.forEach((item) => {
        item.addEventListener("focus", this.onFocus);
      });
      textareas.forEach((item) => {
        item.addEventListener("focus", this.onFocus);
      });
    });
  },
  unMounted() {
    const inputs = document.querySelectorAll("input");
    const textareas = document.querySelectorAll("textarea");
    inputs.forEach((item) => {
      item.removeEventListener("focus", this.onFocus);
    });
    textareas.forEach((item) => {
      item.removeEventListener("focus", this.onFocus);
    });
  },
};
</script>

<style lang="less" scoped>
@width: calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right));
@height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
.hips-page {
  height: 100vh;
  height: @height;
  width: @width;
  // position: relative;
  .content {
    overflow: auto;
  }
  .footer {
    // width: 100vw;
    // position: fixed;
    // bottom: 0;
    // bottom: calc(0 + env(safe-area-inset-bottom));
  }
}
</style>
