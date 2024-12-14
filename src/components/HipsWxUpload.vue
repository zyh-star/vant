<!--
* @description 附件上传
* @fileName HipsWxUpload.vue
* @author zheng yuanhou
* @date 2024/06/26 17:52:36
!-->
<template>
  <van-field
    name="uploader"
    :label="label"
    :required="required"
    :rules="rules"
    label-class="uploader-label"
  >
    <template #input>
      <van-uploader
        v-model="list"
        :disabled="disabled"
        :readonly="readonly"
        :lazy-load="lazyLoad"
        :upload-text="uploadText"
        :before-read="beforeRead"
        :before-delete="beforeDelete"
        :preview-size="previewSize"
        :preview-options="previewOptions"
        :name="name"
        :accept="accept"
        :max-size="maxSize"
        :max-count="maxCount"
        :deletable="deletable"
        :show-upload="showUpload"
        :preview-image="previewImage"
        :preview-full-image="false"
        :image-fit="imageFit"
        :result-type="resultType"
        :upload-icon="uploadIcon"
        :after-read="handleAutoUploadResult"
        @delete="deleteUploadResult"
        @click-preview="clickPreview"
      >
        <template #preview-cover="{ fileName }">
          <div class="preview-cover van-ellipsis">
            {{ fileName }}
          </div>
        </template>
      </van-uploader>
      <van-image-preview v-model="show" :images="images" @change="onChange">
        <template v-slot:index>第{{ index + 1 }}页</template>
      </van-image-preview>
    </template>
  </van-field>
</template>

<script>
import { Uploader, Field, ImagePreview } from "vant";
import { compressImage, base64ToBlob, instance, bridge } from "hips-wx-utils";

// if (/[http|https]:\/\/front/.test(location.href)) {
//   instance.defaults.baseURL = "https://gateway.vasen.com";
// }

export default {
  name: "HipsWxUpload",
  components: {
    [Uploader.name]: Uploader,
    [Field.name]: Field,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  props: {
    moduleType: {
      type: String,
      default: "",
    },
    moduleId: {
      type: String,
      default: "",
    },
    locationId: String,
    auto: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "照片",
    },
    disabled: Boolean,
    readonly: Boolean,
    lazyLoad: Boolean,
    uploadText: String,
    afterRead: Function,
    beforeRead: Function,
    beforeDelete: Function,
    previewSize: [Number, String],
    previewOptions: Object,
    name: {
      type: [Number, String],
      default: "",
    },
    accept: {
      type: String,
      default: "image/*",
    },
    value: {
      type: Array,
      default: function () {
        return [];
      },
    },
    maxSize: {
      type: [Number, String, Function],
      default: Number.MAXlist,
    },
    maxCount: {
      type: [Number, String],
      default: Number.MAXlist,
    },
    deletable: {
      type: Boolean,
      default: true,
    },
    showUpload: {
      type: Boolean,
      default: true,
    },
    previewImage: {
      type: Boolean,
      default: true,
    },
    previewFullImage: {
      type: Boolean,
      default: true,
    },
    imageFit: {
      type: String,
      default: "cover",
    },
    resultType: {
      type: String,
      default: "dataUrl",
    },
    uploadIcon: {
      type: String,
      default: "photograph",
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    bucketName: {
      type: String,
      default: "",
    },
    compress: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // list: [],
      show: false,
      index: 0,
    };
  },
  computed: {
    list: {
      get() {
        return this.value.map((item) => ({ ...item }));
      },
      set(v) {
        this.$emit("input", v);
      },
    },
    images() {
      return this.list.map((item) => item.url);
    },
  },
  methods: {
    async handleAutoUploadResult(res) {
      res.status = "uploading";
      res.message = "上传中...";
      const { file } = res;
      const { list } = this;
      const { name: fileName, type } = file;
      const set = new Set(list);
      const that = this;
      if (this.compress) {
        compressImage(
          res.content,
          0.5,
          type,
          async function (compressedImageBlob) {
            // 使用compressedImageBlob创建一个新的File对象，然后可以用来上传
            const compressedFile = base64ToBlob(
              compressedImageBlob,
              fileName,
              type
            );
            // 上传compressedFile
            const { size } = compressedFile;
            const fileSize = that.getFileSize(size);
            const url = await that.upload(compressedFile);
            set.add({
              url,
              fileUrl: url,
              fileName,
              fileSize,
              moduleId: that.moduleId,
            });
            that.list = Array.from(set);
            res.status = "success";
            res.message = "";
          }
        );
      } else {
        const { size } = file;
        const fileSize = that.getFileSize(size);
        const url = await that.upload(file);
        set.add({
          url,
          fileUrl: url,
          fileName,
          fileSize,
          moduleId: that.moduleId,
        });
        that.list = Array.from(set);
        res.status = "success";
        res.message = "";
      }
    },
    deleteUploadResult(res) {
      const index = this.list.findIndex((item) => item.fileId === res.fileUrl);
      if (index > -1) {
        this.list = this.list.splice(index, 1);
      }
      try {
        this.deleteFileByUrl([res]);
      } catch (e) {
        console.error(e);
      }
    },
    clickPreview(v) {
      if (this.previewFullImage) {
        if (!/.(png|jpg|gif|jpeg|webp)$/.test(v.fileUrl)) {
          bridge.officePreview(v.fileUrl);
        } else {
          this.index = this.images.findIndex((item) => item === v.fileUrl);
          this.show = true;
        }
      }
    },
    getFileSize(size) {
      if (size < 1024) {
        return `${size}B`;
      } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)}KB`;
      }
      return `${(size / 1024 / 1024).toFixed(2)}MB`;
    },
    upload(file) {
      // 设置为表单方式提交
      const formData = new FormData();
      formData.append("file", file);

      return instance.post(
        `/hfle/v1/#tenantId#/files/multipart?bucketName=${this.bucketName}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    },
    deleteFileByUrl(params) {
      return instance.post(
        `/${this.bucketName}/v1/#tenantId#/upload-files/delete-by-url`,
        params
      );
    },
    onChange(index) {
      this.index = index;
    },
  },
};
</script>

<style lang="less" scoped>
.uploader-label {
  color: #323233;
  font-weight: bold;
}
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
</style>
