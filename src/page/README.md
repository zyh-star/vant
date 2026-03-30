# Page

### Intro

```js
import Vue from 'vue';
import { Page } from 'vant-wx';

Vue.use(Page);
```

## Usage

### Basic Usage

The Page component is a page layout container that includes a navigation bar, content area, and footer area. It automatically adapts to mobile screens and iOS safe areas.

```html
<van-page
  title="Page Title"
  left-text="Back"
  right-text="Button"
  @click-left="onClickLeft"
  @click-right="onClickRight"
>
  <!-- Page content -->
  <div>Content area</div>

  <!-- Footer area -->
  <template #footer>
    <van-button type="primary" block>Submit</van-button>
  </template>
</van-page>
```

```js
import { Toast } from 'vant-wx';

export default {
  methods: {
    onClickLeft() {
      Toast('Back');
    },
    onClickRight() {
      Toast('Button');
    },
  },
};
```

### Hide NavBar

Use the `show-nav-bar` prop to hide the navigation bar.

```html
<van-page :show-nav-bar="false">
  <div>Page content without navbar</div>
</van-page>
```

### Custom Background

Use the `background` prop to set the page background color.

```html
<van-page title="Page Title" background="#fff">
  <div>Content area</div>
</van-page>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| show-nav-bar | Whether to show navbar | _boolean_ | `true` |
| title | Title of navbar | _string_ | - |
| left-text | Left text of navbar | _string_ | - |
| right-text | Right text of navbar | _string_ | - |
| left-arrow | Whether to show left arrow | _boolean_ | `true` |
| show-footer | Whether to show footer area | _boolean_ | `false` |
| safe-area-inset-top | Whether to enable top safe area adaptation | _boolean_ | `true` |
| safe-area-inset-bottom | Whether to enable bottom safe area adaptation | _boolean_ | `true` |
| background | Page background color | _string_ | `#f7f8fa` |

### Slots

| Name    | Description         |
| ------- | ------------------- |
| default | Page content        |
| footer  | Footer area content |

### Events

| Event       | Description                                  | Arguments |
| ----------- | -------------------------------------------- | --------- |
| click-left  | Emitted when clicking left button of navbar  | -         |
| click-right | Emitted when clicking right button of navbar | -         |

### Less Variables

How to use: [Custom Theme](#/en-US/theme).

| Name                          | Default Value | Description                  |
| ----------------------------- | ------------- | ---------------------------- |
| @page-background-color        | `@gray-1`     | Page background color        |
| @page-footer-background-color | `@white`      | Footer area background color |
