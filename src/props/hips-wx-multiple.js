import hipsWxSingle from "./hips-wx-single";
export default {
  ...hipsWxSingle,
  rightText: {
    type: String,
    default: "确定",
  },
  // 值，可以是字符串或数字类型，默认值为空字符串
  value: {
    type: [String, Number, Array],
    default: "",
  },
};
