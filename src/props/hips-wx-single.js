export default {
  // 定义 getContainer 属性，用于指定弹出层的父节点
  getContainer: {
    type: [String, () => Element],
    default: "body",
  },
  // 是否只读，布尔类型，默认值为false
  readonly: {
    type: Boolean,
    default: false,
  },
  // 是否禁用，布尔类型，默认值为false
  disabled: {
    type: Boolean,
    default: false,
  },
  // 意义，可以是字符串或数字类型，默认值为空字符串
  meaning: {
    type: [String, Number],
    default: "",
  },
  // 值，可以是字符串或数字类型，默认值为空字符串
  value: {
    type: [String, Number],
    default: "",
  },
  // 标签，字符串类型，默认值为空字符串
  label: {
    type: String,
    default: "",
  },
  // 标题，字符串类型，默认值为空字符串
  title: {
    type: String,
    default: "",
  },
  // // 右侧文本，字符串类型，默认值为空字符串
  // rightText: {
  //   type: String,
  //   default: "",
  // },
  // 占位符，字符串类型，默认值为空字符串
  placeholder: {
    type: String,
    default: "",
  },
  // 搜索关键字，字符串类型，默认值为空字符串
  searchKey: {
    type: [String, Array],
    default: () => [],
  },
  // 关联代码，字符串类型，默认值为空字符串
  lovCode: {
    type: String,
    default: "",
  },
  lookupCode: {
    type: String,
    default: "",
  },
  // 关联URL，字符串类型，默认值为空字符串
  lovUrl: {
    type: String,
    default: "",
  },
  // 单个数据，可以是数组类型或未定义，默认值为未定义
  singleData: {
    type: [Array, undefined],
    default: undefined,
  },
  // 参数，对象类型，默认值为空对象
  params: {
    type: Object,
    default: () => ({}),
  },
  // 级联，数组类型，默认值为空数组
  cascades: {
    type: Object,
    default: () => ({}),
  },
  // 校验标题，字符串类型，默认值为空字符串
  checkTitle: {
    type: String,
    default: "",
  },
  // 校验值，字符串类型，默认值为空字符串
  checkValue: {
    type: String,
    default: "",
  },
  // 选择单选框，可以是字符串或数组类型，默认值为空字符串
  checkRadio: {
    type: [String, Array],
    default: "",
  },
  // 是否必填，布尔类型，默认值为false
  required: {
    type: Boolean,
    default: false,
  },
  // 规则，数组类型，默认值为空数组
  rules: {
    type: Array,
    default: () => [],
  },
  // 是否出错，布尔类型，默认值为false
  error: {
    type: Boolean,
    default: false,
  },
  // 是否显示数字，布尔类型，默认值为false
  showNumber: {
    type: Boolean,
    default: false,
  },
  // 页数量，数字类型，默认值为10
  size: {
    type: Number,
    default: 10,
  },
  // 点击查询仅存在一条数据时自动选中
  autoSelectSingle: {
    type: Boolean,
    default: false,
  },
  // form name
  name: {
    type: String,
    default: "",
  },
  meaningName: {
    type: String,
    default: "",
  },
  // 弹窗时自动重新查询
  noCache: {
    type: Boolean,
    default: false,
  },
  colon: {
    type: Boolean,
    default: false,
  },
  inputAlign: {
    type: String,
    default: "right",
  },
};
