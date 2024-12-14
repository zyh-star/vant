<!--
* @description 多选框
* @fileName HipsWxSingle.vue
* @author zheng yuanhou
* @date 2024/06/26 09:12:00
!-->
<template>
  <div @click="showPopup">
    <slot>
      <van-field
        v-model="meaning"
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
      <van-field v-show="false" v-model="value" :name="name" readonly />
    </slot>
    <van-popup
      ref="popup"
      class="multiple"
      v-model="show"
      position="bottom"
      :style="{ height: '50%' }"
      :get-container="getContainer"
      safe-area-inset-bottom
    >
      <HipsWxList
        :loading="loading"
        :finished="finished"
        @load="onLoad"
        @refresh="onRefresh"
      >
        <van-checkbox-group v-model="checked">
          <HipsWxCard
            v-for="(item, index) in list"
            :key="index"
            :title="showTitle(item, index)"
            :value="item[checkValue]"
            @click="toggleRadio(index, item)"
          >
            <template #icon>
              <slot name="icon">
                <van-checkbox
                  ref="checkboxes"
                  :name="initRadioName(getRadio(item))"
                  shape="square"
                />
              </slot>
            </template>
            <template #label>
              <slot name="label" :item="item"></slot>
            </template>
          </HipsWxCard>
        </van-checkbox-group>
      </HipsWxList>
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
  CheckboxGroup,
  Checkbox,
} from "vant";
import HipsWxList from "../HipsWxList.vue";
import HipsWxCard from "../HipsWxCard.vue";
import { isEmpty } from "lodash";
import HipsWxMultipleProps from "@/props/hips-wx-multiple";
import mixin from "@/mixin";

export default {
  // 组件名称
  name: "MultipleField",
  // 组件参数 接收来自父组件的数据
  props: HipsWxMultipleProps,
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
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
    HipsWxList,
    HipsWxCard,
  },
  // 组件状态值
  data() {
    return {
      // 控制是否显示某个组件或弹窗
      show: false,
      // 存储选中的项
      checked: [],
      meanings: new Proxy(
        {},
        {
          set: (target, property, value) => {
            // 在设置属性值之前，可以执行任何需要的逻辑
            // 设置属性值
            target[property] = value;
            this.$emit("update:meaning", this.getMeaning(target));
            // 返回成功标识
            return true;
          },
          deleteProperty: (target, property) => {
            // 在删除属性之前，可以执行任何需要的逻辑
            // 删除属性
            const v = delete target[property];
            this.$emit("update:meaning", this.getMeaning(target));
            return v;
          },
        }
      ),
    };
  },
  // 计算属性
  computed: {
    /**
     * 获取标签的文本
     * 如果label属性存在，则返回该属性的值；否则返回title属性的值
     * @returns {string} 标签的文本
     */
    _label() {
      return this.label || this.title;
    },
    _checkTitle() {
      return this.checkTitle || this.displayField;
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
  },
  // 侦听器
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
        // 清空check数组，用于存储通过校验的项
        this.checked = [];
        for (let key in this.meanings) {
          delete this.meanings[key];
        }
        this.onRefresh();
      },
      deep: true,
    },
    show(value) {
      if (!value) {
        const jsonArray = [];
        Object.keys(this.meanings).forEach((key) => {
          jsonArray.push(this.meanings[key]);
        });
        this.$emit("confirm", jsonArray);
        return false;
      }
      this.popupFirstShow = true;
      // this.listenPopupFirstShow();
    },
    checked: {
      handler(values) {
        this.$emit("input", values.join(","));
      },
      deep: true,
    },
    value(value) {
      if (value === "") {
        this.checked = [];
        return false;
      }
      this.checked = value.split(",").map((item) => this.initRadioName(item));
    },
  },
  created() {
    this.initQueryUrl();
  },
  // 组件方法
  methods: {
    /**
     * 退出
     */
    onClickLeft() {
      this.hiddenPopup();
      // this.$emit("click-left", this.checked);
    },
    /**
     * 确认
     */
    onClickRight() {
      this.hiddenPopup();
      // this.$emit("click-right", this.checked);
    },
    /**
     * @description: 显示弹出层
     * @return {boolean} 返回一个布尔值，表示弹出层是否应该显示
     */
    showPopup() {
      const flag = this.beforeShowPopup();
      if (flag) {
        if (this.list.length === 1 && this.autoSelectSingle) {
          this.toggleRadio(0);
        } else {
          this.show = true;
        }
      }
    },
    /**
     * 关闭选择层
     */
    hiddenPopup() {
      const flag = this.beforeHiddenPopup();
      if (flag) {
        this.show = false;
      }
    },
    /**
     * 防止
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
        if (this.singleData) {
          this.initSingleData();
          resolve();
          return false;
        }
        // 防止多次查询
        if (!this.popupFirstShow) {
          resolve();
          return false;
        }
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
     * 初始化radio
     */
    getRadio(obj) {
      const checkRadio = this["_checkRadio"];

      if (Array.isArray(checkRadio)) {
        const str = checkRadio.map((key) => obj[key]).join("-");
        return str;
      }
      return obj[checkRadio];
    },
    getMeaning(obj) {
      let text = "";
      for (let key in obj) {
        const _obj = obj[key];
        const value = _obj[this._checkTitle];
        if (isEmpty(value)) {
          continue;
        } else {
          text += text === "" ? obj[key] : `,${obj[key]}`;
        }
      }
      return text;
    },
    /**
     * 切换多选框状态
     * 此函数用于反转给定项的选中状态如果项已选中，则取消选中；如果未选中，则选中
     * 它还负责更新相关的数据结构以反映此项的选中状态变化
     * @param {Object} item - 需要切换选中状态的项
     */
    toggleRadio(index, item) {
      this.$refs.checkboxes[index].toggle();
      if (this.$refs.checkboxes[index].checked) {
        delete this.meanings[index];
      } else {
        // this.meanings[index] = item[this._checkTitle];
        this.meanings[index] = item;
      }
    },
    // 返回一个特定的 DOM 节点，作为挂载的父节点
    getContainerPopupNode() {
      return document.querySelector(".multiple");
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.van-list {
  height: 50vh;
  background-color: rgba(204, 204, 204, 0.5);
  .van-checkbox-group {
    .van-cell {
      .van-checkbox {
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
