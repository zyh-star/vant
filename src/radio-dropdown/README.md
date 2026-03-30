# RadioDropdown

### Intro

```js
import Vue from 'vue';
import { RadioDropdown } from 'vant-wx';

Vue.use(RadioDropdown);
```

> **Note**: The component uses `hips-wx-utils` for data requests. The following information needs to be configured in local storage:
>
> - `baseURL` = `http://dev-gateway.vasen.com`
> - `access_token` = token (Cookies storage)

## Usage

### Basic Usage

The RadioDropdown component is a single-choice dropdown selector that uses Field component to display the selected value. Clicking on the Field opens two Popup components: the top one displays a search bar with query fields, and the bottom one displays a selectable list.

```html
<van-radio-dropdown
  v-model="value"
  label="Select City"
  :options="options"
  placeholder="Please select"
  @confirm="onConfirm"
/>
```

```js
export default {
  data() {
    return {
      value: '',
      options: [
        { meaning: 'Beijing', value: 'beijing' },
        { meaning: 'Shanghai', value: 'shanghai' },
        { meaning: 'Guangzhou', value: 'guangzhou' },
        { meaning: 'Shenzhen', value: 'shenzhen' },
      ],
    };
  },
  methods: {
    onConfirm(item) {
      if (item) {
        console.log('Selected:', item.meaning);
      } else {
        console.log('Deselected');
      }
    },
  },
};
```

### Data Source Priority

The component supports 4 data source types in priority order:

1. **options** - Local data (highest priority)
2. **url** - Custom API endpoint
3. **lovCode** - LOV configuration code
4. **lookupCode** - Lookup batch query code

```html
<!-- Using options -->
<van-radio-dropdown v-model="value" label="Select City" :options="options" />

<!-- Using URL -->
<van-radio-dropdown
  v-model="value"
  label="Select"
  url="/api/list"
  method="get"
/>

<!-- Using LOV code -->
<van-radio-dropdown v-model="value" label="Select" lov-code="MOULD.MOULD" />

<!-- Using Lookup code -->
<van-radio-dropdown
  v-model="value"
  label="Select"
  lookup-code="COMMON.YESORNO"
/>
```

### Disabled State

Use the `disabled` prop to disable the component.

```html
<van-radio-dropdown
  v-model="value"
  label="Select City"
  :options="options"
  disabled
  placeholder="Please select"
/>
```

### Required Field

Use the `required` prop to mark the field as required.

```html
<van-radio-dropdown
  v-model="value"
  label="Select City"
  :options="options"
  required
  placeholder="Please select"
/>
```

### Custom Field Names

Use `label-key` and `value-key` props when your data uses different field names.

```html
<van-radio-dropdown
  v-model="value"
  label="Select Product"
  :options="options"
  label-key="name"
  value-key="id"
  placeholder="Please select"
/>
```

### Input Align

Use the `input-align` prop to set the text alignment of the input field.

```html
<van-radio-dropdown
  v-model="value"
  label="Select City"
  :options="options"
  input-align="left"
  placeholder="Please select"
/>
```

### Pull Refresh & Pagination

Enable pull-to-refresh and pagination for URL and LOV data sources.

```html
<van-radio-dropdown
  v-model="value"
  label="Select"
  url="/api/list"
  :pull-refresh="true"
  :pagination="true"
  :page-size="20"
/>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| name | Field name, used for form identification | _string_ | - |
| label | Field label | _string_ | - |
| placeholder | Placeholder text | _string_ | `'Please select'` |
| value | Current selected value | _string \| number_ | `''` |
| options | Options array (priority 1) | _Array_ | `[]` |
| url | Custom API URL (priority 2) | _string_ | - |
| method | Request method for URL | _string_ | `'GET'` |
| lov-code | LOV configuration code (priority 3) | _string_ | - |
| lookup-code | Lookup batch query code (priority 4) | _string_ | - |
| label-key | Field name for option label | _string_ | `'meaning'` |
| value-key | Field name for option value | _string_ | `'value'` |
| disabled | Whether to disable the component | _boolean_ | `false` |
| readonly | Whether to set readonly | _boolean_ | `false` |
| required | Whether to show required mark | _boolean_ | `false` |
| rules | Form validation rules | _Array_ | - |
| input-align | Input text alignment | _string_ | `'right'` |
| pull-refresh | Enable pull-to-refresh | _boolean_ | `true` |
| pagination | Enable pagination | _boolean_ | `true` |
| page-size | Items per page | _number_ | `10` |
| z-index-offset | Z-index offset for nested components | _number_ | `0` |
| query-fields | Query field configuration for custom search bar | _Array_ | `[{ field: 'meaning', label: 'Name', dataType: 'TEXT' }]` |
| sub-label-key | Sub-label configuration for options, supports array format | _Array_ | `[]` |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| confirm | Emitted when selection is confirmed (null if deselected) | _item: object \| null_ |
| lov-confirm | Emitted when LOV field is confirmed | _{ field, item }_ |
| select-confirm | Emitted when SELECT field is confirmed | _{ field, item }_ |
| fetch-error | Emitted when data fetch fails | _error: Error_ |

### Data Types for LOV Query Fields

When using `lov-code` or `query-fields`, the query fields support different data types:

| dataType | Component       | Description                           |
| -------- | --------------- | ------------------------------------- |
| TEXT     | Field           | Text input                            |
| LOV_CODE | RadioDropdown   | Nested dropdown with lov-code         |
| SELECT   | RadioDropdown   | Nested dropdown with lookup-code      |
| DATE     | DatePickerField | Date picker (YYYY-MM-dd HH:mm:ss)     |
| DATETIME | DatePickerField | DateTime picker (YYYY-MM-dd HH:mm:ss) |

### Custom Query Fields

Use the `query-fields` prop to customize the search bar query fields. This takes priority over LOV configuration query fields.

```html
<van-radio-dropdown
  v-model="value"
  label="Select"
  url="/api/list"
  :query-fields="[
    { field: 'name', label: 'Name', dataType: 'TEXT' },
    { field: 'type', label: 'Type', dataType: 'SELECT', sourceCode: 'COMMON.TYPE' },
    { field: 'startDate', label: 'Start Date', dataType: 'DATE' },
    { field: 'endDate', label: 'End Date', dataType: 'DATETIME' }
  ]"
/>
```

### Slots

| Name | Description |
| ---- | ----------- |
| -    | -           |

### Sub-Label sub-label-key

Use the `sub-label-key` prop to display auxiliary information below the main option label. Supports array format and multiple configuration types.

#### Configuration Types

`sub-label-key` is an array, where each element can be one of the following types:

| Type | Description | Example |
| --- | --- | --- |
| String | Specify field name directly, returns `item[fieldName]` | `'mouldCode'` |
| Object | Specify key field, returns `item[key]` | `{ key: 'mouldCode' }` |
| Object (new line) | Specify key and display on new line | `{ key: 'mouldName', newLine: true }` |
| Function | Custom processing function, item as parameter | `(item) => item.code + '-' + item.name` |
| Function (new line) | Custom function and display on new line | `{ key: (item) => item.spec, newLine: true }` |

#### Array Configuration Examples

```js
// Example 1: Simple string array
:sub-label-key="['code', 'spec', 'model']"

// Example 2: Mixed configuration
:sub-label-key="[
  'mouldCode',                              // String
  { key: 'mouldSpec' },                     // Object
  { key: 'description', newLine: true },    // Object (new line)
  (item) => item.code + '-' + item.name,    // Function
  { key: (item) => item.detail, newLine: true }  // Function (new line)
]"
```

#### Layout

- **Default**: Display 2 items per row, left-right distribution (50% width each)
- **newLine=true**: Display the label on a separate line

#### Example

```html
<van-radio-dropdown
  v-model="value"
  label="Select Mould"
  lov-code="MOULD.MOULD"
  label-key="mouldName"
  :sub-label-key="['mouldCode', { key: 'mouldName', newLine: true }]"
/>
```

**Render result:**

```
○ Deep Floor Drain Flower Piece (Cover)
  dn50-2      dn75-1
  Deep Floor Drain Flower Piece (Cover)

○ Deep Floor Drain Cover
  dn75-1      dn50-2
  Deep Floor Drain Cover
```

### Less Variables

How to use: [Custom Theme](#/en-US/theme).

| Name | Default Value | Description |
| --- | --- | --- |
| @radio-dropdown-search-header-bg | `@white` | Search popup header background |
| @radio-dropdown-list-bg | `@background-color` | List popup background |
