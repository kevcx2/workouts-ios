module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: '.',
          alias: {
            '@/components': './components',
            '@/screens': './screens',
            '@/styles': './styles',
            '@/store': './store',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
