// 导入Observer类和必要的工具库
import Observer from "./Observer";
import Search from "./Search";
import { instance } from "hips-wx-utils";
import { Toast } from "vant";

/**
 * List类继承自Observer，用于处理列表相关的逻辑
 */
export default class List extends Observer {
  /**
   * 构造函数，初始化列表组件
   * @param {Object} props - 组件属性
   * @param {Object} parent - 父组件
   */
  constructor(props = {}, parent, index) {
    super(parent);
    // 默认值
    this.initPage();
    this.initData();
    this.initLoading();
    this.initFinished();

    //只取自己
    this.initTitle(props);
    this.initValue(props);
    this.initLabel(props);
    this.initShowNumber(props);
    this.initClick(props);
    this.initClassName(props);
    this.initTagProps(props);

    if (index >= 0) {
      this.index = index;
    }

    // 优先取自己,无则取父级
    this.initTransport(props);
    this.initQueryParameter(props);
    this.initSearch(props);
    this.initBtns(props);
    this.initPageSize(props);
    this.initNoCatch(props);

    // 只取父级
    this.initQueryFields();

    // 初始化加载数据
    this.onLoad();
  }

  initPage() {
    this.page = 0;
  }
  initData() {
    this.data = [];
  }
  initFinished() {
    this.finished = false;
  }
  initLoading() {
    this.loading = false;
  }

  initTitle(props) {
    const { title = "" } = props;
    this.title = title;
  }

  initValue(props) {
    const { value = "" } = props;
    this.value = value;
  }

  initLabel(props) {
    const { label = "" } = props;
    this.label = label;
  }

  initShowNumber(props) {
    const { showNumber = false } = props;
    this.showNumber = showNumber;
  }

  initClick(props) {
    const { click = () => {} } = props;
    this.click = click;
  }

  initTagProps(props) {
    const { tagProps } = props;
    this.tagProps = tagProps;
  }
  initClassName(props) {
    const { className = "" } = props;
    this.className = className;
  }

  initSearch(props) {
    const { search } = props ?? {};
    const parentSearchData = this.parent?.search?.data;
    this.search = new Search(search ?? parentSearchData, this);
  }
  getQueryParameter() {
    const queryParam = this.queryParameter ?? {};
    const searchQueryParam = this.search?.queryParameter ?? {};
    const queryFieldsParam = this.queryFields?.queryParameter ?? {};

    return {
      ...queryParam,
      ...searchQueryParam,
      ...queryFieldsParam,
      page: this.page,
      size: this.pageSize,
    };
  }

  getReadUrl() {
    const transport = this.transport;
    if (!transport) {
      return "";
    }

    if (typeof transport === "string") {
      return transport;
    }

    if (typeof transport === "object" && transport !== null) {
      const read = transport.read;

      if (typeof read === "string") {
        return read;
      }

      if (typeof read === "function") {
        try {
          return read(this.getQueryParameter());
        } catch (error) {
          console.error("Error calling read function:", error);
          return "";
        }
      }
    }

    return "";
  }

  /**
   * 增加页码
   */
  addPage() {
    this.page++;
  }

  /**
   * 添加数据到现有数据中
   * @param {Array} array - 新数据数组
   */
  addData(array = []) {
    this.data = [...this.data, ...array];
  }

  /**
   * 设置加载状态
   * @param {boolean} flag - 加载状态标志
   */
  setLoading(flag) {
    this.loading = flag;
  }

  /**
   * 设置加载完成状态
   * @param {boolean} flag - 加载完成状态标志
   */
  setFinished(flag) {
    this.finished = flag;
  }

  /**
   * 加载数据，根据当前页码和参数获取数据
   */
  onLoad() {
    if (this.loading) {
      return;
    }
    this.setLoading(true);

    const url = this.getReadUrl();
    if (url === "") {
      this.setFinished(true);
      this.setLoading(false);
      return false;
    }

    instance
      .get(url, { params: this.getQueryParameter() })
      .then((res) => {
        const { content = [], totalElements = 0 } = res;

        if (typeof this.parent.setBadge === "function") {
          this.parent.setBadge(this.index, totalElements);
        }
        this.addData(content);
        this.setFinished(this.data.length >= totalElements);
        this.addPage();
      })
      .catch((error) => {
        Toast.fail(error.message);
        this.setFinished(true);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  /**
   * 刷新数据，重置状态并重新加载数据
   */
  onRefresh() {
    this.initPage();
    this.initData();
    this.initFinished();
    this.onLoad();
  }
}
