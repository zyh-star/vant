<!--
* @description HipsWxView Demo
* @fileName demo.vue
* @author zheng yuanhou
* @date 2024/12/10 09:29:16
!-->
<template>
  <!-- <hips-wx-view :data-set="value">
    <template #left="{ data }">
      <van-button size="large" type="info">
        {{ data.mouldName }}
      </van-button>
    </template>
    <template #right="{ data }">
      <van-button size="large" type="info">
        {{ data.mouldName }}
      </van-button>
    </template>
  </hips-wx-view> -->
  <!-- <hips-wx-single lovCode="MOULD.DEMO"></hips-wx-single> -->
  <!-- <hips-wx-page>
    <hips-wx-card title="1" value="2" class="danger">
      <template #label>3</template>
    </hips-wx-card>
  </hips-wx-page> -->
  <!-- <hips-wx-view :data-set="ds"> </hips-wx-view> -->
  <!-- <hips-wx-date
    v-model="expectedDeliveryTime"
    label="预计交期"
    :readonly="readonly"
    :required="required"
    :rules="[
      {
        required: required,
        message: '请选择预计交期',
        trigger: 'change',
      },
    ]"
    type="datetime"
    label-width="100"
    input-align="right"
  /> -->
  <!-- <hips-wx-search-to-list
    title="ssdfg"
    :queryFields="queryFields"
    :loading="loading"
    :finished="finished"
    :options="options"
    @refresh="onRefresh"
    @load="onLoad"
  >
    <template #list-footer>
      <van-button>1</van-button>
    </template>
  </hips-wx-search-to-list> -->
  <hips-wx-page title="123">
    <div class="a123">
      <div class="b123"></div>
      <input type="text" />
    </div>
    <template #footer>
      <van-button>1</van-button>
    </template>
  </hips-wx-page>
</template>

<script>
/** ===== import ===== */
import { Tag, Button, Field } from "vant";
import HipsWxCard from "./components/HipsWxCard.vue";
import HipsWxView from "./components/HipsWxView.vue";
import HipsWxPage from "./components/HipsWxPage.vue";
import HipsWxSingle from "./components/HipsWxSingle.vue";
import HipsWxDate from "./components/HipsWxDate.vue";
import HipsWxSearchToList from "./components/hips-wx-search-to-list";

/** ===== import ===== */

export default {
  // 组件名称
  name: "DemoApp",
  /** ===== components ===== */
  components: {
    [HipsWxCard.name]: HipsWxCard,
    [HipsWxView.name]: HipsWxView,
    [HipsWxPage.name]: HipsWxPage,
    [HipsWxSingle.name]: HipsWxSingle,
    [HipsWxDate.name]: HipsWxDate,
    [Tag.name]: Tag,
    [Button.name]: Button,
    [Field.name]: Field,
    [HipsWxSearchToList.name]: HipsWxSearchToList,
  },
  /** ===== components ===== */
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {};
  },

  // 组件方法
  methods: {},
};
</script>

<style lang="less" scoped>
// .van-button {
//   height: 100%;
// }
.a123 {
  height: 100vh;
  border: 1px solid red;
  .b123 {
    height: 50vh;
    border: 1px solid yellow;
  }
}
</style>
