# HipsWxView

## 基础

```vue
<template>
  <div>
    <hips-wx-view :data-set="value" />
  </div>
</template>
```

```javascript
import { HipsWxView, DataSet } from 'hips-wx-components'

export default {
  components: {
    [HipsWxView.name]: HipsWxView
  },
  data() {
    return {
      value: null
    }
  },
  created() {
    this.value = new DataSet({ title: '基础' })
  }
}
```

## API

### DataSet

#### Props

| 属性           | 说明                                   | 类型                           | 默认值 |
| -------------- | -------------------------------------- | ------------------------------ | ------ |
| title          | 标题                                   | String                         | ''     |
| webView        | 是否退出子应用                         | Boolean                        | true   |
| key            | DataSet Key 值，用于储存和读取本地数据 | String                         | ''     |
| noCatch        | 页面加载是否不使用缓存                 | Boolean                        | false  |
| pageSize       | 页面请求默认长度                       | Number                         | 10     |
| rightText      | 导航栏右侧文本                         | String                         | ''     |
| queryParameter | 请求参数                               | Object                         | {}     |
| btns           | 底部按钮,见 Btns                       | <String,Object>Array           | []     |
| navbar         | 导航栏，见 NavBar                      | Object                         | {}     |
| list           | 列表，见 List                          | Object                         | {}     |
| search         | 查询栏，见 Search                      | [<String,Object>Array, String] | []     |
| tabs           | 标签栏，见 Tabs                        | Array                          | []     |
| queryFields    | 弹出查询栏，见 QueryFields             | Array                          | []     |
| transport      | 请求数据，见 Transport                 | Object                         | {}     |

### Btns

#### Props

| 属性  | 说明     | 类型   | 默认值 |
| ----- | -------- | ------ | ------ |
| text  | 按钮文本 | String | ''     |
| type  | 按钮类型 | String | ''     |
| size  | 按钮大小 | String | ''     |
| color | 按钮颜色 | String | ''     |
| icon  | 按钮图标 | String | ''     |

#### Events

| 事件名 | 说明 | 回调参数 |
| ------ | ---- | -------- |
| click  | 点击 | data:[]  |

### NavBar

#### Props

| 属性      | 说明           | 类型    | 默认值            |
| --------- | -------------- | ------- | ----------------- |
| title     | 标题           | String  | DataSet.title     |
| rightText | 右侧文本       | String  | DataSet.rightText |
| webView   | 是否退出子应用 | Boolean | DataSet.webView   |
| size      | icon 大小      | Number  | 24                |
| color     | icon 颜色      | String  | #1989fa           |

### Search

#### Props

| 属性         | 说明      | 类型   | 默认值 |
| ------------ | --------- | ------ | ------ |
| placeholder  | 占位符    | String | ''     |
| key          | 查询条件  | String | ''     |
| defaultValue | 默认值    | String | ''     |
| rightIcon    | 右侧 Icon | String | ''     |

### Transport

#### Props

| 属性 | 说明         | 类型              | 默认值 |
| ---- | ------------ | ----------------- | ------ |
| read | 请求地址 get | [String,Function] | ''     |

### QueryFields

#### Props

| 属性         | 说明                              | 类型              | 默认值           |
| ------------ | --------------------------------- | ----------------- | ---------------- |
| name         | name                              | String            | ''               |
| label        | label                             | String            | ''               |
| type         | 文本类型                          | ['single','text'] | text             |
| data         | type = single 时生效,选择内容     | [Array,Function]  | []               |
| textField    | type = single 时生效,显示内容     | String            | ''               |
| valueField   | type = single 时生效,选择内容     | String            | ''               |
| lovCode      | 值集视图                          | String            | ''               |
| lookupCode   | 值集                              | String            | ''               |
| lovUrl       | url                               | String            | ''               |
| pageSize     | pageSize                          | Number            | DataSet.pageSize |
| defaultValue | 默认值                            | [Object,String]   | ''               |
| cache        | 是否缓存,DataSet.key 值存在时生效 | Boolean           | false            |
| cascades     | 级联字段                          | Object            | {}               |
| bind         | 绑定字段                          | String            | ''               |

### List

#### Props

| 属性           | 说明                   | 类型              | 默认值                 |
| -------------- | ---------------------- | ----------------- | ---------------------- |
| title          | 标题                   | String            | ''                     |
| value          | value                  | String            | ''                     |
| label          | label                  | [String,Array]    | ''                     |
| showNumber     | 是否显示序号           | Boolean           | false                  |
| transport      | 请求数据，见 Transport | Object            | {}                     |
| className      | class                  | [String,Function] | ''                     |
| queryParameter | 查询条件               | Object            | DataSet.queryParameter |

#### Events

| 事件名 | 说明 | 回调参数 |
| ------ | ---- | -------- |
| click  | 点击 | data:{}  |

### Tabs

#### Props

| 属性           | 说明     | 类型                  | 默认值                      |
| -------------- | -------- | --------------------- | --------------------------- |
| title          | 标题     | String                | ''                          |
| badge          | 数量     | [Boolean,null,Number] | null                        |
| list           | 见 List  | Object                | DataSet.list                |
| queryParameter | 查询条件 | Object                | DataSet.list.queryParameter |
