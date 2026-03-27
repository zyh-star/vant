import { VanComponent } from './component';

export interface FieldUploaderFile {
  file?: File;
  content?: string;
  url?: string;
  status?: 'uploading' | 'done' | 'failed';
  message?: string;
  serverResponse?: any;
}

export interface FieldUploaderProps {
  /** 文件列表 */
  value?: FieldUploaderFile[];
  /** 输入框左侧文本 */
  label?: string;
  /** 占位提示文字 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  /** 是否显示表单必填星号 */
  required?: boolean;
  /** 输入框对齐方式 */
  inputAlign?: string;
  /** 存储桶名称 */
  bucketName?: string;
  /** 最大文件大小（字节），超过则压缩 */
  maxSize?: number;
  /** 最大文件数量 */
  maxCount?: number | string;
  /** 是否可删除 */
  deletable?: boolean;
  /** 是否显示上传按钮 */
  showUpload?: boolean;
  /** 是否预览图片 */
  previewImage?: boolean;
  /** 是否开启全屏图片预览 */
  previewFullImage?: boolean;
  /** 图片填充模式 */
  imageFit?: string;
  /** 上传区域文字 */
  uploadText?: string;
  /** 上传图标 */
  uploadIcon?: string;
  /** 接受文件类型 */
  accept?: string;
  /** 预览大小 */
  previewSize?: number | string;
  /** 读取文件前的回调 */
  beforeRead?: (files: File | File[]) => boolean | Promise<boolean>;
  /** 读取文件后的回调 */
  afterRead?: (files: FieldUploaderFile | FieldUploaderFile[]) => void;
  /** 删除前的回调 */
  beforeDelete?: (
    file: FieldUploaderFile,
    detail: { index: number }
  ) => boolean | Promise<boolean>;
}

export interface FieldUploaderEvents {
  /** 文件列表变化时触发 */
  input?(fileList: FieldUploaderFile[]): void;
  /** 删除文件时触发 */
  delete?(file: FieldUploaderFile, detail: { index: number }): void;
  /** 上传失败时触发 */
  'upload-error'?(error: any): void;
}

export class FieldUploader extends VanComponent {
  $props: FieldUploaderProps;

  $events: FieldUploaderEvents;
}
