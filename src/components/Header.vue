<script setup lang="ts">
import { ref } from "vue";
import ManagerIcon from "@/assets/Manager.svg";

const show = ref(false);
</script>

<template>
  <header
    class="w-full lg:w-[1046px] border md:px-8 px-4 md:py-6 py-3 rounded-full border-blue-primary">
    <div class="flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-1 cursor-pointer">
        <img src="/metalet.svg" class="w-[38px]" alt="Metalet" />
        <span class="text-[28px] font-bold">Metalet</span>
      </router-link>
      <div class="gap-x-3 sm:gap-x-9 items-center hidden sm:flex">
        <a
          target="_blank"
          href="https://github.com/mvc-labs/metalet-extension"
          class="hover:text-blue-primary hover:opacity-70">
          Build
        </a>
        <a
          target="_blank"
          href="https://github.com/mvc-labs/metalet-extension"
          class="hover:text-blue-primary hover:opacity-70">
          Documentation
        </a>
        <a
          target="_blank"
          href="https://chromewebstore.google.com/detail/metalet/lbjapbcmmceacocpimbpbidpgmlmoaao"
          class="text-white text-center text-xs bg-blue-primary rounded-[28px] inline-block font-bold px-[30px] py-3.5">
          Download
        </a>
      </div>
      <img
        :src="ManagerIcon"
        alt=""
        class="sm:hidden cursor-pointer"
        @click="show = !show" />
    </div>

    <div v-if="show">
      <a
        target="_blank"
        href="https://github.com/mvc-labs/metalet-extension"
        class="w-full h-14 leading-14 block opacity-80 hover:font-bold active:opacity-100">
        Build
      </a>
      <a
        target="_blank"
        href="https://github.com/mvc-labs/metalet-extension"
        class="w-full h-14 leading-14 block opacity-80 hover:font-bold active:opacity-100">
        Documentation
      </a>
      <a
        target="_blank"
        href="https://chromewebstore.google.com/detail/metalet/lbjapbcmmceacocpimbpbidpgmlmoaao"
        class="w-full h-14 leading-14 block opacity-80 hover:font-bold active:opacity-100">
        Download
      </a>
    </div>
  </header>
</template>
