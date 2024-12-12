const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    output: {
      // library: "hipsWxLib", // 导出的库名称
      // libraryTarget: "umd", // 库目标格式
      // filename: "index.js", // 输出文件名
      // umdNamedDefine: true,
    },
    externals: {
      // vue: {
      //   root: "Vue",
      //   commonjs: "vue",
      //   commonjs2: "vue",
      //   amd: "vue",
      // },
      // vant: "vant",
    },
  },
});
