# CheckboxDropdown 复选下拉

### 引入

```js
import Vue from 'vue';
import { CheckboxDropdown } from 'vant';

Vue.use(CheckboxDropdown);
```

> **注意**：组件内部使用 `hips-wx-utils` 进行数据请求，需要提前在本地缓存中配置以下信息：
>
> - `baseURL` = `http://dev-gateway.vasen.com`
> - `access_token` = token（Cookies 缓存）

## 代码演示

### 基础用法

CheckboxDropdown 组件是一个多选下拉选择器，使用 Field 组件展示选中的值。点击 Field 会弹出两个 Popup 组件：上方显示查询栏，下方显示选择列表，列表底部有重置、取消、确定三个操作按钮。

```html
<van-checkbox-dropdown
  v-model="value"
  label="选择城市"
  :options="options"
  placeholder="请选择"
  @confirm="onConfirm"
/>
```

```js
export default {
  data() {
    return {
      value: [],
      options: [
        { meaning: '北京市', value: 'beijing' },
        { meaning: '上海市', value: 'shanghai' },
        { meaning: '广州市', value: 'guangzhou' },
        { meaning: '深圳市', value: 'shenzhen' },
      ],
    };
  },
  methods: {
    onConfirm(values) {
      console.log('选择了:', values);
    },
  },
};
```

### 禁用状态

通过 `disabled` 属性可以禁用组件。

```html
<van-checkbox-dropdown
  v-model="value"
  label="选择城市"
  :options="options"
  disabled
  placeholder="请选择"
/>
```

### 必填项

通过 `required` 属性可以标记为必填项。

```html
<van-checkbox-dropdown
  v-model="value"
  label="选择技能"
  :options="options"
  required
  placeholder="请选择"
/>
```

### 自定义字段名

当数据使用不同的字段名时，可以使用 `label-key` 和 `value-key` 属性。

```html
<van-checkbox-dropdown
  v-model="value"
  label="选择商品"
  :options="options"
  label-key="name"
  value-key="id"
  placeholder="请选择"
/>
```

```js
export default {
  data() {
    return {
      value: [],
      options: [
        { name: 'iPhone 15', id: 'iphone15' },
        { name: 'iPad Pro', id: 'ipadpro' },
        { name: 'MacBook Pro', id: 'macbookpro' },
      ],
    };
  },
};
```

### URL 数据源

使用 `url` 属性可以从自定义接口获取数据。

```html
<van-checkbox-dropdown
  v-model="value"
  label="URL选择"
  url="/api/cities"
  label-key="cityName"
  value-key="cityId"
  placeholder="请选择"
/>
```

### LOV Code 数据源

使用 `lov-code` 属性可以通过 LOV 配置获取数据。

```html
<van-checkbox-dropdown
  v-model="value"
  label="LOV选择"
  lov-code="CITY.CODE"
  placeholder="请选择"
/>
```

### Lookup Code 数据源

使用 `lookup-code` 属性可以通过 Lookup 配置获取数据。

```html
<van-checkbox-dropdown
  v-model="value"
  label="Lookup选择"
  lookup-code="COMMON.YESORNO"
  placeholder="请选择"
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 字段名称，用于表单识别 | _string_ | - |
| label | 字段标签 | _string_ | - |
| placeholder | 占位提示文字 | _string_ | `'请选择'` |
| value | 当前选中的值（数组） | _Array_ | `[]` |
| options | 选项数据数组 | _Array_ | `[]` |
| url | 自定义接口 URL | _string_ | - |
| method | 接口请求方法 | _string_ | `'GET'` |
| lov-code | LOV 编码 | _string_ | - |
| lookup-code | Lookup 编码 | _string_ | - |
| label-key | 选项显示字段名 | _string_ | `'meaning'` |
| value-key | 选项值字段名 | _string_ | `'value'` |
| disabled | 是否禁用 | _boolean_ | `false` |
| readonly | 是否只读 | _boolean_ | `false` |
| required | 是否显示必填标记 | _boolean_ | `false` |
| pull-refresh | 是否开启下拉刷新 | _boolean_ | `true` |
| pagination | 是否开启分页 | _boolean_ | `true` |
| page-size | 每页条数 | _number_ | `10` |
| input-align | 输入框对齐方式 | _string_ | `'right'` |
| z-index-offset | 层级偏移（用于嵌套弹窗） | _number_ | `0` |
| query-fields | 查询字段配置，用于自定义搜索栏 | _Array_ | `[{ field: 'meaning', label: '名称', dataType: 'TEXT' }]` |
| sub-label-key | 选项辅助标签配置，支持数组格式 | _Array_ | `[]` |

### Events

| 事件名         | 说明                      | 回调参数          |
| -------------- | ------------------------- | ----------------- |
| input          | 值变化时触发              | _values: Array_   |
| confirm        | 点击确定按钮时触发        | _values: Array_   |
| fetch-error    | 数据获取失败时触发        | _error: Error_    |
| lov-confirm    | LOV 字段选择确认时触发    | _{ field, item }_ |
| select-confirm | SELECT 字段选择确认时触发 | _{ field, item }_ |

### Slots

| 名称 | 说明 |
| ---- | ---- |
| -    | -    |

### 样式变量

组件提供了下列 Less 变量，可用于自定义样式，使用方法请参考[主题定制](#/zh-CN/theme)。

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| @checkbox-dropdown-search-header-bg | `@white` | 查询栏弹窗头部背景色 |
| @checkbox-dropdown-list-bg | `@background-color` | 列表弹窗背景色 |

## 特性说明

### 列表操作按钮

列表弹窗底部包含三个操作按钮：

1. **重置** - 清空所有已选中的复选框
2. **取消** - 关闭弹窗，不保存本次选择
3. **确定** - 保存选中的值并关闭弹窗

### 遮罩层行为

与 RadioDropdown 不同，点击遮罩层（蒙层）**不会**关闭弹窗。用户必须使用取消或确定按钮来关闭弹窗。

### 搜索字段类型

使用 `lov-code` 或 `query-fields` 且包含查询字段时，查询栏弹窗支持以下字段类型：

| dataType | 组件            | 说明                                       |
| -------- | --------------- | ------------------------------------------ |
| TEXT     | Field           | 文本输入框                                 |
| LOV_CODE | RadioDropdown   | 单选下拉，使用 lov-code                    |
| SELECT   | RadioDropdown   | 单选下拉，使用 lookup-code                 |
| DATE     | DatePickerField | 日期选择器，值格式 YYYY-MM-dd HH:mm:ss     |
| DATETIME | DatePickerField | 日期时间选择器，值格式 YYYY-MM-dd HH:mm:ss |

### 自定义查询字段

通过 `query-fields` 属性可以自定义搜索栏的查询字段，优先级高于 LOV 配置的查询字段。

```html
<van-checkbox-dropdown
  v-model="value"
  label="选择"
  url="/api/list"
  :query-fields="[
    { field: 'name', label: '名称', dataType: 'TEXT' },
    { field: 'type', label: '类型', dataType: 'SELECT', sourceCode: 'COMMON.TYPE' },
    { field: 'startDate', label: '开始日期', dataType: 'DATE' },
    { field: 'endDate', label: '结束日期', dataType: 'DATETIME' }
  ]"
/>
```

### 辅助标签 sub-label-key

通过 `sub-label-key` 属性可以在选项主标签下方显示辅助信息，支持数组格式和多种配置方式。

#### 配置方式

`sub-label-key` 是一个数组，数组中的每个元素可以是以下类型：

| 配置类型 | 说明 | 示例 |
| --- | --- | --- |
| 字符串 | 直接指定字段名，返回 `item[fieldName]` | `'mouldCode'` |
| 对象 | 指定 key 字段，返回 `item[key]` | `{ key: 'mouldCode' }` |
| 对象（换行） | 指定 key 并换行显示 | `{ key: 'mouldName', newLine: true }` |
| 函数 | 自定义处理函数，item 作为参数 | `(item) => item.code + '-' + item.name` |
| 函数（换行） | 自定义函数并换行显示 | `{ key: (item) => item.spec, newLine: true }` |

#### 数组配置示例

```js
// 示例 1：简单的字符串数组
:sub-label-key="['code', 'spec', 'model']"

// 示例 2：混合配置
:sub-label-key="[
  'mouldCode',                              // 字符串
  { key: 'mouldSpec' },                     // 对象
  { key: 'description', newLine: true },    // 对象（换行）
  (item) => item.code + '-' + item.name,    // 函数
  { key: (item) => item.detail, newLine: true }  // 函数（换行）
]"
```

#### 布局方式

- **默认布局**：一行显示 2 条数据，左右分布（每行 50%宽度）
- **newLine=true**：该标签单独一行显示

#### 使用示例

```html
<van-checkbox-dropdown
  v-model="value"
  label="选择模具"
  lov-code="MOULD.MOULD"
  label-key="mouldName"
  :sub-label-key="['mouldCode', { key: 'mouldName', newLine: true }]"
/>
```

**渲染效果：**

```
☐ 高深地漏花片(盖)
  dn50-2      dn75-1
  高深地漏花片(盖)

☐ 高深地漏盖
  dn75-1      dn50-2
  高深地漏盖
```
