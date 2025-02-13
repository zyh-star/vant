<!--
* @description 1
* @fileName HipsWxCard.vue
* @author zheng yuanhou
* @date 2024/06/25 16:54:00
!-->
<template>
  <div ref="card" class="card" @click="onClick">
    <van-cell v-bind="$attrs" class="first-card">
      <template #title>
        <slot name="title">
          {{ replaceUndefinedToRmpty(title) }}
        </slot>
      </template>
      <template v-if="!isEmpty(value)" #default>
        <slot>{{ replaceUndefinedToRmpty(value) }}</slot>
      </template>
      <template #icon>
        <slot name="icon" />
      </template>
      <template #right-icon>
        <slot name="right-icon" />
      </template>
      <template #extra>
        <slot name="extra" />
      </template>
    </van-cell>
    <van-cell v-bind="$attrs" title="">
      <template #label>
        <slot name="label"></slot>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { Cell, Tag } from "vant";
import { isEmpty } from "lodash";
import HipsWxCardProps from "@/props/hips-wx-card";

export default {
  // 组件名称
  name: "HipsWxCard",
  // 组件参数 接收来自父组件的数据
  props: HipsWxCardProps,
  // 局部注册的组件
  components: {
    [Cell.name]: Cell,
    [Tag.name]: Tag,
  },
  // 组件方法
  methods: {
    isEmpty,
    /**'
     * 将undefined转为""
     */
    replaceUndefinedToRmpty(value) {
      return value.replace(/undefined/g, "");
    },
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="less" scoped>
.first-card {
  justify-content: space-between;
  .van-cell__title:first-child {
    flex: 3;
  }
}
.first-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-bottom: 30px solid transparent;
}
.primary > .first-card::before {
  border-left: 30px solid #07c160; /* 根据需要设置颜色 */
}
.danger > .first-card::before {
  border-left: 30px solid #ee0a24; /* 根据需要设置颜色 */
}
.info > .first-card::before {
  border-left: 30px solid #1989fa; /* 根据需要设置颜色 */
}
.warning > .first-card::before {
  border-left: 30px solid #ff976a; /* 根据需要设置颜色 */
}
.yellow > .first-card::before {
  border-left: 30px solid #ffff00; /* 根据需要设置颜色 */
}
.van-cell + .van-cell {
  padding-top: 0;
  padding-bottom: 0;
  .van-cell__label {
    margin-top: 0;
  }
}
</style>
