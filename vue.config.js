module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/pony-challenge/' : '/',
  devServer: {
    clientLogLevel: 'warn',
    overlay: false
  }
}
