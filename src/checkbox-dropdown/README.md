# CheckboxDropdown

### Intro

```js
import Vue from 'vue';
import { CheckboxDropdown } from 'vant';

Vue.use(CheckboxDropdown);
```

> **Note**: The component uses `hips-wx-utils` for data requests. The following information needs to be configured in local storage:
>
> - `baseURL` = `http://dev-gateway.vasen.com`
> - `access_token` = token (Cookies storage)

## Usage

### Basic Usage

The CheckboxDropdown component is a multiple-choice dropdown selector that uses Field component to display the selected values. Clicking on the Field opens two Popup components: the top one displays a search bar, and the bottom one displays a selectable list with reset, cancel, and confirm buttons.

```html
<van-checkbox-dropdown
  v-model="value"
  label="Select Cities"
  :options="options"
  placeholder="Please select"
  @confirm="onConfirm"
/>
```

```js
export default {
  data() {
    return {
      value: [],
      options: [
        { meaning: 'Beijing', value: 'beijing' },
        { meaning: 'Shanghai', value: 'shanghai' },
        { meaning: 'Guangzhou', value: 'guangzhou' },
        { meaning: 'Shenzhen', value: 'shenzhen' },
      ],
    };
  },
  methods: {
    onConfirm(values) {
      console.log('Selected values:', values);
    },
  },
};
```

### Disabled State

Use the `disabled` prop to disable the component.

```html
<van-checkbox-dropdown
  v-model="value"
  label="Select Cities"
  :options="options"
  disabled
  placeholder="Please select"
/>
```

### Required Field

Use the `required` prop to mark the field as required.

```html
<van-checkbox-dropdown
  v-model="value"
  label="Select Skills"
  :options="options"
  required
  placeholder="Please select"
/>
```

### Custom Field Names

Use `label-key` and `value-key` props when your data uses different field names.

```html
<van-checkbox-dropdown
  v-model="value"
  label="Select Products"
  :options="options"
  label-key="name"
  value-key="id"
  placeholder="Please select"
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

### URL Data Source

Use the `url` prop to fetch data from a custom API endpoint.

```html
<van-checkbox-dropdown
  v-model="value"
  label="Select from URL"
  url="/api/cities"
  label-key="cityName"
  value-key="cityId"
  placeholder="Please select"
/>
```

### LOV Code Data Source

Use the `lov-code` prop to fetch data using LOV configuration.

```html
<van-checkbox-dropdown
  v-model="value"
  label="Select from LOV"
  lov-code="CITY.CODE"
  placeholder="Please select"
/>
```

### Lookup Code Data Source

Use the `lookup-code` prop to fetch data using Lookup configuration.

```html
<van-checkbox-dropdown
  v-model="value"
  label="Select from Lookup"
  lookup-code="COMMON.YESORNO"
  placeholder="Please select"
/>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| label | Field label | _string_ | - |
| placeholder | Placeholder text | _string_ | `'Please select'` |
| value | Current selected values | _Array_ | `[]` |
| options | Options array | _Array_ | `[]` |
| url | Custom API URL for fetching data | _string_ | - |
| method | HTTP method for URL requests | _string_ | `'GET'` |
| lov-code | LOV code for fetching configuration | _string_ | - |
| lookup-code | Lookup code for fetching data | _string_ | - |
| label-key | Field name for option label | _string_ | `'meaning'` |
| value-key | Field name for option value | _string_ | `'value'` |
| disabled | Whether to disable the component | _boolean_ | `false` |
| readonly | Whether to set readonly | _boolean_ | `false` |
| required | Whether to show required mark | _boolean_ | `false` |
| pull-refresh | Whether to enable pull-to-refresh | _boolean_ | `true` |
| pagination | Whether to enable pagination | _boolean_ | `true` |
| page-size | Number of items per page | _number_ | `10` |
| input-align | Input text alignment | _string_ | `'right'` |
| z-index-offset | z-index offset for nested popups | _number_ | `0` |
| query-fields | Query field configuration for custom search bar | _Array_ | `[{ field: 'meaning', label: 'Name', dataType: 'TEXT' }]` |
| sub-label-key | Sub-label configuration for options, supports array format | _Array_ | `[]` |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| input | Emitted when value changes | _values: Array_ |
| confirm | Emitted when clicking confirm button | _values: Array_ |
| fetch-error | Emitted when data fetching fails | _error: Error_ |
| lov-confirm | Emitted when LOV field selection is confirmed | _{ field, item }_ |
| select-confirm | Emitted when SELECT field selection is confirmed | _{ field, item }_ |

### Slots

| Name | Description |
| ---- | ----------- |
| -    | -           |

### Less Variables

How to use: [Custom Theme](#/en-US/theme).

| Name | Default Value | Description |
| --- | --- | --- |
| @checkbox-dropdown-search-header-bg | `@white` | Search popup header background |
| @checkbox-dropdown-list-bg | `@background-color` | List popup background |

## Features

### List Actions

The list popup includes three action buttons at the bottom:

1. **Reset** - Clears all selected checkboxes
2. **Cancel** - Closes the popup without saving changes
3. **Confirm** - Saves the selected values and closes the popup

### Overlay Behavior

Unlike RadioDropdown, clicking on the overlay (mask layer) will **not** close the popup. Users must use the Cancel or Confirm buttons to close the popup.

### Search Fields

When using `lov-code` or `query-fields` with query fields, the search popup supports various field types:

| dataType | Component       | Description                             |
| -------- | --------------- | --------------------------------------- |
| TEXT     | Field           | Text input field                        |
| LOV_CODE | RadioDropdown   | Single-select dropdown with lov-code    |
| SELECT   | RadioDropdown   | Single-select dropdown with lookup-code |
| DATE     | DatePickerField | Date picker (YYYY-MM-dd HH:mm:ss)       |
| DATETIME | DatePickerField | DateTime picker (YYYY-MM-dd HH:mm:ss)   |

### Custom Query Fields

Use the `query-fields` prop to customize the search bar query fields. This takes priority over LOV configuration query fields.

```html
<van-checkbox-dropdown
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
<van-checkbox-dropdown
  v-model="value"
  label="Select Mould"
  lov-code="MOULD.MOULD"
  label-key="mouldName"
  :sub-label-key="['mouldCode', { key: 'mouldName', newLine: true }]"
/>
```

**Render result:**

```
☐ Deep Floor Drain Flower Piece (Cover)
  dn50-2      dn75-1
  Deep Floor Drain Flower Piece (Cover)

☐ Deep Floor Drain Cover
  dn75-1      dn50-2
  Deep Floor Drain Cover
```
