const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const cesiumSource = "node_modules/cesium/Source";
const cesiumWorkers = "../Build/Cesium/Workers";
const path = require("path");
const resolve = (dir) => {
  return path.join(__dirname, dir);
}

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
        cesium: path.resolve(__dirname, cesiumSource),
      }
    },
    amd: {
      toUrlUndefined: true
    },
    module: {
      unknownContextCritical: false,
      rules: [
        {
          test: /\.(vert|frag)$/i,
          use: "raw-loader"
        },
        {
          test: /\.(gltf|kmz)$/,
          loader: "url-loader"
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify("")
      }), // 对build生效，拷贝到dist目录下。如：dist/Assets
      new CopyWebpackPlugin([{
        from: path.join(cesiumSource, cesiumWorkers),
        to: "Workers"
      }]),
      new CopyWebpackPlugin([{
        from: path.join(cesiumSource, "Assets"),
        to: "Assets"
      }]),
      new CopyWebpackPlugin([{
        from: path.join(cesiumSource, "Widgets"),
        to: "Widgets"
      }]),
      new webpack.ProvidePlugin({
        Cesium: ["cesium/Cesium"], // Cesium对象实例可在每个js中使用而无须import
      })
    ],
    optimization: {
      minimize: process.env.NODE_ENV === "production" ? true : false
    },
    devtool: 'source-map'
  },
  devServer: {
    proxy: {
      '/data': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/data': '/data'
        }
      }
    }
  }
}
