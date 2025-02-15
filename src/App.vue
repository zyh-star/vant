<!--
* @description 
* @fileName demo.vue
* @author zheng yuanhou
* @date 2024/12/10 09:29:16
!-->
<template>
  <div>
    <hips-wx-view :data-set="value">
      <template #default="{ value }">
        <van-tag>{{ value }}</van-tag>
      </template>
    </hips-wx-view>
  </div>
</template>

<script>
/** ===== import ===== */
import { Tag } from "vant";
import HipsWxView from "./components/HipsWxView.vue";
import { bridge } from "hips-wx-utils";
import DataSet from "@/utils/dataSet.js";

/** ===== import ===== */

export default {
  // 组件名称
  name: "DemoApp",
  /** ===== components ===== */
  components: {
    [HipsWxView.name]: HipsWxView,
    [Tag.name]: Tag,
  },
  /** ===== components ===== */
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      value: null,
    };
  },
  computed: {},
  // 路由组件被激活时触发
  activated() {
    /** ===== activated ===== */
    // this.init();
    /** ===== activated ===== */
  },
  // 路由组件失活时触发
  deactivated() {
    /** ===== deactivated ===== */
    this.unInit();
    /** ===== deactivated ===== */
  },
  // 组件生成时触发
  created() {
    /** ===== created ===== */
    this.init();
    // this.initValue();
    /** ===== created ===== */
  },
  // 组件生成完毕后触发
  mounted() {
    /** ===== mounted ===== */
    /** ===== mounted ===== */
  },
  // 组件方法
  methods: {
    onLeft(event) {
      this.$emit("nav-bar-left", event);
      if (this.webView) {
        bridge.closeWebView();
      } else {
        this.$router.back();
      }
    },
    onRight(event) {
      this.$emit("nav-bar-right", event);
    },
    init() {
      const data = [
        {
          serviceTeamId: "604266362377998336",
          serviceTeamName: "PPR管件一车间模具管理",
          defaultFlag: 0,
          roleList: [
            { roleName: "模具主管", roleId: "0" },
            { roleName: "内修主管", roleId: "1" },
            { roleName: "外修主管", roleId: "2" },
            { roleName: "模具管理员", roleId: "3" },
            { roleName: "新模跟踪员", roleId: "4" },
            { roleName: "试模员", roleId: "5" },
            { roleName: "品质管理员", roleId: "6" },
            { roleName: "技术专员", roleId: "7" },
            { roleName: "保养员", roleId: "8" },
            { roleName: "车间维修专员", roleId: "9" },
            { roleName: "维修跟踪员", roleId: "10" },
            { roleName: "内修技工", roleId: "11" },
            { roleName: "换模调试员", roleId: "12" },
            { roleName: "外协厂家", roleId: "13" },
            { roleName: "外协专员", roleId: "14" },
            { roleName: "车间巡检", roleId: "15" },
            { roleName: "开发厂家", roleId: "16" },
          ],
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
      ];
      const v = new DataSet({
        title: "工单管理",
        key: "new-mould-development",
        type: "tabs",
        webView: true,
        navbar: {
          rightIcon: "search",
        },
        search: {
          key: "mouldCode",
          placeholder: "请输入模具编码",
          rightIcon: "scan",
        },
        tabs: [
          {
            title: "我的工单",
            queryParameter: {
              searchType: "mine",
              queryType: "PDA",
              method: 0,
            },
            badge: true,
          },
          {
            title: "公共池",
            queryParameter: {
              queryType: "PDA",
              method: 1,
            },
            badge: true,
          },
          {
            title: "内修",
            queryParameter: {
              queryType: "PDA",
              inWorkshopFlag: 0,
              searchType: "IN",
            },
            badge: true,
          },
          {
            title: "外修",
            queryParameter: {
              queryType: "PDA",
              inWorkshopFlag: 0,
              searchType: "OUT",
            },
            badge: true,
          },
          {
            title: "试模验收",
            queryParameter: {
              queryType: "PDA",
              searchType: "try",
            },
            badge: true,
          },
        ],
        list: {
          title: "workOrderName",
          value: "workOrderStatusMeaning",
          label: [
            ["mouldName", "mouldCategoryName"],
            ["faultNatureMeaning", "workOrderNatureMeaning"],
            [["申报人员:", "createdByName"], "lastUpdateDate"],
          ],
          showNumber: true,
          click: (data) => {
            const { workOrderId = "" } = data;
            if (workOrderId === "") {
              return false;
            }
            this.to(`/work-order/${workOrderId}`);
          },
        },
        transport: {
          read: "https://dev-gateway.vasen.com/mould-manage/v1/0/new-mould-developments",
        },
        queryFields: [
          {
            name: "serviceTeam",
            label: "服务组织",
            type: "single",
            data,
            textField: "serviceTeamName",
            valueField: "serviceTeamId",
            defaultValue: {
              serviceTeamId: "604266362377998336",
              serviceTeamName: "PPR管件一车间模具管理",
            },
            cache: true,
          },
          {
            name: "serviceTeamId",
            bind: "serviceTeam.serviceTeamId",
          },
          {
            name: "serviceTeamName",
            bind: "serviceTeam.serviceTeamName",
          },
          {
            name: "roleObject",
            label: "角色",
            type: "single",
            textField: "roleName",
            valueField: "roleId",
            cascades: { serviceTeamId: "serviceTeamId" },
            data: (obj) => {
              const { serviceTeamId: a } = obj;
              const item = data.find(({ serviceTeamId: b }) => {
                return a === b;
              });
              if (item) {
                return item.roleList;
              }
              return [];
            },
            cache: true,
          },
          {
            name: "role",
            bind: "roleObject.roleId",
          },
          {
            name: "roleName",
            bind: "roleObject.roleName",
          },
          {
            name: "aaa",
            label: "aaa",
            type: "single",
            lovCode: "MOULD.MOULD",
          },
          {
            name: "f",
            label: "f",
            cache: true,
          },
        ],
      });
      this.value = v;
    },
    unInit() {},
  },
};
</script>

<style lang="less" scoped></style>
