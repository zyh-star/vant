<!--
* @description 
* @fileName demo.vue
* @author zheng yuanhou
* @date 2024/12/10 09:29:16
!-->
<template>
  <hips-wx-page
    :title="title"
    :rightText="rightText"
    @click-left="onLeft"
    @click-right="onRight"
  >
    <template v-if="rightIcon.name" #nav-bar-right>
      <van-icon v-bind="rightIcon" @click.prevent.stop="onRightIconCLick" />
    </template>
    <van-form
      ref="form"
      input-align="right"
      :class="_class"
      @submit="onSubmit"
      @failed="onFailed"
    >
      <div
        v-for="(fields, index) in _fields"
        v-show="!fields.hidden"
        :key="index"
      >
        <hips-wx-card v-if="fields.type === 'card'" v-bind="fields" />
        <hips-wx-date
          v-else-if="fields.type === 'date'"
          v-bind="fields"
          v-model="info[fields.name]"
          :rules="getRules(fields)"
          :placeholder="getPlaceholder(fields)"
        />
        <single-field
          v-else-if="fields.type === 'single'"
          ref="single"
          v-bind="fields"
          v-model="info[fields.name]"
          :meaning.sync="info[getMeaning(fields.name)]"
          :meaningName="getMeaning(fields.name)"
          :rules="getRules(fields)"
          :placeholder="getPlaceholder(fields)"
          :cascades="getCascades(fields)"
          @confirm="(item) => getConfirm(item, fields)"
          @click="(event) => getClick(event, fields)"
          @click-left-icon="(event) => getClickLeftIcon(event, fields)"
          @click-right-icon="(event) => getClickRightIcon(event, fields)"
        >
          <template #fieldType="{ queryFields: querys }">
            <field-type :value="querys" type="query" @submit="onSingle" />
          </template>
        </single-field>
        <multiple-field
          v-else-if="fields.type === 'multiple'"
          ref="multiple"
          v-bind="fields"
          v-model="info[fields.name]"
          :meaning.sync="info[getMeaning(fields.name)]"
          :rules="getRules(fields)"
          :placeholder="getPlaceholder(fields)"
          @confirm="(item) => getConfirm(item, fields)"
          @click="(event) => getClick(event, fields)"
          @click-left-icon="(event) => getClickLeftIcon(event, fields)"
          @click-right-icon="(event) => getClickRightIcon(event, fields)"
        >
          <template #fieldType="{ queryFields: querys }">
            <field-type :value="querys" type="query" @submit="onMultiple" />
          </template>
        </multiple-field>
        <hips-wx-radio
          v-else-if="fields.type === 'radio'"
          v-bind="fields"
          v-model="info[fields.name]"
          :rules="getRules(fields)"
          :placeholder="getPlaceholder(fields)"
        />
        <van-field
          v-else
          v-bind="fields"
          v-model="info[fields.name]"
          :rules="getRules(fields)"
          :placeholder="getPlaceholder(fields)"
          clearable
        />
      </div>
      <btn-type v-if="_btns.length > 0" v-model="_btns" />
    </van-form>
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
} from "../components";
import FieldType from "./utils/FieldType.vue";
import BtnType from "./utils/BtnType.vue";
import SingleField from "./utils/SingleField.vue";
import MultipleField from "./utils/MultipleField.vue";
import { Form, Field, Button, Toast } from "vant";
import indexMixin from "@/mixin/index";
import fieldsMixin from "@/mixin/fields";
import { instance } from "hips-wx-utils";
/** ===== import ===== */

export default {
  // 组件名称
  name: "HipsWxDetail",
  /** ===== components ===== */
  components: {
    [HipsWxPage.name]: HipsWxPage,
    [HipsWxSingle.name]: HipsWxSingle,
    [HipsWxCard.name]: HipsWxCard,
    [HipsWxRadio.name]: HipsWxRadio,
    [HipsWxMultiple.name]: HipsWxMultiple,
    [HipsWxUpload.name]: HipsWxUpload,
    [HipsWxDate.name]: HipsWxDate,
    [FieldType.name]: FieldType,
    [BtnType.name]: BtnType,
    [SingleField.name]: SingleField,
    [MultipleField.name]: MultipleField,
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button,
  },
  /** ===== components ===== */
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          title: "",
          rightText: "",
          webView: false,
          type: "detail",
          search: {
            placeholder: "",
            name: "",
            value: "",
          },
          fields: [],
          queryFields: [],
          btns: [],
          card: {
            title: "",
            value: "",
            label: [],
          },
          transport: {
            read: "",
            submit: "",
            delete: "",
          },
        };
      },
    },
  },
  mixins: [indexMixin, fieldsMixin],
  // 组件状态值
  data() {
    return {
      loading: false,
      info: {},
      created: false,
    };
  },
  // 计算属性
  computed: {
    binds() {
      const { fields = [] } = this.value;
      return fields.filter((item) => item.bind);
    },
    _fields() {
      const { fields = [] } = this.value;
      return fields.filter((item) => !item.bind);
    },
    _btns() {
      const { btns = [] } = this.value;
      switch (this.type) {
        case "query":
          return ["reset", "search", ...btns];
        default:
          return btns;
      }
    },
    _class() {
      let className = "";
      if (this.type === "query") {
        className = "query-form";
      }
      if (this._btns.length > 0) {
        className += " has-btns";
      } else {
        className += " no-btns";
      }
      return className;
    },
    params() {
      const query = this.$route?.query || {};
      const params = this.$route?.params || {};
      return { ...query, ...params };
    },
  },
  // 路由组件被激活时触发
  activated() {
    /** ===== activated ===== */
    this.init();
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
  unCreated() {
    /** ===== unCreated ===== */
    this.unInit();
    /** ===== unCreated ===== */
  },
  // 组件生成完毕后触发
  mounted() {
    /** ===== mounted ===== */
    /** ===== mounted ===== */
  },
  unMounted() {
    /** ===== unMounted ===== */
    /** ===== unMounted ===== */
  },
  // 组件方法
  methods: {
    init() {
      if (this.created) {
        return false;
      }
      this.created = true;
      setTimeout(() => {
        this.created = false;
      }, 2000);
      if (this.type === "detail") {
        instance
          .get(this.transport.read, { params: this.params })
          .then((res) => {
            const { failed = false, content } = res;
            if (failed) {
              return Promise.reject(res);
            }
            if (Array.isArray(content)) {
              this.info = content[0];
            } else {
              this.info = res;
            }
          })
          .catch((err) => {
            Toast.fail(err.message);
          });
      }
    },
    unInit() {},
    onSubmit(props) {
      const { clickType } = props;
      if (this.loading) {
        return false;
      }
      this.loading = true;
      const { read, submit } = this.transport;
      let type = clickType === "search" ? "get" : "post";
      let url = clickType === "search" ? read : submit;
      let params = clickType === "search" ? { params: this.info } : [this.info];
      return instance[type](url, params)
        .then((res) => {
          const { failed = false } = res;
          if (failed) {
            return Promise.reject(res);
          }
          this.$emit("submit", res);
        })
        .catch((err) => {
          this.$emit("failed", err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onFailed() {},
  },
};
</script>

<style lang="less" scoped></style>
