<!--
* @description 单选框
* @fileName SingleField.vue
* @author zheng yuanhou
* @date 2025/01/20 15:46:01
!-->
<template>
  <div>
    <van-field
      v-bind="$attrs"
      v-model="text"
      :label="label"
      :disabled="_disabled"
      :readonly="!showInput"
      is-link
      @click="showSingle"
      @click-input="onInput"
      @click-right-icon="onRightIcon"
      @keydown.enter="onEnter"
    >
      <template v-if="$attrs.showScan" #right-icon>
        <van-icon name="scan" size="24" color="#1989fa" />
      </template>
    </van-field>
    <van-popup
      ref="popup"
      class="single"
      v-model="show"
      position="bottom"
      :style="{ height: '50%' }"
      get-container="body"
      safe-area-inset-bottom
    >
      <hips-wx-list
        :loading="loading"
        :finished="finished"
        @load="onLoad"
        @refresh="onRefresh"
      >
        <van-radio-group v-model="radio" icon-size="24">
          <wx-card
            v-for="(item, index) in list"
            :key="index"
            :title="initCardTitle(item)"
            :value="initCardValue(item)"
            :label="initCardLabels()"
            :data="item"
            @click.stop="(event) => onRadio(event, item)"
          >
            <template #icon>
              <slot name="icon">
                <van-radio :name="initRadioName(item, valueKey)" />
              </slot>
            </template>
          </wx-card>
        </van-radio-group>
      </hips-wx-list>
    </van-popup>
    <slot v-if="queryFields" name="query" :queryFields="queryFields"></slot>
  </div>
</template>

<script>
import { bridge, instance } from "hips-wx-utils";
// import field from "./field.js";
import valueSet from "./valueSet.js";

import HipsWxList from "@/components/hips-wx-list/index.vue";
import WxCard from "../card/Card.vue";
import { Field, Icon, Popup, Radio, RadioGroup } from "vant";

export default {
  // 组件名称
  name: "SingleField",
  mixins: [valueSet],
  components: {
    [HipsWxList.name]: HipsWxList,
    [WxCard.name]: WxCard,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Field.name]: Field,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
  },
  // 组件参数 接收来自父组件的数据
  props: {
    label: {
      type: String,
      default() {
        return "";
      },
    },
    value: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  // 组件状态值
  data() {
    return {
      text: "",
      radio: "",
      // queryParameter: null,
      queryParameterWatch: null,
      t: null,
    };
  },
  computed: {
    _disabled() {
      if (typeof this.disabled === "function") {
        return this.disabled(this.allQueryParameter);
      }
      return this.disabled;
    },
    _cascadesQueryParameter() {
      if (!this.cascadesQueryParameter) {
        return {};
      } else {
        return this.cascadesQueryParameter;
      }
    },
  },
  watch: {
    _cascadesQueryParameter: {
      handler() {
        this.onReset();
        this.onRefresh();
      },
      deep: true,
    },
  },
  // 组件方法
  methods: {
    initTextAndValue() {
      if (typeof this.value === "object") {
        this.text = this.value[this.textKey];
        this.radio = this.value[this.valueKey];
      } else {
        this.text = "";
        this.radio = "";
      }
    },
    onInput(event) {
      if (this.showInput) {
        event.stopPropagation();
      }
    },
    onRightIcon(event) {
      event.stopPropagation();
      bridge.scan().then((res) => {
        this.text = res;
        this.onEnter();
      });
    },
    onReset() {
      this.radio = "";
      this.text = "";
      this.updataBinds({});
    },
    onEnter(event) {
      const value = this.text;
      if (["lookupCode", "data"].includes(this.type)) {
        const data = this.list.find((item) => {
          return item[this.valueKey] === value;
        });
        if (data) {
          this.onRadio(event, data);
        } else {
          this.onRadio(event);
        }
      } else {
        const url = this.url;
        instance.get(url, { [this.valueKey]: value }).then((res) => {
          if (typeof res === "object") {
            if (Array.isArray(res)) {
              if (res.length > 0) {
                this.onRadio(event, res[0]);
              } else {
                this.onRadio(event);
              }
            } else {
              const { content = [] } = res;
              if (Array.isArray(content)) {
                if (content.length > 0) {
                  this.onRadio(event, content[0]);
                } else {
                  this.onRadio(event);
                }
              }
            }
          } else {
            this.onRadio(event);
          }
        });
      }
    },

    onRadio(event, obj = {}) {
      try {
        event.stopPropagation && event.stopPropagation();
      } finally {
        const value = this.initRadioName(obj, this.valueKey);
        if (this.radio === value) {
          this.radio = "";
          this.text = "";
          this.updataBinds({});
        } else {
          this.radio = value;
          this.text = this.initRadioName(obj, this.textKey);
          this.updataBinds(obj);
        }
        this.hiddenSingle();
      }
    },
    updataBinds(obj) {
      this.$emit("confirm", obj);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.van-list {
  height: 50vh;
  background-color: rgba(204, 204, 204, 0.5);
  .van-radio-group {
    .van-cell {
      .van-radio {
        margin-right: 2vw;
      }
    }
    .card + .card {
      margin-top: 1px;
    }
    .card {
      .van-cell:first-child {
        // font-weight: bold;
        > .van-cell__title {
          font-weight: bold;
        }
        // font-size: 16px;
      }
      .van-cell + .van-cell {
        margin-top: -1px;
      }
    }
  }
}
</style>
