<!--
* @description 
* @fileName demo.vue
* @author zheng yuanhou
* @date 2024/12/10 09:29:16
!-->
<template>
  <div>
    <hips-wx-view :data-set="value">
      <template #right>
        <van-button type="danger">删除</van-button>
      </template>
    </hips-wx-view>
  </div>
</template>

<script>
/** ===== import ===== */
import {
  // HipsWxPage,
  HipsWxSingle,
  // HipsWxCard,
  // HipsWxRadio,
  HipsWxMultiple,
  // HipsWxUpload,
  // HipsWxDate,
  // HipsWxView,
  HipsWxDetail,
  HipsWxSwipe,
} from "./components";
import { Form, Field, Button, CellGroup, Cell, Tag } from "vant";
import HipsWxView from "./components/HipsWxViewV3.vue";
import { bridge } from "hips-wx-utils";
import DataSet from "@/utils/dataSetV3.js";
import DataSetV4 from "@/utils/dataSetV4.js";

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
    [HipsWxMultiple.name]: HipsWxMultiple,
    // [HipsWxUpload.name]: HipsWxUpload,
    // [HipsWxDate.name]: HipsWxDate,
    [HipsWxView.name]: HipsWxView,
    [HipsWxDetail.name]: HipsWxDetail,
    [HipsWxSwipe.name]: HipsWxSwipe,
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
      a: 18,
      b: 18,
      c: "18,19",
      d: "18,19",
      value: null,
      loading: false,
      demo: [
        {
          materialCode: "1058042",
          materialName: "VASEN壁挂式温热管线机  R20",
        },
        {
          materialCode: "1058042",
          materialName: "VASEN壁挂式温热管线机  R20",
        },
        {
          materialCode: "1058042",
          materialName: "VASEN壁挂式温热管线机  R20",
        },
        {
          materialCode: "1058042",
          materialName: "VASEN壁挂式温热管线机  R20",
        },
        {
          materialCode: "1058042",
          materialName: "VASEN壁挂式温热管线机  R20",
        },
      ],
      data: [
        {
          meaning: "demo",
          value: "demo",
          list: [
            {
              meaning: "demo",
              value: "demo",
            },
            {
              meaning: "demo1",
              value: "demo1",
            },
          ],
        },
        {
          meaning: "demo1",
          value: "demo1",
          list: [
            {
              meaning: "demo2",
              value: "demo2",
            },
            {
              meaning: "demo3",
              value: "demo3",
            },
          ],
        },
      ],
    };
  },
  computed: {
    cascades() {
      return {
        aaa: this.a,
        list: [],
      };
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
      const v = new DataSetV4({
        title: "DataSet",
        type: "tabs",
        navbar: {
          rightIcon: "search",
        },
        search: [
          "aaa",
          "bbb",
          { key: "ccc", value: "ddd", placeholder: "请输入模具编码" },
        ],
        queryFields: [
          {
            name: "a",
            label: "单选",
            type: "single",
            lovCode: "MOULD.MOULD",
            defaultValue: {
              b: "1",
              c: "2",
            },
            confirm: (value) => {
              console.log("confirm", value);
            },
          },
          {
            name: "b",
            bind: "a.mouldCode",
          },
          {
            name: "c",
            bind: "a.mouldName",
          },
          {
            name: "f",
            label: "多选12",
            defaultValue: "1",
            cascades: {
              f: "b",
            },
          },
          {
            name: "g",
            label: "单选",
            type: "single",
            lovCode: "MOULD.MOULD",
            params: {
              a: "1",
            },
            cascades: {
              f: "b",
            },
          },
          {
            name: "h",
            bind: "g.mouldCode",
          },
          {
            name: "i",
            bind: "g.mouldName",
          },
        ],
        tabs: ["aaa", "bbb", "ccc"],
        list: {
          url: "mould-manage/v1/0/moulds",
          title: "mouldName",
          value: "mouldCode",
          label: [
            ["上课时间", "结束时间"],
            [["还是看", "mouldCode"], "mouldCode"],
          ],
          showNumber: true,
        },
        btns: ["提交", "测试"],
      });
      this.value = v;
      console.log("🚀 ~ init ~ v:", v);
      // this.value.title = "哈哈哈哈";
      // this.value = new DataSet({
      //   navbar: {
      //     title: "111",
      //     rightIcon: "search",
      //     position: "top",
      //   },
      //   search: [
      //     {
      //       key: "mouldCode",
      //       placeholder: "请输入模具编码",
      //       rightIcon: "scan",
      //     },
      //     {
      //       key: "mouldName",
      //       placeholder: "请输入模具编码",
      //       rightIcon: "scan",
      //     },
      //   ],
      //   queryFields: [
      //     {
      //       name: "a",
      //       label: "单选",
      //       type: "single",
      //       lovCode: "MOULD.MOULD",
      //       defaultValue: {
      //         b: "1",
      //         c: "2",
      //       },
      //     },
      //     {
      //       name: "b",
      //       bind: "a.b",
      //     },
      //     {
      //       name: "c",
      //       bind: "a.c",
      //     },
      //     {
      //       name: "d",
      //       label: "多选",
      //     },
      //     {
      //       name: "e",
      //       label: "多选1",
      //       cascades: {
      //         e: "b",
      //       },
      //     },
      //     {
      //       name: "f",
      //       label: "多选12",
      //       cascades: {
      //         f: "b",
      //       },
      //     },
      //   ],
      // });
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
    onClick() {
      console.log(this.a, this.b, this.c, this.d);
    },
    initValue() {
      // const updateDemo1 = this.updateDemo1;
      // const data = this.data;
      this.value = new DataSet({
        title: "工单管理",
        rightText: "返回",
        webView: true,
        type: "list",
        search: {
          key: "mouldCode",
          placeholder: "请输入模具编码",
          rightIcon: "scan",
        },
        transport: {
          read: "anti-counterfeit/v1/0/parts-binds",
        },
        card: {
          title: "mouldName",
          value: "statusMeaning",
          label: [
            ["newMouldDevelopmentCode", "mouldCategoryName", "mouldSpecs"],
            ["serviceTeamName", "developmentManufacturerName"],
            [["更新时间：", "lastUpdateDate"]],
            [["要求完成时间：", "requireDeliveryDate"]],
            ["unqualifiedReason"],
          ],
          showNumber: true,
          click: (data) => {
            const { newMouldDevelopmentId = "" } = data;
            this.to(`/new-mould-development/${newMouldDevelopmentId}`);
          },
          className: (data) => {
            return /前布线/.test(data.mouldName) ? "danger" : "info";
          },
        },
        btns: [
          {
            text: "新建",
          },
        ],
        events: {
          // loadData(data) {},
        },
      });
      this.value.addQueryFields("demo", {
        defaultValue: {
          meaning: "demo1",
          value: "demo1",
          list: [
            {
              meaning: "demo2",
              value: "demo2",
            },
            {
              meaning: "demo3",
              value: "demo3",
            },
          ],
        },
      });
    },
    updateDemo1(item = {}) {
      const { list = [] } = item;
      this.value.addQueryFields("demo1", {
        data: list,
        defaultValue: list[0],
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
