import { VanComponent } from './component';

export class Page extends VanComponent {
  /**
   * 是否显示导航栏
   * @default true
   */
  showNavBar?: boolean;

  /**
   * 导航栏标题
   */
  title?: string;

  /**
   * 导航栏左侧文案
   */
  leftText?: string;

  /**
   * 导航栏右侧文案
   */
  rightText?: string;

  /**
   * 是否显示左侧箭头
   * @default true
   */
  leftArrow?: boolean;

  /**
   * 是否显示底部区域
   * @default false
   */
  showFooter?: boolean;

  /**
   * 是否开启顶部安全区适配
   * @default true
   */
  safeAreaInsetTop?: boolean;

  /**
   * 是否开启底部安全区适配
   * @default true
   */
  safeAreaInsetBottom?: boolean;

  /**
   * 页面背景色
   * @default '#f7f8fa'
   */
  background?: string;

  /**
   * 是否启用 iOS 键盘适配
   * @default true
   */
  keyboardAdapt?: boolean;
}
