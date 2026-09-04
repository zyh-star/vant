import Observer from "./Observer";

/**
 * Search 类继承自 Observer，用于管理搜索相关的状态和逻辑
 */
export default class Search extends Observer {
  /**
   * 构造函数
   * @param {Object|String|Array} props - 初始化搜索的属性，可以是对象、字符串或数组
   * @param {Object} parent - 父组件或父级作用域
   */
  constructor(props, parent) {
    super(parent);
    this.queryParameter = {};
    this.data = this.init(props);
  }

  /**
   * 初始化搜索数据
   * @param {Object|String|Array} props - 初始化搜索的属性，可以是对象、字符串或数组
   * @returns {Array} - 返回初始化后的搜索数据数组
   */
  init(props) {
    if (props == null) {
      return [];
    }

    try {
      if (typeof props === "string") {
        return [this.initIsString(props)];
      } else if (Array.isArray(props)) {
        return props
          .map((item) => {
            switch (typeof item) {
              case "string":
                return this.initIsString(item);
              case "object":
                if (item !== null) {
                  return this.initIsObject(item);
                }
                return {};
              default:
                console.error("Unsupported type in array:", item);
                return null;
            }
          })
          .filter(Boolean);
      } else if (typeof props === "object" && props !== null) {
        return [this.initIsObject(props)];
      } else {
        console.error("Unsupported type:", props);
        return [];
      }
    } catch (error) {
      console.error("Error initializing search data:", error);
      return [];
    }
  }

  /**
   * 当props为字符串时，初始化搜索项
   * @param {String} props - 搜索属性字符串
   * @returns {Object} - 返回初始化后的搜索项对象
   */
  initIsString(props = "") {
    return {
      key: props,
      value: "",
      onChange: (value) => this.onChange(props, value),
    };
  }

  /**
   * 当props为对象时，初始化搜索项
   * @param {Object} props - 搜索属性对象
   * @returns {Object} - 返回初始化后的搜索项对象
   */
  initIsObject(props = {}) {
    try {
      if (typeof props !== "object" || Array.isArray(props)) {
        throw new Error("props 必须是一个对象");
      }

      const {
        key = "",
        defaultValue = "",
        value = defaultValue || "",
        onSearch,
        ...item
      } = props;

      if (typeof key !== "string" || typeof value !== "string") {
        throw new Error("key 和 value 必须是字符串");
      }

      this.queryParameter[key] = value;
      return {
        key,
        value,
        ...item,
        onChange: (value) => this.onChange(key, value, onSearch),
        onSearch,
      };
    } catch (error) {
      console.error("初始化搜索项失败:", error);
      return {};
    }
  }

  /**
   * 当某个参数发生变化时调用此函数来更新查询参数
   *
   * @param {string} key - 发生变化的查询参数的键
   * @param {*} value - 该查询参数的新值
   * @returns {Array} 返回一个数组，包含更新后的查询参数值和完整的查询参数对象
   */
  onChange(key, value, callBack) {
    let v = value;
    if (callBack) {
      v = callBack(value);
    }

    if (typeof v === "object" && v !== null) {
      Object.keys(v).forEach((k) => {
        this.queryParameter[k] = v[k];
      });
    } else {
      this.queryParameter[key] = v;
    }

    delete this.queryParameter[""];

    if (this.parent?.onSearch) {
      this.parent.onSearch();
    }
  }

  getQueryParameter() {
    return this.queryParameter;
  }
}
