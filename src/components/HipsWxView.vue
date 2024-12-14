<!--
* @description 
* @fileName demo.vue
* @author zheng yuanhou
* @date 2024/12/10 09:29:16
!-->
<template>
  <hips-wx-page
    :title="title"
    :rightText="rightText"
    @click-left="onLeft"
    @click-right="onRight"
  >
    <template v-if="rightIcon.name" #nav-bar-right>
      <van-icon v-bind="rightIcon" @click.prevent.stop="onRightIconCLick" />
    </template>
    <van-sticky v-if="search.key" :offset-top="offsetTop.search">
      <van-search v-bind="search" v-model="searchValue" @search="onSearch">
        <template v-if="search.rightIcon" #right-icon>
          <van-icon v-bind="search.rightIconProps" @click="onSearchIcon" />
        </template>
      </van-search>
    </van-sticky>
    <div v-if="type === 'list'" class="list">
      <hips-wx-list
        :loading="lists[active].loading"
        :finished="lists[active].finished"
        @load="onLoad(active)"
        @refresh="onRefresh(active)"
      >
        <div v-for="(data, index) in lists[active].data" :key="index">
          <slot :data="data">
            <hips-wx-card
              v-bind="initCard(lists[active].card)"
              :title="initCardTitle(data, lists[active].card, index)"
              :value="initCardValue(data, lists[active].card)"
            >
              <template>
                <slot
                  name="card-default"
                  :value="initCardValue(data, lists[active].card)"
                />
              </template>
              <template #label>
                <card-label
                  :label="lists[active].card.label"
                  :data="data"
                  class="column"
                />
              </template>
            </hips-wx-card>
          </slot>
        </div>
      </hips-wx-list>
    </div>
    <div v-else-if="type === 'tabs'" class="tabs">
      <van-tabs
        v-model="active"
        animated
        sticky
        :offset-top="offsetTop.tabs"
        @change="tabsChange"
      >
        <van-tab
          v-for="(item, index) in tabs"
          :key="index"
          :title="item.title"
          :badge="badges[index]"
        >
          <hips-wx-list
            :loading="lists[index].loading"
            :finished="lists[index].finished"
            @load="onLoad(index)"
            @refresh="onRefresh(index)"
          >
            <div v-for="(data, i) in lists[index].data" :key="`${index}-${i}`">
              <slot :data="data">
                <hips-wx-card
                  v-bind="initCard(lists[index].card)"
                  :title="initCardTitle(data, lists[index].card, i)"
                  :value="initCardValue(data, lists[index].card)"
                  @click="initCardClick(data, lists[index].card)"
                >
                  <template>
                    <slot
                      name="card-default"
                      :value="initCardValue(data, lists[index].card)"
                    />
                  </template>
                  <template #label>
                    <card-label
                      :label="lists[index].card.label"
                      :data="data"
                      class="column"
                    />
                  </template>
                </hips-wx-card>
              </slot>
            </div>
          </hips-wx-list>
        </van-tab>
      </van-tabs>
    </div>
    <div v-else>
      <van-empty />
    </div>
    <van-popup
      v-model="showRightIconPopup"
      position="top"
      class="right-icon-popup"
      :lazy-render="false"
    >
      <field-type
        ref="fieldType"
        v-model="queryFields"
        type="query"
        @submit="(props) => onSearch(props)"
        @failed="showShowRightIconPopup"
      />
    </van-popup>
    <template v-if="btns.length > 0" #footer>
      <btn-type v-model="btns"></btn-type>
    </template>
  </hips-wx-page>
</template>

<script>
/** ===== import ===== */
import { HipsWxPage, HipsWxList, HipsWxCard } from "../components";
import FieldType from "./utils/FieldType.vue";
import BtnType from "./utils/BtnType.vue";
import CardLabel from "./utils/CardLabel.vue";
import {
  Button,
  Icon,
  Popup,
  Form,
  Empty,
  Tab,
  Tabs,
  Sticky,
  Search,
  Toast,
} from "vant";
import { bridge, instance } from "hips-wx-utils";
/** ===== import ===== */

export default {
  // 组件名称
  name: "HipsWxView",
  /** ===== components ===== */
  components: {
    [HipsWxPage.name]: HipsWxPage,
    [HipsWxList.name]: HipsWxList,
    [HipsWxCard.name]: HipsWxCard,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Form.name]: Form,
    [Empty.name]: Empty,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Sticky.name]: Sticky,
    [Search.name]: Search,
    [FieldType.name]: FieldType,
    [BtnType.name]: BtnType,
    [CardLabel.name]: CardLabel,
  },
  /** ===== components ===== */
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          title: "",
          rightText: "",
          webView: false,
          noCache: false,
          // list | tabs
          type: "list",
          search: {
            placeholder: "",
            name: "",
            value: "",
          },
          tabs: [],
          queryFields: [],
          btns: [],
          card: {
            title: "",
            value: "",
            label: [],
          },
          transport: {
            read: "",
            submit: "",
            delete: "",
          },
        };
      },
    },
  },
  // 组件状态值
  data() {
    return {
      // 控制右侧图标弹窗的显示状态
      showRightIconPopup: false,

      // 当前激活的步骤或选项的索引
      active: 0,

      // 存储相关参数的对象
      params: {},

      // 控制加载状态的变量，通常用于显示加载中的状态或组件
      load: true,

      // 存储搜索值的变量，用于在界面上显示或处理搜索逻辑
      searchValue: "",
      badges: [],
    };
  },
  // 计算属性
  computed: {
    noCache() {
      const { noCache = false } = this.value;
      return noCache;
    },
    /**
     * 获取查询字段
     * 从组件的value属性中解构出queryFields数组
     * @returns {Array} 查询字段数组
     */
    queryFields() {
      const { queryFields = [] } = this.value;
      return queryFields;
    },

    /**
     * 获取按钮配置
     * 从组件的value属性中解构出btns数组
     * @returns {Array} 按钮配置数组
     */
    btns() {
      const { btns = [] } = this.value;
      return btns;
    },

    /**
     * 获取标题
     * 从组件的value属性中解构出title字符串
     * @returns {String} 标题文本
     */
    title() {
      const { title = "" } = this.value;
      return title;
    },

    /**
     * 获取右侧文本
     * 从组件的value属性中解构出rightText字符串
     * @returns {String} 右侧文本
     */
    rightText() {
      const { rightText = "" } = this.value;
      return rightText;
    },

    /**
     * 获取右侧图标配置
     * 根据组件的value属性中的rightIcon和queryFields动态生成图标配置
     * @returns {Object} 图标配置对象，包含name、size、color等属性
     */
    rightIcon() {
      let name = "";
      let size = 24;
      let color = "#1989fa";
      const { rightIcon = { name: "" }, queryFields = [] } = this.value;

      if (queryFields.length > 0) {
        name = "search";
      }

      if (this.rightText) {
        name = "";
      }

      if (rightIcon.name) {
        name = rightIcon.name;
      }

      if (rightIcon.size) {
        size = rightIcon.size;
      }

      if (rightIcon.color) {
        color = rightIcon.color;
      }
      return { ...rightIcon, name, size, color };
    },

    /**
     * 获取是否为webView模式
     * 从组件的value属性中解构出webView布尔值
     * @returns {Boolean} 是否为webView模式
     */
    webView() {
      const { webView = true } = this.value;
      return webView;
    },

    /**
     * 获取数据展示类型
     * 从组件的value属性中解构出type字符串，默认为'list'
     * @returns {String} 数据展示类型，如'list'、'tabs'
     */
    type() {
      const { type = "list" } = this.value;
      return type;
    },

    /**
     * 获取搜索配置
     * 根据组件的value属性中的search和searchValue动态生成搜索配置
     * @returns {Object} 搜索配置对象，包含key、value、rightIconProps等属性
     */
    search() {
      const searchValue = this.searchValue;
      const { search = { key: "", value: "" } } = this.value;
      const {
        key = "",
        rightIcon = "",
        rightIconProps = {
          name: rightIcon,
          size: 24,
          color: "#1989fa",
        },
      } = search;
      return {
        ...search,
        key,
        value: searchValue,
        rightIconProps,
      };
    },

    /**
     * 获取标签页配置
     * 从组件的value属性中解构出tabs数组
     * @returns {Array} 标签页配置数组
     */
    tabs() {
      const noCache = this.noCache;
      const { tabs = [] } = this.value;
      return tabs.map((tab) => {
        return {
          noCache,
          ...tab,
        };
      });
    },

    /**
     * 获取数据传输配置
     * 从组件的value属性中解构出transport对象，包含read、submit、delete方法的配置
     * @returns {Object} 数据传输配置对象，包含read、submit、delete等方法的配置
     */
    transport() {
      const {
        transport = {
          read: "",
          submit: "",
          delete: "",
        },
      } = this.value;
      const { read = "", submit: sub = "", delete: del = "" } = transport;
      return { ...transport, read, submit: sub, delete: del };
    },

    /**
     * 获取卡片配置
     * 从组件的value属性中解构出card对象，包含title、value、label等属性
     * @returns {Object} 卡片配置对象，包含title、value、label等属性
     */
    card() {
      const {
        card = {
          title: "",
          value: "",
          label: [],
        },
      } = this.value;
      const { title = "", value = "", label = [] } = card;
      return { ...card, title, value, label };
    },

    /**
     * 根据搜索配置和标签页配置动态生成偏移量设置
     * 如果搜索配置中的key不为空，返回特定的偏移量设置；否则返回默认的偏移量设置
     * @returns {Object} 偏移量设置对象，包含search和tabs的偏移量
     */
    offsetTop() {
      const { search = {} } = this;
      const { key = "" } = search;
      if (key !== "") {
        return {
          search: 46,
          tabs: 100,
        };
      }
      return {
        search: 0,
        tabs: 46,
      };
    },

    /**
     * 根据数据展示类型动态生成列表配置
     * 如果类型为'list'，返回默认的列表配置数组；如果类型为'tabs'，根据标签页配置生成列表配置数组
     * @returns {Array} 列表配置数组，包含各个列表的配置对象
     */
    lists() {
      if (this.type === "list") {
        return [
          {
            loading: false,
            finished: false,
            page: 0,
            size: 10,
            data: [],
            transport: this.transport,
            card: this.card,
            params: {},
          },
        ];
      } else if (this.type === "tabs") {
        return this.tabs.map((item) => {
          return {
            loading: false,
            finished: false,
            page: 0,
            size: 10,
            data: [],
            transport: this.transport,
            card: this.card,
            params: {},
            ...item,
          };
        });
      } else {
        return [];
      }
    },
  },
  // 路由组件被激活时触发
  activated() {
    /** ===== activated ===== */
    // this.init();
    /** ===== activated ===== */
  },
  // 路由组件失活时触发
  deactivated() {
    /** ===== deactivated ===== */
    this.unInit();
    /** ===== deactivated ===== */
  },
  // 组件生成时触发
  created() {
    /** ===== created ===== */
    this.init();
    /** ===== created ===== */
  },
  // 组件生成完毕后触发
  mounted() {
    /** ===== mounted ===== */
    /** ===== mounted ===== */
  },
  // 组件方法
  methods: {
    /**
     * 处理导航栏左侧按钮点击事件
     * 此函数被触发时，会根据当前环境（是否为WebView）来决定是关闭WebView还是后退到上一个路由页面
     *
     * @param {Event} event - 点击事件对象，包含与事件相关的信息
     */
    onLeft(event) {
      // 触发自定义事件"nav-bar-left"，将点击事件对象传递给父组件
      this.$emit("nav-bar-left", event);

      // 判断当前环境是否为WebView
      if (this.webView) {
        // 如果是WebView环境，调用bridge.closeWebView()方法关闭WebView
        bridge.closeWebView();
      } else {
        // 如果不是WebView环境，使用Vue Router的back方法后退到上一个路由页面
        this.$router.back();
      }
    },
    /**
     * 当右侧导航栏被触发时调用此函数
     *
     * @param {Event} event - 触发事件的对象，包含事件的具体信息
     */
    onRight(event) {
      // 触发自定义事件"nav-bar-right"，将事件对象传递给父组件
      this.$emit("nav-bar-right", event);
    },
    /**
     * 右侧图标点击事件处理函数
     * 此函数用于处理右侧图标被点击时的行为
     * 如果右侧图标定义了点击事件处理函数，则执行该函数
     * 否则，显示右侧图标对应的弹窗
     */
    onRightIconCLick() {
      // 检查右侧图标是否定义了点击事件处理函数
      if (typeof this.rightIcon.click === "function") {
        // 执行右侧图标的点击事件处理函数
        this.rightIcon.click();
        // 表示事件处理完毕，不再执行后续操作
        return false;
      }
      // 如果右侧图标未定义点击事件处理函数，则显示右侧图标对应的弹窗
      this.showShowRightIconPopup();
    },
    init() {
      this.badges = this.tabs.map(({ badge }) => badge);
    },
    unInit() {},
    /**
     * 根据名称获取其含义
     * 如果名称在binds数组中有对应的项，则返回该项的name属性，否则返回原始名称
     * 此函数用于根据给定的名称，在binds数组中查找是否有以该名称起始的项，并返回对应的含义
     * @param {string} name - 需要查找含义的名称，默认为空字符串
     * @returns {string} - 如果找到对应的项，则返回该项的name属性，否则返回原始名称
     */
    getMeaning(name = "") {
      // 创建一个正则表达式，用于匹配以给定名称起始的字符串
      const reg = new RegExp(`^${name}.`);

      // 在binds数组中查找与正则表达式匹配的项
      const item = this.binds.find((item) => {
        return reg.test(item.bind);
      });

      // 如果找到匹配的项，则返回该项的name属性
      if (item) {
        return item.name;
      }
      // 如果没有找到匹配的项，则返回原始名称
      return name;
    },
    /**
     * 根据传入的属性获取验证规则
     * 此函数用于根据不同的表单类型生成相应的验证规则，确保用户输入符合预期
     * @param {Object} props - 一个对象，包含表单元素的属性
     * @returns {Array} 返回一个包含验证规则的数组
     */
    getRules(props) {
      // 解构赋值从props中提取规则、必填性、标签、标题和类型，并设置默认值
      const {
        rules = [],
        required = false,
        label = "",
        title = label,
        type = "text",
      } = props;

      // 如果已经提供了验证规则，则直接返回这些规则
      if (rules.length > 0) {
        return rules;
      }

      // 根据表单类型选择合适的验证规则
      switch (type) {
        case "date":
        case "single":
        case "multiple":
          // 对于日期选择、单选和多选类型，要求用户必须进行选择
          return [{ required, message: `请选择${title}` }];
        default:
          // 对于其他类型（默认为文本类型），要求用户必须输入内容
          return [{ required, message: `请输入${title}` }];
      }
    },
    /**
     * 获取输入框的占位符
     *
     * 此函数旨在根据输入类型和标签动态生成输入框的占位符
     * 它首先检查是否有直接提供的占位符，如果有，则直接返回该占位符
     * 如果没有提供占位符，它将根据输入类型（如日期、单选、多选）生成一个默认占位符
     * 对于其他类型的输入框，它将生成一个通用的输入邀请信息
     *
     * @param {Object} props - 组件的属性对象，包含生成占位符所需的信息
     * @param {string} [props.placeholder=""] - 直接提供的占位符文本，如果提供，则直接使用
     * @param {string} [props.type="text"] - 输入框的类型，用于生成默认占位符
     * @param {string} [props.label=""] - 输入框的标签，用于生成默认占位符
     * @param {string} [props.title=label] - 输入框的标题，默认为标签，用于生成占位符
     * @returns {string} 返回根据条件生成的占位符文本
     */
    getPlaceholder(props) {
      // 解构赋值从props中提取所需属性，并设置默认值
      const {
        placeholder = "",
        type = "text",
        label = "",
        title = label,
      } = props;

      // 如果直接提供了占位符，则返回该占位符
      if (placeholder) {
        return placeholder;
      }

      // 根据输入类型选择合适的默认占位符
      switch (type) {
        case "date":
        case "single":
        case "multiple":
          // 对于日期、单选和多选类型，返回特定格式的占位符
          return `请选择${title}`;
        default:
          // 对于其他类型，返回通用的输入邀请信息
          return `请输入${title}`;
      }
    },
    /**
     * 加载列表数据
     * 当列表需要加载时调用此函数
     * @param {number} index - 列表的索引，用于标识多个列表中的一个
     * @returns {boolean} - 如果加载条件不满足，则返回false，否则继续执行加载逻辑
     */
    onLoad(index) {
      // 检查是否已经处于加载状态，如果是，则直接返回false
      if (this.load) {
        return false;
      }

      // 获取当前列表的配置
      const props = this.lists[index];

      // 从配置中解构出所需的属性，设置默认值以确保代码的健壮性
      const {
        transport = {},
        page,
        size,
        loading,
        data = [],
        params = {},
      } = props;

      // 合并参数，确保分页和大小信息被正确传递
      const _params = { ...this.params, page, size, ...params };

      // 从transport对象中解构出read属性，该属性包含了数据请求的路径
      const { read } = transport;

      // 检查是否处于数据加载状态，如果是，则直接返回false
      if (loading) {
        return false;
      }

      // 设置当前列表的加载状态为true
      props.loading = true;

      // 发起数据请求
      instance
        .get(read, { params: _params })
        .then((res) => {
          // 更新页码
          props.page++;

          // 解构出响应内容，并合并到现有数据中
          const { content = [], totalElements = 0 } = res;
          this.updateTabsBadge(index, totalElements);
          props.data = data.concat(content);

          // 根据返回的数据量判断是否已经完成所有数据的加载
          props.finished = content.length < size;
        })
        .catch((err) => {
          // 请求失败时显示错误提示
          Toast.fail(err);
        })
        .finally(() => {
          // 无论请求成功或失败，都重置加载状态并强制组件重新渲染
          props.loading = false;
          this.$forceUpdate();
        });
    },
    /**
     * 执行搜索操作的函数
     * 该函数接受一个参数params，用于指定搜索条件它可以是一个字符串或对象
     * 如果params是字符串，它将被用作搜索关键字；
     * 如果params是对象，它将与当前搜索条件合并
     * 此函数还会重新加载列表数据，并隐藏显示右侧图标弹窗
     *
     * @param {string | object} params - 搜索条件，可以是字符串类型的关键字或对象类型的搜索条件
     */
    onSearch(params = "") {
      // 设置加载状态为false
      this.load = false;

      // 根据params的类型，更新搜索参数
      if (typeof params !== "string") {
        // 如果params是对象，将其与当前搜索条件合并
        this.params = { ...params, [this.search.key]: this.searchValue };
      } else {
        // 如果params是字符串，将其作为关键字添加到搜索条件中
        this.params[this.search.key] = params;
      }

      // 遍历列表，调用onRefresh函数刷新每个列表项
      this.lists.forEach((item, index) => {
        this.onRefresh(index);
      });

      // 隐藏显示右侧图标弹窗
      this.hiddenShowRightIconPopup();
    },
    /**
     * 当搜索图标被点击时触发的方法
     * 此方法用于处理搜索图标点击后的逻辑，根据不同的情况执行不同的操作
     */
    onSearchIcon() {
      // 从search对象中解构获取rightIconClick和rightIcon属性
      const { rightIconClick = "", rightIcon = "" } = this.search;

      // 检查rightIconClick是否为一个函数，如果是则调用它
      if (typeof rightIconClick === "function") {
        rightIconClick();
      } else {
        // 当rightIcon的值为"scan"时，执行扫描功能
        if (rightIcon === "scan") {
          // this.searchValue = "11111";
          // this.onSearch(this.searchValue);
          // 调用bridge.scan方法进行扫描，并在扫描结果返回后处理结果
          bridge.scan().then((res) => {
            // 当扫描结果为字符串时，直接将其赋值给searchValue
            if (typeof res === "string") {
              this.searchValue = res;
            } else {
              // 否则，从扫描结果中提取result属性的值，并赋给searchValue
              const { result = "" } = res;
              this.searchValue = result;
            }
            // 使用获取到的searchValue执行搜索操作
            this.onSearch(this.searchValue);
          });
        }
      }
    },
    showShowRightIconPopup() {
      this.showRightIconPopup = true;
    },
    hiddenShowRightIconPopup() {
      this.showRightIconPopup = false;
    },
    onRefresh(index) {
      this.lists[index].page = 0;
      this.lists[index].finished = false;
      this.lists[index].data = [];
      this.onLoad(index);
    },
    initCard(item) {
      const _item = { ...item };
      delete _item.title;
      delete _item.value;
      delete _item.label;
      return _item;
    },
    initCardTitle(data, card, index) {
      const { showNumber = false, title = "" } = card;
      let text = "";
      if (showNumber) {
        text += `${index + 1}.`;
      }
      text += data[title] || "";
      return text;
    },
    initCardValue(data, card) {
      const { value = "" } = card;
      return data[value] || "";
    },
    initCardClick(data, card) {
      const { click = "" } = card;
      if (typeof click === "function") {
        click(data);
      }
    },
    updateTabsBadge(index, badge) {
      const tabs = this.tabs;
      const badges = this.badges;
      const { badge: _tabs } = tabs[index];
      const __tabs = Number(_tabs);
      if (typeof __tabs === "number" && !isNaN(__tabs)) {
        badges[index] = _tabs;
      } else {
        badges[index] = badge;
      }
    },
    tabsChange(name) {
      if (this.tabs[name].noCache) {
        this.onRefresh(name);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.right-icon-popup {
  width: 100%;
}
/deep/.content {
  > div.list {
    height: 100%;
    > div.van-pull-refresh {
      height: 100%;
      > div.van-pull-refresh__track {
        > .van-list {
          height: 100%;
          background-color: rgba(240, 240, 240, 0.8); /* 浅灰且有一定透明度 */

          > div + div {
            margin-top: 2vw;
          }
        }
      }
    }
  }
  > div.tabs {
    height: 100%;
    > .van-tabs {
      height: 100%;
      > .van-tabs__content {
        height: calc(100% - 44px);
        > .van-tabs__track {
          > .van-tab__pane-wrapper {
            > .van-tab__pane {
              height: 100%;
              > div.van-pull-refresh {
                height: 100%;
                > div.van-pull-refresh__track {
                  > .van-list {
                    height: 100%;
                    background-color: rgba(
                      240,
                      240,
                      240,
                      0.8
                    ); /* 浅灰且有一定透明度 */

                    > div + div {
                      margin-top: 2vw;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
