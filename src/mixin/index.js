import { debounce, isEmpty } from "lodash";
import { instance } from "hips-wx-utils";
import { Toast } from "vant";

export default {
  data() {
    return {
      // 是否第一次加载
      popupFirstShow: false,
      // 弹出层筛选层是否显示
      showFilter: false,
      // 加载状态，用于显示加载中的动画或提示
      loading: false,
      // 数据加载完成的状态，用于显示没有更多数据的提示
      finished: false,
      // 列表数据
      list: [],
      // 存储筛选条件的参数
      filterParams: {},
      // 页数
      page: 0,
      // 搜索地址
      queryUrl: "",
      valueField: "",
      displayField: "",
      queryFields: [],
      queryParams: {},
    };
  },
  watch: {
    popupFirstShow(flag) {
      if (flag) {
        if (typeof this.onRefresh === "function") {
          this.onRefresh();
        }
      }
    },
  },
  methods: {
    /**
     * 获取传参参数
     */
    getParams() {
      // 合并参数
      const combinedParams = {
        ...this.queryParams,
        page: this.page,
        size: this.size, // 提供默认值
      };

      return combinedParams;
    },
    /**
     * @description: 获取接口地址
     * @return {*}
     */
    initQueryUrl() {
      if (!isEmpty(this.lovUrl)) {
        this.queryUrl = this.lovUrl;
        this.addQueryFields();
        return false;
      }
      if (!isEmpty(this.lovCode)) {
        instance
          .get("/hpfm/v1/#tenantId#/lov-view/info?viewCode=" + this.lovCode)
          .then((res) => {
            const { failed = false, message } = res;
            if (failed) {
              return Promise.reject(message);
            }
            const {
              queryUrl = "",
              valueField = "",
              displayField = "",
              queryFields = [],
            } = res;
            this.queryUrl = queryUrl.replace(/{organizationId}/g, "#tenantId#");
            this.valueField = valueField;
            this.displayField = displayField;
            this.queryFields = queryFields.map((item) => {
              return {
                ...item,
                value: "",
                meaning: "",
                reset: "",
              };
            });
          })
          .catch((error) => {
            Toast.fail(error);
          })
          .finally(() => {
            this.addQueryFields();
          });
        return false;
      }
      if (!isEmpty(this.lookupCode)) {
        this.queryUrl = `/hpfm/v1/#tenantId#/lovs/value/batch?${this.lookupCode}=${this.lookupCode}`;
        this.valueField = "value";
        this.displayField = "meaning";
        // return "/hpfm/v1/#tenantId#/lovs/data?lovCode=" + this.lookupCode;
        this.addQueryFields();
        return false;
      }
    },
    /**
     * 添加查询字段
     * 该方法用于将参数(params和cascades)整合到查询参数(queryParams)中，并根据这些参数更新或添加到查询字段(queryFields)列表中
     */
    addQueryFields() {
      // 解构获取参数和级联参数
      const { params, cascades } = this;

      // 合并参数和级联参数到queryParams对象中
      this.queryParams = {
        ...params,
        ...cascades,
      };

      if (!isEmpty(this.lovCode)) {
        this.queryParams.lovCode = this.lovCode;
      }

      const searchKey = this.searchKey;

      if (Array.isArray(searchKey)) {
        searchKey.forEach((obj) => {
          // 查找是否存在与当前键对应的查询字段
          const { value: field, meaning } = obj;
          const item = this.queryFields.find((item) => item.field === field);
          if (!item) {
            // 如果不存在，添加新的查询字段，并设置为隐藏和只读
            this.queryFields.push({
              label: meaning,
              field: field,
              value: "",
              reset: "",
            });
          }
        });
      } else if (typeof searchKey === "string" && searchKey !== "") {
        const item = this.queryFields.find((item) => item.field === searchKey);
        if (!item) {
          // 如果不存在，添加新的查询字段，并设置为隐藏和只读
          this.queryFields.push({
            label: "查询",
            field: searchKey,
            value: "",
            reset: "",
          });
        }
      }

      // 遍历参数对象，更新或添加查询字段
      for (let key in params) {
        // 查找是否存在与当前键对应的查询字段
        const item = this.queryFields.find((item) => item.field === key);
        if (item) {
          // 如果存在，更新字段的值和重置值
          item.value = params[key];
          item.reset = params[key];
        } else {
          // 如果不存在，添加新的查询字段，并设置为隐藏和只读
          this.queryFields.push({
            field: key,
            value: params[key],
            reset: params[key],
            hidden: true,
            readonly: true,
          });
        }
      }

      // 遍历级联参数对象，更新或添加查询字段
      for (let key in cascades) {
        // 查找是否存在与当前键对应的查询字段
        const item = this.queryFields.find((item) => {
          return item.field === key;
        });
        if (item) {
          // 如果存在，更新字段的值和重置值，并设置为只读
          item.value = cascades[key];
          item.reset = cascades[key];
          item.readonly = true;
        } else {
          // 如果不存在，添加新的查询字段，并设置为隐藏和只读
          this.queryFields.push({
            field: key,
            value: cascades[key],
            reset: cascades[key],
            hidden: true,
            readonly: true,
          });
        }
      }
      if (!isEmpty(this.lovCode)) {
        this.queryFields.push({
          field: "lovCode",
          value: this.lovCode,
          reset: this.lovCode,
          hidden: true,
          readonly: true,
        });
      }
    },
    /**
     * @description: 获取接口地址
     * @return {*}
     */
    // getLovUrl() {
    //   if (!isEmpty(this.lovUrl)) {
    //     return this.lovUrl;
    //   }
    //   if (!isEmpty(this.lovCode)) {
    //     return "/hpfm/v1/#tenantId#/lov-view/info?viewCode=" + this.lovCode;
    //   }
    //   if (!isEmpty(this.lookupCode)) {
    //     return `/hpfm/v1/#tenantId#/lovs/value/batch?${this.lookupCode}=${this.lookupCode}`;
    //     // return "/hpfm/v1/#tenantId#/lovs/data?lovCode=" + this.lookupCode;
    //   }
    // },
    // /**
    //  * 监听弹窗显示事件
    //  * 该方法用于在弹窗显示时，调整相关元素的z-index值，以确保弹窗的正确显示
    //  */
    // listenPopupFirstShow() {
    //   // 确保DOM渲染完成后再执行操作
    //   this.$nextTick(() => {
    //     setTimeout(() => {
    //       const elements = document.querySelectorAll(".van-popup");
    //       let element;
    //       for (let i = 0; i < elements.length; i++) {
    //         if (elements[i].computedStyleMap.display !== "none") {
    //           element = elements[i];
    //           break;
    //         }
    //       }
    //       const currentZIndex = Number(
    //         this.$refs.popup.$el.previousElementSibling.style.zIndex
    //       );
    //       const previousZIndex = Number(element.style.zIndex);
    //       if (currentZIndex <= previousZIndex) {
    //         this.$refs.popup.$el.previousElementSibling.style.zIndex =
    //           previousZIndex + 1;
    //         this.$refs.popup.$el.style.zIndex = previousZIndex + 2;
    //       }
    //     }, 200);
    //   });
    // },

    /**
     * 深度比较两个JSON对象是否相等
     * @param {Object} obj1 第一个对象
     * @param {Object} obj2 第二个对象
     * @param {number} depth 当前递归深度，默认为0
     * @param {number} maxDepth 最大递归深度，默认为100
     * @returns {boolean} 如果两个对象相等则返回true，否则返回false
     * @throws {Error} 如果递归深度超过最大值，抛出错误
     */
    isJsonEqual(obj1, obj2, depth = 0, maxDepth = 100) {
      // 确保传入的参数是对象
      if (
        typeof obj1 !== "object" ||
        typeof obj2 !== "object" ||
        obj1 === null ||
        obj2 === null
      ) {
        return false;
      }

      // 防止栈溢出
      if (depth > maxDepth) {
        throw new Error("Maximum recursion depth exceeded");
      }

      // 获取两个对象的keys
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      // 如果keys的数量不同，则对象不相等
      if (keys1.length !== keys2.length) {
        return false;
      }

      // 检查每个key对应的值是否相等
      for (const key of keys1) {
        if (
          !Object.prototype.hasOwnProperty.call(obj2, key) || // 确保 obj2 也有该 key
          (typeof obj1[key] === "object" &&
            !this.isJsonEqual(obj1[key], obj2[key], depth + 1, maxDepth)) || // 递归比较嵌套对象
          obj1[key] !== obj2[key] // 比较基本类型的值
        ) {
          return false;
        }
      }

      // 如果所有对应的值都相等，则对象相等
      return true;
    },
    /**
     * @description: 显示弹出层之前判断
     * @return {Promise} 返回一个布尔值，表示弹出层是否应该显示
     */
    beforeShowPopup() {
      const isReadonly = Boolean(this.readonly);
      const isDisabled = Boolean(this._disabled);
      const isExplicitlyDisabled = Boolean(this.disabled);

      if (isReadonly || isDisabled || isExplicitlyDisabled) {
        return false;
      } else {
        return true;
      }
    },
    /**
     * 在隐藏弹窗前执行的操作
     *
     * 此函数返回一个Promise，用于在隐藏弹窗前完成必要的操作
     * 主要用于处理弹窗是否首次显示的逻辑
     * 如果设置了noCache属性为true，表示不缓存弹窗状态，则重置popupFirstShow标志
     *
     * @returns {Promise} 一个立即resolve的Promise，用以表示异步操作完成
     */
    beforeHiddenPopup() {
      if (this.noCache) {
        this.popupFirstShow = false;
      }
      return true;
    },
    /**
     * @description: 初始化单选数据
     */
    initSingleData() {
      this.list = this.singleData;
      // const reg = new RegExp(this.search);
      // this.list = this.singleData.filter((item) => {
      //   return reg.test(item[this.searchKey] || "");
      // });
      this.loading = false;
      this.finished = true;
    },
    // filterSubmit: debounce(function (params = {}) {
    //   this.filterParams = params;
    //   this.showFilter = false;
    //   this.onSearch();
    // }, 200),
    /**
     * @description: 重置查询条件
     * @return {*}
     */
    onReset() {
      const queryFields = this.queryFields;
      for (let index = 0; index < queryFields.length; index++) {
        const { reset = "" } = queryFields[index];
        queryFields[index].value = reset;
      }
      this.$refs.form.submit();
      // this.$emit("reset");
    },
    /**
     * @description: 查询
     * @return {*}
     */
    onSearch: debounce(function (props) {
      this.queryParams = props;
      if (typeof this.onRefresh === "function") {
        this.onRefresh();
      }
    }, 200),
    /**
     * @description: 刷新数据
     * @return {Promise} 返回一个Promise对象，表示数据刷新的过程
     */
    onRefresh() {
      this.list = [];
      this.page = 0;
      if (typeof this.onLoad === "function") {
        return this.onLoad();
      } else {
        return Promise.resolve();
      }
    },
    /**
     * @description: 获取数据
     * @return {Promise} 返回一个Promise对象，表示数据获取的过程
     */
    fetchData() {
      // const lovUrl = this.getLovUrl();
      const params = this.getParams();
      if (isEmpty(this.lookupCode)) {
        return instance.get(this.queryUrl, { params });
      } else {
        return instance.get(this.queryUrl);
      }
    },

    /**
     * @description: 处理响应数据
     * @param {*} res 响应的数据
     * @return {*}
     */
    handleResponse(res) {
      this.page++;
      // 如果是值集
      if (this.lookupCode) {
        this.contentIsArray(res[this.lookupCode]);
        this.finished = true;
        return false;
      }
      if (Array.isArray(res)) {
        this.contentIsArray(res);
        this.finished = res.length < this.size;
      } else if (typeof res === "object") {
        this.contentIsObject(res);
      } else {
        this.contentIsFailed("请求失败");
      }
    },
    /**
     * 将内容合并到列表中
     * 此方法用于处理当内容为数组时的情况
     * 它将内容数组合并到实例的列表中，并根据内容长度判断是否完成加载
     *
     * @param {Array} content - 要合并到列表的内容，默认为空数组
     */
    contentIsArray(content = []) {
      this.list = this.list.concat(content);
      this.finished = content.length < this.size;
    },

    /**
     * 处理当响应为对象时的内容
     * 此方法提取响应对象中的内容数组，并调用contentIsArray方法处理
     * 它用于处理API响应格式为对象，实际内容封装在对象中的情况
     *
     * @param {Object} res - 包含内容的响应对象，默认为空对象
     */
    contentIsObject(res = {}) {
      const { content = [], failed = false, message } = res;
      if (failed) {
        this.contentIsFailed(message);
      } else {
        this.contentIsArray(content);
      }
    },
    /**
     * @description: 接口返回报错
     * @param {string} message - 错误信息
     */
    contentIsFailed(message) {
      this.finished = true;
      Toast.fail({
        message,
        duration: 2000,
      });
    },
    /**
     * @description: 显示标题
     * @param {Object} item - 当前项对象
     * @param {number} index - 当前项索引
     * @return {string} - 标题字符串
     */
    showTitle(item, index) {
      if (this.showNumber) {
        return `${index + 1}.${item[this._checkTitle]}`;
      }
      return item[this._checkTitle];
    },
  },
};
