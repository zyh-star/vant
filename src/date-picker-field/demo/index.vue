<template>
  <demo-section>
    <demo-block title="基础用法">
      <van-date-picker-field
        v-model="dateValue"
        label="选择日期"
        placeholder="请选择日期"
        type="date"
      />
      <div class="result">选中值: {{ dateValue }}</div>
    </demo-block>

    <demo-block title="日期时间选择">
      <van-date-picker-field
        v-model="dateTimeValue"
        label="选择时间"
        placeholder="请选择日期时间"
        type="datetime"
      />
      <div class="result">选中值: {{ dateTimeValue }}</div>
    </demo-block>

    <demo-block title="自定义格式化显示">
      <van-date-picker-field
        v-model="formattedValue"
        label="选择日期"
        placeholder="请选择"
        type="date"
        :formatter="formatter"
      />
      <div class="result">原始值: {{ formattedValue }}</div>
      <div class="result">显示值: 只显示日期部分</div>
    </demo-block>

    <demo-block title="禁用状态">
      <van-date-picker-field
        v-model="disabledValue"
        label="禁用状态"
        placeholder="请选择"
        type="date"
        disabled
      />
    </demo-block>

    <demo-block title="必填项">
      <van-date-picker-field
        v-model="requiredValue"
        label="必填日期"
        placeholder="请选择"
        type="date"
        required
      />
    </demo-block>
  </demo-section>
</template>

<script>
export default {
  data() {
    return {
      dateValue: '',
      dateTimeValue: '',
      formattedValue: '2024-01-15 00:00:00',
      disabledValue: '2024-01-01 00:00:00',
      requiredValue: '',
    };
  },

  methods: {
    formatter(value) {
      // 只显示日期部分
      return value ? value.split(' ')[0] : '';
    },
  },
};
</script>

<style lang="less">
.result {
  padding: 10px 16px;
  color: #666;
  font-size: 14px;
  background-color: #f7f8fa;
}
</style>
