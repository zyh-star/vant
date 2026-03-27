import { VanComponent } from './component';

export interface DatePickerFieldProps {
  /** 当前选中的日期时间，格式为 YYYY-MM-dd HH:mm:ss */
  value?: string;
  /** 输入框左侧文本 */
  label?: string;
  /** 输入框占位提示文字 */
  placeholder?: string;
  /** 选择器类型，可选值为 date datetime */
  type?: 'date' | 'datetime';
  /** 是否禁用输入框 */
  disabled?: boolean;
  /** 是否只读 */
  readonly?: boolean;
  /** 是否显示表单必填星号 */
  required?: boolean;
  /** 输入框对齐方式，可选值为 center right */
  inputAlign?: string;
  /** 可选的最小时间 */
  minDate?: Date;
  /** 可选的最大时间 */
  maxDate?: Date;
  /** 自定义显示格式化函数 */
  formatter?: (value: string) => string;
}

export interface DatePickerFieldEvents {
  /** 点击完成按钮时触发 */
  confirm?(value: string): void;
  /** 点击取消按钮时触发 */
  cancel?(): void;
}

export class DatePickerField extends VanComponent {
  $props: DatePickerFieldProps;

  $events: DatePickerFieldEvents;
}
