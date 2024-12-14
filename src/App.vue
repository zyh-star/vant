<!--
* @description 
* @fileName demo.vue
* @author zheng yuanhou
* @date 2024/12/10 09:29:16
!-->
<template>
  <hips-wx-view v-model="value">
    <template #card-default="{ value }">
      <van-tag>
        {{ value }}
      </van-tag>
    </template>
  </hips-wx-view>
  <!-- <hips-wx-single
    v-model="info.reasonCode"
    :meaning.sync="info.reasonMeaning"
    title="保养原因"
    :rules="[{ required: true, message: '保养原因不能为空' }]"
    lov-code="MOULD.REASON"
    check-title="meaning"
    check-radio="value"
    required
  /> -->
</template>

<script>
/** ===== import ===== */
import {
  // HipsWxPage,
  HipsWxSingle,
  // HipsWxCard,
  // HipsWxRadio,
  // HipsWxMultiple,
  // HipsWxUpload,
  // HipsWxDate,
  HipsWxView,
} from "./components";
import { Form, Field, Button, CellGroup, Cell, Tag } from "vant";
import { bridge } from "hips-wx-utils";
/** ===== import ===== */

export default {
  // 组件名称
  name: "DemoApp",
  /** ===== components ===== */
  components: {
    // [HipsWxPage.name]: HipsWxPage,
    [HipsWxSingle.name]: HipsWxSingle,
    // [HipsWxCard.name]: HipsWxCard,
    // [HipsWxRadio.name]: HipsWxRadio,
    // [HipsWxMultiple.name]: HipsWxMultiple,
    // [HipsWxUpload.name]: HipsWxUpload,
    // [HipsWxDate.name]: HipsWxDate,
    [HipsWxView.name]: HipsWxView,
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Tag.name]: Tag,
  },
  /** ===== components ===== */
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      info: {
        reasonCode: "",
        reasonMeaning: "",
      },
      // value: {
      //   title: "view",
      //   type: "tabs",
      //   tabs: [
      //     {
      //       title: "tab1",
      //       params: {
      //         name: "tab1",
      //       },
      //     },
      //     {
      //       title: "tab2",
      //       params: {
      //         name: "tab2",
      //       },
      //     },
      //   ],
      //   // rightIcon: {
      //   //   name: "search",
      //   // },
      //   queryFields: [
      //     {
      //       name: "demo",
      //       label: "demo",
      //       // required: true,
      //       type: "single",
      //       lovCode: "QMS.WORKSHOP",
      //     },
      //     {
      //       name: "meaning",
      //       bind: "demo.workshopName",
      //     },
      //   ],
      //   btns: [
      //     {
      //       text: "新建",
      //       type: "primary",
      //     },
      //   ],
      //   card: {
      //     title: "mouldName",
      //     value: "mouldName",
      //     label: [
      //       [
      //         ["aaa:", "mouldCode", "ccc"],
      //         "mouldCode",
      //         { class: "red", key: "mouldCode" },
      //       ],
      //       ["mouldCode", "mouldCode"],
      //     ],
      //     url: "https://www.baidu.com",
      //   },
      //   transport: {
      //     read: "/mould-manage/v1/0/moulds",
      //   },
      // },
      // value: {
      //   title: "demo",
      //   rightText: "",
      //   webView: false,
      //   fields: [
      //     {
      //       name: "demo",
      //       type: "card",
      //       title: "demo",
      //     },
      //     {
      //       name: "demo1",
      //       type: "date",
      //       label: "demo1",
      //       required: true,
      //     },
      //     {
      //       name: "demo2",
      //       type: "single",
      //       label: "demo2",
      //       // required: true,
      //       lovCode: "QMS.WORKSHOP",
      //       searchKey: [{ meaning: "全局", value: "keyword" }],
      //       // searchKey: "workshopName",
      //       // checkTitle: "workshopName",
      //       // checkRadio: "workshopId",
      //     },
      //     {
      //       name: "demo2Meaning",
      //       bind: "demo2.workshopName",
      //     },
      //     {
      //       name: "demo3",
      //       type: "multiple",
      //       label: "demo3",
      //       // required: true,
      //       lookupCode: "MOULD.PIPEORPIPEFITTING",
      //       searchKey: "workshopName",
      //     },
      //     {
      //       name: "demo3Meaning",
      //       bind: "demo3.workshopName",
      //     },
      //     {
      //       name: "demo4",
      //       type: "radio",
      //       label: "demo4",
      //       required: true,
      //     },
      //     {
      //       name: "demo5",
      //       type: "text",
      //       label: "demo5",
      //       required: true,
      //     },
      //     {
      //       name: "demo6",
      //       type: "tel",
      //       label: "demo6",
      //       required: true,
      //     },
      //     {
      //       name: "demo7",
      //       type: "digit",
      //       label: "demo7",
      //       required: true,
      //     },
      //     {
      //       name: "demo8",
      //       type: "number",
      //       label: "demo8",
      //       required: true,
      //     },
      //     {
      //       name: "demo9",
      //       type: "number",
      //       label: "demo9",
      //       required: true,
      //     },
      //   ],
      //   queryFields: [],
      //   transport: {
      //     init: "",
      //     submit: "",
      //   },
      // },
      loading: false,
    };
  },
  // 计算属性
  computed: {
    value() {
      const {
        serviceTeamList = [
          {
            meaning: "demo",
            value: "demo",
          },
          {
            meaning: "demo1",
            value: "demo1",
          },
        ],
        roleList = serviceTeamList,
        updateRoleList,
        updateLoginCookie,
      } = this;
      return {
        title: "工单管理",
        type: "tabs",
        search: {
          key: "mouldCode",
          placeholder: "请输入模具编码",
          rightIcon: "scan",
        },
        tabs: [
          {
            title: "我的工单",
            params: {
              searchType: "mine",
              queryType: "PDA",
              method: 0,
            },
            transport: {
              read: "/mould-manage/v1/0/work-orders",
            },
            card: {
              title: "workOrderName",
              value: "workOrderStatusMeaning",
              label: [
                ["mouldName", "mouldCategoryName"],
                ["faultNatureMeaning", "workOrderNatureMeaning"],
                [["申报人员:", "createdByName"]],
              ],
              showNumber: true,
            },
          },
          {
            title: "我的工单",
            params: {
              searchType: "mine",
              queryType: "PDA",
              method: 0,
            },
            noCache: true,
            transport: {
              read: "/mould-manage/v1/0/work-orders",
            },
            card: {
              title: "workOrderName",
              value: "workOrderStatusMeaning",
              label: [
                ["mouldName", "mouldCategoryName"],
                ["faultNatureMeaning", "workOrderNatureMeaning"],
                [["申报人员:", "createdByName"]],
              ],
              showNumber: true,
            },
          },
        ],
        queryFields: [
          {
            name: "serviceTeamId",
            label: "服务组织",
            type: "single",
            singleData: serviceTeamList,
            checkTitle: "meaning",
            checkRadio: "value",
            confirm: updateRoleList,
          },
          {
            name: "serviceTeamName",
            bind: "serviceTeamId.serviceTeamName",
          },
          {
            name: "role",
            label: "角色",
            type: "single",
            singleData: roleList,
            checkTitle: "meaning",
            checkRadio: "value",
            cascades: { serviceTeamId: "serviceTeamId" },
            confirm: updateLoginCookie,
          },
          {
            name: "roleName",
            bind: "role.roleName",
          },
        ],
      };
    },
    binds() {
      const { fields = "" } = this.value;
      return fields.filter((item) => item.bind);
    },
    title() {
      const { title = "" } = this.value;
      return title;
    },
    rightText() {
      const { rightText = "" } = this.value;
      return rightText;
    },
    rightIcon() {
      const { rightIcon = { name: "" } } = this.value;
      const { size = 24, color = "#1989fa" } = rightIcon;
      return { size, color, ...rightIcon };
    },
    webView() {
      const { webView = false } = this.value;
      return webView;
    },
  },
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
      setTimeout(() => {
        // this.value.btns = [];
        this.$forceUpdate();
      }, 3000);
    },
    unInit() {},
    onSubmit() {
      if (this.loading) {
        return false;
      }
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 3000);
    },
    getMeaning(name = "") {
      const reg = new RegExp(`^${name}.`);
      const item = this.binds.find((item) => {
        return reg.test(item.bind);
      });
      if (item) {
        return item.name;
      }
      return name;
    },
    getRules(props) {
      const {
        rules = [],
        required = false,
        label = "",
        title = label,
        type = "text",
      } = props;
      if (rules.length > 0) {
        return rules;
      }
      switch (type) {
        case "date":
        case "single":
        case "multiple":
          return [{ required, message: `请选择${title}` }];
        default:
          return [{ required, message: `请输入${title}` }];
      }
    },
    getPlaceholder(props) {
      const {
        placeholder = "",
        type = "text",
        label = "",
        title = label,
      } = props;
      if (placeholder) {
        return placeholder;
      }
      switch (type) {
        case "date":
        case "single":
        case "multiple":
          return `请选择${title}`;
        default:
          return `请输入${title}`;
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
