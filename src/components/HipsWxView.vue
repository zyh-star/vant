<!--
* @description 
* @fileName demo.vue
* @author zheng yuanhou
* @date 2024/12/10 09:29:16
!-->
<template>
  <div class="hips-page">
    <nav-bar
      ref="navbar"
      :navbar="navbar"
      @search="navBarSearch"
      @click-left="navBarClickLeft"
      @click-right="navBarClickRight"
    />
    <query-list ref="queryList" :queryFields="queryFields" />
    <div v-if="!load" class="content">
      <data-list
        v-if="type === 'list'"
        ref="dataList"
        :list="list"
        :height="height"
        @search-right-icon-click="onSearchRightIconClick"
      >
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
      <tabs-list
        v-else-if="type === 'tabs'"
        ref="tabList"
        :tabs="tabs"
        :height="height"
      >
        <template #default="{ value, list: listData }">
          <slot name="default" :value="value" :list="listData" />
        </template>
        <template #left="{ data: leftData, list: listData }">
          <slot name="left" :data="leftData" :list="listData" />
        </template>
        <template #right="{ data: rightData, list: listData }">
          <slot name="right" :data="rightData" :list="listData" />
        </template>
      </tabs-list>
    </div>
  </div>
</template>

<script>
/** ===== import ===== */
import NavBar from "./utils/view/NavBar.vue";
import QueryList from "./utils/view/list/QueryList.vue";
import SearchList from "./utils/view/list/SearchList.vue";
import DataList from "./utils/view/list/DataList.vue";
import BtnList from "./utils/view/list/BtnList.vue";
import TabsList from "./utils/view/list/TabsList.vue";
/** ===== import ===== */

export default {
  // 组件名称
  name: "HipsWxView",
  /** ===== components ===== */
  components: {
    [NavBar.name]: NavBar,
    [QueryList.name]: QueryList,
    [SearchList.name]: SearchList,
    [DataList.name]: DataList,
    [BtnList.name]: BtnList,
    [TabsList.name]: TabsList,
  },
  /** ===== components ===== */
  // 组件参数 接收来自父组件的数据
  props: {
    dataSet: {
      type: [Object, null],
      default: null,
    },
  },
  // mixins: [indexMixin],
  // 组件状态值
  data() {
    return {
      // 控制加载状态的变量，通常用于显示加载中的状态或组件
      load: true,
      // ds: null,
      // container: null,
      // navbar默认高度
      height: 0,
    };
  },
  // 计算属性
  computed: {
    ds() {
      return this.dataSet || {};
    },
    type() {
      return this.ds.type || "list";
    },
    navbar() {
      const { navbar = {} } = this.ds;
      return navbar;
    },
    // search() {
    //   const { search = {} } = this.ds;
    //   return search;
    // },
    queryFields() {
      const { queryFields = {} } = this.ds;
      return queryFields;
    },
    list() {
      const { list = {} } = this.ds;
      return list;
    },
    tabs() {
      const { tabs = {} } = this.ds;
      return tabs;
    },
    // btns() {
    //   const { btns = [] } = this.ds;
    //   return btns;
    // },
  },
  // 路由组件被激活时触发
  activated() {
    /** ===== activated ===== */
    /** ===== activated ===== */
  },
  // 路由组件失活时触发
  deactivated() {
    /** ===== deactivated ===== */
    /** ===== deactivated ===== */
  },
  // 组件生成时触发
  created() {
    /** ===== created ===== */
    /** ===== created ===== */
  },
  // 组件生成完毕后触发
  mounted() {
    /** ===== mounted ===== */
    this.initHeight();
    /** ===== mounted ===== */
  },
  // 组件方法
  methods: {
    initHeight() {
      this.load = true;
      let height = this.height;
      if (this.$refs.navbar) {
        height += this.$refs.navbar.$el.clientHeight;
      }
      this.height = height;
      this.load = false;
    },
    navBarSearch() {},
    navBarClickLeft(event) {
      this.$emit("nav-bar-click-left", event);
    },
    navBarClickRight(event) {
      if (this.navbar.data.rightIcon === "search") {
        this.queryFields.toggle();
      }
      this.$emit("nav-bar-click-right", event);
    },
    onSearchRightIconClick(event) {
      this.$emit("search-right-icon-click", event);
    },
    // onSearch(value) {
    //   this.$emit("search", value);
    // },
    // searchRightIconClick(event) {
    //   this.$emit("search-right-icon-click", event);
    // },
  },
};
</script>

<style lang="less" scoped>
@width: calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right));
@height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
.right-icon-popup {
  width: 100%;
  margin-top: calc(0 + env(safe-area-inset-top));
}
.hips-page {
  height: @height;
  width: @width;
  .content {
    height: calc(@height - 46px);
  }
}
</style>
