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
import { Form, Field } from "vant";
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
      const { field = "", name = field, value, defaultValue = value } = item;
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
.query-form {
  max-height: 20vh;
}
.has-btns {
  // padding-bottom: 50px;
}
.no-btns {
  padding-bottom: 0px;
}
</style>
