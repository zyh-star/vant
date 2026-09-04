<!--
* @description 
* @fileName Card.vue
* @author zheng yuanhou
* @date 2025/01/06 13:39:43
!-->
<template>
  <div class="card" @click="onClick">
    <van-cell :title="title" v-bind="$attrs">
      <template #icon>
        <slot name="icon"></slot>
      </template>
      <template #right-icon>
        <slot name="right-icon" />
      </template>
      <template #default>
        <van-tag v-if="tagProps" v-bind="tagProps || {}">
          {{ value }}
        </van-tag>
        <slot v-else name="default" :value="value">
          {{ value }}
        </slot>
      </template>
      <template #extra>
        <slot name="extra" />
      </template>
    </van-cell>
    <van-cell>
      <card-label :label="label" :data="data" class="column" />
    </van-cell>
  </div>
</template>

<script>
import { Cell, Tag } from "vant";
import CardLabel from "./CardLabel.vue";

import mixin from "@/mixin/indexV3";

export default {
  // 组件名称
  name: "WxCard",
  // 组件参数 接收来自父组件的数据
  props: {
    title: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    label: {
      type: [String, Array],
      default: "",
    },
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    tagProps: {
      type: [Object, String],
      default: "",
    },
  },
  mixins: [mixin],
  // 局部注册的组件
  components: {
    [CardLabel.name]: CardLabel,
    [Cell.name]: Cell,
    [Tag.name]: Tag,
  },
  // 组件状态值
  data() {
    return {};
  },
  // 组件方法
  methods: {
    onClick(event) {
      this.$emit("click", event);
    },
  },
};
</script>

<style lang="less" scoped>
.van-cell + .van-cell {
  padding-top: 0;
}
.card {
  .van-cell:first-child {
    font-weight: bold;
  }
}
</style>
