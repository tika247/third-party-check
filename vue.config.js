const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const imortScss = '@import "@/assets/scss/reset.scss"; @import "@/assets/scss/style.scss";';

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  },
});

module.exports = {
  // exclude specific files or folders from watching by saving a file
  configureWebpack: {
    watchOptions: {
      // ignored: /.*\.json/,
      ignored: /.*\/@archive/,
    },
  },
  // exclude specific files or folders from watching by changing a file
  devServer: {
    hot: false,
    liveReload: false,
  },
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.ts",
      // Or, for multiple preload files:
      // preload: { preload: "src/preload.js", otherPreload: "src/preload2.js" }
      customFileProtocol: "./",
      builderOptions: {
        extraResources: [
          {
            from: "src/bat",
            to: "bat",
            filter: ["**/*"],
          },
          {
            from: "README.md",
            to: "",
            filter: ["**/*"],
          },
          {
            from: "README_JA.md",
            to: "",
            filter: ["**/*"],
          },
        ],
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: imortScss,
      },
    },
  },
};
