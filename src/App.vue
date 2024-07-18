<script setup lang="ts">
import Header from "@/components/Header.vue";
</script>

<template>
  <div class="w-full min-h-screen relative pt-6 px-5 flex flex-col items-center">
    <Header />

    <router-view></router-view>

    <footer class="w-full py-9 text-center font-semibold">
      <a target="_blank" href="https://metalet.space">metalet.space</a>
      Copyrights @2024.&nbsp;
      <RouterLink to="/privacy-policy" class="underline font-normal">
        Privacy Policy
      </RouterLink>
      &nbsp;and&nbsp;
      <RouterLink to="/terms-of-service" class="underline font-normal">
        Terms of Service
      </RouterLink>
    </footer>
  </div>
</template>

<style scoped></style>
