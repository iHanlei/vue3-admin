import { createApp } from 'vue'

// unocss
import 'virtual:uno.css'

// 全局样式
import './styles/index.css'

// 初始化多语言
import { setupI18n } from '@/locales'

// 状态管理
import { setupStore } from '@/store'

// 路由
import { setupRouter } from './router'

// 全局组件
import { setupGlobCom } from '@/components'

// Element-plus部分组件
import { setupElementPlus } from './plugins/elementPlus'

import App from './App.vue'

// 权限控制
import './permission'

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  await setupI18n(app)

  setupStore(app)

  setupRouter(app)

  setupGlobCom(app)
  
  setupElementPlus(app)

  app.mount('#app')
}

setupAll()
