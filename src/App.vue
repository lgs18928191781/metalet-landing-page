<script setup lang="ts">
import XIcon from "@/assets/x.svg";
import Header from "@/components/Header.vue";
</script>

<template>
  <div
    class="w-full min-h-screen relative pt-6 px-5 flex flex-col items-center">
    <Header />

    <router-view></router-view>

    <footer class="w-full py-9 flex flex-col gap-4 md:flex-row items-center justify-between">
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
      <div class="flex items-center gap-x-4">
        <RouterLink
          to="/feedback"
          class="hover:underline hover:text-blue-primary">
          Feedback
        </RouterLink>
        <span class="text-[#E0E3E8]">|</span>
        <a href="https://x.com/metaletofficial" target="_blank">
          <img :src="XIcon" alt="X" />
        </a>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
