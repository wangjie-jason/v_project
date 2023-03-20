import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ELementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import JsonViewer from 'vue-json-viewer'
import axios from 'axios'
Vue.use(ELementUI)
Vue.config.productionTip = false;
Vue.use(JsonViewer)
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
