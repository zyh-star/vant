// Utils
import { createNamespace } from '../utils';

// Components
import Field from '../field';
import Popup from '../popup';
import DatetimePicker from '../datetime-picker';

const [createComponent, bem] = createNamespace('date-picker-field');

const DatePickerField = createComponent({
  name: 'DatePickerField',

  props: {
    // Field 组件相关属性
    label: String,
    placeholder: {
      type: String,
      default: '请选择',
    },
    value: {
      type: String,
      default: '',
    },
    // 选择器类型: date | datetime
    type: {
      type: String,
      default: 'date',
      validator: (value) => ['date', 'datetime'].includes(value),
    },
    // 是否禁用
    disabled: Boolean,
    // 是否只读
    readonly: Boolean,
    // 是否必填
    required: Boolean,
    // 输入框对齐方式
    inputAlign: {
      type: String,
      default: 'right',
    },
    // 最小日期
    minDate: {
      type: Date,
      default: () => new Date(1900, 0, 1),
    },
    // 最大日期
    maxDate: {
      type: Date,
      default: () => new Date(2100, 11, 31),
    },
    // 格式化函数，自定义显示文本
    formatter: {
      type: Function,
      default: null,
    },
  },

  data() {
    return {
      showPopup: false,
      currentDate: new Date(),
    };
  },

  computed: {
    // 显示值
    displayValue() {
      if (this.formatter) {
        return this.formatter(this.value);
      }
      return this.value;
    },
    // 是否为日期类型
    isDateType() {
      return this.type === 'date';
    },
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          // 解析传入的值并设置当前日期
          this.currentDate = this.parseDateString(val);
        }
      },
    },
  },

  methods: {
    // 解析日期字符串为 Date 对象
    parseDateString(dateString) {
      if (!dateString) return new Date();

      // 支持 YYYY-MM-dd 或 YYYY-MM-dd HH:mm:ss 格式
      const parts = dateString.split(' ');
      const datePart = parts[0];
      const timePart = parts[1] || '00:00:00';

      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);

      return new Date(
        year,
        month - 1,
        day,
        hours || 0,
        minutes || 0,
        seconds || 0
      );
    },

    // 格式化日期为字符串 YYYY-MM-dd HH:mm:ss
    formatDateTime(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    // 点击 Field 打开弹窗
    onFieldClick() {
      if (this.disabled || this.readonly) {
        return;
      }
      this.showPopup = true;
    },

    // 确认选择
    onConfirm(value) {
      const formattedValue = this.formatDateTime(value);
      this.$emit('input', formattedValue);
      this.$emit('confirm', formattedValue);
      this.showPopup = false;
    },

    // 取消选择
    onCancel() {
      this.$emit('cancel');
      this.showPopup = false;
    },

    // 关闭弹窗
    onPopupClose() {
      this.showPopup = false;
    },

    genField() {
      return (
        <Field
          label={this.label}
          placeholder={this.placeholder}
          value={this.displayValue}
          readonly
          disabled={this.disabled}
          required={this.required}
          isLink
          inputAlign={this.inputAlign}
          onClick={this.onFieldClick}
        />
      );
    },

    genPopup() {
      const pickerType = this.isDateType ? 'date' : 'datetime';

      return (
        <Popup
          vModel={this.showPopup}
          position="bottom"
          onClose={this.onPopupClose}
        >
          <DatetimePicker
            type={pickerType}
            vModel={this.currentDate}
            minDate={this.minDate}
            maxDate={this.maxDate}
            onConfirm={this.onConfirm}
            onCancel={this.onCancel}
          />
        </Popup>
      );
    },
  },

  render() {
    return (
      <div class={bem()}>
        {this.genField()}
        {this.genPopup()}
      </div>
    );
  },
});

export default DatePickerField;
