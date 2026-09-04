<!--
* @description 
* @fileName Field.vue
* @author zheng yuanhou
* @date 2024/12/31 11:20:55
!-->
<template>
  <van-field
    v-bind="$attrs"
    v-model="_value"
    :label="label"
    :disabled="_disabled"
    clearable
    @input="onInput"
  />
</template>

<script>
import field from "./field.js";
export default {
  // 组件名称
  name: "WxField",
  mixins: [field],
  data() {
    return {
      t: null,
    };
  },
  methods: {
    onReset() {
      this._value = "";
    },
    /**
     * 当输入框的值发生变化时调用的方法
     * 该方法通过设置一个定时器来延迟触发输入事件的更新
     * 这有助于在用户输入时减少事件的触发频率，提高性能
     *
     * @param {any} value 输入框的当前值
     */
    onInput(value) {
      // 清除上一次的定时器，以避免重复触发
      clearTimeout(this.t);
      // 设置一个新的定时器，等待200毫秒后触发input-field事件
      // 这样可以确保在用户停止输入200毫秒后才触发事件
      this.t = setTimeout(() => {
        this.$emit("input-field", value);
      }, 200);
    },
  },
};
</script>

<style lang="less" scoped></style>
