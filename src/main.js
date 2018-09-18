import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// css
import '@/assets/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/global.css'
// js
import '@/utils/permission'
import cache from '@/utils/cache'
import JIM from '@/api/jim'
// 第三方
import ElementUI from 'element-ui'
import vueClipboard from 'vue-clipboard-pack'
import VueProgressBar from 'vue-progressbar'

import components from '@/components'

import '@/mock'

Vue.use(ElementUI)
Vue.use(vueClipboard)
Vue.use(VueProgressBar, {
    color: '#29F',
    failedColor: 'red',
    thickness: '2px'
})
Vue.prototype.$cache = cache
Vue.prototype.$JIM = JIM

Object.keys(components).forEach(key => {
    Vue.component(key, components[key])
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
