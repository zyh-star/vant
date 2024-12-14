<!--
* @description 右下方悬浮按钮组件
* @fileName HipsWxFloatBtn.vue
* @author zheng yuanhou
* @date 2024/06/26 08:41:49
!-->
<template>
  <div
    ref="float"
    class="float-btn"
    :style="{ top, left, backgroundColor }"
    @click="onClick"
  >
    <van-icon :name="icon" :size="size" :color="color"></van-icon>
  </div>
</template>

<script>
import { Icon } from "vant";

export default {
  // 组件名称
  name: "HipsWxFloatBtn",
  // 组件参数 接收来自父组件的数据
  props: {
    icon: {
      type: String,
      default: "add",
    },
    size: {
      type: Number,
      default: 24,
    },
    color: {
      type: String,
      default: "#1989fa",
    },
    backgroundColor: {
      type: String,
      default: "#fff",
    },
  },
  // 局部注册的组件
  components: {
    [Icon.name]: Icon,
  },
  // 组件状态值
  data() {
    return {
      top: "90vh",
      left: "85vw",
    };
  },
  // 组件方法
  methods: {
    init() {
      const div = this.$refs.float;
      div.addEventListener("touchmove", this.touchMove);
    },
    unInit() {
      const div = this.$refs.float;
      div.removeEventListener("touchmove", this.touchMove);
    },
    touchMove(event) {
      // 处理手指移动逻辑
      // 可以调用 event.preventDefault() 阻止滚动
      var touch = event.touches[0]; // 获取第一个触摸点
      const height = event.target.offsetHeight;
      const width = event.target.offsetWidth;
      this.top = `${touch.clientY - height / 2}px`;
      this.left = `${touch.clientX - width / 2}px`;
    },
    onClick() {
      this.$emit("click");
    },
  },
  // 组件生成完毕后触发
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.unInit();
  },
};
</script>

<style lang="less" scoped>
.float-btn {
  position: fixed;
  z-index: 20;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
