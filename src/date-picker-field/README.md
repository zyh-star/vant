# DatePickerField

### Intro

A date picker component based on Field + Popup + DatetimePicker, supporting both `date` and `datetime` types with a unified return format of `YYYY-MM-dd HH:mm:ss`.

### Install

```js
import Vue from 'vue';
import { DatePickerField } from 'vant-wx';

Vue.use(DatePickerField);
```

## Usage

### Basic Usage

```html
<van-date-picker-field
  v-model="dateValue"
  label="Select Date"
  placeholder="Please select date"
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

### DateTime Selection

```html
<van-date-picker-field
  v-model="dateTimeValue"
  label="Select DateTime"
  placeholder="Please select date and time"
  type="datetime"
/>
```

### Custom Formatter

```html
<van-date-picker-field
  v-model="dateValue"
  label="Select Date"
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
      // Only display date part
      return value ? value.split(' ')[0] : '';
    },
  },
};
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Current selected datetime, format is `YYYY-MM-dd HH:mm:ss` | _string_ | - |
| name | Field name, used for form identification | _string_ | - |
| label | Left side label of the input field | _string_ | - |
| placeholder | Placeholder text of the input field | _string_ | `Please select` |
| type | Picker type, can be set to `date` `datetime` | _string_ | `date` |
| disabled | Whether to disable the input field | _boolean_ | `false` |
| readonly | Whether to make the input field read-only | _boolean_ | `false` |
| required | Whether to show the required asterisk | _boolean_ | `false` |
| rules | Form validation rules | _Array_ | - |
| input-align | Input field alignment, can be set to `center` `right` | _string_ | `right` |
| min-date | Minimum selectable date | _Date_ | Ten years ago |
| max-date | Maximum selectable date | _Date_ | Ten years later |
| formatter | Custom display formatter function | _Function_ | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| confirm | Emitted when the confirm button is clicked | value: Current selected datetime string |
| cancel | Emitted when the cancel button is clicked | - |

### Format Specification

Regardless of whether `type` is `date` or `datetime`, the component always returns values in the format `YYYY-MM-dd HH:mm:ss`:

- When `type="date"`, the time part defaults to `00:00:00`
- When `type="datetime"`, the complete datetime is returned

Examples:

- `type="date"` selects 2024-01-15, returns `2024-01-15 00:00:00`
- `type="datetime"` selects 2024-01-15 14:30:00, returns `2024-01-15 14:30:00`
