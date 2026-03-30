# FieldUploader 文件上传字段

### 介绍

基于 Field + Uploader 封装的文件上传组件，支持图片压缩、预览、上传和删除功能。

> **注意**：组件内部使用 `hips-wx-utils` 进行数据请求，需要提前在本地缓存中配置以下信息：
>
> - `baseURL` = `http://dev-gateway.vasen.com`
> - `access_token` = token（Cookies 缓存）

### 引入

```js
import Vue from 'vue';
import { FieldUploader } from 'vant-wx';

Vue.use(FieldUploader);
```

## 代码演示

### 基础用法

```html
<van-field-uploader
  v-model="fileList"
  label="上传图片"
  placeholder="点击上传图片"
/>
```

```js
export default {
  data() {
    return {
      fileList: [],
    };
  },
};
```

### 图片压缩

```html
<van-field-uploader
  v-model="fileList"
  label="上传图片"
  :max-size="2 * 1024 * 1024"
  bucket-name="hzero-front"
/>
```

### 限制上传数量

```html
<van-field-uploader v-model="fileList" label="上传图片" :max-count="3" />
```

### 自定义上传区域

```html
<van-field-uploader
  v-model="fileList"
  label="上传图片"
  upload-text="上传照片"
  upload-icon="photo"
/>
```

### 查询已有附件

```html
<van-field-uploader
  v-model="fileList"
  label="附件"
  placeholder="点击上传附件"
  module-id="822050835239407616"
  module-type="work-order"
  bucket-name="mould-manage"
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 文件列表 | _Array_ | `[]` |
| label | 输入框左侧文本 | _string_ | - |
| placeholder | 占位提示文字 | _string_ | `'点击上传'` |
| disabled | 是否禁用 | _boolean_ | `false` |
| readonly | 是否只读 | _boolean_ | `false` |
| required | 是否显示表单必填星号 | _boolean_ | `false` |
| input-align | 输入框对齐方式 | _string_ | `'right'` |
| bucket-name | 存储桶名称 | _string_ | `'mould-manage'` |
| module-id | 模块 ID，用于查询已有附件 | _string_ | - |
| module-type | 模块类型，用于查询已有附件 | _string_ | - |
| max-size | 最大文件大小（字节），超过则压缩 | _number_ | `2097152` (2MB) |
| max-count | 最大文件数量 | _number \| string_ | `9` |
| deletable | 是否可删除 | _boolean_ | `true` |
| show-upload | 是否显示上传按钮 | _boolean_ | `true` |
| preview-image | 是否预览图片 | _boolean_ | `true` |
| preview-full-image | 是否开启全屏图片预览 | _boolean_ | `true` |
| image-fit | 图片填充模式 | _string_ | `'cover'` |
| upload-text | 上传区域文字 | _string_ | - |
| upload-icon | 上传图标 | _string_ | `'photograph'` |
| accept | 接受文件类型 | _string_ | `'image/*'` |
| preview-size | 预览大小 | _number \| string_ | - |
| before-read | 读取文件前的回调 | _Function_ | - |
| after-read | 读取文件后的回调 | _Function_ | - |
| before-delete | 删除前的回调 | _Function_ | - |

### Events

| 事件名       | 说明               | 回调参数                            |
| ------------ | ------------------ | ----------------------------------- |
| input        | 文件列表变化时触发 | fileList: 文件列表                  |
| delete       | 删除文件时触发     | file: 删除的文件, detail: { index } |
| upload-error | 上传失败时触发     | error: 错误信息                     |

### 数据格式

#### 文件对象

上传成功后，文件对象会包含以下属性：

```js
{
  file: File,           // 原始文件对象
  content: string,      // 文件内容（base64 或 blob URL）
  url: string,          // 服务器返回的文件 URL
  fileUrl: string,      // 文件URL（用于表单提交）
  fileName: string,     // 文件名（用于表单提交）
  fileSize: string,     // 文件大小（用于表单提交，如：1.5MB）
  moduleId: string,     // 模块ID（用于表单提交）
  moduleType: string,   // 模块类型（用于表单提交）
  deleteFlag: 0,        // 删除标记（用于表单提交）
  status: 'done',       // 上传状态：uploading / done / failed
  message: '',          // 状态提示文字
  isExisting: boolean,  // 是否为已有附件（查询获得）
  serverResponse: {     // 服务器返回的完整响应
    fileUrl: string,
    fileId: string,
    // ...
  }
}
```

## 功能说明

### 图片压缩

当上传图片大小超过 `max-size` 时，组件会自动使用 `hips-wx-utils` 的 `compressImage` 方法进行压缩：

- 最大宽度：1920px
- 最大高度：1920px
- 压缩质量：0.8

### 图片预览

- 点击已上传的图片可以预览
- 支持全屏预览（使用 ImagePreview 组件）
- 可以通过 `preview-full-image` 属性关闭全屏预览

### 上传功能

组件会自动将文件上传到服务器：

- 上传接口：`POST /hfle/v1/{tenantId}/files/multipart`
- 请求参数：`bucketName`
- 文件字段名：`file`

### 删除功能

删除文件时会：

1. 调用 `before-delete` 回调（如果提供）
2. 调用服务器删除接口：`POST /{bucketName}/v1/{tenantId}/upload-files`
3. 从文件列表中移除
4. 触发 `delete` 事件

> **注意**：当 `disabled` 或 `readonly` 为 `true` 时，禁止删除文件

### 附件查询功能

当设置了 `module-id` 和 `module-type` 时，组件会自动查询已有附件：

- 查询接口：`GET /{bucketName}/v1/{tenantId}/upload-files?moduleId={moduleId}&moduleType={moduleType}&deleteFlag=0`
- 查询到的附件会标记 `isExisting: true`
- 已有附件不会重复上传
