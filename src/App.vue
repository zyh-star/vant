<!--
* @description HipsWxView Demo
* @fileName demo.vue
* @author zheng yuanhou
* @date 2024/12/10 09:29:16
!-->
<template>
  <!-- <hips-wx-view :data-set="value">
    <template #default="{ value }">
      <van-tag>{{ value }}</van-tag>
    </template>
    <template #right> 1111 </template>
  </hips-wx-view> -->
  <!-- <hips-wx-page title="111"> 111 </hips-wx-page> -->
  <hips-wx-single
    label="demo"
    lov-url="anti-counterfeit/v1/0/parts-batchs"
    textField="serviceTeamName"
    valueField="serviceTeamId"
    :querys="[{ label: 'aaa', name: 'sss' }]"
  ></hips-wx-single>
</template>

<script>
/** ===== import ===== */
import { Tag } from "vant";
import HipsWxView from "./components/HipsWxView.vue";
import HipsWxPage from "./components/HipsWxPage.vue";
import HipsWxSingle from "./components/HipsWxSingle.vue";
import DataSet from "@/utils/dataSet.js";

/** ===== import ===== */

export default {
  // 组件名称
  name: "DemoApp",
  /** ===== components ===== */
  components: {
    [HipsWxView.name]: HipsWxView,
    [HipsWxPage.name]: HipsWxPage,
    [HipsWxSingle.name]: HipsWxSingle,
    [Tag.name]: Tag,
  },
  /** ===== components ===== */
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
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
    this.init();
  },
  // 组件方法
  methods: {
    init() {
      this.value = new DataSet({
        title: this.title,
        type: "list",
        search: {
          key: "keyword",
          placeholder: "请输入后查询",
          rightIcon: "scan",
        },
        // queryParameter: {
        //   authFlag: this.$route.query.authFlag,
        // },
        // list: {
        //   title: 'partsName',
        //   value: 'batchNumber',
        //   label: [
        //     [
        //       [ '供应商', 'supplier' ],
        //       [ '上传日期', 'lastUpdateDate' ],
        //     ],
        //   ],
        //   showNumber: true,
        //   click: (data)=>{
        //     this.goDetail(data)
        //   },
        // },
        // transport: {
        //   read: ()=>{
        //     return 'anti-counterfeit/v1/0/parts-batchs'
        //   },
        // },
        btns: [
          {
            text: "配件检验信息上传",
            type: "info",
            click: () => {
              this.go("/bind-parts-batch-add");
            },
          },
        ],
      });
    },
  },
};
</script>

<style lang="less" scoped>
.red {
  >>> .van-cell__title {
    color: red;
    background-color: red;
  }
}
</style>
