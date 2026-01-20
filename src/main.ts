import "./style.css";
import App from "./App.vue";
import { pinia } from './stores/index'
import { createApp } from "vue";
import * as VueRouter from "vue-router";
import UserAvatar from '@/components/UserAvatar/UserAvatar.vue'
import Image from '@/components/Image/Image.vue'
import { configManager } from './utils/config'
import './index.scss'
import { Buffer } from 'buffer'
// @ts-ignore
globalThis.Buffer = Buffer
window.addEventListener("vite:preloadError", () => {
  window.location.reload(); // for example, refresh the page
});

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./pages/Home.vue"),
    },
    {
      path: "/feedback",
      component: () => import("./pages/Feedback.vue"),
    },
    {
      path: "/terms-of-service",
      component: () => import("./pages/TermsofService.vue"),
    },
    {
      path: "/privacy-policy",
      component: () => import("./pages/PrivacyPolicy.vue"),
    },
    {
      path: "/pin/management",
      component: () => import("./pages/PinManagement.vue"),
    },
  ],
});

// const app = createApp(App);

// app.use(router);
// app.mount("#app");

async function startApp() {
  // 加载外部配置
  await configManager.loadConfig();

  const app = createApp(App)
  app.component('UserAvatar', UserAvatar)
  app.component('Image', Image)
  app.use(pinia)
  app.use(router)

  // 将配置管理器注入到全局属性
  app.config.globalProperties.$config = configManager;

  app.mount('#app')

  console.log('🚀 应用启动完成');
}

// 启动应用
startApp().catch(console.error);
