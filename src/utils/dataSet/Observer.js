export default class Observer {
  constructor(props) {
    this.parent = props;
  }

  getParent() {
    return this.parent ?? undefined;
  }

  initTransport(props) {
    const { transport } = props ?? {};
    this.transport = transport ?? this.parent?.transport;
  }

  initQueryParameter(props = {}) {
    const { queryParameter } = props;
    this.queryParameter = queryParameter ?? this.parent?.queryParameter;
  }

  initBtns(props) {
    const { btns } = props ?? {};
    this.btns = btns ?? this.parent?.btns;
  }

  initPageSize(props) {
    const { pageSize } = props ?? {};
    if (typeof pageSize === "number") {
      this.pageSize = pageSize;
    } else {
      this.pageSize = this.parent?.pageSize;
    }
  }

  initNoCatch(props) {
    const { noCatch } = props ?? {};
    if (typeof noCatch === "boolean") {
      this.noCatch = noCatch;
    } else {
      this.noCatch = this.parent?.noCatch;
    }
  }

  initQueryFields() {
    const { queryFields } = this.parent ?? {};
    this.queryFields = queryFields;
  }

  parseStringifyData(obj = {}) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      return obj;
    }
  }

  /**
   * 搜索事件处理函数
   * 尝试在父组件中查找并执行刷新操作
   */
  onSearch(index) {
    try {
      const parent = this.parent;
      if (!parent) {
        console.warn("Parent is not defined");
        return;
      }
      if (typeof parent.onSearch === "function") {
        parent.onSearch(index);
      }
    } catch (error) {
      console.error("Error during onSearch:", error);
    }
  }
}
