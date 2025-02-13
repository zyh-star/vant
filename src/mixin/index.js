import { bridge } from "hips-wx-utils";

export default {
  // 组件状态值
  data() {
    return {
      // 控制右侧图标弹窗的显示状态
      showRightIconPopup: false,
    };
  },
  // 计算属性
  computed: {},
  methods: {
    /**
     * 处理导航栏左侧按钮点击事件
     * 此函数被触发时，会根据当前环境（是否为WebView）来决定是关闭WebView还是后退到上一个路由页面
     *
     * @param {Event} event - 点击事件对象，包含与事件相关的信息
     */
    onLeft(event) {
      // 触发自定义事件"nav-bar-left"，将点击事件对象传递给父组件
      this.$emit("nav-bar-left", event);

      // 判断当前环境是否为WebView
      if (this.webView) {
        // 如果是WebView环境，调用bridge.closeWebView()方法关闭WebView
        bridge.closeWebView();
      } else {
        // 如果不是WebView环境，使用Vue Router的back方法后退到上一个路由页面
        this.$router.back();
      }
    },
    /**
     * 当右侧导航栏被触发时调用此函数
     *
     * @param {Event} event - 触发事件的对象，包含事件的具体信息
     */
    onRight(event) {
      // 触发自定义事件"nav-bar-right"，将事件对象传递给父组件
      this.$emit("nav-bar-right", event);
    },
    /**
     * 右侧图标点击事件处理函数
     * 此函数用于处理右侧图标被点击时的行为
     * 如果右侧图标定义了点击事件处理函数，则执行该函数
     * 否则，显示右侧图标对应的弹窗
     */
    onRightIconCLick() {
      // 检查右侧图标是否定义了点击事件处理函数
      if (typeof this.rightIcon.click === "function") {
        // 执行右侧图标的点击事件处理函数
        this.rightIcon.click();
        // 表示事件处理完毕，不再执行后续操作
        return false;
      }
      // 如果右侧图标未定义点击事件处理函数，则显示右侧图标对应的弹窗
      this.showShowRightIconPopup();
    },
    showShowRightIconPopup() {
      this.showRightIconPopup = true;
    },
    hiddenShowRightIconPopup() {
      this.showRightIconPopup = false;
    },
    initClassName(data, card) {
      const { className = "" } = card;
      if (typeof className === "function") {
        return className(data);
      }
      return className;
    },
  },
};
