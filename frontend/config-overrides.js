const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('react-scripts/config/paths');

module.exports = function override(config, env) {
  config.resolve.fallback = {
      net: false,
      fs: false,
      tls: false,
      child_process: false,
      util: false,
      buffer: false,
      assert: false,
      http: false,
      path: false,
      https: false,
      os: false,
      stream: false,
      crypto: false,
      "crypto-browserify": false,
    };
    config.ignoreWarnings = [/Failed to parse source map/];
    config.plugins.push(
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),
      );

    config.plugins.shift();
    
    config.plugins.push(
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: paths.appHtml,
          },
          {}
        )
      )
    );
    return config;
  };