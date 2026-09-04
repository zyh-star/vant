<!--
* @description 
* @fileName index.vue
* @author zheng yuanhou
* @date 2025/09/01 09:00:22
!-->
<template>
  <div class="hips-page">
    <van-form v-show="showFormFlag" @submit="onSubmit">
      <van-nav-bar
        :title="title"
        :left-text="leftText"
        :right-text="rightText"
        left-arrow
        safe-area-inset-top
        @click-left="onFormClickLeft"
        @click-right="onFormClickRight"
      />
      <div v-for="(field, index) in queryFields" :key="index">
        <hips-wx-date
          v-if="typeIsDate(field)"
          v-bind="field"
          v-model="field.value"
        />
        <hips-wx-single
          v-else-if="typeIsSingle(field)"
          v-bind="field"
          v-model="field.value"
          :meaning.sync="field.meaning"
        />
        <van-field v-else v-bind="field" v-model="field.value">
          <template #right-icon>
            <van-icon
              name="scan"
              size="24"
              color="#1989fa"
              @click="fieldRightIconClick(field)"
            />
          </template>
        </van-field>
      </div>
      <footer>
        <slot name="footer" class="footer">
          <van-button block type="primary" native-type="submit">
            查询
          </van-button>
        </slot>
      </footer>
    </van-form>
    <div v-show="!showFormFlag">
      <van-nav-bar
        :title="title"
        :left-text="leftText"
        :right-text="rightText"
        left-arrow
        safe-area-inset-top
        @click-left="onClickLeft"
      />
      <div class="list">
        <hips-wx-list
          :loading="loading"
          :finished="finished"
          @load="onLoad"
          @refresh="onRefresh"
        >
          <slot>
            <van-swipe-cell
              v-for="(item, index) in list"
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
                  <slot name="card-default" :value="value" :list="list" />
                </template>
              </wx-card>
              <template #left>
                <slot name="card-left" :data="item" :list="list" />
              </template>
              <template #right>
                <slot name="card-right" :data="item" :list="list" />
              </template>
            </van-swipe-cell>
          </slot>
        </hips-wx-list>
      </div>
      <footer>
        <slot name="list-footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
import { Form, Button, NavBar, Field, SwipeCell } from "vant";
import HipsWxDate from "../hips-wx-date/index.vue";
import HipsWxSingle from "../hips-wx-single/index.vue";
import HipsWxList from "../hips-wx-list/index.vue";
import Card from "@/components/view/card/Card.vue";

import mixin from "@/mixin/index";
import debounce from "lodash.debounce";
import { bridge } from "hips-wx-utils";

export default {
  // 组件名称
  name: "HipsWxSearchToList",
  // 组件参数 接收来自父组件的数据
  props: {
    title: {
      type: String,
      default: "",
    },
    leftText: {
      type: String,
      default: "",
    },
    rightText: {
      type: String,
      default: "",
    },
    queryFields: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    finished: {
      type: Boolean,
      default: false,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    options: {
      type: Array,
      default: () => [],
    },
    cardProps: {
      type: Object,
      default: () => {},
    },
  },
  mixins: [mixin],
  // 局部注册的组件
  components: {
    [Form.name]: Form,
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Field.name]: Field,
    [HipsWxDate.name]: HipsWxDate,
    [HipsWxSingle.name]: HipsWxSingle,
    [HipsWxList.name]: HipsWxList,
    [Card.name]: Card,
    [SwipeCell.name]: SwipeCell,
  },
  // 组件状态值
  data() {
    return {
      showFormFlag: true,
      params: {},
      push: true,
    };
  },
  computed: {
    list() {
      return this.options;
    },
  },

  // 侦听器
  watch: {
    params: {
      handler() {
        this.onRefresh();
        this.onLoad();
      },
      deep: true,
    },
  },
  // 组件方法
  methods: {
    showForm() {
      this.showFormFlag = true;
    },
    hideForm() {
      this.showFormFlag = false;
    },
    onSubmit: debounce(function (event) {
      const obj = this.removeEmptyKeys(event);
      obj.pageSize = this.pageSize;
      this.params = obj;
      this.hideForm();
    }, 500),
    typeIsDate(field) {
      const { type = "" } = field;
      return [
        "date",
        "year-month",
        "month-day",
        "time",
        "datetime",
        "datehour",
      ].includes(type);
    },
    typeIsSingle(field) {
      const { type = "" } = field;
      return ["single"].includes(type);
    },
    onFormClickLeft() {
      this.$emit("click-left");
    },
    onFormClickRight() {
      this.$emit("click-right");
    },
    onClickLeft() {
      this.showForm();
    },
    removeEmptyKeys(obj) {
      return Object.fromEntries(
        Object.entries(obj).filter(
          ([key]) => key && key !== null && key !== undefined
        )
      );
    },
    onRefresh() {
      this.$emit("refresh");
    },
    onLoad() {
      if (this.loading) {
        return false;
      }

      this.$emit("load", this.params);
    },
    setPush(flag) {
      this.push = flag;
    },
    nitTitle(data, index) {
      let title = this.showNumber ? `${index + 1}.` : "";
      title += this.getKeyValue(data, this.cardProps.title);
      return title;
    },
    initValue(data) {
      let value = this.getKeyValue(data, this.cardProps.value);
      return value;
    },
    initClassName(data) {
      if (typeof this.cardProps.className === "function") {
        return this.className(data);
      } else if (typeof this.cardProps.className === "string") {
        return this.cardProps.className;
      } else {
        return "";
      }
    },
    initTagProps(data) {
      if (typeof this.cardProps.tagProps === "function") {
        return this.cardProps.tagProps(data);
      } else if (typeof this.cardProps.tagProps === "string") {
        return { type: this.cardProps.tagProps };
      } else if (typeof this.cardProps.tagProps === "object") {
        return this.cardProps.tagProps;
      } else {
        return "";
      }
    },
    onClick: debounce(function (e, data) {
      e.stopPropagation();
      if (typeof this.cardProps.click === "function") {
        if (this.push) {
          this.cardProps.click(data);
        } else {
          this.setPush(true);
        }
      }
    }, 500),
    fieldRightIconClick: debounce(async function (field) {
      const res = await bridge.scan();
      field.value = res;
    }, 500),
  },
};
</script>

<style lang="less" scoped>
@height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));

footer {
  width: 100%;
  position: absolute;
  bottom: calc(0 + env(safe-area-inset-bottom));
}
.list:not(:has(+ footer:not(:empty))) {
  .van-list {
    height: calc(@height - 50px);
    overflow-y: auto;
  }
  /deep/ .van-list {
    height: calc(@height - 50px);
    overflow-y: auto;
  }
}
.list:has(+ footer:not(:empty)) {
  .van-list {
    height: calc(@height - 50px - 44px);
    overflow-y: auto;
  }
  /deep/ .van-list {
    height: calc(@height - 50px - 44px);
    overflow-y: auto;
  }
}
</style>
