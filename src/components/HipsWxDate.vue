<!--
* @description 时间控件
* @fileName HipsWxDate.vue
* @author zheng yuanhou
* @date 2024/07/05 09:18:30
!-->
<template>
  <div>
    <van-field
      v-bind="$attrs"
      :placeholder="placeholder"
      :input-align="inputAlign"
      @click="showDatetimePicker"
    />
    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        :type="type"
        cancel-button-text="重置"
        @confirm="onConfirm"
        @cancel="onConfirm('')"
      />
    </van-popup>
  </div>
</template>

<script>
import { Field, DatetimePicker, Popup } from "vant";
import { dateFormat } from "hips-wx-utils";
import HipsWxDateProps from "@/props/hips-wx-date";
import _ from "lodash";

export default {
  // 组件名称
  name: "HipsWxDate",
  // 局部注册的组件
  components: {
    [Field.name]: Field,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
  },
  // 组件参数 接收来自父组件的数据
  props: HipsWxDateProps,
  // 组件状态值
  data() {
    return {
      showPicker: false,
      currentDate: new Date(this.value || new Date()),
    };
  },
  // 组件方法
  methods: {
    onConfirm(value) {
      if (_.isEmpty(value)) {
        this.$emit("input", "");
      } else {
        this.$emit("input", dateFormat(value, this.formatter));
      }
      this.hiddenDatetimePicker();
    },
    showDatetimePicker() {
      this.showPicker = true;
    },
    hiddenDatetimePicker() {
      this.showPicker = false;
    },
  },
};
</script>

<style lang="less" scoped></style>
