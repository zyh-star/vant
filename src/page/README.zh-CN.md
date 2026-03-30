# Page 页面

### 引入

```js
import Vue from 'vue';
import { Page } from 'vant-wx';

Vue.use(Page);
```

## 代码演示

### 基础用法

Page 组件是一个页面布局容器，包含导航栏、内容区和底部区域，自动适配手机屏幕和 iOS 安全区。

```html
<van-page
  title="页面标题"
  left-text="返回"
  right-text="按钮"
  @click-left="onClickLeft"
  @click-right="onClickRight"
>
  <!-- 页面内容 -->
  <div>内容区域</div>

  <!-- 底部区域 -->
  <template #footer>
    <van-button type="primary" block>提交</van-button>
  </template>
</van-page>
```

```js
import { Toast } from 'vant-wx';

export default {
  methods: {
    onClickLeft() {
      Toast('返回');
    },
    onClickRight() {
      Toast('按钮');
    },
  },
};
```

### 隐藏导航栏

通过 `show-nav-bar` 属性可以隐藏导航栏。

```html
<van-page :show-nav-bar="false">
  <div>无导航栏的页面内容</div>
</van-page>
```

### 自定义背景色

通过 `background` 属性可以设置页面背景色。

```html
<van-page title="页面标题" background="#fff">
  <div>内容区域</div>
</van-page>
```

### iOS 键盘适配

Page 组件内置了 iOS 软键盘适配功能，当输入框获得焦点时，会自动将输入框滚动到可视区域内，避免被键盘遮挡。

```html
<van-page title="表单页面">
  <div class="form">
    <input type="text" placeholder="输入框 1" />
    <input type="text" placeholder="输入框 2" />
    <!-- 更多输入框... -->
    <input type="text" placeholder="输入框 10（底部）" />
  </div>
</van-page>
```

如果需要禁用键盘适配功能，可以设置 `keyboard-adapt` 属性为 `false`：

```html
<van-page title="页面" :keyboard-adapt="false">
  <div>内容</div>
</van-page>
```

## API

### Props

| 参数                   | 说明                   | 类型      | 默认值    |
| ---------------------- | ---------------------- | --------- | --------- |
| show-nav-bar           | 是否显示导航栏         | _boolean_ | `true`    |
| title                  | 导航栏标题             | _string_  | -         |
| left-text              | 导航栏左侧文案         | _string_  | -         |
| right-text             | 导航栏右侧文案         | _string_  | -         |
| left-arrow             | 是否显示左侧箭头       | _boolean_ | `true`    |
| show-footer            | 是否显示底部区域       | _boolean_ | `false`   |
| safe-area-inset-top    | 是否开启顶部安全区适配 | _boolean_ | `true`    |
| safe-area-inset-bottom | 是否开启底部安全区适配 | _boolean_ | `true`    |
| background             | 页面背景色             | _string_  | `#f7f8fa` |
| keyboard-adapt         | 是否启用 iOS 键盘适配  | _boolean_ | `true`    |

### Slots

| 名称    | 说明         |
| ------- | ------------ |
| default | 页面内容     |
| footer  | 底部区域内容 |

### Events

| 事件名      | 说明                     | 回调参数 |
| ----------- | ------------------------ | -------- |
| click-left  | 点击导航栏左侧按钮时触发 | -        |
| click-right | 点击导航栏右侧按钮时触发 | -        |

### 样式变量

组件提供了下列 Less 变量，可用于自定义样式，使用方法请参考[主题定制](#/zh-CN/theme)。

| 名称                          | 默认值    | 描述           |
| ----------------------------- | --------- | -------------- |
| @page-background-color        | `@gray-1` | 页面背景色     |
| @page-footer-background-color | `@white`  | 底部区域背景色 |

## 常见问题

### iOS 键盘弹出时输入框被遮挡

Page 组件默认启用了 iOS 键盘适配功能，当输入框获得焦点时会自动滚动到可视区域。如果遇到问题，请确保：

1. 输入框的 `font-size` 不小于 16px（防止 iOS 缩放）
2. 不要给 content 区域设置固定高度
3. 如果使用了第三方输入法，可能需要适当调整滚动延迟
