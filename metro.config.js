// const blacklist = require('metro-config/src/defaults/blacklist');
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // (add 'bin' to assetExts)
    assetExts: ['tflite', 'txt', 'jpg', 'png', 'ttf','pdf','gif'],
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx','gif'],
    // blacklistRE: blacklist([/platform_node/])
  },
};
