<!--
* @description 轮播
* @fileName index.vue
* @author zheng yuanhou
* @date 2024/12/26 15:02:48
!-->
<template>
  <div>
    <van-cell title="检查项" class="title">
      <template #right-icon>
        <van-icon
          name="wap-nav"
          size="24"
          :class="`icon-y ${y ? 'checked' : 'unChecked'}`"
          @click="toggleChecked('y')"
        />
        <van-icon
          name="wap-nav"
          size="24"
          :class="`icon-x ${x ? 'checked' : 'unChecked'}`"
          @click="toggleChecked('x')"
        />
      </template>
    </van-cell>
    <div v-if="y">
      <div class="content">
        <div v-for="(item, index) in data" :key="index">
          <slot :data="item"></slot>
        </div>
      </div>
    </div>
    <div v-else-if="x">
      <van-swipe ref="swipe" class="my-swipe" @change="onChangeActive">
        <van-swipe-item v-for="(item, index) in data" :key="index">
          <slot :data="item"></slot>
        </van-swipe-item>
        <template #indicator>
          <div class="custom-indicator">{{ active + 1 }}/{{ data.length }}</div>
        </template>
      </van-swipe>
      <van-pagination
        v-model="currentPage"
        :page-count="data.length"
        :show-page-size="5"
        force-ellipses
        @change="onChangeCurrentPage"
      >
        <template #prev-text>
          <van-icon name="arrow-left" />
        </template>
        <template #next-text>
          <van-icon name="arrow" />
        </template>
        <template #page="{ text }">
          {{ text }}
        </template>
      </van-pagination>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
import { Cell, Icon, Swipe, SwipeItem, Pagination } from "vant";

export default {
  // 组件名称
  name: "HipsWxSwipe",
  // 组件参数 接收来自父组件的数据
  props: {
    title: {
      type: String,
      default: "",
    },
    // offsetTop: {
    //   type: [Number, String],
    //   default: 0,
    // },
    data: {
      type: Array,
      default: () => [],
    },
  },
  // 局部注册的组件
  components: {
    [Cell.name]: Cell,
    [Icon.name]: Icon,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Pagination.name]: Pagination,
  },
  // 组件状态值
  data() {
    return {
      y: true,
      x: false,
      active: 0,
      currentPage: 1,
    };
  },
  // 组件方法
  methods: {
    toggleChecked(key) {
      this.x = key === "x";
      this.y = !this.x;
    },
    onChangeActive(index) {
      this.active = index;
      this.currentPage = this.active + 1;
    },
    onChangeCurrentPage() {
      this.active = this.currentPage - 1;
      this.$refs.swipe.swipeTo(this.active);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.title {
  .van-cell__title {
    font-weight: bold;
  }
  .icon-x {
    transform: rotate(90deg);
  }
  .checked {
    border: 1px solid rgba(150, 151, 153, 0.5);
  }
  .unChecked {
    border: 1px solid rgba(150, 151, 153, 0.1);
  }
}
.content {
  max-height: 50vh;
  overflow-y: auto;
}
.my-swipe .van-swipe-item {
  padding-bottom: 10px;
}
.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
}
</style>
