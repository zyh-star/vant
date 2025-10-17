<template>
  <div class="date">
    <van-field
      v-model="_value"
      :name="name"
      :label="label"
      :label-width="labelWidth"
      :placeholder="placeholder"
      :input-align="inputAlign"
      :disabled="disabled"
      :required="required"
      :rules="rules"
      readonly
      @click="showDatetimePicker"
    />
    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        v-bind="$attrs"
        :type="type"
        :readonly="readonly"
        cancel-button-text="重置"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
  </div>
</template>

<script>
import { Field, DatetimePicker, Popup } from "vant";
import dayjs from "dayjs";

export default {
  name: "hips-wx-date",
  components: {
    [Field.name]: Field,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
  },

  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "点击选择时间",
    },
    inputAlign: {
      type: String,
      default: "right",
    },
    label: {
      type: String,
      default: "",
    },
    labelWidth: {
      type: [String, Number],
      default: "6.2em",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: "date",
    },
    formatter: {
      type: [String, Function, undefined],
    },
  },
  data() {
    return {
      showPicker: false,
      currentDate: new Date(this.value || new Date()),
    };
  },
  computed: {
    _value: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    _formatter(value, formatter) {
      if (typeof this.formatter === "function") {
        return this.formatter(value);
      } else if (typeof this.formatter === "string") {
        return value.format(this.formatter ?? formatter);
      } else {
        return value.format(formatter);
      }
    },
    onConfirm(value) {
      let dateValue = "";
      switch (this.type) {
        case "date":
          dateValue = this._formatter(dayjs(value), "YYYY-MM-DD");
          break;
        case "year-month":
          dateValue = this._formatter(dayjs(value), "YYYY-MM");
          break;
        case "month-day":
          dateValue = this._formatter(dayjs(value), "MM-DD");
          break;
        case "time":
          dateValue = this._formatter(dayjs(value), "HH:mm:ss");
          break;
        case "datetime":
          dateValue = this._formatter(dayjs(value), "YYYY-MM-DD HH:mm:ss");
          break;
        case "datehour":
          dateValue = this._formatter(dayjs(value), "YYYY-MM-DD HH:mm:ss");
          break;
        default:
          break;
      }
      this._value = dateValue;
      this.hiddenDatetimePicker();
    },
    onCancel() {
      this.$emit("input", "");
      this.hiddenDatetimePicker();
    },
    showDatetimePicker() {
      if (this.readonly) {
        return false;
      }
      if (this.disabled) {
        return false;
      }
      this.showPicker = true;
    },
    hiddenDatetimePicker() {
      this.showPicker = false;
    },
  },
};
</script>

<style lang="less">
.van-cell::after {
  border: none;
}
</style>
