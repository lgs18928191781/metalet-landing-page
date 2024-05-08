import "./style.css";
import App from "./App.vue";
import { createApp } from "vue";
import * as VueRouter from "vue-router";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./pages/Home.vue"),
    },
    {
      path: "/terms-of-service",
      component: () => import("./pages/TermsofService.vue"),
    },
    {
      path: "/privacy-policy",
      component: () => import("./pages/PrivacyPolicy.vue"),
    },
  ],
});

const app = createApp(App);

app.use(router);
app.mount("#app");
