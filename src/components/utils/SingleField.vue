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
        v-model="radioMeaning"
        :disabled="_disabled"
        :label="_label"
        :input-align="inputAlign"
        :required="required"
        :rules="rules"
        :error="error"
        :placeholder="placeholder"
        :name="meaningName"
        readonly
        is-link
      />
      <van-field v-show="false" v-model="radio" :name="name" readonly />
    </slot>

    <van-popup
      ref="popup"
      class="single"
      v-model="show"
      position="bottom"
      :style="{ height: '50%' }"
      :get-container="getContainer"
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
            :title="showTitle(item, index)"
            :value="item[checkValue]"
            @click="toggleRadio(item)"
          >
            <template #icon>
              <slot name="icon">
                <van-radio :name="initRadioName(getRadio(item))" />
              </slot>
            </template>
            <template #label>
              <slot name="label" :item="item"></slot>
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
      :get-container="getContainer"
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
} from "vant";
import HipsWxList from "../HipsWxList.vue";
import HipsWxCard from "../HipsWxCard.vue";
import { isEmpty } from "lodash";
import HipsWxSingleProps from "@/props/hips-wx-single";
import mixin from "@/mixin";

export default {
  // 组件名称
  name: "SingleField",
  // 组件参数 接收来自父组件的数据
  props: HipsWxSingleProps,
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
  },
  // 组件状态值
  data() {
    return {
      // 控制弹窗或特定组件的显示状态
      show: false,
    };
  },
  // 计算属性
  computed: {
    /**
     * 返回当前组件的标签文本
     * 如果当前组件的 label 属性存在，则返回 label，否则返回 title
     */
    _label() {
      return this.label || this.title;
    },
    _checkTitle() {
      if (this.checkTitle) {
        return this.checkTitle;
      }
      return this.displayField;
    },

    /**
     * 检查并返回适当的 radio 值
     * 此函数首先检查 checkRadio 属性是否为空字符串、null 或 undefined
     * 如果 checkRadio 不符合上述条件，则返回 checkValue
     * 否则，返回 checkRadio
     */
    _checkRadio() {
      // 获取 checkRadio 和 checkValue 的值，减少多次访问对象属性的开销
      const checkRadio = this.checkRadio;
      const checkValue = this.checkValue;
      const valueField = this.valueField;
      if (checkRadio) {
        return checkRadio;
      }
      if (valueField) {
        return valueField;
      }
      return checkValue;
    },

    /**
     * 计算并返回当前组件的禁用状态
     * 此函数通过一系列检查来确定组件是否应被禁用
     */
    _disabled() {
      if (this.disabled) {
        return this.disabled;
      }
      // 确保 this.cascades 是一个有效的对象或数组
      const cascades = this.cascades || {};

      // 使用 Object.values 和 some 方法来检查是否有 undefined, null, "" 的值
      const flag = Object.values(cascades).some((value) => isEmpty(value));

      // 如果 flag 为真或组件被禁用，则返回 true，否则返回 false
      return flag;
    },
    radio: {
      get() {
        return this.initRadioName(this.value);
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    radioMeaning: {
      get() {
        return this.meaning;
      },
      set(value) {
        this.$emit("update:meaning", value);
      },
    },
  },
  watch: {
    cascades: {
      handler(newValue, oldValue) {
        if (this.isJsonEqual(newValue, oldValue)) {
          return false;
        }
        let flag = false;
        for (let key in oldValue) {
          if (!isEmpty(oldValue[key])) {
            flag = true;
          }
        }

        if (!flag) {
          return false;
        }
        this.radio = "";
        this.radioMeaning = "";
        this.onRefresh();
      },
      deep: true,
    },
    show(value) {
      if (!value) {
        return false;
      }
      this.popupFirstShow = true;
    },
  },
  created() {
    // console.log(this.$props);

    this.initQueryUrl();
  },
  // 组件方法
  methods: {
    /**
     * @description: 点击左侧按钮时触发
     * @return {*}
     */
    onClickLeft() {
      this.hiddenPopup();
      this.$emit("click-left");
    },

    /**
     * @description: 点击右侧按钮时触发
     * @return {*}
     */
    onClickRight() {
      this.hiddenPopup();
      this.$emit("click-right");
    },

    /**
     * @description: 显示弹出层
     * @return {boolean} 返回一个布尔值，表示弹出层是否应该显示
     */
    showPopup() {
      const flag = this.beforeShowPopup();
      if (flag) {
        if (this.list.length === 1 && this.autoSelectSingle) {
          this.toggleRadio(this.list[0]);
        } else {
          this.show = true;
        }
      }
    },

    /**
     * @description: 隐藏弹出层
     * @return {*}
     */
    hiddenPopup() {
      const flag = this.beforeHiddenPopup();
      if (flag) {
        this.show = false;
      }
    },
    /**
     * 防止数字导致选择不生效
     */
    initRadioName(value) {
      return value;
    },

    /**
     * @description: 加载数据
     * @return {Promise} 返回一个Promise对象，表示数据加载的过程
     */
    onLoad() {
      return new Promise((resolve, reject) => {
        // 如果存在默认数据，则直接赋值并返回
        if (this.singleData) {
          this.initSingleData();
          resolve();
          return false;
        }

        // 如果不是第一次打开，则直接返回
        if (!this.popupFirstShow) {
          resolve();
          return false;
        }

        // 如果正在加载数据，则直接返回
        if (this.loading) {
          resolve();
          return false;
        }
        this.loading = true;

        this.fetchData()
          .then((res) => {
            this.handleResponse(res);
            resolve();
          })
          .catch((error) => {
            this.contentIsFailed(error.message);
            reject(error);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },

    /**
     * @description: 获取单选值
     * @param {Object} obj - 当前项对象
     * @return {string|*} - 单选值字符串或原始值
     */
    getRadio(obj = {}) {
      const radioKeys = this["_checkRadio"];

      // 检查 _checkRadio 是否存在且类型正确
      if (typeof radioKeys === "undefined" || radioKeys === null) {
        console.error("_checkRadio is not defined or null");
        return "";
      }

      // 检查 radioKeys 是否为数组
      if (Array.isArray(radioKeys)) {
        // 验证数组内容
        if (!radioKeys.every((key) => typeof key === "string")) {
          console.error("Invalid keys in _checkRadio array");
          return "";
        }

        // 使用 reduce 方法构建字符串
        const str = radioKeys.reduce((acc, key) => {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return acc + (acc ? "-" : "") + obj[key];
          } else {
            console.warn(`Key ${key} does not exist in the object`);
            return acc;
          }
        }, "");
        return str;
      }

      // 检查单个键是否存在
      if (
        typeof radioKeys === "string" &&
        Object.prototype.hasOwnProperty.call(obj, radioKeys)
      ) {
        return obj[radioKeys];
      }

      // 异常处理
      console.error("Invalid _checkRadio value");
      return "";
    },

    /**
     * @description: 切换单选项
     * @param {Object} item - 当前项对象
     */
    toggleRadio(item = {}) {
      try {
        const checkTitle = this._checkTitle || "";
        if (!item || !Object.keys(item).length) {
          // 如果 item 是空对象或 undefined
          return;
        }
        const radioValue = this.initRadioName(this.getRadio(item));
        const titleValue = item[checkTitle];

        if (this.radio === radioValue) {
          this.radio = "";
          this.radioMeaning = "";
          this.$emit("confirm", {});
        } else {
          this.radio = radioValue;
          this.radioMeaning = titleValue;
          this.$emit("confirm", item);
        }

        this.hiddenPopup();
      } catch (error) {
        console.error("Error in toggleRadio:", error);
      }
    },

    // 返回一个特定的 DOM 节点，作为挂载的父节点
    getContainerPopupNode() {
      return document.querySelector(".single");
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
  }
}
.query {
  .van-form {
    > div:first-child {
      max-height: 20vh;
      overflow-y: auto;
    }
    > div:last-child {
      display: flex;
      .van-button {
        flex: 1;
      }
    }
  }
}
</style>
