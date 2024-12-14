<!--
* @description 单选框
* @fileName HipsWxSingle.vue
* @author zheng yuanhou
* @date 2024/06/26 09:12:00
!-->
<template>
  <single-field
    ref="single"
    v-bind="$props"
    v-model="_value"
    :meaning.sync="_meaning"
    @confirm="onConfirm"
  >
    <template #default>
      <slot></slot>
    </template>
    <template #fieldType="{ queryFields: querys }">
      <field-type :value="querys" type="query" @submit="onSubmit" />
    </template>
  </single-field>
</template>

<script>
import SingleField from "./utils/SingleField.vue";
import FieldType from "./utils/FieldType.vue";
import HipsWxSingleProps from "@/props/hips-wx-single";

export default {
  // 组件名称
  name: "HipsWxSingle",
  // 局部注册的组件
  components: {
    [SingleField.name]: SingleField,
    [FieldType.name]: FieldType,
  },
  props: HipsWxSingleProps,
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
      this.$refs.single.onSearch(props);
    },
    onConfirm(props) {
      this.$emit("confirm", props);
    },
  },
};
</script>

<style lang="less" scoped></style>
