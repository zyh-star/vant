<template>
  <van-page
    title="页面标题"
    left-text="返回"
    right-text="按钮"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <!-- 页面内容 -->
    <div class="demo-content">
      <div class="demo-section">
        <h3>iOS 键盘适配测试</h3>
        <p class="demo-desc">点击下方输入框，测试键盘弹出时的滚动效果</p>
      </div>

      <!-- 输入框列表，用于测试键盘适配 -->
      <div class="demo-form">
        <div class="demo-item">
          <label>输入框 1（顶部）</label>
          <input type="text" placeholder="请输入内容" />
        </div>

        <div class="demo-item">
          <label>输入框 2</label>
          <input type="text" placeholder="请输入内容" />
        </div>

        <div class="demo-item">
          <label>输入框 3</label>
          <input type="text" placeholder="请输入内容" />
        </div>

        <div class="demo-item">
          <label>输入框 4</label>
          <input type="text" placeholder="请输入内容" />
        </div>

        <div class="demo-item">
          <label>输入框 5</label>
          <input type="text" placeholder="请输入内容" />
        </div>

        <div class="demo-item">
          <label>输入框 6</label>
          <input type="text" placeholder="请输入内容" />
        </div>

        <div class="demo-item">
          <label>输入框 7</label>
          <input type="text" placeholder="请输入内容" />
        </div>

        <div class="demo-item">
          <label>输入框 8</label>
          <input type="text" placeholder="请输入内容" />
        </div>

        <div class="demo-item">
          <label>输入框 9</label>
          <input type="text" placeholder="请输入内容" />
        </div>

        <div class="demo-item">
          <label>输入框 10（底部）</label>
          <input type="text" placeholder="请输入内容" />
        </div>

        <div class="demo-item">
          <label>多行文本框</label>
          <textarea rows="3" placeholder="请输入多行内容"></textarea>
        </div>
      </div>

      <!-- 普通列表项 -->
      <div v-for="i in 10" :key="'item-' + i" class="demo-list-item">
        列表项 {{ i }}
      </div>
    </div>

    <!-- 底部插槽 -->
    <template #footer>
      <div class="demo-footer">
        <van-button type="primary" block>提交</van-button>
      </div>
    </template>
  </van-page>
</template>

<script>
import Vue from 'vue';
import Page from '../index';
import Toast from '../../toast';
import Button from '../../button';

Vue.use(Page);
Vue.use(Button);

export default {
  methods: {
    onClickLeft() {
      Toast('返回');
    },
    onClickRight() {
      Toast('按钮');
    },
  },
};
</script>

<style lang="less">
.demo-content {
  padding: 16px;
}

.demo-section {
  margin-bottom: 20px;

  h3 {
    margin: 0 0 8px;
    color: #323233;
    font-size: 16px;
  }

  .demo-desc {
    margin: 0;
    color: #969799;
    font-size: 14px;
  }
}

.demo-form {
  margin-bottom: 20px;
}

.demo-item {
  margin-bottom: 12px;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 8px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #323233;
    font-size: 14px;
  }

  input,
  textarea {
    box-sizing: border-box;
    width: 100%;
    padding: 10px 12px;
    color: #323233;
    font-size: 16px; // iOS 防止缩放
    background-color: #f7f8fa;
    border: 1px solid #ebedf0;
    border-radius: 4px;

    &::placeholder {
      color: #c8c9cc;
    }

    &:focus {
      background-color: #fff;
      border-color: #1989fa;
      outline: none;
    }
  }

  textarea {
    resize: none;
  }
}

.demo-list-item {
  margin-bottom: 8px;
  padding: 16px;
  color: #323233;
  font-size: 14px;
  background-color: #fff;
  border-radius: 8px;
}

.demo-footer {
  padding: 8px 16px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
}
</style>
