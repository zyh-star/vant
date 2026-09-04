<!--
* @description 按钮列表
* @fileName BtnList.vue
* @author zheng yuanhou
* @date 2024/12/30 13:48:46
!-->
<template>
  <div class="btns">
    <van-button
      v-for="(item, index) in btns"
      v-bind="item"
      :key="index"
      @click="item.click && item.click()"
    >
      {{ i18n(item.text) }}
    </van-button>
    <van-popup
      v-model="show"
      position="bottom"
      get-container="body"
      safe-area-inset-bottom
    >
      <van-button
        v-for="(item, index) in moreBtns"
        v-bind="item"
        :key="index"
        @click="item.click && item.click()"
      >
        {{ i18n(item.text) }}
      </van-button>
    </van-popup>
  </div>
</template>

<script>
import { Button, Popup } from "vant";
import mixin from "@/mixin/index";
export default {
  // 组件名称
  name: "BtnList",
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    data: {
      type: [Object, Array],
      default: () => {
        return [];
      },
    },
    form: {
      type: [Object, undefined],
      default: undefined,
    },
  },
  mixins: [mixin],
  // 局部注册的组件
  components: {
    [Button.name]: Button,
    [Popup.name]: Popup,
  },
  data() {
    return {
      show: false,
    };
  },
  // 计算属性
  computed: {
    btns() {
      const length = this.value.length;
      let array = this.value;
      if (length > 3) {
        array = this.value.slice(0, 2);
        array.push("more");
      }
      return array.map((item) => this.initBtn(item));
    },
    moreBtns() {
      return this.value.map((item) => this.initBtn(item));
    },
  },
  methods: {
    initBtn(item) {
      if (typeof item === "object") {
        const { click, ..._item } = item;
        return {
          ..._item,
          click: () => {
            if (typeof click === "function") {
              click(this.data);
            }
          },
        };
      } else if (typeof item === "string") {
        switch (item) {
          case "reset":
            return {
              size: "large",
              nativeType: "reset",
              text: "重置",
              click: () => {
                this.form && this.form.$el.reset();
                this.$emit("reset");
              },
            };
          case "search":
            return {
              size: "large",
              type: "info",
              nativeType: "submit",
              text: "查询",
              click: () => {
                this.form && this.form.submit();
              },
            };
          case "submit":
            return {
              size: "large",
              type: "info",
              nativeType: "submit",
              text: "提交",
              click: () => {
                this.form && this.form.submit();
              },
            };
          case "more":
            return {
              size: "large",
              nativeType: "button",
              text: "更多",
              click: () => {
                this.show = true;
              },
            };
          default:
            return {
              size: "large",
              nativeType: "button",
              type: "warning",
              text: item,
            };
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.btns {
  display: flex;
  width: 100%;
  // position: fixed;
  // bottom: 0;
  .van-button {
    flex: 1;
  }
}
.van-popup {
  width: 100vw;
  max-height: 40vh;
  overflow-y: auto;
}
</style>
