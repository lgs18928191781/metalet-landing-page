// import path from "path";
// import { defineConfig } from "vite";
// import vue from "@vitejs/plugin-vue";
// import VueDevTools from "vite-plugin-vue-devtools";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue(), VueDevTools()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//     },
//   },
// });
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import * as path from 'path'
import stdLibBrowser from 'node-stdlib-browser'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import wasm from 'vite-plugin-wasm'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  // 开发环境 (--mode development): 加载 .env 和 .env.development
  // 生产环境 (--mode prod): 加载 .env 和 .env.prod
  // .env.prod 中的变量会覆盖 .env 中的同名变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
  plugins: [
    vue({
      // 在生产环境也包含文件名信息（开发环境默认启用）
      script: {
        defineModel: true,
        propsDestructure: true,
      },
      // 启用模板源代码映射
      template: {
        compilerOptions: {
          // 在开发环境添加注释，显示组件位置
          comments: true,
        },
      },
    }),
    VueDevTools({
      // 启用组件检查器，可以在页面上 Alt + Click 定位组件
      componentInspector: true,
      // 配置编辑器，支持 vscode、webstorm、atom 等
      // launchEditor: 'code', // 默认会自动检测，也可以手动指定
    }),
     wasm(),
  ],
    resolve: {
    alias: {
    '@': path.resolve(__dirname, './src'),
    ...stdLibBrowser,
    },
    },
  // server: {
  //   // 允许从局域网访问
  //   host: true,
  //   // 配置代理，解决开发环境的 CORS 问题
  //   proxy: {
  //     '/socket.io': {
  //       target: 'https://www.metaweb.world',
  //       changeOrigin: true,
  //       ws: true, // 启用 WebSocket 代理
  //       secure: true, // 如果是 https，需要设置为 true
  //       rewrite: (path) => path, // 保持路径不变
  //       configure: (proxy, _options) => {
  //         proxy.on('error', (err, _req, _res) => {
  //           console.log('proxy error', err);
  //         });
  //         proxy.on('proxyReq', (proxyReq, req, _res) => {
  //           console.log('Sending Request to the Target:', req.method, req.url);
  //         });
  //         proxy.on('proxyRes', (proxyRes, req, _res) => {
  //           console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
  //         });
  //       },
  //     },
  //   },
  // },
  build: {
    target:'es2015',
    minify:true,
    rollupOptions:{
        // @ts-ignore
        plugins: [nodePolyfills()],
          output: {
          sourcemap: 'inline',
            entryFileNames: `[name].[hash].js`,
            chunkFileNames: `[name].[hash].js`,
            assetFileNames: `[name].[hash].[ext]`
        },
    },
    // 生成 sourcemap 以便调试
    sourcemap: 'inline',
  },
  }
})
