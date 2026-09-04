export default {
  // 组件状态值
  data() {
    return {
      i18n: typeof this.$i18n === "function" ? this.i18n : (text) => text,
    };
  },
  methods: {
    /**
     * 从给定的对象中获取指定键的值，并通过i18n函数处理
     * @param {Object} data - 包含键值对的数据对象
     * @param {string|function} key - 要获取值的键名或键名生成函数
     * @returns {string} - 处理后的值或空字符串
     * @throws {Error} - 如果data不是对象或key不是字符串或函数时抛出错误
     */
    getKeyValue(data, key) {
      // 获取i18n引用
      const i18n = this.i18n;

      // 确保 data 是一个对象
      if (data == null || typeof data !== "object") {
        throw new Error("Invalid data: expected an object");
      }

      if (typeof key === "string") {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          return i18n(data[key]);
        } else {
          return "";
        }
      } else if (typeof key === "function") {
        return i18n(key(data));
      } else {
        return "";
      }
    },
    initClassName(data, object) {
      const { className } = object;
      if (typeof className === "function") {
        return className(data);
      } else if (typeof className === "string") {
        return className;
      }
      return "";
    },
  },
};
