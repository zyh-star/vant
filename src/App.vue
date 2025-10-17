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
  <hips-wx-view :data-set="ds"> </hips-wx-view>
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
    [HipsWxSearchToList.name]: HipsWxSearchToList,
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
      queryFields: [
        {
          name: "workOrderName",
          placeholder: "请输入工单名称",
          label: "aaa",
          inputAlign: "right",
          value: "",
        },
        {
          name: "date",
          type: "datetime",
          placeholder: "请选择预计交期",
          label: "预计交期",
        },
        {
          name: "mouldCode",
          value: "",
          meaning: "",
          placeholder: "请选择资产编号",
          label: "资产编号",
          lovCode: "MOULD.MOULD",
          type: "single",
        },
      ],
      loading: false,
      finished: false,
      options: [],
    };
  },
  created() {
    this.init();
  },
  // 组件方法
  methods: {
    $t(v) {
      return v;
    },
    onRefresh() {
      this.page = 0;
      this.options = [];
    },
    onLoad(props) {
      console.log("🚀 ~ onLoad ~ props:", props);
      this.loading = true;
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.options.push(i);
        }
        this.loading = false;
        this.finished = this.options.length >= 50;
      }, 1000);
    },
    init() {
      setCookie("access_token", "a40a004e-92b2-4226-bede-c2a9c3ef9ba8");
      this.ds = new DataSet({
        title: "维修单管理",
        type: "tabs",
        rightText: "",
        search: [
          {
            name: "workOrderName",
            placeholder: "请输入工单名称",
          },
          {
            name: "asset",
            placeholder: "请输入资产",
            onSearch(value = "") {
              const matchs = value.match(/^(.{4})-(\d{1,20})/);

              if (matchs) {
                const assetCode = matchs[2] ?? "";
                const sapCompanyCode = matchs[1] ?? "";
                return {
                  assetCode,
                  sapCompanyCode,
                };
              }
              return "";
            },
          },
        ],
        queryFields: [],
        tabs: [
          {
            title: this.$t("公共池"),
            badge: true,
            queryParameter: {
              method: 4,
            },
            list: {
              title: (item) => {
                const { problem, workOrderName } = item;
                if (problem) {
                  return `${workOrderName}(问题描述:'${problem})`;
                }
                return workOrderName;
              },
              value: (item) => {
                const { workOrderBackReason = "", waitTime = 0 } = item;
                if (workOrderBackReason !== "") {
                  return this.$t("退回");
                }
                const m = Number(waitTime) % 60;
                let h = Math.floor(Number(waitTime) / 60);
                const day = Math.floor(h / 24);
                h = h % 24;
                return `${day > 0 ? `${day}${this.$t("天")}` : ""}${
                  h > 0 ? `${h}${this.$t("时")}` : ""
                }${m}${this.$t("分")}`;
              },
              label: [
                ["workOrderCode"],
                [
                  (item) => {
                    const {
                      productionLineName = "",
                      assetName = "",
                      assetCode = "",
                    } = item;
                    return `${productionLineName}-${assetName}-${assetCode}`;
                  },
                ],
              ],
              tagProps: (item) => {
                const { waitTime = 0 } = item;
                if (waitTime > 30) {
                  return { type: "danger" };
                }
                return "primary";
              },
              click: ({ workOrderId }) => {
                this.$router.push({
                  path: `/work-order-claim-detail/4/${workOrderId}`,
                });
              },
            },
          },
          {
            title: this.$t("我的工单"),
            badge: true,
            queryParameter: {
              method: 0,
            },
            list: {
              title: (item) => {
                const { problem, workOrderName } = item;
                if (problem) {
                  return `${workOrderName}(问题描述:'${problem})`;
                }
                return workOrderName;
              },
              value: (item) => {
                const {
                  workOrderBackReason = "",
                  // actualStartTime = "",
                  workOrderStatusMeaning = "",
                } = item;
                if (workOrderBackReason !== "") {
                  return this.$t("退回");
                }
                // if (isEmpty(actualStartTime)) {
                //   return this.$t("未开始");
                // }
                return this.$t(workOrderStatusMeaning);
              },
              label: [
                ["workOrderCode"],
                [
                  (item) => {
                    const {
                      productionLineName = "",
                      assetName = "",
                      assetCode = "",
                    } = item;
                    return `${productionLineName}-${assetName}-${assetCode}`;
                  },
                ],
              ],
              tagProps: (item) => {
                const { workOrderBackReason = "" } = item;
                if (workOrderBackReason !== "") {
                  return { type: "danger" };
                }
                return "primary";
              },
              click: (item) => {
                const { workOrderId = "" } = item;
                this.$router.push({
                  path: `/work-order/${workOrderId}/0/${this.getTagType(
                    item,
                    0
                  )}`,
                });
              },
            },
          },
          {
            title: this.$t("待审"),
            badge: true,
            queryParameter: {
              method: 1,
            },
            list: {
              title: (item) => {
                const { problem, workOrderName } = item;
                if (problem) {
                  return `${workOrderName}(问题描述:'${problem})`;
                }
                return workOrderName;
              },
              value: () => {
                return "111";
                // return workOrderTypeIsOneStatus(item).meaning;
              },
              label: [
                ["workOrderCode"],
                [
                  (item) => {
                    const {
                      productionLineName = "",
                      assetName = "",
                      assetCode = "",
                    } = item;
                    return `${productionLineName}-${assetName}-${assetCode}`;
                  },
                ],
              ],
              tagProps: () => {
                // return workOrderTypeIsOneStatus(item).tag;
                return "222";
              },
              click: (item) => {
                const { workOrderId = "" } = item;
                this.$router.push({
                  path: `/work-order/${workOrderId}/1/${this.getTagType(
                    item,
                    1
                  )}`,
                });
              },
            },
          },
          {
            title: this.$t("已完成"),
            queryParameter: {
              method: 2,
            },
            list: {
              title: (item) => {
                const { problem, workOrderName } = item;
                if (problem) {
                  return `${workOrderName}(问题描述:'${problem})`;
                }
                return workOrderName;
              },
              value: (item) => {
                const { workOrderStatusMeaning = "" } = item;
                return this.$t(workOrderStatusMeaning);
              },
              label: [
                ["workOrderCode"],
                [
                  (item) => {
                    const {
                      productionLineName = "",
                      assetName = "",
                      assetCode = "",
                    } = item;
                    return `${productionLineName}-${assetName}-${assetCode}`;
                  },
                ],
              ],
              click: (item) => {
                const { workOrderId = "" } = item;
                this.$router.push({
                  path: `/work-order/${workOrderId}/2/${this.getTagType(
                    item,
                    2
                  )}`,
                });
              },
            },
          },
          {
            title: this.$t("已审"),
            queryParameter: {
              method: 3,
            },
            list: {
              title: (item) => {
                const { problem, workOrderName } = item;
                if (problem) {
                  return `${workOrderName}(问题描述:'${problem})`;
                }
                return workOrderName;
              },
              value: (item) => {
                const { workOrderStatus = "", checkStatusMeaning = "" } = item;
                if (workOrderStatus === "COMPLETED") {
                  return this.$t(checkStatusMeaning) + `(${this.$t("未评分")})`;
                }
                return this.$t(checkStatusMeaning);
              },
              label: [
                ["workOrderCode"],
                [
                  (item) => {
                    const {
                      productionLineName = "",
                      assetName = "",
                      assetCode = "",
                    } = item;
                    return `${productionLineName}-${assetName}-${assetCode}`;
                  },
                ],
              ],
              click: (item) => {
                const { workOrderId = "" } = item;
                this.$router.push({
                  path: `/work-order/${workOrderId}/3/${this.getTagType(
                    item,
                    3
                  )}`,
                });
              },
            },
          },
        ],
        transport: {
          read: `https://dev-gateway.vasen.com/asset-manage-new/v1/#tenantId#/work-orders`,
        },
      });
    },
    // onSubmit(data) {},
    // onDelete(data) {},
    // onPass(data) {},
  },
};
</script>

<style lang="less" scoped>
// .van-button {
//   height: 100%;
// }
</style>
