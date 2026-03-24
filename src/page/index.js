// Utils
import { createNamespace } from '../utils';

// Components
import NavBar from '../nav-bar';

const [createComponent, bem] = createNamespace('page');

export default createComponent({
  props: {
    // 是否显示导航栏
    showNavBar: {
      type: Boolean,
      default: true,
    },
    // 导航栏标题
    title: String,
    // 导航栏左侧文字
    leftText: String,
    // 导航栏右侧文字
    rightText: String,
    // 是否显示左侧箭头
    leftArrow: {
      type: Boolean,
      default: true,
    },
    // 是否显示底部
    showFooter: {
      type: Boolean,
      default: false,
    },
    // 是否适配顶部安全区（iOS刘海屏）
    safeAreaInsetTop: {
      type: Boolean,
      default: true,
    },
    // 是否适配底部安全区（iOS刘海屏）
    safeAreaInsetBottom: {
      type: Boolean,
      default: true,
    },
    // 导航栏是否固定
    fixed: {
      type: Boolean,
      default: true,
    },
    // 背景色
    background: {
      type: String,
      default: '#f7f8fa',
    },
  },

  methods: {
    onClickLeft(event) {
      this.$emit('click-left', event);
    },

    onClickRight(event) {
      this.$emit('click-right', event);
    },

    genNavBar() {
      if (!this.showNavBar) {
        return null;
      }

      return (
        <NavBar
          title={this.title}
          leftText={this.leftText}
          rightText={this.rightText}
          leftArrow={this.leftArrow}
          fixed={false}
          safeAreaInsetTop={this.safeAreaInsetTop}
          onClick-left={this.onClickLeft}
          onClick-right={this.onClickRight}
        />
      );
    },

    genContent() {
      return (
        <div ref="content" class={bem('content')}>
          {this.slots('default')}
        </div>
      );
    },

    genFooter() {
      if (!this.showFooter && !this.slots('footer')) {
        return null;
      }

      return (
        <div
          class={bem('footer', {
            'safe-area-inset-bottom': this.safeAreaInsetBottom,
          })}
        >
          {this.slots('footer')}
        </div>
      );
    },
  },

  render() {
    return (
      <div class={bem()} style={{ backgroundColor: this.background }}>
        {this.genNavBar()}
        {this.genContent()}
        {this.genFooter()}
      </div>
    );
  },
});
