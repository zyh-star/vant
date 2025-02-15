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
    <div v-if="!load">
      <div v-if="type === 'list'">
        <data-list ref="dataList" :list="list" :height="height">
          <template #default="{ value }">
            <slot name="default" :value="value" />
          </template>
        </data-list>
      </div>
      <div v-else-if="type === 'tabs'">
        <tabs-list ref="tabList" :tabs="tabs" :height="height">
          <template #default="{ value }">
            <slot name="default" :value="value" />
          </template>
        </tabs-list>
      </div>
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
.right-icon-popup {
  width: 100%;
  margin-top: calc(0 + env(safe-area-inset-top));
}
/deep/.content {
  > div.list {
    height: 100%;
    > div.van-pull-refresh {
      height: 100%;
      > div.van-pull-refresh__track {
        > .van-list {
          height: 100%;
          background-color: rgba(240, 240, 240, 0.8); /* 浅灰且有一定透明度 */

          .van-swipe-cell {
            .van-button {
              height: 100%;
            }
          }
          > div + div {
            margin-top: 2vw;
          }
        }
      }
    }
  }
  > div.tabs {
    height: 100%;
    > .van-tabs {
      height: 100%;
      > .van-tabs__content {
        height: calc(100% - 44px);
        > .van-tabs__track {
          > .van-tab__pane-wrapper {
            > .van-tab__pane {
              height: 100%;
              > div.van-pull-refresh {
                height: 100%;
                > div.van-pull-refresh__track {
                  > .van-list {
                    height: 100%;
                    background-color: rgba(
                      240,
                      240,
                      240,
                      0.8
                    ); /* 浅灰且有一定透明度 */
                    .van-swipe-cell {
                      .van-button {
                        height: 100%;
                      }
                    }

                    > div + div {
                      margin-top: 2vw;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
