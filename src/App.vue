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
  <hips-wx-view :data-set="ds">
    <template #left="{ data }">
      <van-button
        v-if="phone === data.outUserId"
        square
        type="info"
        text="提交"
        @click="onSubmit(data)"
      />
      <van-button
        v-if="createBy === data.createBy"
        square
        type="danger"
        text="删除"
        @click="onDelete(data)"
      />
      <van-button
        v-if="employeeNum === data.operator"
        square
        type="info"
        text="通过"
        @click="onPass(data)"
      />
    </template>
  </hips-wx-view>
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
</template>

<script>
/** ===== import ===== */
import { Tag, Button, Field } from "vant";
import HipsWxCard from "./components/HipsWxCard.vue";
import HipsWxView from "./components/HipsWxView.vue";
import HipsWxPage from "./components/HipsWxPage.vue";
import HipsWxSingle from "./components/HipsWxSingle.vue";
import HipsWxDate from "./components/HipsWxDate.vue";
import DataSet from "@/utils/dataSet.js";
import { setCookie } from "hips-wx-utils";

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
  },
  /** ===== components ===== */
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      expectedDeliveryTime: "",
      required: true,
      readonly: false,
      ds: null,
    };
  },
  created() {
    this.init();
  },
  // 组件方法
  methods: {
    init() {
      setCookie("access_token", "2f9196ef-a21f-4346-8bbb-fb9ea2adf25c");
      this.ds = new DataSet({
        title: "委外维修",
        type: "tabs",
        search: {
          key: "workOrderName",
        },
        tabs: [
          {
            title: "待提交",
            badge: true,
            queryParameter: {
              outCompany: this.outCompany,
              workOrderStatus: "APPROVED",
            },
          },
          {
            title: "待审核",
            badge: true,
            queryParameter: {
              outCompany: this.outCompany,
              workOrderStatus: "COMPLETED",
              checkStatus: 0,
            },
          },
          {
            title: "已审核",
            queryParameter: {
              outCompany: this.outCompany,
              workOrderStatus: "COMPLETED",
              checkStatus: 2,
            },
          },
        ],
        transport: {
          read: "https://dev-gateway.vasen.com/asset-manage-new/v1/#tenantId#/work-orders",
        },
        list: {
          title: "sparePartsName",
          value: (item) => {
            console.log("🚀 ~ init ~ item:", item);
            return "sparePartsCode";
          },
          label: [
            [
              (obj) => `库房:${obj.storageRoomName}`,
              (obj) => `库位:${obj.storageLocationName}`,
            ],
            ["model", "sparePartsCategoryMeaning"],
            [(obj) => `库存数量:${obj.stockQuantity}`],
            [
              (obj) => `库存上限:${obj.inventoryUl}`,
              (obj) => `库存下限:${obj.inventoryLl}`,
            ],
          ],
        },
      });
    },
    onSubmit(data) {
      console.log("🚀 ~ onSubmit ~ data:", data);
    },
    onDelete(data) {
      console.log("🚀 ~ onDelete ~ data:", data);
    },
    onPass(data) {
      console.log("🚀 ~ onPass ~ data:", data);
    },
  },
};
</script>

<style lang="less" scoped>
// .van-button {
//   height: 100%;
// }
</style>
