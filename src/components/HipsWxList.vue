<!--
* @description 列表
* @fileName HipsWxList.vue
* @author zheng yuanhou
* @date 2024/06/26 09:15:19
!-->
<template>
  <van-pull-refresh v-model="refresh" :disabled="disabled" @refresh="onRefresh">
    <van-list
      ref="list"
      v-model="_loading"
      :finished="_finished"
      :finished-text="finishedText"
      @load="onLoad"
    >
      <slot />
    </van-list>
  </van-pull-refresh>
</template>

<script>
import { List, PullRefresh } from "vant";

export default {
  // 组件名称
  name: "HipsWxList",
  // 组件参数 接收来自父组件的数据
  props: {
    // van-list是否处于加载中
    loading: {
      type: Boolean,
      default: false,
    },
    // van-list是否加载完毕
    finished: {
      type: Boolean,
      default: false,
    },
    finishedText: {
      type: String,
      default: "没有更多了",
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  // 局部注册的组件
  components: {
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
  },
  // 组件状态值
  data() {
    return {
      refresh: false,
      disabled: false,
    };
  },
  // 计算属性
  computed: {
    _loading: {
      get() {
        return this.loading;
      },
      set(v) {
        this.$emit("update:loading", v);
      },
    },
    _finished: {
      get() {
        return this.finished;
      },
      set(v) {
        this.$emit("update:finished", v);
      },
    },
  },

  // 组件方法
  methods: {
    onRefresh() {
      this.$emit("refresh");
      this.refresh = false;
      this._loading = true;
      this._finished = false;
      this.onLoad();
    },
    onLoad() {
      this.$emit("load");
    },
    onScroll(e) {
      this.disabled = e.target.scrollTop !== 0;
    },
    init() {
      this.$refs.list.$el.addEventListener("scroll", this.onScroll);
    },
    uninit() {
      this.$refs.list.$el.removeEventListener("scroll", this.onScroll);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  beforeDestroy() {
    this.uninit();
  },
};
</script>

<style lang="less" scoped>
.van-list {
  overflow: auto;
  height: 100vh;
}
</style>
