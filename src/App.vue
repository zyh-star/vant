<template>
  <HipsWxPage
    title="Demo"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template #title-right></template>
    <template #footer></template>
    <!-- <HipsWxCard title="demo" value="10" @click="show1 = !show1">
      <template #label>
        <div class="flex">
          <div>1</div>
          <div>2</div>
        </div>
      </template>
      <template #title>
        <div class="title">111</div>
      </template>
      <van-tag>111</van-tag>
    </HipsWxCard> -->
    <!-- <HipsWxDialog title="dialog" v-model="show">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
    </HipsWxDialog>
    <HipsWxFloatBtn v-if="show1"></HipsWxFloatBtn> -->
    <!-- <HipsWxList
      :loading="loading"
      :finished="finished"
      @load="onLoad"
      @refresh="onRefresh"
    >
      <van-cell v-for="item in list" :key="item" :title="item" />
    </HipsWxList> -->
    <!-- <HipsWxSingle
      v-model="value"
      :meaning.sync="meaning"
      title="demo"
      lovCode="LOV_UNIT"
      checkTitle="unitName"
      checkRadio="unitId"
      @reset="onReset"
    >
      <template #search>
        <van-field name="demo" label="demo" v-model="demo"></van-field>
      </template>
      <template #label="{ item }">
        <div class="flex">
          <div>{{ item.unitName }}</div>
          <div>{{ item.unitId }}</div>
        </div>
      </template>
    </HipsWxSingle> -->
    <!-- <HipsWxUpload v-model="list" bucketName="asset-manage-app"></HipsWxUpload> -->
    <hips-wx-multiple
      v-model="value"
      :meaning.sync="meaning"
      :singleData="list"
      checkTitle="meaning"
      checkRadio="value"
    ></hips-wx-multiple>
  </HipsWxPage>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import HipsWxPage from "./components/HipsWxPage.vue";
// import HipsWxCard from "./components/HipsWxCard.vue";
// import HipsWxDialog from "./components/HipsWxDialog.vue";
// import HipsWxFloatBtn from "./components/HipsWxFloatBtn.vue";
// import HipsWxList from "./components/HipsWxList.vue";
// import HipsWxUpload from "./components/HipsWxUpload.vue";
// import { Field, Tag } from "vant";
// import HipsWxSingle from "./components/HipsWxSingle.vue";
import { bridge } from "hips-wx-utils";
// import HipsWxDates from "./components/HipsWxDates.vue";
import HipsWxMultiple from "./components/HipsWxMultiple.vue";

export default {
  name: "App",
  components: {
    // HelloWorld
    HipsWxPage,
    // HipsWxCard,
    // HipsWxDialog,
    // HipsWxFloatBtn,
    // HipsWxList,
    // [Field.name]: Field,
    // [Tag.name]: Tag,
    // HipsWxSingle,
    // HipsWxUpload,
    // HipsWxDates,
    HipsWxMultiple,
  },
  data() {
    return {
      show1: false,
      meaning: "",
      value: "",
      demo: "",
      list: [
        {
          meaning: "1",
          value: "1",
        },
        {
          meaning: "2",
          value: "2",
        },
        {
          meaning: "3",
          value: "3",
        },
      ],
    };
  },
  methods: {
    onClickLeft() {
      console.log("left");
    },
    onClickRight() {
      console.log("right");
    },
    onRefresh() {
      this.list = [];
    },
    onReset() {
      this.demo = "";
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        this.loading = false;

        if (this.list.length >= 40) {
          this.finished = true;
        } else {
          this.finished = false;
        }
      }, 1000);
    },
  },
  created() {
    bridge.getBaseInfo();
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.title {
  font-weight: bold;
}
.flex {
  display: flex;
  justify-content: space-between;
}
</style>
