<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import SuggestIcon from "@/assets/suggest.jpg";
import ArrowLeftIcon from "@/assets/arrow-left.svg";

onMounted(() => {
  document.body.classList.add("white");
});

onBeforeUnmount(() => {
  document.body.classList.remove("white");
});
</script>

<template>
  <main class="pt-[54px] grow">
    <div class="flex items-center gap-3 cursor-pointer"  @click="$router.replace('/')">
      <img
        :src="ArrowLeftIcon"
        alt=""
        />
      <h4 class="text-2xl">Back</h4>
    </div>
    <div class="pt-6 flex flex-col lg:flex-row items-center justify-between">
      <div>
        <h1 class="font-semibold text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
          Product Feedback and Suggestions.
        </h1>
        <h4
          class="text-[#A4AFC0] text-sm md:text-base lg:text-lg xl:text-xl text-balance mt-3.5 mb-20">
          Metalet is a blockchain wallet application committed to protecting
          users’ privacy. This privacy policy aims to explain how Metalet
          collects, uses, stores, and shares your information.
        </h4>
        <a
          target="_blank"
          href="https://github.com/mvc-labs/metalet-extension/issues"
          class="bg-blue-primary text-white px-6 py-2 rounded-full hidden lg:inline-block">
          Feedback
        </a>
      </div>
      <img :src="SuggestIcon" alt="" class="w-[600px]" />
      <a
        target="_blank"
        href="https://github.com/mvc-labs/metalet-extension/issues"
        class="bg-blue-primary text-white w-[600px] text-center py-2 rounded-full inline-block lg:hidden">
        Feedback
      </a>
    </div>
  </main>
</template>

<style scoped></style>
