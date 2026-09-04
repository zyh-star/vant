<!--
* @description 数据列表
* @fileName dataList.vue
* @author zheng yuanhou
* @date 2025/02/07 09:30:48
!-->
<template>
  <div class="data-list-div">
    <search-list
      ref="searchList"
      :search="search"
      @search="onRefresh"
      @search-right-icon-click="onSearchRightIconClick"
    />
    <hips-wx-list
      ref="list"
      class="data-list-container"
      :loading="loading"
      :finished="finished"
      @load="onLoad"
      @refresh="onRefresh"
    >
      <van-swipe-cell
        v-for="(item, index) in data"
        :key="index"
        stop-propagation
        @open="setPush(false)"
        @close="setPush(false)"
      >
        <wx-card
          :title="initTitle(item, index)"
          :value="initValue(item)"
          :label="label"
          :data="item"
          :class="initClassName(item)"
          :tag-props="initTagProps(item)"
          @click="onClick($event, item)"
        >
          <template #default="{ value }">
            <slot name="default" :value="value" :list="list" />
          </template>
        </wx-card>
        <template #left>
          <slot name="left" :data="item" :list="list" />
        </template>
        <template #right>
          <slot name="right" :data="item" :list="list" />
        </template>
      </van-swipe-cell>
    </hips-wx-list>
    <div v-if="btns.length > 0" class="footer">
      <btn-list ref="btnList" :value="btns" :data="data" />
    </div>
  </div>
</template>

<script>
import HipsWxList from "@/components/hips-wx-list/index.vue";
import Card from "@/components/utils/view/card/Card.vue";

import SearchList from "./SearchList.vue";
import BtnList from "./BtnList.vue";
import { SwipeCell } from "vant";

import mixin from "@/mixin/indexV3";

export default {
  // 组件名称
  name: "DataList",
  // 组件参数 接收来自父组件的数据
  props: {
    list: {
      type: Object,
      default: () => {
        return {};
      },
    },
    height: {
      type: Number,
      default: 0,
    },
    index: {
      type: [Number, undefined],
      default: undefined,
    },
  },
  mixins: [mixin],
  // 局部注册的组件
  components: {
    [HipsWxList.name]: HipsWxList,
    [Card.name]: Card,
    [SearchList.name]: SearchList,
    [BtnList.name]: BtnList,
    [SwipeCell.name]: SwipeCell,
  },
  // 组件状态值
  data() {
    return {
      h: 0,
      push: true,
    };
  },
  // 计算属性
  computed: {
    title() {
      const { title = "" } = this.list;
      return title;
    },
    value() {
      const { value = "" } = this.list;
      return value;
    },
    label() {
      const { label = "" } = this.list;
      return label;
    },
    showNumber() {
      const { showNumber = false } = this.list;
      return showNumber;
    },
    click() {
      const { click = () => {} } = this.list;
      return click;
    },
    className() {
      const { className = "" } = this.list;
      return className;
    },
    tagProps() {
      const { tagProps } = this.list;
      return tagProps;
    },
    data() {
      return this.list.data;
    },
    search() {
      return this.list.search;
    },
    btns() {
      const { btns = [] } = this.list;
      return btns;
    },
    loading: {
      get() {
        return this.list.loading;
      },
      set(flag) {
        this.list.setLoading(flag);
      },
    },
    finished: {
      get() {
        return this.list.finished;
      },
      set(flag) {
        this.list.setFinished(flag);
      },
    },
    noCatch() {
      const { noCatch = false } = this.list;
      return noCatch;
    },
  },
  activated() {
    if (this.noCatch) {
      this.onRefresh();
    }
  },
  // 组件方法
  methods: {
    onLoad() {
      if (typeof this.list.onLoad === "function") {
        this.list.onLoad();
      }
      // // 防止输入键盘隐藏页面高度
      // setTimeout(() => {
      //   this.initHeight();
      // }, 500);
    },
    setPush(flag) {
      this.push = flag;
    },
    onRefresh() {
      this.list.onRefresh();
      this.onLoad();
    },
    initTitle(data, index) {
      let title = this.showNumber ? `${index + 1}.` : "";
      title += this.getKeyValue(data, this.title);
      return title;
    },
    initValue(data) {
      let value = this.getKeyValue(data, this.value);
      return value;
    },
    initClassName(data) {
      if (typeof this.className === "function") {
        return this.className(data);
      } else if (typeof this.className === "string") {
        return this.className;
      } else {
        return "";
      }
    },
    initTagProps(data) {
      if (typeof this.tagProps === "function") {
        return this.tagProps(data);
      } else if (typeof this.tagProps === "string") {
        return { type: this.tagProps };
      } else if (typeof this.tagProps === "object") {
        return this.tagProps;
      } else {
        return "";
      }
    },
    onClick(e, data) {
      e.stopPropagation();
      if (typeof this.click === "function") {
        if (this.push) {
          this.click(data);
        } else {
          this.setPush(true);
        }
      }
    },
    initHeight() {
      let height = this.height;
      const searchList = this.$refs.searchList;
      const btnList = this.$refs.btnList;
      if (searchList) {
        height += searchList.$el.clientHeight;
      }
      if (btnList) {
        height += btnList.$el.clientHeight;
      }

      if (this.$refs.list) {
        this.$refs.list.$refs.list.$el.style.height = `${
          window.innerHeight - height
        }px`;
      }
    },
    onSearchRightIconClick(e) {
      this.$emit("search-right-icon-click", e);
    },
  },
  // 组件生成完毕后触发
  mounted() {},
};
</script>

<style lang="less" scoped>
@width: calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right));
@height: calc(
  100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 46px
);
.data-list-div {
  height: 100%;
  display: flex;
  flex-direction: column;
  .data-list-container {
    flex: 1;
    overflow: auto;
    padding-top: 1vw;
    background-color: rgba(240, 240, 240, 0.8); /* 浅灰且有一定透明度 */
    .van-swipe-cell + .van-swipe-cell {
      margin-top: 1vw;
    }
    /deep/.van-swipe-cell {
      .van-swipe-cell__left,
      .van-swipe-cell__right {
        .van-button {
          height: 100%;
        }
      }
    }
  }
  .footer {
    width: 100vw;
  }
}
// .data-list-container {
//   overflow: auto;
//   padding-top: 1vw;
//   background-color: rgba(240, 240, 240, 0.8); /* 浅灰且有一定透明度 */
//   flex: 1;
//   .van-swipe-cell + .van-swipe-cell {
//     margin-top: 1vw;
//   }
// }
// .footer {
//   display: flex;
//   width: 100%;
//   height: 50px;
//   position: fixed;
//   bottom: 0;
// }
</style>
