<!--
* @description 多选框
* @fileName HipsWxSingle.vue
* @author zheng yuanhou
* @date 2024/06/26 09:12:00
!-->
<template>
  <multiple-field
    ref="multiple"
    v-bind="$attrs"
    v-model="_value"
    :meaning.sync="_meaning"
    :label="_label"
    :disabled="disabled"
    :readonly="readonly"
    @confirm="onConfirm"
    @click="onClick"
    @enter="onEnter"
    @click-input="onClickInput"
    @click-left-icon="onClickLeftIcon"
    @click-right-icon="onClickRightIcon"
  >
    <template #fieldType="{ queryFields: querys }">
      <field-type :value="querys" type="query" @submit="onSubmit" />
    </template>
  </multiple-field>
</template>

<script>
import MultipleField from "./utils/MultipleField.vue";
import FieldType from "./utils/FieldType.vue";

export default {
  // 组件名称
  name: "HipsWxMultiple",
  // 局部注册的组件
  components: {
    [MultipleField.name]: MultipleField,
    [FieldType.name]: FieldType,
  },
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    meaning: {
      type: [String, Number],
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    _value: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    _meaning: {
      get() {
        return this.meaning;
      },
      set(val) {
        this.$emit("update:meaning", val);
      },
    },
    _label() {
      return this.$attrs.label || this.title;
    },
  },
  methods: {
    onSubmit(props) {
      if (this.$refs.multiple.show) {
        this.$refs.multiple.onSearch(props);
      }
    },
    onConfirm(props) {
      this.$emit("confirm", props);
    },
    onClick(event) {
      this.$emit("click", event);
    },
    onClickInput(event) {
      this.$emit("click-input", event);
    },
    onClickLeftIcon(event) {
      this.$emit("click-left-icon", event);
    },
    onClickRightIcon(event) {
      this.$emit("click-right-icon", event);
    },
    onEnter(event) {
      this.$emit("enter", event);
    },
    onScan(value) {
      this.$refs.multiple.onScan(value);
    },
  },
};
</script>

<style lang="less" scoped></style>
