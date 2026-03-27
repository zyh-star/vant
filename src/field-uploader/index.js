// Utils
import { createNamespace } from '../utils';
import { instance, compressImage, base64ToBlob } from 'hips-wx-utils';

// Components
import Field from '../field';
import Uploader from '../uploader';

const [createComponent, bem] = createNamespace('field-uploader');

const FieldUploader = createComponent({
  name: 'FieldUploader',

  props: {
    // Field 组件相关属性
    label: String,
    placeholder: {
      type: String,
      default: '点击上传',
    },
    // 是否禁用
    disabled: Boolean,
    // 是否只读
    readonly: Boolean,
    // 是否必填
    required: Boolean,
    // 表单校验规则
    rules: Array,
    // 输入框对齐方式
    inputAlign: {
      type: String,
      default: 'right',
    },
    // 存储桶名称
    bucketName: {
      type: String,
      default: 'mould-manage',
    },
    // 模块ID，用于查询已有附件
    moduleId: String,
    // 模块类型，用于查询已有附件
    moduleType: String,
    // Uploader 组件属性
    // 文件列表
    value: {
      type: Array,
      default: () => [],
    },
    // 最大文件大小（字节），超过则压缩
    maxSize: {
      type: Number,
      default: 2 * 1024 * 1024, // 2MB
    },
    // 最大文件数量
    maxCount: {
      type: [Number, String],
      default: 9,
    },
    // 是否可删除
    deletable: {
      type: Boolean,
      default: true,
    },
    // 是否显示上传按钮
    showUpload: {
      type: Boolean,
      default: true,
    },
    // 是否预览图片
    previewImage: {
      type: Boolean,
      default: true,
    },
    // 是否开启全屏图片预览
    previewFullImage: {
      type: Boolean,
      default: true,
    },
    // 图片填充模式
    imageFit: {
      type: String,
      default: 'cover',
    },
    // 上传区域文字
    uploadText: String,
    // 上传图标
    uploadIcon: {
      type: String,
      default: 'photograph',
    },
    // 接受文件类型
    accept: {
      type: String,
      default: 'image/*',
    },
    // 读取文件后的回调
    afterRead: Function,
    // 读取文件前的回调
    beforeRead: Function,
    // 删除前的回调
    beforeDelete: Function,
    // 预览大小
    previewSize: [Number, String],
  },

  data() {
    return {
      fileList: [],
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.fileList = val || [];
      },
    },
    // 当 moduleId 或 moduleType 变化时，重新查询附件
    moduleId: {
      immediate: true,
      handler() {
        this.fetchAttachments();
      },
    },
    moduleType: {
      immediate: true,
      handler() {
        this.fetchAttachments();
      },
    },
  },

  methods: {
    // 查询已有附件
    async fetchAttachments() {
      // 如果 moduleId 和 moduleType 都存在，则查询附件
      if (!this.moduleId || !this.moduleType) {
        return;
      }

      try {
        const response = await instance.get(
          `/${this.bucketName}/v1/#tenantId#/upload-files?moduleId=${this.moduleId}&moduleType=${this.moduleType}&deleteFlag=0&page=0&size=0`
        );

        // 处理查询结果
        if (response && response.content && Array.isArray(response.content)) {
          const attachments = response.content.map((item) => ({
            url: item.fileUrl,
            fileUrl: item.fileUrl,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileId: item.fileId,
            moduleId: item.moduleId,
            moduleType: item.moduleType,
            status: 'done',
            message: '',
            isExisting: true, // 标记为已有附件
            serverResponse: item,
          }));

          // 合并已有附件到文件列表
          this.fileList = [
            ...attachments,
            ...this.fileList.filter((f) => !f.isExisting),
          ];
          this.updateFileList();
        }
      } catch (error) {
        console.warn('查询附件失败:', error);
      }
    },

    // 读取文件前的处理
    async beforeReadHandler(files) {
      // 如果用户提供了 beforeRead，先执行用户的
      if (this.beforeRead) {
        const result = await this.beforeRead(files);
        if (!result) return false;
      }

      // 检查文件大小，超过则压缩
      if (Array.isArray(files)) {
        const compressedFiles = await Promise.all(
          files.map((file) => this.compressFileIfNeeded(file))
        );
        return compressedFiles;
      }

      return this.compressFileIfNeeded(files);
    },

    // 如果需要则压缩图片
    async compressFileIfNeeded(file) {
      // 如果不是图片或大小未超过限制，直接返回原数据
      if (!file.type.startsWith('image/') || file.size <= this.maxSize) {
        return file;
      }

      try {
        const { type, name } = file;

        // 1. 先将 File 转为 base64
        const fileBase64 = await this.fileToBase64(file);

        // 2. 使用 compressImage 压缩
        const compressedBase64 = await new Promise((resolve, reject) => {
          compressImage(fileBase64, 0.5, type, (compressedImageBase64) => {
            if (compressedImageBase64) {
              resolve(compressedImageBase64);
            } else {
              reject(new Error('压缩失败'));
            }
          });
        });

        // 3. 使用 hips-wx-utils 的 base64ToBlob 转为 File
        const compressedFile = base64ToBlob(compressedBase64, name, type);

        // 4. 设置 content 为压缩后的 base64
        compressedFile.content = compressedBase64;

        return compressedFile;
      } catch (error) {
        console.warn('图片压缩失败，使用原文件:', error);
        return file;
      }
    },

    // File 转 Base64
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },

    // 读取文件后的处理
    async afterReadHandler(files) {
      // 过滤掉已有附件（isExisting=true 的不需要上传）
      const filesToUpload = Array.isArray(files)
        ? files.filter((file) => !file.isExisting)
        : files.isExisting
        ? []
        : [files];

      // 如果没有需要上传的文件，直接返回
      if (filesToUpload.length === 0) {
        return;
      }

      // 更新文件列表状态
      if (Array.isArray(filesToUpload)) {
        filesToUpload.forEach((file) => {
          file.status = 'uploading';
          file.message = '上传中...';
        });
      } else {
        filesToUpload.status = 'uploading';
        filesToUpload.message = '上传中...';
      }

      // 执行上传
      try {
        const uploadResults = await this.uploadFiles(filesToUpload);

        // 更新文件状态为完成
        if (Array.isArray(uploadResults)) {
          uploadResults.forEach((result) => {
            result.status = 'done';
            result.message = '';
          });
        } else {
          uploadResults.status = 'done';
          uploadResults.message = '';
        }

        // 触发 afterRead 回调
        if (this.afterRead) {
          await this.afterRead(uploadResults);
        }

        // 更新文件列表
        this.updateFileList();
      } catch (error) {
        // 上传失败
        if (Array.isArray(files)) {
          files.forEach((file) => {
            file.status = 'failed';
            file.message = '上传失败';
          });
        } else {
          files.status = 'failed';
          files.message = '上传失败';
        }
        this.updateFileList();
        this.$emit('upload-error', error);
      }
    },

    // 上传文件到服务器
    async uploadFiles(files) {
      if (Array.isArray(files)) {
        const results = await Promise.all(
          files.map((file) => this.uploadSingleFile(file))
        );
        return results;
      }

      return this.uploadSingleFile(files);
    },

    // 上传单个文件
    async uploadSingleFile(file) {
      const formData = new FormData();
      // 使用 file.file（原始 File 对象）进行上传
      formData.append('file', file.file || file);

      const response = await instance.post(
        `/hfle/v1/#tenantId#/files/multipart?bucketName=${this.bucketName}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      // 将服务器返回的信息附加到 file 对象
      // 处理 response 可能是字符串 URL 或对象的情况
      file.serverResponse = response;
      if (typeof response === 'string') {
        file.url = response;
        file.fileUrl = response;
      } else {
        file.url = response?.fileUrl || response?.url || file.content;
        file.fileUrl = response?.fileUrl || response?.url || file.content;
      }

      // 添加表单需要的字段
      file.fileName = file.file?.name || file.name || 'unnamed';
      file.fileSize = this.formatFileSize(file.file?.size || file.size || 0);

      // 如果组件设置了 moduleId 和 moduleType，则添加到文件对象
      if (this.moduleId) {
        file.moduleId = this.moduleId;
      }
      if (this.moduleType) {
        file.moduleType = this.moduleType;
      }

      // 初始化删除标记
      file.deleteFlag = 0;

      return file;
    },

    // 格式化文件大小
    formatFileSize(size) {
      if (size < 1024) {
        return `${size}B`;
      }
      if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)}KB`;
      }
      return `${(size / 1024 / 1024).toFixed(2)}MB`;
    },

    // 更新文件列表
    updateFileList() {
      this.$emit('input', [...this.fileList]);
    },

    // 删除文件
    async onDelete(file, detail) {
      // 禁用或只读状态下禁止删除
      if (this.disabled || this.readonly) {
        return;
      }

      // 如果用户提供了 beforeDelete，先执行
      if (this.beforeDelete) {
        const result = await this.beforeDelete(file, detail);
        if (!result) return;
      }

      // 调用服务器删除接口
      if (file.serverResponse) {
        try {
          await instance.post(
            `/${this.bucketName}/v1/#tenantId#/upload-files`,
            [
              {
                ...file.serverResponse,
                deleteFlag: 1,
              },
            ]
          );
        } catch (error) {
          console.warn('删除文件失败:', error);
        }
      }

      // 从列表中移除
      const { index } = detail;
      this.fileList.splice(index, 1);
      this.updateFileList();
      this.$emit('delete', file, detail);
    },

    // Uploader 的 input 变化
    onUploaderChange() {
      // 同步文件列表
      this.fileList = this.$refs.uploader.fileList;
      this.updateFileList();
    },

    genUploader() {
      return (
        <Uploader
          ref="uploader"
          vModel={this.fileList}
          disabled={this.disabled}
          readonly={this.readonly}
          maxCount={this.maxCount}
          maxSize={Number.MAX_VALUE}
          deletable={this.deletable && !this.disabled && !this.readonly}
          showUpload={this.showUpload}
          previewImage={this.previewImage}
          previewFullImage={this.previewFullImage}
          imageFit={this.imageFit}
          uploadText={this.uploadText}
          uploadIcon={this.uploadIcon}
          accept={this.accept}
          previewSize={this.previewSize}
          beforeRead={this.beforeReadHandler}
          afterRead={this.afterReadHandler}
          onDelete={this.onDelete}
          onChange={this.onUploaderChange}
        />
      );
    },
  },

  render() {
    const fieldProps = {
      props: {
        label: this.label,
        placeholder: this.placeholder,
        readonly: true,
        disabled: this.disabled,
        required: this.required,
        inputAlign: this.inputAlign,
        rules: this.rules,
      },
      scopedSlots: {
        input: () => this.genUploader(),
      },
    };

    return (
      <div class={bem()}>
        <Field {...fieldProps} />
      </div>
    );
  },
});

export default FieldUploader;
