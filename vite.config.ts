import path from 'path'// 引入 Node.js 的 path 模块，用于处理文件路径。
import type { PluginOption } from 'vite'// 引入 vite 插件的类型定义。
import { defineConfig, loadEnv } from 'vite'// 引入 vite 的配置方法和环境变量管理方法。
import vue from '@vitejs/plugin-vue'// 引入 vite 的 Vue.js 插件。
import { VitePWA } from 'vite-plugin-pwa'// 引入 vite 的 PWA（渐进式网络应用）插件。

// 自定义一个 setupPlugins 方法，接收 ImportMetaEnv 类型参数 env，返回 PluginOption 类型数组。
function setupPlugins(env: ImportMetaEnv): PluginOption[] {
  return [
    vue(), // 加载 vue 插件。
    env.VITE_GLOB_APP_PWA === 'true' && VitePWA({ // 根据全局环境变量 VITE_GLOB_APP_PWA 决定是否加载 PWA 插件
      injectRegister: 'auto', // 设置启动后自动注册 Service Worker。
      manifest: { // 配置 PWA 渐进式网络应用的信息。
        name: 'chatGPT',
        short_name: 'chatGPT',
        icons: [ // 定义图标资源。
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ]
}

export default defineConfig((env) => { // 导出 vite 的配置对象。
  const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv // 获取环境变量。

  return {
    resolve: { // 配置别名，方便导入模块。
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    plugins: setupPlugins(viteEnv), // 使用自定义插件方法来设置所需的插件。
    server: { // 配置开发服务器。
      host: '0.0.0.0', // 允许外部设备访问。
      port: 80, // 设置端口号为 80。
      open: false, // 不自动打开浏览器。
      proxy: { // 配置代理。
        '/api': { // 当请求 /api 路径时，转发到 API 服务器。
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, // 允许跨域
          rewrite: path => path.replace('/api/', '/'), // 将请求路径中的 /api/ 替换为 /。
        },
      },
    },
    build: { // 配置生产环境构建选项。
      reportCompressedSize: false, // 是否生成压缩文件大小报告。
      sourcemap: false, // 是否生成源代码映射文件。
      commonjsOptions: { // 在发布 Node.js 模块时，是否允许使用 try-catch 包裹 CommonJS 导入语句。
        ignoreTryCatch: false,
      },
    },
  }
})

// Vite 是一款快速的 Web 开发工具，它采用了基于浏览器原生 ES 模块的开发模式，以及利用浏览器本身的能力进行高效的打包和编译。Vite 的工作原理可以概括为以下几个步骤：
//
// 首先，Vite 启动一个本地服务器，并侦听端口以提供服务。
//
// 当用户请求某个页面时，Vite 会解析该页面所需的所有模块，并生成对应的依赖关系图。
//
// 接着，Vite 会将每个模块作为一个单独的文件来处理，而不是像传统的打包工具一样将所有模块集成到一个文件中。这意味着在开发过程中，每个模块都可以被单独地加载和缓存，从而提高了性能。
//
// Vite 会根据依赖关系图，按需编译和打包每个模块，并将结果缓存起来，以便下次快速加载。
//
// 对于 JavaScript 模块，Vite 会将其转换为浏览器可执行的 ES5 语法，并将其保存在内存中。此时，如果用户修改了某个模块的代码，则 Vite 只会重新编译并加载该模块，而不需要重新构建整个项目。
//
// 最后，Vite 将编译后的模块通过 HTTP 服务器提供给浏览器，并添加 HMR（热更新）机制，使得在开发过程中可以实现快速地修改和预览。
//
// 综上所述，Vite 并不是将所有 TypeScript 文件集成到一个 index.js 文件中，而是根据需要动态编译和打包每个模块。这种处理方式既提高了性能，又保留了原有的模块结构和依赖关系，同时还支持 HMR 等功能，使得开发效率更高。
