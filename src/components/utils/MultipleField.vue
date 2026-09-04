<!--
* @description 多选框
* @fileName hips-wx-single/index.vue
* @author zheng yuanhou
* @date 2024/06/26 09:12:00
!-->
<template>
  <div @click="showPopup">
    <slot>
      <van-field
        v-bind="$attrs"
        v-model="meaningText"
        name=""
        :disabled="disabled"
        :readonly="readonly"
        :rightIcon="rightIcon"
        is-link
        @click="onClick"
        @click-input="onClickInput"
        @click-left-icon="onClickLeftIcon"
        @click-right-icon="onClickRightIcon"
        @keydown.enter="onEnter"
      />
    </slot>
    <van-field
      v-show="false"
      v-model="checkText"
      :name="$attrs.name"
      readonly
    />
    <van-popup
      ref="popup"
      class="multiple"
      v-model="show"
      position="bottom"
      get-container="body"
      :style="{ height: '50%' }"
      safe-area-inset-bottom
    >
      <hips-wx-list
        :loading="loading"
        :finished="finished"
        @load="onLoad"
        @refresh="onRefresh"
      >
        <van-checkbox-group v-model="checked">
          <hips-wx-card
            v-for="(item, index) in list"
            :key="index"
            :title="showTitle(item, index)"
            @click="toggleCheck(item)"
          >
            <template #icon>
              <slot name="icon">
                <van-checkbox
                  ref="checkboxes"
                  :name="initRadioName(item, valueKey)"
                  shape="square"
                />
              </slot>
            </template>
            <!-- <template #label>
              <slot name="label" :item="item"></slot>
            </template> -->
            <template #label>
              <card-label :label="labelField" :data="item" class="column" />
            </template>
          </hips-wx-card>
        </van-checkbox-group>
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
  CheckboxGroup,
  Checkbox,
  Toast,
} from "vant";
import HipsWxList from "../hips-wx-list/index.vue";
import HipsWxCard from "../hips-wx-card/index.vue";
import CardLabel from "../view/card/CardLabel.vue";
import mixin from "@/mixin/single";

export default {
  // 组件名称
  name: "MultipleField",
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
    [HipsWxList.name]: HipsWxList,
    [HipsWxCard.name]: HipsWxCard,
    [CardLabel.name]: CardLabel,
  },
  // 组件状态值
  data() {
    return {
      // 控制是否显示某个组件或弹窗
      show: false,
      // 存储选中的项
      checked: this.value === "" ? [] : this.value.split(","),
      checkText: this.value.toString(),
      meanings: this.meaning === "" ? [] : this.meaning.split(","),
      meaningText: this.meaning.toString(),
      checks: [],
    };
  },
  watch: {
    checked(newVal) {
      this.checkText = newVal.filter((item) => item !== "").join(",");
    },
    meanings(newVal) {
      this.meaningText = newVal.filter((item) => item !== "").join(",");
    },
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.checkText = newVal;
      }
    },
    meaning(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.meaningText = newVal;
      }
    },
    checkText(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.checked = newVal.split(",");
        this.$emit("input", newVal);
      }
    },
    meaningText(newVal, oldVal) {
      if (oldVal !== newVal) {
        this.meanings = newVal.split(",");
        this.$emit("update:meaning", newVal);
      }
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
          this.onConfirm(res);
        } else {
          const { failed = false, message = "", content = [] } = res;
          if (failed) {
            Toast.fail(message);
          } else {
            if (content.length > 0) {
              this.onConfirm(content);
            } else {
              Toast.fail("未查询到数据");
              this.onConfirm();
            }
          }
        }
      });
    },
    onConfirm(array = []) {
      const checked = [];
      const meanings = [];
      const checks = [];
      for (let i = 0; i < array.length; i++) {
        const value = array[i][this.valueKey];
        const text = array[i][this.textKey];
        checked.push(value);
        meanings.push(text);
        checks.push(array[i]);
      }
      this.checked = checked;
      this.meanings = meanings;
      this.checks = checks;
      this.$emit("confirm", this.checks);
    },
    /**
     * 切换多选框状态
     * 此函数用于反转给定项的选中状态如果项已选中，则取消选中；如果未选中，则选中
     * 它还负责更新相关的数据结构以反映此项的选中状态变化
     * @param {Object} item - 需要切换选中状态的项
     */
    toggleCheck(item) {
      try {
        const value = item[this.valueKey].toString();
        const meaning = item[this.textKey].toString();
        const index = this.checked.findIndex(
          (item) => item.toString() === value
        );
        if (index > -1) {
          this.checked.splice(index, 1);
          this.meanings.splice(index, 1);
          this.checks.splice(index, 1);
        } else {
          this.checked.push(value);
          this.meanings.push(meaning);
          this.checks.push(item);
        }
        this.$emit("confirm", this.checks);
      } catch (error) {
        console.error("Error in toggleCheck:", error);
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
/deep/.van-field__right-icon {
  .van-icon {
    font-size: 24px;
    color: #1989fa;
  }
}
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
      max-height: 25vh;
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
