// const apiMocke = require("./before");
// const { apiMocke } = require("apimock");

const proxy = {
  // proxy: {
  // 	"/api(.*)": "http://yapi.in.wezhuiyi.com/mock/65"
  // }
};

module.exports = {
  devServer: {
    // before(app) {
    // 	apiMocke(app, proxy)
    // },
  },
  productionSourceMap: false,
};
