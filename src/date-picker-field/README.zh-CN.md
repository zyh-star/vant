# DatePickerField 日期选择字段

### 介绍

基于 Field + Popup + DatetimePicker 封装的日期选择组件，支持 date 和 datetime 两种类型，返回格式统一为 `YYYY-MM-dd HH:mm:ss`。

### 引入

```js
import Vue from 'vue';
import { DatePickerField } from 'vant';

Vue.use(DatePickerField);
```

## 代码演示

### 基础用法

```html
<van-date-picker-field
  v-model="dateValue"
  label="选择日期"
  placeholder="请选择日期"
  type="date"
/>
```

```js
export default {
  data() {
    return {
      dateValue: '',
    };
  },
};
```

### 日期时间选择

```html
<van-date-picker-field
  v-model="dateTimeValue"
  label="选择时间"
  placeholder="请选择日期时间"
  type="datetime"
/>
```

### 自定义格式化

```html
<van-date-picker-field
  v-model="dateValue"
  label="选择日期"
  :formatter="formatter"
/>
```

```js
export default {
  data() {
    return {
      dateValue: '2024-01-15 00:00:00',
    };
  },
  methods: {
    formatter(value) {
      // 只显示日期部分
      return value ? value.split(' ')[0] : '';
    },
  },
};
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 当前选中的日期时间，格式为 `YYYY-MM-dd HH:mm:ss` | _string_ | - |
| label | 输入框左侧文本 | _string_ | - |
| placeholder | 输入框占位提示文字 | _string_ | `请选择` |
| type | 选择器类型，可选值为 `date` `datetime` | _string_ | `date` |
| disabled | 是否禁用输入框 | _boolean_ | `false` |
| readonly | 是否只读 | _boolean_ | `false` |
| required | 是否显示表单必填星号 | _boolean_ | `false` |
| input-align | 输入框对齐方式，可选值为 `center` `right` | _string_ | `right` |
| min-date | 可选的最小时间，精确到分钟 | _Date_ | 十年前 |
| max-date | 可选的最大时间，精确到分钟 | _Date_ | 十年后 |
| formatter | 自定义显示格式化函数 | _Function_ | - |

### Events

| 事件名  | 说明               | 回调参数                        |
| ------- | ------------------ | ------------------------------- |
| confirm | 点击完成按钮时触发 | value: 当前选中的日期时间字符串 |
| cancel  | 点击取消按钮时触发 | -                               |

### 格式说明

无论 `type` 是 `date` 还是 `datetime`，组件返回的值格式始终为 `YYYY-MM-dd HH:mm:ss`：

- 当 `type="date"` 时，时间部分默认为 `00:00:00`
- 当 `type="datetime"` 时，返回完整的日期时间

例如：

- `type="date"` 选择 2024-01-15，返回值为 `2024-01-15 00:00:00`
- `type="datetime"` 选择 2024-01-15 14:30:00，返回值为 `2024-01-15 14:30:00`
