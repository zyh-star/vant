import Observer from "./Observer";

export default class QueryFields extends Observer {
  /**
   * 构造函数，初始化组件
   * @param {Array} props - 组件的属性
   * @param {Object} parent - 父组件
   */
  constructor(props = [], parent) {
    super(parent);
    // 是否显示查询栏
    this.show = false;

    this.load = false;
    // 查询参数对象
    this.queryParameter = {};
    // 查询参数对象，包含所有查询参数
    this.allQueryParameter = {};
    // 数据映射表
    // 显示在页面的字段
    this.dataMap = new Map();
    // 显示在传参上的字段
    this.bindsMap = new Map();
    // 级联字段
    this.cascadesMap = new Map();

    if (this.checkIfDataExistsInLocalStorage(this.parent?.key)) {
      this.defaultValue = this.getLocalStorage(this.parent.key);
    } else {
      this.defaultValue = undefined;
    }
    // 验证props是否为数组
    if (!Array.isArray(props)) {
      throw new Error("Props must be an array");
    }
    // 遍历props数组，初始化查询字段数据
    props.forEach((prop) => {
      this.initQueryFieldData(prop);
    });

    // 将映射转换为数组，便于后续操作
    this.data = Array.from(this.dataMap.values());
    for (let i = 0; i < this.data.length; i++) {
      this.updateDataValue(this.data[i], this.data[i].value);
    }
    // 按钮数组，包含重置和搜索按钮
    this.btns = ["reset", "search"];

    this.load = true;
  }
  /**
   * 初始化类型
   * 该函数用于根据传入的属性初始化数据类型
   * @param {Object} props - 包含类型信息的属性对象
   * @param {string} props.type - 数据类型的字符串表示，默认为"string"
   * @param {string} props.dataType - 数据类型的另一种表示，如果存在，则优先使用
   * @returns {string} 初始化后的数据类型
   * @throws {Error} 如果在获取类型过程中发生错误，会重新抛出
   */
  initType(props = {}) {
    // 从属性对象中解构出类型信息，如果没有提供，则使用默认值
    const { type = "string", dataType } = props;

    this.deleteObjectKey(props, ["type", "dataType"]);

    // 提前获取类型，避免重复调用 initType
    const tarinitType = dataType !== undefined ? dataType : type;

    try {
      // 尝试根据 tarinitType 获取初始化后的类型
      return initType(tarinitType);
    } catch (error) {
      // 处理 initType 抛出的异常
      console.error("Error occurred while getting type:", error);
      // 根据需求决定是否重新抛出异常
      throw error;
    }
  }
  /**
   * 初始化默认值
   *
   * 此函数用于根据提供的属性和类型初始化一个默认值当属性中的defaultValue不存在时，它会根据类型来初始化默认值
   * 这在需要确保变量总是有初始值的场景中非常有用
   *
   * @param {Object} props - 包含defaultValue属性的对象，默认为空对象
   * @param {String} type - 变量的类型，用于在defaultValue缺失时初始化默认值
   * @returns {any} - 返回默认值或者根据类型初始化的默认值
   */
  initDefaultValue(props = {}, type) {
    // 从属性中解构出defaultValue
    const { defaultValue, cache, name } = props;
    this.deleteObjectKey(props, ["defaultValue"]);
    if (cache && this.defaultValue) {
      return this.defaultValue[name];
    }

    // 如果defaultValue不存在，则调用initDefaultValue函数根据类型初始化默认值
    if (!defaultValue) {
      return initDefaultValue(type);
    }

    // 如果defaultValue存在，则直接返回defaultValue
    return defaultValue;
  }
  /**
   * 初始化组件的值
   * 如果传入的props中没有value属性或者value属性为falsy值，则使用默认值
   * 否则，使用props中传入的value属性值
   *
   * @param {Object} props - 组件的props对象
   * @param {*} defaultValue - 默认值，当props中没有value时使用
   * @returns {*} - 返回初始化后的值
   */
  initValue(props, defaultValue) {
    // 从props对象中解构出value属性
    const { value } = props;
    this.deleteObjectKey(props, ["value"]);

    // 检查value是否存在，如果不存在则返回默认值
    if (!value) {
      return defaultValue;
    }

    // 如果value存在，则返回value的值
    return value;
  }
  initLabel(props) {
    const { label = "" } = props;

    this.deleteObjectKey(props, ["label"]);
    return label;
  }
  initName(props) {
    const { name, field } = props;
    this.deleteObjectKey(props, ["name", "field"]);
    return field || name;
  }
  /**
   * 删除对象中的指定键
   *
   * 此函数旨在从一个对象中删除一个或多个指定的键，如果键存在且为对象的直接属性，则将其删除
   * 如果提供的键不存在或对象中没有可删除的属性，则函数不会进行任何操作
   *
   * @param {Object} props - 需要从中删除键的对象
   * @param {string | string[]} key - 要删除的键名，可以是一个单独的键名字符串或键名数组
   */
  deleteObjectKey(props, key) {
    // 输入验证
    if (!props || typeof props !== "object" || props === null) {
      return;
    }
    // 处理 key 为 null 或 undefined 的情况
    if (key == null) {
      return;
    }
    // 确保 keys 是一个数组
    const keys = Array.isArray(key) ? key : [key];
    // 删除指定的键
    keys.forEach((k) => {
      if (
        typeof k === "string" &&
        Object.prototype.hasOwnProperty.call(props, k)
      ) {
        delete props[k];
      }
    });
  }
  initQueryFieldData(props) {
    // 验证每个项是否为非空对象
    if (typeof props !== "object" || props === null) {
      throw new Error("Each item in props must be a non-null object");
    }

    const { bind } = props;
    if (bind) {
      this.addBindData(props);
    } else {
      this.addDataData(props);
    }
  }

  /**
   * 添加数据到数据映射中，并根据需要更新查询参数
   * 此函数用于处理单个属性的存储逻辑，包括默认值和实际值的处理
   * @param {Object} props - 包含要添加的数据属性，可指定名称、默认值和实际值
   */
  addDataData(props = {}) {
    const { data, onChange, label, cascades, autoSingle, ...prop } = props;
    const name = this.initName(props);
    const type = this.initType(prop);
    const defaultValue = this.initDefaultValue(prop, type);
    const value = this.initValue(prop, defaultValue);
    const newProps = {
      ...prop,
      type,
      name,
      label,
      value,
      defaultValue,
      cascades,
      data,
      onChange,
      autoSingle,
    };
    if (cascades) {
      newProps.cascadesQueryParameter = {};
      Object.keys(cascades).forEach((key) => {
        newProps.cascadesQueryParameter[cascades[key]] = "";
        if (this.cascadesMap.has(key)) {
          this.cascadesMap.get(key).push(newProps);
        } else {
          this.cascadesMap.set(key, [newProps]);
        }
      });
    }
    // 获取数据映射对象
    const dataMap = this.dataMap;
    // 将属性及其值存储到数据映射中
    dataMap.set(name, newProps);
  }
  addBindData(props = {}) {
    const { bind = "", name } = props;
    // 获取绑定映射对象
    const bindsMap = this.bindsMap;
    // 解析props字符串为key和keyword
    const [dataName, dataKey] = bind.split(".");

    const newProps = {
      name,
      key: dataKey,
      value: "",
    };
    if (bindsMap.has(dataName)) {
      bindsMap.get(dataName).push(newProps);
    } else {
      bindsMap.set(dataName, [newProps]);
    }
  }

  updateDataValue(field, value = "") {
    const { onChange } = field;
    if (typeof onChange === "function") {
      onChange(value);
    }
    if (field.value !== value) {
      field.value = value;
    }
    this.updateQueryParameter(field);
    if (this.bindsMap.has(field.name)) {
      const binds = this.bindsMap.get(field.name);
      for (let i = 0; i < binds.length; i++) {
        const bind = binds[i];
        if (
          typeof value === "object" &&
          value !== null &&
          Object.prototype.hasOwnProperty.call(value, bind.key)
        ) {
          bind.value = value[bind.key];
        } else {
          bind.value = "";
        }
        this.updateQueryParameter(bind);
      }
    }
  }

  updateQueryParameter(props = {}) {
    const { name, value, ignore = false } = props;
    if (!ignore && typeof value !== "object") {
      this.queryParameter[name] = value;
    }
    this.allQueryParameter[name] = value;
    if (this.cascadesMap.has(name)) {
      const cascades = this.cascadesMap.get(name);
      for (let i = 0; i < cascades.length; i++) {
        const cascade = cascades[i];
        const { cascadesQueryParameter = {}, cascades: cascadesObject = {} } =
          cascade;
        if (cascadesQueryParameter[cascadesObject[name]] !== value) {
          if (cascade.type === "single") {
            this.load && this.updateDataValue(cascade, {});
          } else if (cascade.type === "text") {
            this.updateDataValue(cascade, "");
          }
        }
        cascadesQueryParameter[cascadesObject[name]] = value;
        let disabled = false;
        Object.keys(cascadesQueryParameter).forEach((key) => {
          if (cascadesQueryParameter[key] === "") {
            disabled = true;
          }
        });
        cascade.disabled = disabled;
      }
    }
  }

  /**
   * 切换显示状态
   * @param {boolean} [flag] - 可选的布尔值，用于设置显示状态
   */
  toggle(flag) {
    // 当提供的是布尔值时，直接设置显示状态
    if (typeof flag === "boolean") {
      this.show = flag;
    } else {
      // 当未提供布尔值时，切换当前的显示状态
      this.show = !this.show;
    }
  }
  onSearch() {
    const parent = this.parent;
    const { type, key, list, tabs } = parent;

    if (key) {
      let object = {};
      this.data.forEach(({ name, value, textField, valueField }) => {
        if (typeof value === "object" && value !== null) {
          object[name] = {
            [textField]: value[textField],
            [valueField]: value[valueField],
          };
        } else {
          object[name] = value;
        }
      });
      localStorage.setItem(this.parent.key, JSON.stringify(object));
    }
    switch (type) {
      case "list":
        list.onRefresh();
        break;
      case "tabs":
        tabs.onRefresh();
        break;
      case "lovCode":
        parent.onRefresh();
        break;
      default:
        break;
    }
    this.show = false;
  }
  getLocalStorage(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || {};
    } catch (e) {
      return {};
    }
  }
  checkIfDataExistsInLocalStorage(key) {
    return localStorage.getItem(key) !== null;
  }
  getQueryParameter() {
    return this.queryParameter;
  }
}

function initDefaultValue(type) {
  switch (type) {
    case "single":
      return {};
    case "multiple":
      return [];
    default:
      return "";
  }
}

function initType(type) {
  switch (type) {
    case "TEXT":
    case "string":
      return "text";
    default:
      return type;
  }
}
