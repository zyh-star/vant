import { VanComponent } from './component';

export type RadioDropdownOption = {
  [key: string]: any;
};

export interface RadioDropdownProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  options?: RadioDropdownOption[];
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

export class RadioDropdown extends VanComponent {
  $props: RadioDropdownProps;

  $emit(eventName: 'confirm', item: RadioDropdownOption | null): this;

  $emit(eventName: 'fetch-error', error: any): this;

  $emit(
    eventName: 'lov-confirm',
    data: { field: any; item: RadioDropdownOption | null }
  ): this;

  $emit(
    eventName: 'select-confirm',
    data: { field: any; item: RadioDropdownOption | null }
  ): this;
}
