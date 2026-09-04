<!--
* @description 
* @fileName QueryList.vue
* @author zheng yuanhou
* @date 2025/01/20 09:22:41
!-->
<template>
  <van-popup
    v-model="show"
    v-bind="$attrs"
    :position="position"
    :overlay="overlay"
    :class="className"
    get-container="body"
    safe-area-inset-bottom
  >
    <van-form ref="form" input-align="right" @submit="onSubmit">
      <div v-for="(field, index) in data" :key="index">
        <wx-field
          v-if="field.type === 'text'"
          ref="field"
          v-bind="field"
          v-model="field.value"
          @input-field="(item) => onInput(item, field)"
        />
        <single-field
          v-else-if="field.type === 'single'"
          ref="field"
          v-bind="field"
          :allQueryParameter="allQueryParameter"
          @confirm="(item) => onConfirm(item, field)"
          @mounted="
            (textField, valueField) => addFieldKey(field, textField, valueField)
          "
        >
          <template #query="{ queryFields: query }">
            <query-list :queryFields="query" :overlay="false" />
          </template>
        </single-field>
        <hips-wx-date
          v-else-if="
            [
              'date',
              'year-month',
              'month-day',
              'time',
              'datetime',
              'datehour',
            ].includes(field.type)
          "
          ref="field"
          v-bind="field"
          @input="(item) => onInput(item, field)"
        />
      </div>
    </van-form>
    <div class="footer">
      <btn-list v-model="btns" :form="form" @reset="onReset" />
    </div>
  </van-popup>
</template>

<script>
import mixin from "@/mixin/indexV3";
import { Popup, Form } from "vant";
import WxField from "../field/Field.vue";
import SingleField from "../field/SingleField.vue";
import BtnList from "./BtnList.vue";
import HipsWxDate from "@/components/hips-wx-date/index.vue";

export default {
  // 组件名称
  name: "QueryList",
  // 组件参数 接收来自父组件的数据
  props: {
    queryFields: {
      type: Object,
      default: () => {
        return {};
      },
    },
    overlay: {
      type: Boolean,
      default: true,
    },
  },
  mixins: [mixin],
  // 局部注册的组件
  components: {
    [HipsWxDate.name]: HipsWxDate,
    [Popup.name]: Popup,
    [Form.name]: Form,
    [WxField.name]: WxField,
    [SingleField.name]: SingleField,
    [BtnList.name]: BtnList,
  },
  // 组件状态值
  data() {
    return {
      form: null,
    };
  },
  // 计算属性
  computed: {
    show: {
      get() {
        return this.queryFields.show;
      },
      set(show) {
        this.queryFields.toggle(show);
      },
    },
    data() {
      const { data = [] } = this.queryFields;
      return data;
    },
    btns() {
      const { btns = [] } = this.queryFields;
      return btns;
    },
    parent() {
      const { parent = {} } = this.queryFields;
      return parent;
    },
    navbar() {
      const { navbar = {} } = this.parent;
      const { data = {} } = navbar;
      return data;
    },
    position() {
      const { position = "top" } = this.navbar;
      if (typeof position === "function") {
        return position(this.parent);
      } else {
        return position;
      }
    },
    className() {
      return `query-field-${this.position}`;
    },
    allQueryParameter() {
      return this.queryFields.allQueryParameter;
    },
  },
  updated() {
    this.$nextTick(() => {
      if (!this.form) {
        this.form = this.$refs.form;
      }
    });
  },
  // 组件方法
  methods: {
    onSubmit() {
      this.queryFields.onSearch();
    },
    onReset() {
      if (Array.isArray(this.$refs.field)) {
        this.$refs.field.forEach((item) => {
          item.onReset();
        });
      } else if (this.$refs.field) {
        this.$refs.field.onReset();
      }
    },
    onConfirm(props, field) {
      this.queryFields.updateDataValue(field, props);
    },
    addFieldKey(field, textField, valueField) {
      field.textField = textField;
      field.valueField = valueField;
    },
    onInput(props, field) {
      this.queryFields.updateDataValue(field, props);
    },
  },
};
</script>

<style lang="less" scoped>
.query-field-top {
  width: 100vw;
  max-height: calc(50vh + env(safe-area-inset-top));
  padding-top: calc(0 + env(safe-area-inset-top));
  overflow-y: auto;
  .van-form {
    height: 100%;
    max-height: 40vh;
    overflow-y: auto;
    padding-bottom: 50px;
  }
}
.query-field-right {
  width: 50vw;
  height: 100vh;
  height: calc(
    100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 50px
  );
  padding-right: calc(0 + env(safe-area-inset-right));
  padding-top: calc(0 + env(safe-area-inset-top));
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
  overflow-y: auto;
  padding-bottom: 50px;
}
.query-field-left {
  width: 50vw;
  height: 100vh;
  height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  margin-left: calc(0 + env(safe-area-inset-right));
  margin-top: calc(0 + env(safe-area-inset-top));
  overflow-y: auto;
  padding-bottom: 50px;
}
.footer {
  display: flex;
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: 0;
}
</style>
