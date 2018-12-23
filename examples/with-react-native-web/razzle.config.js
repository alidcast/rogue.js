const nodeExternals = require('webpack-node-externals');
const fs = require('fs');

module.exports = {
  modify(config, { target, dev }, webpack) {
    // package un-transpiled packages
    // https://github.com/jaredpalmer/razzle/issues/689
    const babelRuleIndex = config.module.rules.findIndex(
      (rule) => rule.use && rule.use[0].loader && rule.use[0].loader.includes('babel-loader')
    );
    config.module.rules[babelRuleIndex] = Object.assign(config.module.rules[babelRuleIndex], {
      include: [
        ...config.module.rules[babelRuleIndex].include,
        fs.realpathSync('./node_modules/react-native-web')
      ],
    });
    config.externals =
      target === 'node'
        ? [
            nodeExternals({
              whitelist: [
                dev ? 'webpack/hot/poll?300' : null,
                /\.(eot|woff|woff2|ttf|otf)$/,
                /\.(svg|png|jpg|jpeg|gif|ico)$/,
                /\.(mp4|mp3|ogg|swf|webp)$/,
                /\.(css|scss|sass|sss|less)$/,
                /^react-native-web/,
              ].filter(Boolean),
            }),
          ]
        : [];

    return config;
  }
}