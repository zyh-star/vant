import { isEmpty } from "lodash";

import { instance } from "hips-wx-utils";
import { Toast } from "vant";

export default {
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    meaning: {
      type: [String, Number],
      default: "",
    },
    lovCode: {
      type: String,
      default: "",
    },
    lovUrl: {
      type: String,
      default: "",
    },
    lookupCode: {
      type: String,
      default: "",
    },
    textField: {
      type: String,
      default: "",
    },
    valueField: {
      type: String,
      default: "",
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    cascades: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Array,
      default: () => [],
    },
    autoSelectSingle: {
      type: Boolean,
      default: false,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    showNumber: {
      type: Boolean,
      default: false,
    },
    labelField: {
      type: [String, Array],
      default: "",
    },
    pda: {
      type: Boolean,
      default: false,
    },
    querys: {
      type: Array,
      default: () => [],
    },
    showValue: {
      type: Boolean,
      default: true,
    },
    getContainer: {
      type: [String, () => Element],
      default: "body",
    },
  },
  data() {
    return {
      loading: false,
      finished: false,
      list: [],
      queryFields: this.querys.map((item = {}) => {
        return { ...item };
      }),
      textKey: "",
      valueKey: "",
      url: "",
      queryParams: {},
      page: 0,
      pdaInput: false,
    };
  },
  computed: {
    disabled() {
      const { disabled } = this.$attrs;
      if (disabled) {
        return disabled;
      }
      const cascades = this.cascades;
      let flag = false;
      for (let key in cascades) {
        const value = cascades[key] || "";
        if (value === "") {
          flag = true;
          break;
        }
      }
      return flag;
    },
    readonly() {
      const { readonly } = this.$attrs;
      if (readonly) {
        return true;
      }
      return !this.pda;
    },
    rightIcon() {
      const { readonly } = this.$attrs;
      const rightIcon = this.$attrs["right-icon"] || this.$attrs["rightIcon"];
      if (readonly) {
        return "";
      }
      if (this.disabled) {
        return "";
      }
      return rightIcon;
    },
  },
  watch: {
    data: {
      handler() {
        const index = this.data.findIndex((item) => {
          return item[this.valueKey] == this.value;
        });
        if (index === -1) {
          this.onConfirm();
        }
        this.onRefresh();
      },
      deep: true,
    },
    params: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          // this.onConfirm();
          this.onRefresh();
        }
      },
      deep: true,
    },
    cascades: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          // this.onConfirm();
          this.onRefresh();
        }
      },
      deep: true,
    },
  },
  created() {
    this.initQueryUrl();
  },
  methods: {
    /**
     * @description: 显示弹出层
     * @return {boolean} 返回一个布尔值，表示弹出层是否应该显示
     */
    showPopup() {
      const { readonly } = this.$attrs;
      if (this.disabled) {
        return false;
      }
      if (readonly) {
        return false;
      }
      if (this.pdaInput) {
        return false;
      }
      this.show = true;
    },
    /**
     * @description: 隐藏弹出层
     * @return {*}
     */
    hiddenPopup() {
      this.show = false;
    },
    initQueryUrl() {
      if (this.data.length > 0 && this.data.length !== this.list.length) {
        this.initListIsData();
        return false;
      }

      if (!isEmpty(this.lovUrl)) {
        this.url = this.lovUrl;
        this.initTextAndValue("meaning", "value");
        return;
      }
      if (!isEmpty(this.lovCode)) {
        this.getLovCodeConfig();

        return;
      }
      if (!isEmpty(this.lookupCode)) {
        this.url = `/hpfm/v1/#tenantId#/lovs/value/batch?${this.lookupCode}=${this.lookupCode}`;
        this.initTextAndValue("meaning", "value");
        return;
      }
      this.initTextAndValue("meaning", "value");
    },
    initRadioName(data, key) {
      try {
        return data[key].toString();
      } catch {
        return data[key];
      }
    },
    initListIsData() {
      this.initTextAndValue("meaning", "value");
      this.list = this.data;
      this.finished = true;
      return false;
    },
    initUrl(url) {
      this.url = url.replace(/{organizationId}/g, "#tenantId#");
    },
    initTextAndValue(text = "", value = "") {
      const textField = this.textField;
      const valueField = this.valueField;
      this.textKey = textField || text;
      this.valueKey = valueField || value;
    },
    getLovCodeConfig() {
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
          this.initUrl(queryUrl);
          this.initTextAndValue(displayField, valueField);
          this.queryFields = queryFields;
        })
        .catch((error) => {
          Toast.fail(error);
        });
    },
    /**
     * @description: 查询
     * @return {*}
     */
    onSearch(props = {}) {
      this.queryParams = props;
      if (typeof this.onRefresh === "function") {
        this.onRefresh();
      }
    },
    /**
     * @description: 刷新数据
     * @return {Promise} 返回一个Promise对象，表示数据刷新的过程
     */
    onRefresh() {
      this.finished = false;
      this.list = [];
      this.page = 0;

      if (typeof this.onLoad === "function") {
        return this.onLoad();
      } else {
        return Promise.resolve();
      }
    },
    /**
     * @description: 加载数据
     * @return {Promise} 返回一个Promise对象，表示数据加载的过程
     */
    onLoad() {
      return new Promise((resolve) => {
        if (this.data.length > 0) {
          this.list = this.data;
          return resolve(false);
        }
        if (this.finished) {
          return resolve(false);
        }
        if (this.loading) {
          return resolve(false);
        }
        if (this.disabled) {
          return resolve(false);
        }
        if (!this.url) {
          return resolve(false);
        }
        this.loading = true;
        this.fetchData()
          .then((res) => {
            const { failed = false, message = "" } = res;
            if (failed) {
              return Promise.reject(message);
            } else {
              if (typeof res === "object") {
                if (Array.isArray(res)) {
                  this.list = this.list.concat(res);
                  this.finished = true;
                } else {
                  const { content = [] } = res;
                  this.list = this.list.concat(content);
                  this.finished = content.length < this.pageSize;
                }
              }
              resolve(this.list);
            }
          })
          .catch((error) => {
            this.finished = true;
            Toast.fail(error);
          })
          .finally(() => {
            this.page++;
            setTimeout(() => {
              this.loading = false;
            }, 500);
            // this.loading = false;
          });
      });
    },
    /**
     * @description: 获取数据
     * @return {Promise} 返回一个Promise对象，表示数据获取的过程
     */
    fetchData(obj = {}) {
      const params = {
        size: this.pageSize,
        ...this.params,
        ...this.cascades,
        ...this.queryParams,
        page: this.page,
        ...obj,
      };
      if (this.lovCode) {
        params.lovCode = this.lovCode;
      }
      if (isEmpty(this.lookupCode)) {
        return instance.get(this.url, { params }).then((res) => {
          return res;
        });
      } else {
        return instance.get(this.url).then((res) => {
          return res[this.lookupCode] || [];
        });
      }
    },
    /**
     * @description: 显示标题
     * @param {Object} item - 当前项对象
     * @param {number} index - 当前项索引
     * @return {string} - 标题字符串
     */
    showTitle(item, index) {
      if (this.showNumber) {
        return `${index + 1}.${item[this.textKey]}`;
      }
      return item[this.textKey];
    },
    showValueText(item) {
      if (this.showValue) {
        return item[this.valueKey] || "";
      }
    },
    onClick(event) {
      this.$emit("click", event);
      this.showPopup();
    },
    onClickInput(event) {
      this.$emit("click-input", event);
    },
    onClickLeftIcon(event) {
      this.$emit("click-left-icon", event);
    },
    onClickRightIcon(event) {
      this.$emit("click-right-icon", event);
    },
    onEnter(event) {
      this.$emit("enter", event);
    },
  },
};
