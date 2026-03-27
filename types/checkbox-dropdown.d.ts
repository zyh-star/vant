import { VanComponent } from './component';

export type CheckboxDropdownOption = {
  [key: string]: any;
};

export interface CheckboxDropdownProps {
  label?: string;
  placeholder?: string;
  value?: (string | number)[];
  options?: CheckboxDropdownOption[];
  url?: string;
  method?: string;
  lovCode?: string;
  lookupCode?: string;
  labelKey?: string;
  valueKey?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  pullRefresh?: boolean;
  pagination?: boolean;
  pageSize?: number;
  inputAlign?: string;
  zIndexOffset?: number;
}

export class CheckboxDropdown extends VanComponent {
  $props: CheckboxDropdownProps;

  $emit(eventName: 'input', value: (string | number)[]): this;

  $emit(eventName: 'confirm', value: (string | number)[]): this;

  $emit(eventName: 'fetch-error', error: any): this;

  $emit(
    eventName: 'lov-confirm',
    data: { field: any; item: CheckboxDropdownOption | null }
  ): this;

  $emit(
    eventName: 'select-confirm',
    data: { field: any; item: CheckboxDropdownOption | null }
  ): this;
}
