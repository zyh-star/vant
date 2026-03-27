# FieldUploader

### Intro

A file upload component based on Field + Uploader, supporting image compression, preview, upload, and delete functionality.

> **Note**: The component uses `hips-wx-utils` for data requests. The following information needs to be configured in local storage:
>
> - `baseURL` = `http://dev-gateway.vasen.com`
> - `access_token` = token (Cookies storage)

### Install

```js
import Vue from 'vue';
import { FieldUploader } from 'vant';

Vue.use(FieldUploader);
```

## Usage

### Basic Usage

```html
<van-field-uploader
  v-model="fileList"
  label="Upload Image"
  placeholder="Click to upload"
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

### Image Compression

```html
<van-field-uploader
  v-model="fileList"
  label="Upload Image"
  :max-size="2 * 1024 * 1024"
  bucket-name="hzero-front"
/>
```

### Limit Upload Count

```html
<van-field-uploader v-model="fileList" label="Upload Image" :max-count="3" />
```

### Custom Upload Area

```html
<van-field-uploader
  v-model="fileList"
  label="Upload Image"
  upload-text="Upload Photo"
  upload-icon="photo"
/>
```

### Fetch Existing Attachments

```html
<van-field-uploader
  v-model="fileList"
  label="Attachments"
  placeholder="Click to upload"
  module-id="822050835239407616"
  module-type="work-order"
  bucket-name="mould-manage"
/>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | File list | _Array_ | `[]` |
| label | Left side label of the input field | _string_ | - |
| placeholder | Placeholder text of the input field | _string_ | `'Click to upload'` |
| disabled | Whether to disable the input field | _boolean_ | `false` |
| readonly | Whether to make the input field read-only | _boolean_ | `false` |
| required | Whether to show the required asterisk | _boolean_ | `false` |
| rules | Form validation rules | _Array_ | - |
| input-align | Input field alignment | _string_ | `'right'` |
| bucket-name | Bucket name for file storage | _string_ | `'mould-manage'` |
| module-id | Module ID for fetching existing attachments | _string_ | - |
| module-type | Module type for fetching existing attachments | _string_ | - |
| max-size | Maximum file size in bytes, compress if exceeded | _number_ | `2097152` (2MB) |
| max-count | Maximum number of files | _number \| string_ | `9` |
| deletable | Whether to allow delete | _boolean_ | `true` |
| show-upload | Whether to show upload button | _boolean_ | `true` |
| preview-image | Whether to preview image | _boolean_ | `true` |
| preview-full-image | Whether to enable full-screen image preview | _boolean_ | `true` |
| image-fit | Image fill mode | _string_ | `'cover'` |
| upload-text | Upload area text | _string_ | - |
| upload-icon | Upload icon | _string_ | `'photograph'` |
| accept | Accepted file types | _string_ | `'image/*'` |
| preview-size | Preview size | _number \| string_ | - |
| before-read | Callback before reading file | _Function_ | - |
| after-read | Callback after reading file | _Function_ | - |
| before-delete | Callback before deleting | _Function_ | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| input | Emitted when file list changes | fileList: File list |
| delete | Emitted when file is deleted | file: Deleted file, detail: { index } |
| upload-error | Emitted when upload fails | error: Error information |

### Data Format

#### File Object

After successful upload, the file object will contain the following properties:

```js
{
  file: File,           // Original file object
  content: string,      // File content (base64 or blob URL)
  url: string,          // File URL returned by server
  fileUrl: string,      // File URL (for form submission)
  fileName: string,     // File name (for form submission)
  fileSize: string,     // File size (for form submission, e.g.: 1.5MB)
  moduleId: string,     // Module ID (for form submission)
  moduleType: string,   // Module type (for form submission)
  deleteFlag: 0,        // Delete flag (for form submission)
  status: 'done',       // Upload status: uploading / done / failed
  message: '',          // Status message
  isExisting: boolean,  // Whether it's an existing attachment (from query)
  serverResponse: {     // Complete response from server
    fileUrl: string,
    fileId: string,
    // ...
  }
}
```

## Feature Description

### Image Compression

When the uploaded image size exceeds `max-size`, the component will automatically use `hips-wx-utils`'s `compressImage` method for compression:

- Max width: 1920px
- Max height: 1920px
- Compression quality: 0.8

### Image Preview

- Click uploaded images to preview
- Support full-screen preview (using ImagePreview component)
- Can disable full-screen preview via `preview-full-image` attribute

### Upload Function

The component will automatically upload files to the server:

- Upload API: `POST /hfle/v1/{tenantId}/files/multipart`
- Request parameter: `bucketName`
- File field name: `file`

### Delete Function

When deleting a file:

1. Call `before-delete` callback (if provided)
2. Call server delete API: `POST /{bucketName}/v1/{tenantId}/upload-files`
3. Remove from file list
4. Trigger `delete` event

> **Note**: When `disabled` or `readonly` is `true`, file deletion is prohibited

### Attachment Query Function

When `module-id` and `module-type` are set, the component will automatically fetch existing attachments:

- Query API: `GET /{bucketName}/v1/{tenantId}/upload-files?moduleId={moduleId}&moduleType={moduleType}&deleteFlag=0`
- Fetched attachments will be marked with `isExisting: true`
- Existing attachments will not be re-uploaded
