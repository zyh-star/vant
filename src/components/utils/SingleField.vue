<!--
* @description 单选框
* @fileName HipsWxSingle.vue
* @author zheng yuanhou
* @date 2024/06/26 09:12:00
!-->
<template>
  <div @click="showPopup">
    <slot>
      <van-field
        v-model="singleText"
        v-bind="$attrs"
        :disabled="disabled"
        :readonly="readonly"
        :rightIcon="rightIcon"
        name=""
        is-link
        @click-input="onClickInput"
        @click-left-icon="onClickLeftIcon"
        @click-right-icon="onClickRightIcon"
        @keydown.enter="onEnter"
      />
    </slot>
    <van-field v-show="false" v-model="radio" :name="$attrs.name" readonly />

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
        <van-radio-group v-model="radio">
          <hips-wx-card
            v-for="(item, index) in list"
            :key="index"
            :value="showValueText(item)"
            :title="showTitle(item, index)"
            @click="toggleRadio(item)"
          >
            <template #icon>
              <slot name="icon">
                <van-radio :name="initRadioName(item, valueKey)" />
              </slot>
            </template>
            <template #label>
              <slot name="label" :item="item">
                <card-label :label="labelField" :data="item" class="column" />
              </slot>
            </template>
          </hips-wx-card>
        </van-radio-group>
      </hips-wx-list>
    </van-popup>
    <van-popup
      v-if="!lookupCode && queryFields.length > 0"
      v-model="show"
      class="query"
      position="top"
      get-container="body"
      :overlay="false"
      safe-area-inset-top
    >
      <slot name="fieldType" :queryFields="queryFields" />
    </van-popup>
  </div>
</template>

<script>
import {
  Field,
  Popup,
  NavBar,
  Search,
  Icon,
  Form,
  Button,
  RadioGroup,
  Radio,
  Toast,
} from "vant";
import HipsWxList from "../HipsWxList.vue";
import HipsWxCard from "../HipsWxCard.vue";
import CardLabel from "./view/card/CardLabel.vue";
// import { isEmpty } from "lodash";
// import HipsWxSingleProps from "@/props/hips-wx-single";
import mixin from "@/mixin/single";

export default {
  // 组件名称
  name: "SingleField",
  mixins: [mixin],
  // 局部注册的组件
  components: {
    [Field.name]: Field,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [Icon.name]: Icon,
    [Form.name]: Form,
    [Button.name]: Button,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [HipsWxList.name]: HipsWxList,
    [HipsWxCard.name]: HipsWxCard,
    [CardLabel.name]: CardLabel,
  },
  // 组件状态值
  data() {
    return {
      // 控制弹窗或特定组件的显示状态
      show: false,
      radio: this.value,
      singleText: this.meaning.toString(),
    };
  },

  watch: {
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.radio = newVal;
      }
    },
    meaning(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.singleText = newVal;
      }
    },
    radio(newVal) {
      this.$emit("input", newVal);
    },
    singleText(newVal) {
      this.$emit("update:meaning", newVal);
    },
  },
  // 组件方法
  methods: {
    onScan(value) {
      this.page = 0;
      const params = {
        [this.valueKey]: value,
      };
      this.fetchData(params).then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          this.onConfirm(res[0]);
        } else {
          const { failed = false, message = "", content = [] } = res;
          if (failed) {
            Toast.fail(message);
          } else {
            if (content.length > 0) {
              this.onConfirm(content[0]);
            } else {
              Toast.fail("未查询到数据");
              this.onConfirm();
            }
          }
        }
      });
    },
    onConfirm(obj = {}) {
      this.radio = this.initRadioName(obj, this.valueKey);
      this.singleText = obj[this.textKey];
      this.$emit("confirm", obj);
    },

    // 返回一个特定的 DOM 节点，作为挂载的父节点
    getContainerPopupNode() {
      return document.querySelector(".single");
    },
    /**
     * @description: 切换单选项
     * @param {Object} item - 当前项对象
     */
    toggleRadio(item = {}) {
      try {
        const value = this.initRadioName(item, this.valueKey);
        if (value === this.radio) {
          this.onConfirm({});
        } else {
          this.onConfirm(item);
        }
        this.hiddenPopup();
      } catch (error) {
        console.error("Error in toggleRadio:", error);
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.van-field__right-icon {
  .van-icon {
    font-size: 24px;
    color: #1989fa;
  }
}
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
  }
}
.query {
  /deep/.query-form {
    .fields {
      max-height: 25vh;
      overflow: auto;
    }
  }
}
</style>
