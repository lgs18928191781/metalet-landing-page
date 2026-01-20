<script setup lang="ts">
import { computed,onMounted } from 'vue'
import { useRoute } from 'vue-router'
import XIcon from "@/assets/x.svg";
import { getUtxoRawTx } from "@/api/metalet-v3"; 
import Header from "@/components/Header.vue";
import GithubIcon from '@/assets/githubIcon.png'
import ConnectWalletModalVue from '@/components/ConnectWalletModal/ConnectWalletModal.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()
const isPinManagementPage = computed(() => route.path === '/pin/management')

 
onMounted(()=>{
 
  //getUtxoRawTx({txId:'308647cbbf60d5c8d4ce4b036b9cc0beb56ed71257e65b2eb13e946d57b9bbfa'})
})

</script>

<template>
  <div
    class="w-full min-h-screen relative pt-6 px-5 flex flex-col items-center">
    <Header v-if="!isPinManagementPage" />

    <router-view></router-view>

    <footer class="w-full  py-9 flex flex-col gap-4 md:flex-row items-center justify-between">
      <div class="flex flex-col items-start">
        <div class="flex items-center gap-x-1">
          <img src="/metalet.svg" class="w-5" alt="Metalet" />
          <span class="text-sm font-bold">Metalet</span>
        </div>
        <p class="text-sm text-balance">
          <a target="_blank" href="https://metalet.space">metalet.space</a>
          Copyrights @2024.&nbsp;
          <RouterLink to="/privacy-policy" class="underline text-blue-primary">
            Privacy Policy
          </RouterLink>
          &nbsp;and&nbsp;
          <RouterLink
            to="/terms-of-service"
            class="underline text-blue-primary">
            Terms of Service
          </RouterLink>
        </p>
      </div>
      <div class="flex items-center ">
        <RouterLink
          to="/feedback"
          class="mr-[40px] cursor-pointer hover:underline hover:text-blue-primary">
          Feedback
        </RouterLink>
        <span class="text-[#E0E3E8]">|</span>
        <div class="flex  items-center justify-center">
           <a class="ml-[40px] cursor-pointer" href="https://x.com/metaletofficial" target="_blank">
          <img :src="XIcon" alt="X" />
        </a>
         <a class="ml-[40px] cursor-pointer" href="https://github.com/mvc-labs/metalet-extension" target="_blank">
          <img :src="GithubIcon" alt="Github" />
        </a>
        </div>
      </div>
    </footer>
    <!-- 模态框组件 -->
    <ConnectWalletModalVue />
  </div>
</template>

<style scoped></style>
