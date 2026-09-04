import { instance } from "hips-wx-utils";
import QueryFields from "@/utils/dataSet/QueryFields";
import { Toast } from "vant";

const API_BASE_URL = "/hpfm/v1/#tenantId#";
// 值集
export default {
  props: {
    name: {
      type: String,
      default() {
        return "";
      },
    },
    data: {
      type: [Array, Function, undefined],
      default() {
        return undefined;
      },
    },
    lovUrl: {
      type: String,
      default() {
        return "";
      },
    },
    lovCode: {
      type: String,
      default() {
        return "";
      },
    },
    lookupCode: {
      type: String,
      default() {
        return "";
      },
    },
    pageSize: {
      type: Number,
      default() {
        return 10;
      },
    },
    params: {
      type: Object,
      default() {
        return {};
      },
    },
    valueField: {
      type: String,
      default() {
        return "value";
      },
    },
    textField: {
      type: String,
      default() {
        return "meaning";
      },
    },
    showValue: {
      type: [Boolean, undefined],
      default() {
        return true;
      },
    },
    // 定义 disabled 属性，类型为布尔或函数，默认值为 false
    disabled: {
      type: [Boolean, Function],
      default() {
        return false;
      },
    },
    cascadesQueryParameter: {
      type: [Object, undefined],
      default: undefined,
    },
    queryParameter: {
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
    showInput: {
      type: Boolean,
      default: false,
    },
    autoSingle: {
      type: Boolean,
      default: false,
    },
  },
  // 组件状态值
  data() {
    return {
      show: false,
      list: [],
      loading: false,
      finished: false,
      queryFields: null,
      tableFields: [],
      valueKey: "",
      textKey: "",
      page: 0,
      queryParams: {},
      type: "",
    };
  },
  watch: {
    show(newVal) {
      this.queryFields && this.queryFields.toggle(newVal);
    },
  },
  created() {
    this.initType();
    this.init();
  },
  methods: {
    initType() {
      const typeMap = [
        {
          key: "data",
          condition: () =>
            this.data &&
            (Array.isArray(this.data) || typeof this.data === "function"),
        },
        { key: "lovUrl", condition: () => this.lovUrl && this.lovUrl !== "" },
        {
          key: "lookupCode",
          condition: () => this.lookupCode && this.lookupCode !== "",
        },
        {
          key: "lovCode",
          condition: () => this.lovCode && this.lovCode !== "",
        },
      ];

      for (const item of typeMap) {
        if (item.condition()) {
          this.type = item.key;
          return;
        }
      }

      // 添加默认值，确保 type 总是被设置
      this.type = "unknown";
    },
    async init() {
      switch (this.type) {
        case "data":
          this.initData();
          break;
        case "lovUrl":
          this.initLovUrl();
          break;
        case "lookupCode":
          this.initLookupCode();
          break;
        case "lovCode":
          await this.initLovCode();
          break;
        case "unknown":
          this.finished = true;
          break;
        default:
          break;
      }
    },
    initData() {
      this.initCommon();
      // this.loading = true;
      // const queryParameter = {
      //   ...this.queryParameter,
      //   ...this.cascadesQueryParameter,
      //   ...this.allQueryParameter,
      // };

      // if (Array.isArray(this.data)) {
      //   this.list = this.data;
      // } else if (typeof this.data === "function") {
      //   this.list = this.data(queryParameter);
      // }
      // this.finished = true;
      // this.initTextKeyAndValueKey();
      // this.loading = false;
    },
    initLovUrl() {
      this.url = this.lovUrl.replace(/{organizationId}/g, "#tenantId#");
      this.initCommon();
    },
    async initLookupCode() {
      this.url = `${API_BASE_URL}/lovs/value/batch?${this.lookupCode}=${this.lookupCode}`;
      this.initCommon();
    },
    async initLovCode() {
      try {
        if (!this.url) {
          const res = await instance.get(
            `${API_BASE_URL}/lov-view/info?viewCode=${this.lovCode}`
          );
          const { failed = false, message } = res;
          if (failed) {
            Toast.fail(message);
            return false;
          }

          const {
            queryUrl = "",
            valueField = "",
            displayField = "",
            queryFields = [],
            tableFields = [],
          } = res;
          this.url = queryUrl.replace(/{organizationId}/g, "#tenantId#");
          this.initTextKeyAndValueKey(valueField, displayField);
          this.queryParams.lovCode = this.lovCode;
          this.queryFields = new QueryFields(queryFields, this);

          this.tableFields[0] = [displayField, valueField];
          tableFields.forEach((tableField, index) => {
            const { dataIndex, title } = tableField;
            if (dataIndex !== displayField && dataIndex !== valueField) {
              this.tableFields[index + 1] = [
                (data) => `${title}:${data[dataIndex] || ""}`,
              ];
            }
          });
        }
        this.onLoad();
      } catch (error) {
        console.error("Error fetching LOV code:", error);
        Toast.fail("Failed to fetch LOV code");
      }
    },

    initCommon() {
      this.initTextKeyAndValueKey();
      this.onLoad();
    },
    initTextKeyAndValueKey(valueKey = null, textKey = null) {
      // 明确处理 null 和 undefined
      this.valueKey = valueKey ?? this.valueField ?? "";
      this.textKey = textKey ?? this.textField ?? "";

      // 检查 this.valueField 和 this.textField 是否存在
      if (this.valueField === undefined) {
        throw new Error("this.valueField is not defined");
      }
      if (this.textField === undefined) {
        throw new Error("this.textField is not defined");
      }
      if (typeof this.initTextAndValue === "function") {
        this.initTextAndValue();
      }
      this.$emit("mounted", this.textKey, this.valueKey);
    },
    showSingle() {
      const { readonly } = this.$attrs;
      if (readonly) {
        return false;
      }
      if (this._disabled) {
        return false;
      }
      this.show = true;
    },
    hiddenSingle() {
      this.show = false;
    },
    onSearch() {
      this.onRefresh();
    },

    onRefresh() {
      this.finished = false;
      this.list = [];
      this.page = 0;
      this.init();
    },
    onLoad() {
      if (this.shouldPreventLoad()) {
        return false;
      }

      this.loading = true;

      const fetchDataWithTimeout = async () => {
        try {
          const res = await Promise.race([
            this.fetchData(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Request timed out")), 10000)
            ),
          ]);
          const { failed = false, message } = res;
          if (failed) {
            throw new Error(message);
          }
          const { content = [], totalElements = 0 } = res;
          this.list = this.list.concat(content);
          this.finished =
            totalElements >= 0 && totalElements <= this.list.length;
        } catch (err) {
          console.error("Error fetching data:", err); // 记录详细的错误信息
          Toast.fail("加载失败，请稍后再试");
          this.finished = true;
        } finally {
          this.page++;

          if (
            typeof this.onRadio === "function" &&
            [undefined, null, ""].includes(this.text) &&
            [undefined, null, ""].includes(this.radio)
          ) {
            if (typeof this.autoSingle === "function") {
              this.onRadio({}, this.autoSingle(this.list));
            } else if (typeof this.autoSingle === "boolean") {
              if (this.autoSingle) {
                this.onRadio({}, this.list[0] || {});
              }
            }
          }
          this.loading = false;
        }
      };

      fetchDataWithTimeout();
    },

    shouldPreventLoad() {
      return (
        this.finished || this.loading || this._disabled || this.$attrs.readonly
      );
    },
    fetchData() {
      let params = {
        page: this.page,
        size: this.pageSize,
        ...this.queryParams,
        ...this.queryParameter,
        ...this.cascadesQueryParameter,
      };

      if (this.queryFields) {
        params = { ...params, ...this.queryFields.queryParameter };
      }

      try {
        if (this.type === "data") {
          // if (Array.isArray(this.data)) {
          //   this.list = this.data;
          // } else if (typeof this.data === "function") {
          //   this.list = this.data(queryParameter);
          // }
          return new Promise((resolve) => {
            let data = Array.isArray(this.data)
              ? this.data
              : typeof this.data === "function"
              ? this.data(params)
              : [];
            resolve({ content: data, totalElements: data.length });
          });
        } else if (this.type === "lovUrl" || this.type === "lovCode") {
          return instance
            .get(this.url, { params })
            .then((res) => res)
            .catch((error) => {
              console.error("Error fetching data:", error);
              throw error;
            });
        } else if (this.type === "lookupCode") {
          return instance
            .get(this.url)
            .then((res) => {
              const { failed = false } = res;
              if (failed) {
                return res;
              }
              return {
                content: res[this.lookupCode] || [],
                totalElements: res[this.lookupCode]?.length || 0,
              };
            })
            .catch((error) => {
              console.error("Error fetching lookup code data:", error);
              throw error;
            });
        } else {
          return new Promise((resolve) => {
            resolve({ content: [], totalElements: 0 });
          });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        throw error;
      }
    },
    initCardTitle(data) {
      return data[this.textKey] || "";
    },
    initCardValue(data) {
      if (this.showValue) {
        return data[this.valueKey] || "";
      }
      return "";
    },
    initCardLabels() {
      return this.tableFields.filter(
        (tableField, tableFieldIndex) => tableFieldIndex > 0
      );
    },
    initRadioName(data = {}, key) {
      try {
        return data[key].toString();
      } catch {
        return data[key];
      }
    },
  },
};
