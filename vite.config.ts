// // import path from "path";
// // import { defineConfig } from "vite";
// // import vue from "@vitejs/plugin-vue";
// // import VueDevTools from "vite-plugin-vue-devtools";

// // // https://vitejs.dev/config/
// // export default defineConfig({
// //   plugins: [vue(), VueDevTools()],
// //   resolve: {
// //     alias: {
// //       "@": path.resolve(__dirname, "src"),
// //     },
// //   },
// // });
// import { defineConfig, loadEnv } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import VueDevTools from 'vite-plugin-vue-devtools'
// import * as path from 'path'
// import stdLibBrowser from 'node-stdlib-browser'
// import nodePolyfills from 'rollup-plugin-polyfill-node'
// import wasm from 'vite-plugin-wasm'
// import topLevelAwait from 'vite-plugin-top-level-await'
// import type { Plugin } from 'vite'
// // https://vite.dev/config/
// export default defineConfig(({ mode }) => {
//   // 加载环境变量
//   // 开发环境 (--mode development): 加载 .env 和 .env.development
//   // 生产环境 (--mode prod): 加载 .env 和 .env.prod
//   // .env.prod 中的变量会覆盖 .env 中的同名变量
//   const env = loadEnv(mode, process.cwd(), '')
  
//   // 修复 dexie 导入问题的插件
//   const fixDexieImport = (): Plugin => {
//     return {
//       name: 'fix-dexie-import',
//       resolveId(id) {
//         // 拦截并重定向 import-wrapper 到主模块
//         if (id.includes('dexie/import-wrapper')) {
//           return path.resolve(__dirname, 'node_modules/dexie/dist/dexie.mjs')
//         }
//         return null
//       },
//     }
//   }
  
//   return {
//   plugins: [
//     vue({
//       // 在生产环境也包含文件名信息（开发环境默认启用）
     
//       // 启用模板源代码映射
//       template: {
//         compilerOptions: {
//           // 在开发环境添加注释，显示组件位置
//           comments: true,
//         },
//       },
//     }),
//     VueDevTools({
//       // 启用组件检查器，可以在页面上 Alt + Click 定位组件
//       componentInspector: true,
//       // 配置编辑器，支持 vscode、webstorm、atom 等
//       // launchEditor: 'code', // 默认会自动检测，也可以手动指定
//     }),
//      nodePolyfills({
//       // To exclude specific polyfills, add them to this list.
//       exclude: [
//         'fs', // Excludes the polyfill for `fs` and `node:fs`.
//       ],
//       // Whether to polyfill specific globals.
//       //@ts-ignore
//       globals: {
//         Buffer: true, // can also be 'build', 'dev', or false
//         global: true,
//         process: true,
//       },
//     }),
//      wasm(),
//      topLevelAwait(),
//      fixDexieImport()
//   ],
//     resolve: {
//     alias: {
//     '@': path.resolve(__dirname, './src'),
//     ...stdLibBrowser,
//     // 解决 dexie 的导入问题，直接指向 ESM 版本
//     'dexie': path.resolve(__dirname, 'node_modules/dexie/dist/dexie.mjs'),
//     },
//     // 解决 dexie 的导入问题
//     dedupe: ['dexie'],
//     // 确保正确解析 dexie
//     conditions: ['import', 'module', 'browser', 'default'],
//     },
//     // 优化依赖配置
//     optimizeDeps: {
//       include: ['dexie'],
//       exclude: [],
//       esbuildOptions: {
//         target: 'es2015',
//          // Node.js global to browser globalThis
//       define: {
//         global: 'globalThis',
//       },
//       },
//     },
//     // esbuild 配置 - 禁用压缩以避免构建错误
//     esbuild: {
//       target: 'es2015',
     
//       legalComments: 'none',
//       // 禁用所有压缩选项，避免 esbuild 崩溃
//       minifyIdentifiers: false,
//       minifySyntax: false,
//       minifyWhitespace: false,
//       // 增加日志级别以便调试
//       logLevel: 'warning',
//     },
//   // server: {
//   //   // 允许从局域网访问
//   //   host: true,
//   //   // 配置代理，解决开发环境的 CORS 问题
//   //   proxy: {
//   //     '/socket.io': {
//   //       target: 'https://www.metaweb.world',
//   //       changeOrigin: true,
//   //       ws: true, // 启用 WebSocket 代理
//   //       secure: true, // 如果是 https，需要设置为 true
//   //       rewrite: (path) => path, // 保持路径不变
//   //       configure: (proxy, _options) => {
//   //         proxy.on('error', (err, _req, _res) => {
//   //           console.log('proxy error', err);
//   //         });
//   //         proxy.on('proxyReq', (proxyReq, req, _res) => {
//   //           console.log('Sending Request to the Target:', req.method, req.url);
//   //         });
//   //         proxy.on('proxyRes', (proxyRes, req, _res) => {
//   //           console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
//   //         });
//   //       },
//   //     },
//   //   },
//   // },
//   build: {
//     target:'es2015',
//     commonjsOptions: {
//       transformMixedEsModules: true,
//       esmExternals: true
//     },
    
//     // 禁用 tree-shaking
//     terserOptions: {
//       compress: {
//         unused: false,
//         dead_code: false
//       }
//     },
//     // 暂时禁用压缩以避免 esbuild 错误
//     // 如果后续需要压缩，可以安装 terser: yarn add -D terser，然后改为 minify: 'terser'
//     minify: false,
//     rollupOptions:{
//        external: ['bitcoin', 'bitcoin.js'],
//         // @ts-ignore
//         plugins: [
//           nodePolyfills(),
//           // 修复 dexie 导入
//           fixDexieImport() as any,
//         ],
//           output: {
//             // 简化输出
//             manualChunks: undefined,
//             inlineDynamicImports: false,
//             onwarn: (warning, warn) => {
//               // 忽略特定的 rollup 警告
//               if (
//                 warning.code === 'THIS_IS_UNDEFINED' ||
//                 warning.code === 'CIRCULAR_DEPENDENCY' ||
//                 warning.code === 'UNUSED_EXTERNAL_IMPORT' ||
//                 warning.code === 'MIXED_EXPORTS'
//               ) {
//                 return
//               }
//               warn(warning)
//             },
//             sourcemap: 'inline',
//             entryFileNames: `[name].[hash].js`,
//             chunkFileNames: `[name].[hash].js`,
//             assetFileNames: `[name].[hash].[ext]`,
//           },
//     },
//       // 或者明确指定 esbuild 版本
//     esbuild: {
//       target: 'es2020',
//       supported: {
//         'top-level-await': true
//       }
//     },
//     // 生成 sourcemap 以便调试
//     sourcemap: 'inline',
//     // 增加 chunk 大小警告限制
//     chunkSizeWarningLimit: 1000,
//   },
//   }
// })


import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { nodePolyfills } from 'vite-plugin-node-polyfills'



import VueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

const env = loadEnv('', process.cwd())

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  plugins: [
    vue(),
    VueDevTools({
      ...(env.VITE_LAUNCH_EDITOR && { launchEditor: env.VITE_LAUNCH_EDITOR }),
    }),
   
    nodePolyfills({
      // To exclude specific polyfills, add them to this list.
      exclude: [
        'fs', // Excludes the polyfill for `fs` and `node:fs`.
      ],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
    }),
    wasm(),
    topLevelAwait(),
  
    
   
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    open: true,
    host: true,
    ...(env.VITE_PORT && { port: parseInt(env.VITE_PORT) }),
  },
  build: {
    rollupOptions: {
      external: ['bitcoin', 'bitcoin.js'],
    },
  },
})
