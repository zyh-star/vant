// 导入 Vant 组件库中的 Field 组件
import { Field, Icon, Popup } from "vant";

// 导出一个 Vue 组件
export default {
  // 定义组件的属性
  props: {
    label: {
      type: String,
      default() {
        return "";
      },
    },
    value: {
      type: [String, Number],
      default() {
        return "";
      },
    },
    // 定义 disabled 属性，类型为布尔或函数，默认值为 false
    disabled: {
      type: [Boolean, Function],
      default() {
        return false;
      },
    },
    binds: {
      type: Array,
      default() {
        return [];
      },
    },
    cascades: {
      type: Object,
      default() {
        return {};
      },
    },
    allQueryParameter: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  // 定义组件使用的子组件
  components: {
    [Field.name]: Field,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
  },
  // 定义计算属性
  computed: {
    // 定义 _value 计算属性，用于双向绑定值
    _value: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    _disabled() {
      // 严格检查 disabled 属性的类型
      if (typeof this.disabled === "boolean" && this.disabled) {
        return true;
      }

      if (typeof this.disabled === "function") {
        try {
          if (this.disabled(this.allQueryParameter)) {
            return true;
          }
        } catch (error) {
          console.error("Error calling disabled function:", error);
          return false;
        }
      }

      /**
       * 逻辑未处理好，暂时关闭
       */

      const cascades = this.cascades;

      for (let key in cascades) {
        if (Object.prototype.hasOwnProperty.call(this.allQueryParameter, key)) {
          const flag =
            this.allQueryParameter[key] === "" ||
            this.allQueryParameter[key] == null ||
            this.allQueryParameter[key] === undefined;
          if (flag) {
            return true;
          }
        } else {
          return true;
        }
      }

      return false;
    },
  },
};
