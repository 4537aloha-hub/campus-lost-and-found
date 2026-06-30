import { createApp } from 'vue'
import pinia from './stores'

import App from './App.vue'
import router from './router/fronted'
import { lazyPlugin } from './directives/lazyImg'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

app.use(pinia)
app.use(router)
// // 引入懒加载插件
app.use(lazyPlugin)
app.use(ElementPlus, {
  locale: zhCn
})

Object.keys(ElementPlusIconsVue).forEach(key => {
  app.component(key, ElementPlusIconsVue[key])
})

app.mount('#app')
