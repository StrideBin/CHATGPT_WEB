/** @type {import('tailwindcss').Config} */
// 这段代码是一个 Tailwind CSS 的配置文件 tailwind.config.js，用于自定义 Tailwind CSS 的主题、插件等选项。

module.exports = { // 导出一个对象作为 Tailwind CSS 的配置对象。
  darkMode: 'class', // 启用 Dark Mode 主题模式，设置类名为 .dark。
  content: [ // 指定生成样式表所需的文件路径或者 glob 模式。// 在此处指定了 index.html 和所有在 src 目录下的 Vue 文件、JavaScript 文件和 TypeScript 文件等。
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: { // 定义自定义主题选项，可以覆盖默认的 Tailwind CSS 样式。
    extend: { // 扩展已有的主题配置。
      animation: { // 在动画样式中添加自定义的动画效果。
        blink: 'blink 1.2s infinite steps(1, start)', // 定义名为 blink 的动画，实现闪烁的效果。
      },
      keyframes: { // 定义自定义的关键帧动画。
        blink: { // 定义名为 blink 的关键帧动画，包括三个状态。
          '0%, 100%': { 'background-color': 'currentColor' }, // 起始状态和结束状态，设置背景颜色为当前文本颜色。
          '50%': { 'background-color': 'transparent' }, // 中间状态，设置背景色为透明。
        },
      },
    },
  },
  plugins: [], // 定义 Tailwind CSS 的插件。在此处留空，表示不使用任何插件。
}
