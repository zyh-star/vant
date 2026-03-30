<template>
  <demo-section>
    <demo-block title="基础用法">
      <van-checkbox-dropdown
        v-model="value1"
        label="选择城市"
        :options="cityOptions"
        placeholder="请选择城市"
        @confirm="onConfirm"
      />
    </demo-block>

    <demo-block title="禁用状态">
      <van-checkbox-dropdown
        v-model="value2"
        label="选择城市"
        :options="cityOptions"
        disabled
        placeholder="请选择城市"
      />
    </demo-block>

    <demo-block title="必填项">
      <van-checkbox-dropdown
        v-model="value3"
        label="选择技能"
        :options="skillOptions"
        required
        placeholder="请选择技能"
      />
    </demo-block>

    <demo-block title="自定义字段名">
      <van-checkbox-dropdown
        v-model="value4"
        label="选择商品"
        :options="productOptions"
        label-key="name"
        value-key="id"
        placeholder="请选择商品"
      />
    </demo-block>

    <demo-block title="URL数据源">
      <van-checkbox-dropdown
        v-model="value5"
        label="URL选择"
        url="/mould-manage/v1/#tenantId#/moulds"
        label-key="mouldName"
        value-key="mouldId"
        placeholder="请选择"
      />
    </demo-block>

    <demo-block title="LovCode数据源">
      <van-checkbox-dropdown
        v-model="value6"
        show-scan
        label="LovCode选择"
        lov-code="MOULD.MOULD"
        placeholder="请选择"
        scan-field="mouldCode"
      />
    </demo-block>

    <demo-block title="Lookup数据源">
      <van-checkbox-dropdown
        v-model="value6"
        label="Lookup选择"
        lookup-code="COMMON.YESORNO"
        placeholder="请选择"
      />
    </demo-block>

    <demo-block title="显示扫码图标">
      <van-checkbox-dropdown
        v-model="value7"
        label="扫码选择"
        :options="cityOptions"
        show-scan
        placeholder="请扫码或选择"
        @confirm="onConfirm"
      />
    </demo-block>
  </demo-section>
</template>

<script>
import CheckboxDropdown from '../index';

// 模拟数据 - 城市选项
const cityOptions = [
  { meaning: '北京市', value: 'beijing' },
  { meaning: '上海市', value: 'shanghai' },
  { meaning: '广州市', value: 'guangzhou' },
  { meaning: '深圳市', value: 'shenzhen' },
  { meaning: '杭州市', value: 'hangzhou' },
  { meaning: '南京市', value: 'nanjing' },
  { meaning: '成都市', value: 'chengdu' },
  { meaning: '武汉市', value: 'wuhan' },
  { meaning: '西安市', value: 'xian' },
  { meaning: '重庆市', value: 'chongqing' },
  { meaning: '天津市', value: 'tianjin' },
  { meaning: '苏州市', value: 'suzhou' },
  { meaning: '郑州市', value: 'zhengzhou' },
  { meaning: '长沙市', value: 'changsha' },
  { meaning: '沈阳市', value: 'shenyang' },
];

// 模拟数据 - 技能选项
const skillOptions = [
  { meaning: 'JavaScript', value: 'javascript' },
  { meaning: 'Python', value: 'python' },
  { meaning: 'Java', value: 'java' },
  { meaning: 'Go', value: 'go' },
  { meaning: 'Rust', value: 'rust' },
  { meaning: 'TypeScript', value: 'typescript' },
  { meaning: 'Vue.js', value: 'vue' },
  { meaning: 'React', value: 'react' },
  { meaning: 'Angular', value: 'angular' },
  { meaning: 'Node.js', value: 'nodejs' },
  { meaning: 'Docker', value: 'docker' },
  { meaning: 'Kubernetes', value: 'kubernetes' },
];

// 模拟数据 - 商品选项（使用自定义字段名）
const productOptions = [
  { name: 'iPhone 15 Pro', id: 'iphone15pro' },
  { name: 'iPhone 15', id: 'iphone15' },
  { name: 'iPad Pro', id: 'ipadpro' },
  { name: 'MacBook Pro', id: 'macbookpro' },
  { name: 'AirPods Pro', id: 'airpodspro' },
  { name: 'Apple Watch', id: 'applewatch' },
  { name: 'Samsung S24', id: 's24' },
  { name: 'Huawei Mate 60', id: 'mate60' },
  { name: 'Xiaomi 14', id: 'xiaomi14' },
  { name: 'OPPO Find X7', id: 'findx7' },
  { name: 'vivo X100', id: 'x100' },
  { name: 'OnePlus 12', id: 'oneplus12' },
];

export default {
  components: {
    'van-checkbox-dropdown': CheckboxDropdown,
  },

  data() {
    return {
      value1: [],
      value2: ['beijing', 'shanghai'],
      value3: [],
      value4: [],
      value5: [],
      value6: [],
      value7: [],
      cityOptions,
      skillOptions,
      productOptions,
    };
  },

  methods: {
    onConfirm(values) {
      this.$toast(`选择了: ${values.length} 项`);
    },
  },
};
</script>

<style lang="less">
@import '../../style/var';

.demo-checkbox-dropdown {
  min-height: 100vh;
  background-color: @background-color;
}
</style>
