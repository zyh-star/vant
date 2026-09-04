import NavBar from "./dataSet/NavBar";
import Search from "./dataSet/Search";
import QueryFields from "./dataSet/QueryFields";
import List from "./dataSet/List";
import Tabs from "./dataSet/Tabs";

const TYPE_ENUM = {
  list: "list",
  tabs: "tabs",
  create: "create",
  edit: "edit",
  read: "read",
};

const TYPE_FUNCTION = {
  list: "initList",
  tabs: "initTabs",
};

export default class DataSet {
  constructor(props = {}) {
    // 基础配置初始化
    this.initType(props);
    this.initWebView(props);
    this.initKey(props);
    this.initNoCatch(props);
    this.initPageSize(props);
    this.initTitle(props);
    this.initRightText(props);
    this.initQueryParameter(props);
    this.initTransport(props);
    this.initQueryFields(props);
    this.initBtns(props);
    this.initSearch(props);

    // 组件初始化
    this.initNavBar(props);

    // 根据类型初始化特定组件
    if (
      TYPE_FUNCTION[this.type] &&
      typeof this[TYPE_FUNCTION[this.type]] === "function"
    ) {
      this[TYPE_FUNCTION[this.type]](props);
    }
  }

  // 初始化方法
  initWebView(props) {
    this.webView = Boolean(props.webView ?? false);
  }

  initKey(props) {
    this.key = String(props.key ?? "");
  }

  initNoCatch(props) {
    this.noCatch = Boolean(props.noCatch ?? false);
  }

  initPageSize(props) {
    const pageSize = Number(props.pageSize ?? 10);
    this.pageSize = isNaN(pageSize) ? 10 : pageSize;
  }

  initTitle(props) {
    this.title = String(props.title ?? "");
  }

  initRightText(props) {
    this.rightText = String(props.rightText ?? "");
  }

  initQueryParameter(props) {
    this.queryParameter = Object(props.queryParameter ?? {});
  }

  initTransport(props) {
    this.transport = props.transport ?? {};
  }

  initQueryFields(props) {
    this.queryFields = new QueryFields(props.queryFields, this);
  }

  initType(props) {
    const type = props.type ?? "list";
    if (Object.prototype.hasOwnProperty.call(TYPE_ENUM, type)) {
      this.type = TYPE_ENUM[type];
    } else {
      this.type = "list";
      console.warn(`Invalid type: ${type}, using default type: list`);
    }
  }

  initBtns(props) {
    this.btns = Array.isArray(props.btns) ? props.btns : [];
  }

  initSearch(props) {
    this.search = new Search(props.search, this);
  }

  initNavBar(props) {
    this.navbar = new NavBar(props.navbar, this);
  }

  initList(props) {
    this.list = new List(props.list ?? {}, this);
  }

  initTabs(props) {
    this.tabs = new Tabs(props.tabs ?? [], props.list ?? {}, this);
  }

  // 公共方法
  setType(type) {
    if (Object.prototype.hasOwnProperty.call(TYPE_ENUM, type)) {
      this.type = TYPE_ENUM[type];
    } else {
      throw new Error(`Invalid type: ${type}`);
    }
  }

  setBadge(badge) {
    if (typeof this.rightText === "function") {
      this.navbar.rightText = this.rightText(badge);
    }
  }

  // 更新属性方法
  updateProperty(key, value) {
    if (key in this) {
      this[key] = value;
      return true;
    }
    return false;
  }

  // 更新多个属性
  updateProperties(properties) {
    if (typeof properties !== "object" || properties === null) {
      return false;
    }

    Object.keys(properties).forEach((key) => {
      this.updateProperty(key, properties[key]);
    });
    return true;
  }

  // 获取属性
  getProperty(key) {
    return this[key];
  }
}
