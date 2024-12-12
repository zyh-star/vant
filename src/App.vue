<!--
* @description 
* @fileName demo.vue
* @author zheng yuanhou
* @date 2024/12/10 09:29:16
!-->
<template>
  <hips-wx-page title="demo" @click-left="goBack">
    <van-form
      ref="form"
      input-align="right"
      @submit="onSubmit"
      @failed="onFailed"
    >
      <div v-for="(fieldObject, index) in fields" :key="index">
        <hips-wx-card v-if="fieldObject.type === 'card'" v-bind="fieldObject" />
        <hips-wx-date
          v-if="fieldObject.type === 'date'"
          v-model="info[fieldObject.name]"
          v-bind="fieldObject"
          :rules="getRules(fieldObject)"
          :placeholder="getPlaceholder(fieldObject)"
        />
        <hips-wx-single
          v-if="fieldObject.type === 'single'"
          v-model="info[fieldObject.name]"
          v-bind="fieldObject"
          :meaning.sync="info[getMeaning(fieldObject.name)]"
          :rules="getRules(fieldObject)"
          :placeholder="getPlaceholder(fieldObject)"
        />
        <hips-wx-multiple
          v-if="fieldObject.type === 'multiple'"
          v-model="info[fieldObject.name]"
          v-bind="fieldObject"
          :meaning.sync="info[getMeaning(fieldObject.name)]"
          :rules="getRules(fieldObject)"
          :placeholder="getPlaceholder(fieldObject)"
        />
        <hips-wx-radio
          v-if="fieldObject.type === 'radio'"
          v-model="info[fieldObject.name]"
          v-bind="fieldObject"
          input-align="right"
          :rules="getRules(fieldObject)"
          :placeholder="getPlaceholder(fieldObject)"
        />
        <van-field
          v-else-if="fieldObject.type === 'text'"
          v-model="info[fieldObject.name]"
          v-bind="fieldObject"
          :rules="getRules(fieldObject)"
          :placeholder="getPlaceholder(fieldObject)"
        />
        <van-field
          v-else-if="fieldObject.type === 'tel'"
          v-model="info[fieldObject.name]"
          type="tel"
          v-bind="fieldObject"
          :rules="getRules(fieldObject)"
          :placeholder="getPlaceholder(fieldObject)"
        />
        <van-field
          v-else-if="fieldObject.type === 'digit'"
          v-model="info[fieldObject.name]"
          type="digit"
          v-bind="fieldObject"
          :rules="getRules(fieldObject)"
          :placeholder="getPlaceholder(fieldObject)"
        />
        <van-field
          v-else-if="fieldObject.type === 'number'"
          v-model="info[fieldObject.name]"
          type="number"
          v-bind="fieldObject"
          :rules="getRules(fieldObject)"
          :placeholder="getPlaceholder(fieldObject)"
        />
        <van-field
          v-else-if="fieldObject.type === 'password'"
          v-model="info[fieldObject.name]"
          type="password"
          v-bind="fieldObject"
          :rules="getRules(fieldObject)"
          :placeholder="getPlaceholder(fieldObject)"
        />
      </div>
    </van-form>
    <template #footer>
      <van-button
        type="primary"
        size="large"
        native-type="submit"
        form="form"
        :loading="loading"
        @click="$refs.form.submit()"
      >
        提交
      </van-button>
    </template>
  </hips-wx-page>
</template>

<script>
/** ===== import ===== */
import {
  HipsWxPage,
  HipsWxSingle,
  HipsWxCard,
  HipsWxRadio,
  HipsWxMultiple,
  HipsWxUpload,
  HipsWxDate,
} from "./components";
import { Form, Field, Button } from "vant";
/** ===== import ===== */

export default {
  // 组件名称
  name: "DemoApp",
  /** ===== components ===== */
  components: {
    [HipsWxPage.name]: HipsWxPage,
    [HipsWxSingle.name]: HipsWxSingle,
    [HipsWxCard.name]: HipsWxCard,
    [HipsWxRadio.name]: HipsWxRadio,
    [HipsWxMultiple.name]: HipsWxMultiple,
    [HipsWxUpload.name]: HipsWxUpload,
    [HipsWxDate.name]: HipsWxDate,
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button,
  },
  /** ===== components ===== */
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      loading: false,
      info: {
        demo2: "",
        demo2Meaning: "",
      },
      fields: [
        {
          name: "demo",
          type: "card",
          title: "demo",
        },
        {
          name: "demo1",
          type: "date",
          label: "demo1",
          required: true,
        },
        {
          name: "demo2",
          type: "single",
          label: "demo2",
          // required: true,
          lovCode: "QMS.WORKSHOP",
          // searchKey: "workshopName",
          // checkTitle: "workshopName",
          // checkRadio: "workshopId",
        },
        {
          name: "demo2Meaning",
          bind: "demo2.workshopName",
        },
        {
          name: "demo3",
          type: "multiple",
          label: "demo3",
          // required: true,
          lookupCode: "MOULD.PIPEORPIPEFITTING",
          searchKey: "workshopName",
        },
        {
          name: "demo3Meaning",
          bind: "demo3.workshopName",
        },
        {
          name: "demo4",
          type: "radio",
          label: "demo4",
          required: true,
        },
        {
          name: "demo5",
          type: "text",
          label: "demo5",
          required: true,
        },
        {
          name: "demo6",
          type: "tel",
          label: "demo6",
          required: true,
        },
        {
          name: "demo7",
          type: "digit",
          label: "demo7",
          required: true,
        },
        {
          name: "demo8",
          type: "number",
          label: "demo8",
          required: true,
        },
        {
          name: "demo9",
          type: "number",
          label: "demo9",
          required: true,
        },
      ],
    };
  },
  // 计算属性
  computed: {
    binds() {
      return this.fields.filter((item) => item.bind);
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
    goBack() {},
    init() {
      setTimeout(() => {
        this.info.demo2 = "18";
        this.info.demo2Meaning = "管道制造部";
        this.$forceUpdate();
      }, 500);
    },
    unInit() {},
    onSubmit() {
      if (this.loading) {
        return false;
      }
      this.loading = true;
      console.log("🚀 ~ onSubmit ~ this.info:", this.info);
      setTimeout(() => {
        this.loading = false;
      }, 3000);
    },
    onFailed(err) {
      console.log("🚀 ~ onFailed ~ err:", err);
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
