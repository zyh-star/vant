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
  <hips-wx-page>
    <hips-wx-card title="1" value="2" class="danger">
      <template #label>3</template>
    </hips-wx-card>
  </hips-wx-page>
</template>

<script>
/** ===== import ===== */
import { Tag, Button, Field } from "vant";
import HipsWxCard from "./components/HipsWxCard.vue";
import HipsWxView from "./components/HipsWxView.vue";
import HipsWxPage from "./components/HipsWxPage.vue";
import HipsWxSingle from "./components/HipsWxSingle.vue";
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
      a: "",
      b: "2",
      show: false,
      value: null,
      singleData: [
        {
          serviceTeamId: "604266362377998336",
          serviceTeamName: "PPR管件一车间模具管理",
          defaultFlag: 0,
          roleList: [{ roleName: "模具主管", roleId: "0" }],
        },
        {
          serviceTeamId: "619453782060830720",
          serviceTeamName: "PPR管道车间模具管理",
          defaultFlag: 0,
          roleList: [
            { roleName: "模具管理员", roleId: "3" },
            { roleName: "模具主管", roleId: "0" },
            { roleName: "内修主管", roleId: "1" },
          ],
        },
      ],
    };
  },
  created() {
    // this.init();
  },
  // 组件方法
  methods: {
    init() {
      setCookie("access_token", "8a24f870-59e8-4155-89f0-7a735a09e229");
      this.value = new DataSet({
        title: "保养任务",
        type: "tabs",
        key: "maintenance-task",
        webView: true,
        noCache: true,
        navbar: {
          rightIcon: "search",
        },
        queryFields: [
          {
            name: "mouldCode",
            placeholder: "请输入模具编码",
          },
          {
            name: "mouldCode1",
            placeholder: "请输入模具编码",
          },
          {
            name: "mouldCode2",
            placeholder: "请输入模具编码",
          },
          {
            name: "mouldCode3",
            placeholder: "请输入模具编码",
          },
          {
            name: "mouldCode4",
            placeholder: "请输入模具编码",
          },
        ],
        search: [
          {
            key: "mouldCode",
            placeholder: "请输入模具编码",
            rightIcon: "scan",
          },
          {
            key: "mouldCode",
            placeholder: "请输入模具编码",
            rightIcon: "scan",
          },
        ],
        tabs: [
          {
            title: "未开始",
            queryParameter: {
              maintenanceTaskStatus: "NEW",
              queryType: "PDA",
            },
            badge: true,
          },
          {
            title: "进行中",
            queryParameter: {
              maintenanceTaskStatus: "INPRG",
              queryType: "PDA",
            },
            badge: true,
          },
          {
            title: "已完成",
            queryParameter: {
              // maintenanceTaskStatus: 'COMPLETED',
              queryType: "WLY",
            },
          },
        ],
        list: {
          title: "mouldName",
          value: "maintenanceTaskStatusMeaning",
          label: [
            ["position", "stayWorkshopName"],
            ["mouldCategoryName", "creationDate"],
            ["materialName", "jtmc"],
            ["maintenancePersonelName", "actualFinishTime"],
            ["produceNeed", "taskCode"],
          ],
          showNumber: true,
        },
        transport: {
          read: () => {
            return "https://dev-gateway.vasen.com/asset-manage-new/v1/0/assets";
          },
        },
        btns: [
          {
            text: "新建",
            type: "info",
            click: () => {},
          },
        ],
        // search: {
        //   key: "keyword",
        //   placeholder: "请输入后查询",
        //   rightIcon: "scan",
        // },
        // list: {
        //   title: "mouldName",
        //   value: "maintenanceTaskStatusMeaning",
        // },
        // transport: {
        //   read: () => {
        //     return "https://dev-gateway.vasen.com/mould-manage/v1/0/maintenance-tasks";
        //   },
        // },
      });
    },
  },
};
</script>

<style lang="less" scoped>
// .van-button {
//   height: 100%;
// }
</style>
