<!--
* @description 
* @fileName index.vue
* @author zheng yuanhou
* @date 2025/05/28 10:42:09
!-->
<template>
  <van-swipe-cell
    stop-propagation
    @open="setPush(false)"
    @close="setPush(false)"
  >
    <wx-card
      :title="_title"
      :value="_value"
      :label="label"
      :data="data"
      :class="_className"
      @click="onClick($event, data)"
    >
      <template #default="{ value }">
        <slot name="default" :value="value" />
      </template>
    </wx-card>
    <template #left>
      <slot name="left" :data="data" />
    </template>
    <template #right>
      <slot name="right" :data="data" />
    </template>
  </van-swipe-cell>
</template>

<script>
import { SwipeCell } from "vant";
import Card from "@/components/utils/view/card/Card.vue";

export default {
  // 组件名称
  name: "HipsWxSwipeCell",
  // 组件参数 接收来自父组件的数据
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: [String, Function],
      default: "",
    },
    value: {
      type: [String, Function],
      default: "",
    },
    label: {
      type: [String, Array],
      default: "",
    },
    className: {
      type: [String, Function, Array, Object],
      default: "",
    },
  },
  // 局部注册的组件
  components: {
    [Card.name]: Card,
    [SwipeCell.name]: SwipeCell,
  },
  // 组件状态值
  data() {
    return {
      push: true, // 是否允许点击事件
    };
  },
  // 计算属性
  computed: {
    _title() {
      const title = this.title;
      if (typeof title === "string") {
        if (Object.prototype.hasOwnProperty.call(this.data, title)) {
          return this.data[title] || "";
        }
        return title;
      } else if (typeof title === "function") {
        return title(this.data);
      }
      return "";
    },
    _value() {
      const value = this.value;
      if (typeof value === "string") {
        if (Object.prototype.hasOwnProperty.call(this.data, value)) {
          return this.data[value] || "";
        }
        return value;
      } else if (typeof title === "function") {
        return value(this.data);
      }
      return "";
    },
    _className() {
      const className = this.className;
      if (typeof value === "string") {
        return className;
      } else if (typeof title === "function") {
        return className(this.data);
      } else if (Array.isArray(className)) {
        return className.join(" ");
      } else if (typeof className === "object") {
        return Object.keys(className)
          .filter((key) => className[key])
          .join(" ");
      }
      return "";
    },
  },
  // 组件方法
  methods: {
    setPush(flag) {
      this.push = flag;
    },
    onClick(e, data) {
      e.stopPropagation();
      if (this.push) {
        this.$emit("click", data);
      } else {
        this.setPush(true);
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
