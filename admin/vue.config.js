const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      "/adminapi": {
        target: "http://localhost:10000",
        changeOrigin: true
      }
    }
  }
})
