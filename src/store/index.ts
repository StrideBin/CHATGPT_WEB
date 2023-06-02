// 导入 'vue' 中的 'App' 类型
import type { App } from 'vue'

// 导入 'pinia' 中的 'createPinia' 函数
import { createPinia } from 'pinia'

// 使用 'createPinia' 函数创建一个新的 pinia store，并导出它
// pinia 是一个 Vue.js 状态管理库，提供了易于使用的 API 来管理和访问全局状态
export const store = createPinia()

// 创建一个名为 'setupStore' 的函数，该函数接受一个 'App' 类型的参数
// 这个函数的作用是将 pinia store 添加到提供的 Vue app 中
// 'app.use()' 方法是用来安装 Vue.js 插件的，这里我们将 'store' 作为插件安装到 'app' 中
export function setupStore(app: App) {
  app.use(store)
}

// 从 './modules' 文件或文件夹中导出所有的导出
// 这样，其他文件可以直接从这个文件导入 './modules' 中的导出，而不需要直接导入 './modules'
export * from './modules'
