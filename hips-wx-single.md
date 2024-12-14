# 单选

## 示例

### 值集视图

```vue
<template>
  <hips-wx-single
    v-model="value"
    :meaning.sync="meaning"
    label="值集视图"
    lovCode="QMS.WORKSHOP"
  />
</template>
```

```javascript
import { HipsWxSingle } from 'hips-wx-components'
export default {
  components: {
    [HipsWxSingle.name]: HipsWxSingle
  },
  data() {
    return {
      value: '',
      meaning: ''
    }
  }
}
```

### 值集

```vue
<template>
  <hips-wx-single
    v-model="value"
    :meaning.sync="meaning"
    label="值集"
    lookupCode="QMS.WORKSHOP"
  />
</template>
```

```javascript
import { HipsWxSingle } from 'hips-wx-components'
export default {
  components: {
    [HipsWxSingle.name]: HipsWxSingle
  },
  data() {
    return {
      value: '',
      meaning: ''
    }
  }
}
```

### URL

```vue
<template>
  <hips-wx-single
    v-model="value"
    :meaning.sync="meaning"
    label="URL"
    lovUrl="/mould-manage-app/v1/#tenantId#/service-team-employees"
    checkTitle="name"
    checkValue="code"
  />
</template>
```

```javascript
import { HipsWxSingle } from 'hips-wx-components'
export default {
  components: {
    [HipsWxSingle.name]: HipsWxSingle
  },
  data() {
    return {
      value: '',
      meaning: ''
    }
  }
}
```

### 自定义传参

```vue
<template>
  <hips-wx-single
    v-model="value"
    :meaning.sync="meaning"
    :params="params"
    label="URL"
    lovUrl="/mould-manage-app/v1/#tenantId#/service-team-employees"
    checkTitle="name"
    checkValue="code"
  />
</template>
```

```javascript
import { HipsWxSingle } from 'hips-wx-components'
export default {
  components: {
    [HipsWxSingle.name]: HipsWxSingle
  },
  data() {
    return {
      value: '',
      meaning: '',
      params: {
        name: 'test'
      }
    }
  }
}
```

### 级联

```vue
<template>
  <hips-wx-single
    v-model="value"
    :meaning.sync="meaning"
    :cascades="cascades"
    label="URL"
    lovUrl="/mould-manage-app/v1/#tenantId#/service-team-employees"
    checkTitle="name"
    checkValue="code"
  />
</template>
```

```javascript
import { HipsWxSingle } from 'hips-wx-components'
export default {
  components: {
    [HipsWxSingle.name]: HipsWxSingle
  },
  data() {
    return {
      value: '',
      meaning: '',
      cascades: {
        name: 'test'
      }
    }
  }
}
```

### 自定义查询栏

```vue
<template>
  <hips-wx-single
    v-model="value"
    :meaning.sync="meaning"
    :searchKey="searchKey"
    label="URL"
    lovUrl="/mould-manage-app/v1/#tenantId#/service-team-employees"
    checkTitle="name"
    checkValue="code"
  />
</template>
```

```javascript
import { HipsWxSingle } from 'hips-wx-components'
export default {
  components: {
    [HipsWxSingle.name]: HipsWxSingle
  },
  data() {
    return {
      value: '',
      meaning: '',
      searchKey: [{ meaning: 'demo', value: 'demo' }]
    }
  }
}
```

## API

### props

| 属性             | 说明                                           | 类型                  | 默认值    |
| ---------------- | ---------------------------------------------- | --------------------- | --------- |
| getContainer     | 定义 getContainer 属性，用于指定弹出层的父节点 | String, () => Element | body      |
| readonly         | 是否只读                                       | Boolean               | false     |
| disabled         | 是否禁用                                       | Boolean               | false     |
| meaning          | 显示内容                                       | String,Number         | -         |
| value            | 值                                             | String,Number         | -         |
| label            | 标签                                           | String                | -         |
| searchKey        | 搜索栏列表                                     | Array,String          | []        |
| lovCode          | 值集视图                                       | String                | -         |
| lookupCode       | 值集                                           | String                | -         |
| lovUrl           | url                                            | String                | -         |
| singleData       | 默认选择内容，若存在值则不进行前后端交互       | Array,undefined       | undefined |
| params           | 传参                                           | Object                | {}        |
| cascades         | 级联传参                                       | Object                | {}        |
| checkTitle       | 显示内容 key 值,                               | String                | -         |
| checkValue       | 右侧内容 key 值                                | String                | -         |
| checkRadio       | 值 key 值                                      | String                | -         |
| required         | 是否必填                                       | Boolean               | false     |
| rules            | 校验规则                                       | Array                 | []        |
| error            | 是否出错                                       | Boolean               | false     |
| showNumber       | 是否显示序号                                   | Boolean               | false     |
| size             | 每页数量                                       | Number                | 10        |
| autoSelectSingle | 点击查询仅存在一条数据时自动选中               | Boolean               | false     |
| name             | form name                                      | String                | -         |
| noCache          | 弹窗时自动重新查询                             | Boolean               | false     |
| colon            | 是否显示:                                      | Boolean               | false     |
| inputAlign       | 文本排列方向                                   | left,right            | right     |

### Events

| 事件名称 | 说明   | 回调参数         |
| -------- | ------ | ---------------- |
| confirm  | 确认时 | (object) => void |
