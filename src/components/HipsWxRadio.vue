<!--
* @description 单选
* @fileName HipsWxRadio.vue
* @author zheng yuanhou
* @date 2024/07/04 10:34:24
!-->
<template>
  <van-field
    v-model="_value"
    :name="name"
    :label="label"
    :colon="colon"
    :required="required"
    :rules="rules"
    :input-align="inputAlign"
    :label-width="labelWidth"
  >
    <template #label>
      <slot name="label"></slot>
    </template>
    <template #input v-if="readonly">
      {{ text }}
    </template>
    <template #input v-else>
      <van-radio-group
        v-model="_value"
        direction="horizontal"
        @change="onChange"
      >
        <van-radio :name="trueValue"> 是 </van-radio>
        <van-radio :name="falseValue"> 否 </van-radio>
      </van-radio-group>
    </template>
  </van-field>
</template>

<script>
import { Field, RadioGroup, Radio } from "vant";
export default {
  // 组件名称
  name: "HipsWxRadio",
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    colon: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => {
        return [];
      },
    },
    inputAlign: {
      type: String,
      default: "right",
    },
    trueValue: {
      type: [String, Number],
      default: "1",
    },
    falseValue: {
      type: [String, Number],
      default: "0",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: [String, Number],
      default: "6.2em",
    },
  },
  // 局部注册的组件
  components: {
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
  },
  // 组件状态值
  data() {
    return {};
  },
  // 计算属性
  computed: {
    _value: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    text() {
      switch (this.value) {
        case this.trueValue:
          return "是";
        case this.falseValue:
          return "否";
        default:
          return "";
      }
    },
  },
  methods: {
    onChange(e) {
      this.$emit("change", e);
    },
  },
};
</script>

<style lang="less" scoped></style>
