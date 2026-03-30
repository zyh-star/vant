// Utils
import { createNamespace } from '../utils';

// Components
import Field from '../field';
import Popup from '../popup';
import List from '../list';
import Radio from '../radio';
import RadioGroup from '../radio-group';
import Cell from '../cell';
import Button from '../button';
import CellGroup from '../cell-group';
import PullRefresh from '../pull-refresh';
import Overlay from '../overlay';
import DatePickerField from '../date-picker-field';
import Icon from '../icon';
import { bridge, instance } from 'hips-wx-utils';

const [createComponent, bem] = createNamespace('radio-dropdown');

// 数据源类型
const DATA_SOURCE_TYPE = {
  OPTIONS: 'options',
  URL: 'url',
  LOV_CODE: 'lovCode',
  LOOKUP_CODE: 'lookupCode',
};

const RadioDropdown = createComponent({
  name: 'RadioDropdown',
  props: {
    // Field 组件相关属性
    name: String,
    label: String,
    placeholder: {
      type: String,
      default: '请选择',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    // 选项数据 - 优先级1
    options: {
      type: Array,
      default: () => [],
    },
    // 自定义接口URL - 优先级2
    url: String,
    // 请求方法
    method: {
      type: String,
      default: 'GET',
    },
    // LOV编码 - 优先级3
    lovCode: String,
    // Lookup编码 - 优先级4
    lookupCode: String,
    // 选项显示的字段名
    labelKey: {
      type: String,
      default: 'meaning',
    },
    // 选项辅助显示的字段配置，支持数组格式
    // 支持: 'fieldName' | { key: 'fieldName' } | { key: 'fieldName', newLine: true } | (item) => string | { key: (item) => string, newLine: true }
    subLabelKey: {
      type: Array,
      default: () => [],
    },
    // 选项值的字段名
    valueKey: {
      type: String,
      default: 'value',
    },
    // 是否禁用
    disabled: Boolean,
    // 是否只读
    readonly: Boolean,
    // 是否必填
    required: Boolean,
    // 表单校验规则
    rules: Array,
    // 是否开启下拉刷新
    pullRefresh: {
      type: Boolean,
      default: true,
    },
    // 是否开启分页
    pagination: {
      type: Boolean,
      default: true,
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: 10,
    },
    // 输入框对齐方式
    inputAlign: {
      type: String,
      default: 'right',
    },
    // 层级偏移，用于递归组件
    zIndexOffset: {
      type: Number,
      default: 0,
    },
    // 查询字段配置，用于自定义搜索栏
    queryFields: {
      type: Array,
      default: () => [{ field: 'meaning', label: '名称', dataType: 'TEXT' }],
    },
    // 是否显示扫码图标
    showScan: {
      type: Boolean,
      default: false,
    },
    // 扫码查询字段名，如果不传则按数据源类型默认逻辑处理
    scanField: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      showPopup: false,
      searchForm: {},
      filteredOptions: [],
      internalOptions: [],
      // 内部选中值，避免直接修改prop
      internalValue: this.value,
      // LOV配置
      lovConfig: {
        queryFields: [],
        queryUrl: '',
        displayField: '',
        valueField: '',
        requestMethod: 'GET',
      },
      // 分页相关
      page: 0,
      totalPages: 0,
      loading: false,
      finished: false,
      refreshing: false,
      // 当前数据源类型
      currentDataSource: '',
      // Overlay 元素引用
      overlayRef: null,
      // input聚焦状态，用于blur时判断是否需要查询
      inputFocused: false,
      // input聚焦时的值，用于blur时判断值是否变化
      inputFocusValue: '',
    };
  },

  computed: {
    currentLabelKey() {
      if (this.currentDataSource === DATA_SOURCE_TYPE.LOV_CODE) {
        return this.lovConfig.displayField || this.labelKey;
      }
      return this.labelKey;
    },
    currentValueKey() {
      if (this.currentDataSource === DATA_SOURCE_TYPE.LOV_CODE) {
        return this.lovConfig.valueField || this.valueKey;
      }
      return this.valueKey;
    },
    displayValue() {
      const options = this.getCurrentOptions();
      const selected = options.find(
        (item) => item[this.currentValueKey] === this.internalValue
      );
      return selected ? selected[this.currentLabelKey] : '';
    },
    // 计算 overlay z-index
    overlayZIndex() {
      return 1999 + this.zIndexOffset;
    },
    // 计算 popup wrapper z-index
    popupZIndex() {
      return 2000 + this.zIndexOffset;
    },
  },

  watch: {
    value(val) {
      this.internalValue = val;
    },
    options: {
      immediate: true,
      handler(val) {
        if (val && val.length > 0) {
          this.currentDataSource = DATA_SOURCE_TYPE.OPTIONS;
          this.filteredOptions = val;
        }
      },
    },
  },

  mounted() {
    this.initDataSource();
  },

  methods: {
    // 初始化数据源
    initDataSource() {
      // 优先级1: options
      if (this.options && this.options.length > 0) {
        this.currentDataSource = DATA_SOURCE_TYPE.OPTIONS;
        this.filteredOptions = this.options;
        return;
      }

      // 优先级2: url
      if (this.url) {
        this.currentDataSource = DATA_SOURCE_TYPE.URL;
        this.fetchUrlData();
        return;
      }

      // 优先级3: lovCode
      if (this.lovCode) {
        this.currentDataSource = DATA_SOURCE_TYPE.LOV_CODE;
        this.fetchLovConfig();
        return;
      }

      // 优先级4: lookupCode
      if (this.lookupCode) {
        this.currentDataSource = DATA_SOURCE_TYPE.LOOKUP_CODE;
        this.fetchLookupData();
      }
    },

    // 获取当前选项列表
    getCurrentOptions() {
      switch (this.currentDataSource) {
        case DATA_SOURCE_TYPE.OPTIONS:
          return this.options;
        case DATA_SOURCE_TYPE.URL:
        case DATA_SOURCE_TYPE.LOV_CODE:
        case DATA_SOURCE_TYPE.LOOKUP_CODE:
          return this.internalOptions;
        default:
          return [];
      }
    },

    // 从URL获取数据
    async fetchUrlData(params = {}, isRefresh = false) {
      if (this.loading) return;
      this.loading = true;

      try {
        const requestParams = {
          ...params,
          page: isRefresh ? 0 : this.page,
          size: this.pageSize,
        };

        const response = await instance[this.method.toLowerCase()](this.url, {
          params: requestParams,
        });

        this.handleResponse(response, isRefresh);
      } catch (error) {
        console.error('获取数据失败:', error);
        this.$emit('fetch-error', error);
      } finally {
        this.loading = false;
        this.refreshing = false;
      }
    },

    // 获取LOV配置
    async fetchLovConfig() {
      try {
        const url = `/hpfm/v1/#tenantId#/lov-view/info?viewCode=${this.lovCode}`;

        const response = await instance.get(url);

        if (response) {
          this.lovConfig = {
            queryFields: response.queryFields || [],
            queryUrl: response.queryUrl || '',
            displayField: response.displayField || '',
            valueField: response.valueField || '',
            requestMethod: response.requestMethod || 'GET',
          };
          this.initSearchForm();
          this.fetchLovListData();
        }
      } catch (error) {
        console.error('获取LOV配置失败:', error);
        this.$emit('fetch-error', error);
      }
    },

    // 获取LOV列表数据
    async fetchLovListData(params = {}, isRefresh = false) {
      if (this.loading) return;
      this.loading = true;

      try {
        let url = this.lovConfig.queryUrl;
        url = url.replace('{organizationId}', '#tenantId#');

        const requestParams = {
          ...params,
          page: isRefresh ? 0 : this.page,
          size: this.pageSize,
        };

        const response = await instance[
          this.lovConfig.requestMethod.toLowerCase()
        ](url, {
          params: requestParams,
        });

        this.handleResponse(response, isRefresh);
      } catch (error) {
        console.error('获取列表数据失败:', error);
        this.$emit('fetch-error', error);
      } finally {
        this.loading = false;
        this.refreshing = false;
      }
    },

    // 获取Lookup数据
    async fetchLookupData() {
      if (this.loading) return;
      this.loading = true;

      try {
        const url = `/hpfm/v1/#tenantId#/lovs/value/batch?${this.lookupCode}=${this.lookupCode}`;

        const response = await instance.get(url);

        if (response) {
          let data = response;
          if (response.data) {
            data = response.data.data || response.data;
          }
          // 处理 lookupCode 返回格式: { "LOOKUP_CODE": [...] }
          if (
            data &&
            data[this.lookupCode] &&
            Array.isArray(data[this.lookupCode])
          ) {
            this.internalOptions = data[this.lookupCode];
            this.filteredOptions = data[this.lookupCode];
          } else if (Array.isArray(data)) {
            this.internalOptions = data;
            this.filteredOptions = data;
          }
        }
        this.finished = true;
      } catch (error) {
        console.error('获取Lookup数据失败:', error);
        this.$emit('fetch-error', error);
      } finally {
        this.loading = false;
        this.refreshing = false;
      }
    },

    // 处理响应数据
    handleResponse(response, isRefresh) {
      if (!response) return;

      let data = response;
      if (response.data) {
        data = response.data.data || response.data;
      }

      if (Array.isArray(data)) {
        if (isRefresh) {
          this.internalOptions = data;
        } else {
          this.internalOptions = [...this.internalOptions, ...data];
        }
        this.finished = data.length < this.pageSize;
      } else if (data && Array.isArray(data.content)) {
        if (isRefresh) {
          this.internalOptions = data.content;
        } else {
          this.internalOptions = [...this.internalOptions, ...data.content];
        }
        this.totalPages = data.totalPages || 0;
        this.finished =
          this.page >= this.totalPages - 1 ||
          data.content.length < this.pageSize;
      }

      this.filteredOptions = this.internalOptions;

      if (!isRefresh) {
        this.page++;
      }
    },

    // 初始化查询表单
    initSearchForm() {
      const form = {};
      this.lovConfig.queryFields.forEach((field) => {
        form[field.field] = '';
      });
      this.searchForm = form;
    },

    // 下拉刷新
    async onRefresh() {
      this.refreshing = true;
      this.page = 0;

      switch (this.currentDataSource) {
        case DATA_SOURCE_TYPE.URL:
          await this.fetchUrlData({}, true);
          break;
        case DATA_SOURCE_TYPE.LOV_CODE:
          await this.fetchLovListData({}, true);
          break;
        case DATA_SOURCE_TYPE.LOOKUP_CODE:
          await this.fetchLookupData();
          break;
        default:
          this.refreshing = false;
      }
    },

    // 加载更多
    onLoad() {
      switch (this.currentDataSource) {
        case DATA_SOURCE_TYPE.URL:
          this.fetchUrlData();
          break;
        case DATA_SOURCE_TYPE.LOV_CODE:
          this.fetchLovListData();
          break;
        default:
          this.loading = false;
          this.finished = true;
      }
    },

    onFieldClick() {
      if (this.disabled || this.readonly) {
        return;
      }
      this.showPopup = true;
      this.resetSearchForm();
      this.filteredOptions = this.getCurrentOptions();
    },

    resetSearchForm() {
      if (this.currentDataSource === DATA_SOURCE_TYPE.LOV_CODE) {
        this.initSearchForm();
      } else {
        this.searchForm = { name: '', code: '' };
      }
    },

    onReset() {
      this.resetSearchForm();
      this.page = 0;

      switch (this.currentDataSource) {
        case DATA_SOURCE_TYPE.URL:
          this.fetchUrlData({}, true);
          break;
        case DATA_SOURCE_TYPE.LOV_CODE:
          this.fetchLovListData({}, true);
          break;
        default:
          this.filteredOptions = this.getCurrentOptions();
      }
    },

    onSearch() {
      const params = {};
      Object.keys(this.searchForm).forEach((key) => {
        if (this.searchForm[key]) {
          params[key] = this.searchForm[key];
        }
      });

      this.page = 0;
      this.refreshing = true;

      switch (this.currentDataSource) {
        case DATA_SOURCE_TYPE.URL:
          this.fetchUrlData(params, true);
          break;
        case DATA_SOURCE_TYPE.LOV_CODE:
          this.fetchLovListData(params, true);
          break;
        default:
          // 本地过滤
          this.filteredOptions = this.getCurrentOptions().filter((item) => {
            return Object.keys(params).every((key) => {
              return String(item[key] || '')
                .toLowerCase()
                .includes(String(params[key]).toLowerCase());
            });
          });
          this.refreshing = false;
      }
    },

    onSelect(item) {
      const newValue = item[this.currentValueKey];
      // 保存当前值作为旧值（RadioGroup还未修改internalValue）
      const oldValue = this.internalValue;

      // 如果值相同，则取消选中
      if (oldValue === newValue) {
        this.internalValue = '';
        this.$emit('confirm', null);
      } else {
        this.internalValue = newValue;
        this.$emit('confirm', item);
      }
      this.showPopup = false;
    },

    onPopupClose() {
      this.showPopup = false;
    },

    // 处理扫码
    async handleScan() {
      try {
        const scanCode = await bridge.scan();
        await this.queryByScanCode(scanCode);
      } catch (error) {
        this.$toast.fail(error);
      }
    },

    // 处理input blur事件
    async handleInputBlur() {
      // 如果inputFocused为true且值有变化，则调用查询函数
      if (this.inputFocused && this.displayValue !== this.inputFocusValue) {
        await this.queryByScanCode(this.displayValue);
      }
      // 重置状态
      this.inputFocused = false;
      this.inputFocusValue = '';
    },

    // 根据扫码结果查询数据
    async queryByScanCode(scanCode) {
      // 优先使用自定义的 scanField，如果没有则根据数据源类型确定使用的 key
      const queryKey = this.scanField
        ? this.scanField
        : this.currentDataSource === DATA_SOURCE_TYPE.LOV_CODE
        ? this.lovConfig.valueField || this.valueKey
        : this.valueKey;

      const params = {
        [queryKey]: scanCode,
      };

      switch (this.currentDataSource) {
        case DATA_SOURCE_TYPE.URL:
          // URL数据源：使用scanCode作为查询条件请求数据
          await this.fetchUrlData(params, true);
          this.checkAndSelectSingleResult();
          break;
        case DATA_SOURCE_TYPE.LOV_CODE:
          // LOV_CODE数据源：使用scanCode作为查询条件请求数据
          await this.fetchLovListData(params, true);
          this.checkAndSelectSingleResult();
          break;
        case DATA_SOURCE_TYPE.LOOKUP_CODE:
          // LOOKUP_CODE数据源：本地筛选
          this.filteredOptions = this.getCurrentOptions().filter((item) => {
            return String(item[queryKey] || '')
              .toLowerCase()
              .includes(String(scanCode).toLowerCase());
          });
          this.checkAndSelectSingleResult();
          break;
        case DATA_SOURCE_TYPE.OPTIONS:
          // OPTIONS数据源：本地筛选
          this.filteredOptions = this.options.filter((item) => {
            return String(item[queryKey] || '')
              .toLowerCase()
              .includes(String(scanCode).toLowerCase());
          });
          this.checkAndSelectSingleResult();
          break;
      }
    },

    // 检查结果长度是否为1，是则默认选中
    checkAndSelectSingleResult() {
      // 使用 filteredOptions 而不是 getCurrentOptions()，因为筛选后的结果存储在 filteredOptions 中
      const options = this.filteredOptions;
      if (options.length === 1) {
        const value = options[0][this.currentValueKey];
        this.internalValue = value;
        this.$emit('input', this.internalValue);
        this.$emit('confirm', options[0]);
      } else {
        // 结果不为1，打开弹窗显示选项
        this.showPopup = true;
      }
    },

    genField() {
      const fieldProps = {
        props: {
          name: this.name,
          label: this.label,
          placeholder: this.placeholder,
          value: this.displayValue,
          readonly: !this.showScan,
          disabled: this.disabled,
          required: this.required,
          rules: this.rules,
          isLink: true,
          inputAlign: this.inputAlign,
        },
        on: {
          click: this.onFieldClick,
          'click-input': (event) => {
            if (this.showScan) {
              event.stopPropagation();
            }
            // 记录input聚焦状态和当前值
            this.inputFocused = true;
            this.inputFocusValue = this.displayValue;
          },
          blur: () => {
            this.handleInputBlur();
          },
        },
        scopedSlots: this.showScan
          ? {
              'right-icon': () => (
                <Icon
                  name="scan"
                  size={24}
                  color="#07c160"
                  onClick={(event) => {
                    event.stopPropagation();
                    this.handleScan();
                  }}
                />
              ),
            }
          : {},
      };

      return <Field {...fieldProps} />;
    },

    genSearchFields() {
      // 优先从 LOV 配置获取（如果是 LOV_CODE 数据源且有配置），否则从 props 获取 queryFields
      const fields =
        this.currentDataSource === DATA_SOURCE_TYPE.LOV_CODE &&
        this.lovConfig.queryFields &&
        this.lovConfig.queryFields.length > 0
          ? this.lovConfig.queryFields
          : this.queryFields && this.queryFields.length > 0
          ? this.queryFields
          : [];

      return fields.map((field) => {
        const dataType = field.dataType || 'TEXT';

        switch (dataType) {
          case 'TEXT':
            return (
              <Field
                vModel={this.searchForm[field.field]}
                label={field.label}
                placeholder={`请输入${field.label}`}
                input-align="right"
              />
            );

          case 'LOV_CODE':
            return (
              <RadioDropdown
                vModel={this.searchForm[field.field]}
                label={field.label}
                lov-code={field.sourceCode}
                placeholder={`请选择${field.label}`}
                input-align="right"
                z-index-offset={this.zIndexOffset + 10}
                onConfirm={(item) => this.onLovConfirm(field, item)}
              />
            );

          case 'SELECT':
            return (
              <RadioDropdown
                vModel={this.searchForm[field.field]}
                label={field.label}
                lookup-code={field.sourceCode}
                placeholder={`请选择${field.label}`}
                input-align="right"
                z-index-offset={this.zIndexOffset + 10}
                onConfirm={(item) => this.onSelectConfirm(field, item)}
              />
            );

          case 'DATE':
            return (
              <DatePickerField
                vModel={this.searchForm[field.field]}
                label={field.label}
                placeholder={`请选择${field.label}`}
                type="date"
                input-align="right"
              />
            );

          case 'DATETIME':
            return (
              <DatePickerField
                vModel={this.searchForm[field.field]}
                label={field.label}
                placeholder={`请选择${field.label}`}
                type="datetime"
                input-align="right"
              />
            );

          default:
            return (
              <Field
                vModel={this.searchForm[field.field]}
                label={field.label}
                placeholder={`请输入${field.label}`}
              />
            );
        }
      });
    },

    // LOV_CODE 字段确认选择
    onLovConfirm(field, item) {
      if (item) {
        this.searchForm[field.field] = item[this.valueKey];
      } else {
        this.searchForm[field.field] = '';
      }
      this.$emit('lov-confirm', { field, item });
    },

    // SELECT 字段确认选择
    onSelectConfirm(field, item) {
      if (item) {
        this.searchForm[field.field] = item[this.valueKey];
      } else {
        this.searchForm[field.field] = '';
      }
      this.$emit('select-confirm', { field, item });
    },

    // 处理 subLabelKey，获取标签配置列表
    getSubLabels(item) {
      if (!this.subLabelKey || this.subLabelKey.length === 0) {
        return [];
      }

      return this.subLabelKey
        .map((config) => {
          let text = '';
          let newLine = false;

          if (typeof config === 'string') {
            // 2.1 如果是字符串 a，返回 item[a]
            text = item[config] || '';
          } else if (typeof config === 'function') {
            // 2.4 如果是函数，item 作为传参返回
            text = config(item) || '';
          } else if (typeof config === 'object' && config !== null) {
            const { key, newLine: nl } = config;
            newLine = nl || false;

            if (typeof key === 'string') {
              // 2.2 如果是 {key: a}，返回 item[key]
              text = item[key] || '';
            } else if (typeof key === 'function') {
              // 2.4/2.5 如果是函数，item 作为传参返回
              text = key(item) || '';
            }
          }

          return { text, newLine };
        })
        .filter((item) => item.text);
    },

    // 渲染 subLabel
    genSubLabel(item) {
      const labels = this.getSubLabels(item);
      if (labels.length === 0) return null;

      // 检查是否有需要换行的标签
      const hasNewLine = labels.some((l) => l.newLine);

      if (hasNewLine) {
        // 如果有 newLine=true 的标签，每个标签单独一行
        return (
          <div class={bem('sub-labels')}>
            {labels.map((label, index) => (
              <div
                key={index}
                class={bem('sub-label', { 'new-line': label.newLine })}
              >
                {label.text}
              </div>
            ))}
          </div>
        );
      }

      // 否则一行显示2条数据，左右分布
      return (
        <div class={bem('sub-labels', 'inline')}>
          {labels.map((label, index) => (
            <div key={index} class={bem('sub-label-item')}>
              {label.text}
            </div>
          ))}
        </div>
      );
    },

    genSearchPopup() {
      return (
        <Popup
          vModel={this.showPopup}
          position="top"
          overlay={false}
          getContainer={() => this.$refs.overlayRef?.$el || document.body}
        >
          <div class={bem('search-popup')}>
            <div class={bem('search-fields')}>
              <CellGroup>{this.genSearchFields()}</CellGroup>
            </div>
            <div class={bem('search-actions')}>
              <Button
                type="default"
                block
                class={bem('search-btn')}
                onClick={this.onReset}
              >
                重置
              </Button>
              <Button
                type="primary"
                block
                class={bem('search-btn')}
                onClick={this.onSearch}
              >
                查询
              </Button>
            </div>
          </div>
        </Popup>
      );
    },

    genListContent() {
      const listContent = (
        <List
          finished={this.finished}
          loading={this.loading}
          onLoad={this.onLoad}
        >
          {this.filteredOptions.map((item) => (
            <Cell
              key={item[this.currentValueKey]}
              clickable
              onClick={() => this.onSelect(item)}
            >
              <Radio
                name={item[this.currentValueKey]}
                checked={this.internalValue === item[this.currentValueKey]}
              >
                {item[this.currentLabelKey]}
              </Radio>
              {this.genSubLabel(item)}
            </Cell>
          ))}
        </List>
      );

      // 支持下拉刷新
      if (
        this.pullRefresh &&
        (this.currentDataSource === DATA_SOURCE_TYPE.URL ||
          this.currentDataSource === DATA_SOURCE_TYPE.LOV_CODE ||
          this.currentDataSource === DATA_SOURCE_TYPE.LOOKUP_CODE)
      ) {
        return (
          <PullRefresh vModel={this.refreshing} onRefresh={this.onRefresh}>
            {listContent}
          </PullRefresh>
        );
      }

      return listContent;
    },

    genOverlay() {
      return (
        <Overlay
          ref="overlayRef"
          show={this.showPopup}
          onClick={this.onPopupClose}
          z-index={this.overlayZIndex}
        />
      );
    },

    genListPopup() {
      return (
        <Popup
          vModel={this.showPopup}
          position="bottom"
          style={{ height: '55%', top: '45%' }}
          overlay={false}
          safeAreaInsetBottom={true}
          getContainer={() => this.$refs.overlayRef?.$el || document.body}
        >
          <div class={bem('list-popup')}>
            <RadioGroup value={this.internalValue}>
              {this.genListContent()}
            </RadioGroup>
          </div>
        </Popup>
      );
    },
  },

  render() {
    return (
      <div class={bem()}>
        {this.genField()}
        {this.genOverlay()}
        {this.showPopup && (
          <div
            class={bem('popup-wrapper')}
            style={{ zIndex: this.popupZIndex }}
          >
            {this.genSearchPopup()}
            {this.genListPopup()}
          </div>
        )}
      </div>
    );
  },
});

export default RadioDropdown;
