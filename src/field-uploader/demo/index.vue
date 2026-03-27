<template>
  <demo-section>
    <demo-block title="基础用法">
      <van-field-uploader
        v-model="fileList1"
        label="上传图片"
        placeholder="点击上传图片"
      />
    </demo-block>

    <demo-block title="限制上传数量">
      <van-field-uploader
        v-model="fileList2"
        label="上传图片"
        placeholder="最多上传3张"
        :max-count="3"
      />
    </demo-block>

    <demo-block title="图片压缩">
      <van-field-uploader
        v-model="fileList3"
        label="上传图片"
        placeholder="超过2MB自动压缩"
        :max-size="2 * 1024 * 1024"
      />
    </demo-block>

    <demo-block title="自定义上传区域">
      <van-field-uploader
        v-model="fileList4"
        label="上传照片"
        upload-text="上传照片"
        upload-icon="photo"
      />
    </demo-block>

    <demo-block title="禁用状态">
      <van-field-uploader v-model="fileList5" label="上传图片" disabled />
    </demo-block>

    <demo-block title="必填项">
      <van-field-uploader v-model="fileList6" label="上传图片" required />
    </demo-block>

    <demo-block title="查询已有附件">
      <van-field-uploader
        v-model="fileList7"
        label="附件"
        placeholder="点击上传附件"
        module-id="822050835239407616"
        module-type="work-order"
        bucket-name="mould-manage"
      />
      <van-button type="primary" @click="logFileList7">
        查看 fileList7 数据
      </van-button>
    </demo-block>
  </demo-section>
</template>

<script>
export default {
  data() {
    return {
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      fileList5: [{ url: 'https://img.yzcdn.cn/1.png', status: 'done' }],
      fileList6: [],
      fileList7: [],
    };
  },

  methods: {
    logFileList7() {
      console.log('fileList7:', this.fileList7);
    },
  },
};
</script>
