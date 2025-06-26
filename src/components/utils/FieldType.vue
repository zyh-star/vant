<!--
* @description 
* @fileName FieldType.vue
* @author zheng yuanhou
* @date 2024/12/12 16:39:07
!-->
<template>
  <van-form
    ref="form"
    colon
    submit-on-enter
    input-align="right"
    :class="_class"
    @submit="onSubmit"
    @failed="onFailed"
  >
    <div class="fields">
      <div
        v-for="(fields, index) in _fields"
        v-show="!fields.hidden"
        :key="index"
      >
        <hips-wx-card v-if="fields.type === 'card'" v-bind="fields" />
        <!-- 日期 -->
        <hips-wx-date
          v-else-if="fields.type === 'date'"
          v-bind="fields"
          v-model="info[fields.name]"
          :rules="getRules(fields)"
          :placeholder="getPlaceholder(fields)"
        />
        <!-- 日期时间 -->
        <hips-wx-date
          v-else-if="fields.type === 'datetime'"
          v-bind="fields"
          v-model="info[fields.name]"
          :rules="getRules(fields)"
          :placeholder="getPlaceholder(fields)"
          type="datetime"
          formatter="yyyy-MM-dd hh:mm:ss"
        />
        <hips-wx-date
          v-else-if="fields.type === 'time'"
          v-bind="fields"
          v-model="info[fields.name]"
          :rules="getRules(fields)"
          :placeholder="getPlaceholder(fields)"
          type="time"
          formatter="hh:mm:ss"
        />
        <!-- 值集 -->
        <single-field
          v-else-if="fields.type === 'select'"
          v-bind="fields"
          v-model="info[fields.name]"
          :lookup-code="fields.sourceCode"
          @confirm="(item) => getConfirm(item, fields)"
        >
          <template #fieldType="{ queryFields: querys }">
            <field-type :value="querys" type="query" @submit="onSingle" />
          </template>
        </single-field>
        <!-- 开关 -->
        <van-field
          v-else-if="fields.type === 'switch'"
          v-bind="fields"
          :rules="getRules(fields)"
        >
          <template #input>
            <van-switch
              v-model="info[fields.name]"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </van-field>
        <!-- 值集视图 -->
        <single-field
          v-else-if="fields.type === 'lovCode'"
          v-bind="fields"
          v-model="info[fields.name]"
          :lov-code="fields.sourceCode"
          @confirm="(item) => getConfirm(item, fields)"
        >
          <template #fieldType="{ queryFields: querys }">
            <field-type :value="querys" type="query" @submit="onSingle" />
          </template>
        </single-field>
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
        >
          <template #fieldType="{ queryFields: querys }">
            <field-type :value="querys" type="query" @submit="onMultiple" />
          </template>
        </multiple-field>
        <hips-wx-radio
          v-else-if="fields.type === 'radio'"
          v-bind="fields"
          v-model="info[fields.name]"
          input-align="right"
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
    </div>
    <btn-type v-if="_btns.length > 0" v-model="_btns" />
  </van-form>
</template>

<script>
import { Form, Field, Switch } from "vant";
// import {
//   HipsWxSingle,
//   HipsWxCard,
//   HipsWxRadio,
//   HipsWxMultiple,
//   HipsWxUpload,
//   HipsWxDate,
// } from "..";
import HipsWxCard from "../HipsWxCard.vue";
import HipsWxRadio from "../HipsWxRadio.vue";
import HipsWxUpload from "../HipsWxUpload.vue";
import HipsWxDate from "../HipsWxDate.vue";
import BtnType from "./BtnType.vue";
import SingleField from "./SingleField.vue";
import MultipleField from "./MultipleField.vue";
import fieldsMixin from "@/mixin/fields";
export default {
  // 组件名称
  name: "FieldType",
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    btns: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: "",
    },
  },
  // 局部注册的组件
  components: {
    [Form.name]: Form,
    [Field.name]: Field,
    [Switch.name]: Switch,
    [HipsWxCard.name]: HipsWxCard,
    [HipsWxRadio.name]: HipsWxRadio,
    [HipsWxUpload.name]: HipsWxUpload,
    [HipsWxDate.name]: HipsWxDate,
    [BtnType.name]: BtnType,
    [SingleField.name]: SingleField,
    [MultipleField.name]: MultipleField,
  },
  mixins: [fieldsMixin],
  // 组件状态值
  data() {
    return {
      info: {},
    };
  },
  // 计算属性
  computed: {
    _value() {
      return this.value.map((item) => {
        const {
          field = "",
          name = field,
          label = field,
          dataType = "",
          type = dataType,
        } = item;
        let _type = "";
        switch (type) {
          case "TEXT":
            _type = "text";
            break;
          case "INT":
            _type = "number";
            break;
          case "NUMBER":
            _type = "number";
            break;
          case "DATE":
            _type = "date";
            break;
          case "DATETIME":
            _type = "datetime";
            break;
          case "TIME":
            _type = "time";
            break;
          case "SELECT":
            _type = "select";
            break;
          case "SWITCH":
            _type = "switch";
            break;
          case "LOV_CODE":
            _type = "lovCode";
            break;
          case "BOOLEAN":
            _type = "boolean";
            break;
          default:
            _type = type;
            break;
        }
        return {
          ...item,
          name,
          label,
          type: _type,
        };
      });
    },
    _fields() {
      return this._value.filter((item) => !item.bind);
    },
    binds() {
      return this._value.filter((item) => item.bind);
    },
    _btns() {
      switch (this.type) {
        case "query":
          return ["reset", "search", ...this.btns];
        default:
          return this.btns;
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
  },
  created() {
    const json = {};
    this._value.forEach((item) => {
      let {
        field = "",
        name = field,
        value = "",
        defaultValue = value,
        type,
      } = item;
      if (type === "switch") {
        defaultValue = 0;
      }
      if (name) {
        json[name] = defaultValue;
      }
    });
    this.info = json;
  },
  mounted() {
    // this.$refs.form.submit();
  },
  // 组件方法
  methods: {
    onSubmit(props) {
      this.$emit("submit", props);
    },
    onFailed(err) {
      this.$emit("failed", err);
    },
  },
};
</script>

<style lang="less" scoped>
.van-form {
  overflow-y: auto;
  max-height: calc(100vh - 46px);
  margin-top: calc(0 + env(safe-area-inset-top));
}
.no-btns {
  padding-bottom: 0px;
}
</style>
