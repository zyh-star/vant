import Observer from "./Observer";
import List from "./List";

/**
 * Tabs 类，继承自 Observer
 * 用于管理标签页的数据和行为
 */
export default class Tabs extends Observer {
  /**
   * 构造函数
   * @param {Array} props - 标签页的初始数据
   * @param {Object} parent - 父组件
   */
  constructor(props, list, parent) {
    super(parent);
    // 默认值
    this.initActive();

    // 优先取自己,无则取父级
    this.initTransport(props);
    this.initQueryParameter(props);
    this.initSearch(props);
    this.initBtns(props);
    this.initPageSize(props);
    this.initNoCatch(props);
    this.initList(props, list);

    // 只取父级
    this.initQueryFields();

    this.initData(props);
  }

  initActive() {
    this.active = 0;
  }

  initSearch() {
    this.search = this.parent.search;
  }

  initList(props, object) {
    const { list } = props ?? {};
    this.list = typeof list === "object" ? list : object;
  }

  /**
   * 初始化数据
   * @param {Array} array - 标签页数据数组
   */
  initData(array) {
    // 初始化 List 实例
    this.tabData = (array || []).map((item, index) =>
      this.initTabData(item, index)
    );
    this.onRefresh();
  }

  initTabData(item = {}, index) {
    if (typeof item === "string") {
      return {
        title: item,
        badge: null,
        hidden: false,
        list: new List(this.list, this, index),
      };
    }
    const {
      title,
      hidden = false,
      badge,
      queryParameter,
      list,
      transport,
      search,
    } = item;
    let newList;
    if (typeof list === "object") {
      newList = { ...list };
    } else {
      newList = { ...this.list };
    }
    if (transport) {
      newList.transport = transport;
    }
    if (typeof queryParameter === "object") {
      newList.queryParameter = { ...queryParameter };
    }
    if (search) {
      newList.search = search;
    } else {
      newList.search = this.search.data;
    }
    return {
      title,
      badge: badge ? "" : null,
      hidden,
      list: new List(newList, this, index),
    };
  }

  setActive(index) {
    this.active = index;
  }

  getQueryParameter() {
    const queryParam = this.queryParameter ?? {};
    const queryFieldsParam = this.queryFields?.queryParameter ?? {};

    return {
      ...queryParam,
      ...queryFieldsParam,
    };
  }

  onRefresh() {
    const tabs = this.tabData.filter(({ hidden }) => {
      if (typeof hidden === "boolean") {
        return !hidden;
      } else if (typeof hidden === "function") {
        return !hidden(this.getQueryParameter());
      }
      return true;
    });
    tabs.forEach(({ list }) => {
      list.onRefresh();
      list.onLoad();
    });
    this.data = tabs;
  }

  setBadge(index, num) {
    const badge = this.data[index]?.badge;
    if (badge !== null && badge !== undefined) {
      this.data[index].badge = num === 0 ? "" : num;
    }
  }
}
