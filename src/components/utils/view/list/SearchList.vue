<!--
* @description 查询栏
* @fileName SearchField.vue
* @author zheng yuanhou
* @date 2024/12/31 14:19:20
!-->
<template>
  <van-sticky v-if="searchs.length > 0" container="body">
    <search-field
      v-for="(field, index) in searchs"
      :key="index"
      v-bind="field"
      v-model="field.value"
      @search="onSearch"
      @search-right-icon-click="onSearchRightIconClick"
    />
  </van-sticky>
</template>

<script>
import { Sticky } from "vant";
import SearchField from "../field/SearchField.vue";
export default {
  // 组件名称
  name: "SearchList",
  // 组件参数 接收来自父组件的数据
  props: {
    search: {
      type: Object,
      default: () => {},
    },
  },
  // 局部注册的组件
  components: {
    [Sticky.name]: Sticky,
    [SearchField.name]: SearchField,
  },
  computed: {
    searchs() {
      const { search = {} } = this;
      const { data = [] } = search;
      return data;
    },
  },
  methods: {
    onSearch() {
      this.$emit("search");
    },
    onSearchRightIconClick(e) {
      this.$emit("search-right-icon-click", e);
    },
  },
};
</script>

<style lang="less" scoped>
.van-search + .van-search {
  padding-top: 0;
}
</style>
