const webpack = require("webpack");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: require.resolve("path-browserify"),
    os: require.resolve("os-browserify/browser"),
    crypto: require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),

  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ];

  return config;
};
