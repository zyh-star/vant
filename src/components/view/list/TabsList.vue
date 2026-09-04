<!--
* @description tabs
* @fileName TabsList.vue
* @author zheng yuanhou
* @date 2025/02/08 15:53:50
!-->
<template>
  <van-tabs ref="tabs" v-model="active" swipeable>
    <van-tab
      v-for="(item, index) in list"
      :key="index"
      :title="i18n(item.title)"
      :badge="item.badge"
      :name="item.name"
    >
      <data-list :list="item.list" :height="h">
        <template #default="{ value, list: listData }">
          <slot name="default" :value="value" :list="listData" />
        </template>
        <template #left="{ data: leftData, list: listData }">
          <slot name="left" :data="leftData" :list="listData" />
        </template>
        <template #right="{ data: rightData, list: listData }">
          <slot name="right" :data="rightData" :list="listData" />
        </template>
      </data-list>
    </van-tab>
  </van-tabs>
</template>

<script>
import { Tabs, Tab } from "vant";

import DataList from "./DataList.vue";

import mixin from "@/mixin/index";

export default {
  // 组件名称
  name: "TabsList",
  // 组件参数 接收来自父组件的数据
  props: {
    tabs: {
      type: Object,
      default: () => {
        return {};
      },
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  mixins: [mixin],
  // 局部注册的组件
  components: {
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [DataList.name]: DataList,
  },
  // 组件状态值
  data() {
    return {
      element: undefined,
      h: this.height,
    };
  },
  // 计算属性
  computed: {
    active: {
      get() {
        return this.tabs.active;
      },
      set(active) {
        this.tabs.setActive(active);
      },
    },
    list() {
      return this.tabs.data.map((item, index) => {
        return {
          ...item,
          name: index,
        };
      });
    },
  },
  // 组件方法
  methods: {},
  // 组件生成完毕后触发
  mounted() {
    let height = this.h;
    if (this.$refs.tabs) {
      height += this.$refs.tabs.$refs.wrap.clientHeight;
    }
    this.h = height;
  },
};
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  /deep/.van-tabs__content {
    height: calc(100% - 44px);
    .van-tab__pane {
      height: 100%;
    }
  }
}
</style>
