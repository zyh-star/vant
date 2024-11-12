module.exports = {
  // presets: ["@vue/cli-plugin-babel/preset"],
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          android: 6,
        },
      },
    ],
  ],
  plugins: [
    [
      "import",
      {
        libraryName: "vant",
        libraryDirectory: "es",
        style: true,
      },
      "vant",
    ],
  ],
};
