import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueRx from "vue-rx";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);
Vue.use(VueRx);
Vue.config.productionTip = false;

new Vue({
	router,
	render: (h) => h(App)
}).$mount("#app");
