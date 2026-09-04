<!--
* @description 1
* @fileName CardLabel.vue
* @author zheng yuanhou
* @date 2024/12/13 11:52:30
!-->
<template>
  <div>
    <div v-if="type === 'string'">
      {{ getKeyValue(data, label) }}
    </div>
    <div v-else-if="type === 'function'" v-html="getKeyValue(data, label)" />
    <div v-else-if="type === 'array'">
      <card-label
        v-for="(_label, i) in label"
        :key="i"
        :label="_label"
        :data="data"
        :index="index + 1"
        :class="`between${index}`"
      />
    </div>
    <div
      v-else-if="type === 'object'"
      v-bind="label"
      :class="initClassName(data, label)"
    >
      {{ getKeyValue(data, label.key) }}
    </div>
    <div v-else></div>
  </div>
</template>

<script>
import mixin from "@/mixin/index";

export default {
  // 组件名称
  name: "CardLabel",
  // 组件参数 接收来自父组件的数据
  props: {
    label: {
      type: [String, Array, Object, Function],
      default: "",
    },
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  mixins: [mixin],
  // 计算属性
  computed: {
    type() {
      if (typeof this.label === "string") {
        return "string";
      } else if (typeof this.label === "object") {
        if (Array.isArray(this.label)) {
          return "array";
        }
        return "object";
      } else if (typeof this.label === "function") {
        return "function";
      } else if (typeof this.label === "number") {
        return "number";
      }
      return "";
    },
  },
  methods: {
    isClosedTag(str) {
      if (typeof str !== "string") return false;
      const regex = /^<([a-zA-Z]+)(?:\s+[^>]*)?>.*?<\/\1>$/s;
      return regex.test(str);
    },
  },
};
</script>

<style lang="less" scoped>
.column {
  width: 100%;
}
.column > div {
  display: flex;
  flex-direction: column;
}
.between0 > div {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.between1 {
  flex: 1;
}
.between1 + .between1 > div {
  display: flex;
  justify-content: center;
}
.between1:last-child > div {
  display: flex;
  justify-content: flex-end;
}
.between1:first-child > div {
  display: flex;
  justify-content: flex-start;
}
.between2 {
  display: flex;
}
.red {
  color: red;
}
.yellow {
  color: yellow;
}
.lightgreen {
  color: lightgreen;
}
.lightblue {
  color: lightblue;
}
</style>
