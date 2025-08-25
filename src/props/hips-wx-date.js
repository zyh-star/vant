export default {
  placeholder: {
    type: String,
    default: "点击选择时间",
  },
  type: {
    type: String,
    default: "date",
  },
  formatter: {
    type: String,
    default: "yyyy-MM-dd",
  },
  inputAlign: {
    type: String,
    default: "right",
  },
  value: {
    type: [String, Date],
    default: "",
  },
};
