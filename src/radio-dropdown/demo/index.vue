<template>
  <demo-section>
    <demo-block title="基础用法">
      <van-radio-dropdown
        v-model="value1"
        label="选择城市"
        :options="cityOptions"
        placeholder="请选择城市"
        @change="onChange"
      />
    </demo-block>

    <demo-block title="禁用状态">
      <van-radio-dropdown
        v-model="value2"
        label="选择城市"
        :options="cityOptions"
        disabled
        placeholder="请选择城市"
      />
    </demo-block>

    <demo-block title="必填项">
      <van-radio-dropdown
        v-model="value3"
        label="选择职业"
        :options="jobOptions"
        required
        placeholder="请选择职业"
      />
    </demo-block>

    <demo-block title="自定义字段名">
      <van-radio-dropdown
        v-model="value4"
        label="选择商品"
        :options="productOptions"
        label-key="name"
        value-key="id"
        placeholder="请选择商品"
      />
    </demo-block>

    <demo-block title="lovCode数据源">
      <van-radio-dropdown
        v-model="value1"
        label="lovCode选择"
        lov-code="MOULD.MOULD"
        :sub-label-key="['mouldCode']"
        @change="onChange"
      />
    </demo-block>

    <demo-block title="URL数据源">
      <van-radio-dropdown
        v-model="value5"
        label="URL选择"
        url="/mould-manage/v1/#tenantId#/moulds"
        label-key="mouldName"
        value-key="mouldId"
        placeholder="请选择"
      />
    </demo-block>

    <demo-block title="Lookup数据源">
      <van-radio-dropdown
        v-model="value6"
        label="Lookup选择"
        lookup-code="COMMON.YESORNO"
        placeholder="请选择"
      />
    </demo-block>
  </demo-section>
</template>

<script>
import RadioDropdown from '../index';

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

// 模拟数据 - 职业选项
const jobOptions = [
  { meaning: '软件工程师', value: 'software_engineer' },
  { meaning: '产品经理', value: 'product_manager' },
  { meaning: 'UI设计师', value: 'ui_designer' },
  { meaning: '测试工程师', value: 'test_engineer' },
  { meaning: '运维工程师', value: 'devops_engineer' },
  { meaning: '数据分析师', value: 'data_analyst' },
  { meaning: '项目经理', value: 'project_manager' },
  { meaning: '技术总监', value: 'cto' },
  { meaning: '架构师', value: 'architect' },
  { meaning: '前端工程师', value: 'frontend_engineer' },
  { meaning: '后端工程师', value: 'backend_engineer' },
  { meaning: '全栈工程师', value: 'fullstack_engineer' },
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
    'van-radio-dropdown': RadioDropdown,
  },

  data() {
    return {
      value1: '',
      value2: 'beijing',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      cityOptions,
      jobOptions,
      productOptions,
    };
  },

  methods: {
    onChange(item) {
      this.$toast(`选择了: ${item.meaning || item.name}`);
    },
  },
};
</script>

<style lang="less">
@import '../../style/var';

.demo-radio-dropdown {
  min-height: 100vh;
  background-color: @background-color;
}
</style>
