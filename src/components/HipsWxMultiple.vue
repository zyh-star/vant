<!--
* @description 多选框
* @fileName HipsWxSingle.vue
* @author zheng yuanhou
* @date 2024/06/26 09:12:00
!-->
<template>
  <multiple-field
    ref="multiple"
    v-bind="$props"
    v-model="_value"
    :meaning.sync="_meaning"
    @confirm="onConfirm"
  >
    <template #fieldType="{ queryFields: querys }">
      <field-type :value="querys" type="query" @submit="onSubmit" />
    </template>
  </multiple-field>
</template>

<script>
import MultipleField from "./utils/MultipleField.vue";
import FieldType from "./utils/FieldType.vue";
import HipsWxMultipleProps from "@/props/hips-wx-multiple";

export default {
  // 组件名称
  name: "HipsWxMultiple",
  // 局部注册的组件
  components: {
    [MultipleField.name]: MultipleField,
    [FieldType.name]: FieldType,
  },
  props: HipsWxMultipleProps,
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
  },
  methods: {
    onSubmit(props) {
      this.$refs.multiple.onSearch(props);
    },
    onConfirm(props) {
      this.$emit("confirm", props);
    },
  },
};
</script>

<style lang="less" scoped></style>
