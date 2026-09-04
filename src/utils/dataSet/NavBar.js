import Observer from "./Observer";

/**
 * NavBar 类继承自 Observer，用于创建导航栏组件
 * 它根据传入的属性和父组件的数据来配置导航栏
 *
 * @extends Observer
 */
export default class NavBar extends Observer {
  /**
   * NavBar组件的构造函数
   * 它初始化导航栏的属性，包括标题、右侧文本、webView等
   *
   * @param {Object} props - 传入的属性对象，包含导航栏的配置信息
   * @param {Object} parent - 父组件对象，包含标题、右侧文本和webView属性
   */
  constructor(props, parent) {
    super(parent);

    // 保存当前实例的标题和右侧文本
    const title = parent.title;
    const rightText = parent.rightText;
    const webView = parent.webView;

    // 解析并处理传入的导航栏属性
    const navbar = this.parseStringifyData(props ?? {});

    // 确保导航栏属性中包含webView，如果没有则使用父组件的webView
    if (!("webView" in navbar)) {
      navbar.webView = webView;
    }

    // 如果导航栏属性中没有标题，则使用当前实例的标题
    if (!("title" in navbar)) {
      navbar.title = title;
    }

    // 如果导航栏属性中没有右侧文本，则使用当前实例的右侧文本
    if (!("rightText" in navbar)) {
      if (typeof rightText === "function") {
        navbar.rightText = rightText();
      } else {
        navbar.rightText = rightText;
      }
    }

    // 如果导航栏属性中没有大小，则使用默认值24
    if (!("size" in navbar)) {
      navbar.size = 24;
    }

    // 如果导航栏属性中没有颜色，则使用默认值"#1989fa"
    if (!("color" in navbar)) {
      navbar.color = "#1989fa";
    }

    // 将配置好的导航栏赋值给当前实例的navbar属性
    this.data = navbar;
  }
}
