import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'

async function bootstrap() {
  const app = createApp(App)// 创建 Vue 应用程序实例。
  setupAssets()// 调用自定义插件方法，设置全局资源相关的配置。

  setupScrollbarStyle()// 调用自定义插件方法，处理滚动条样式。

  setupStore(app) // 调用状态管理方法，配置全局状态管理数据。

  setupI18n(app)// 调用国际化相关方法，配置多语言支持。

  await setupRouter(app) // 调用路由配置方法，设置前端路由。

  app.mount('#app')// 将应用程序挂载到指定的 HTML 元素上。
}

bootstrap()// 启动应用程序。
