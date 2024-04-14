<script setup lang="ts">
import { ref } from "vue";
import CheckIcon from "./assets/Check.svg";
import WalletPNG from "./assets/wallet.png";
import ChromeIcon from "./assets/Chrome.svg";
import ManagerIcon from "./assets/Manager.svg";
import AndroidAPKIcon from "./assets/Android.svg";
import AppleStoreIcon from "./assets/AppleStore.svg";
import GooglePlayIcon from "./assets/GooglePlay.svg";

const solgans = [
  "One Wallet for All Bitcoin Ecosystems",
  "Lightweight and Fast",
  "Supports Android, iOS and Chrome",
  "Supports BTC and Bitcoin sidechain MVC",
  "Supports Ordinals, BRC20, MVC20, MetaID and other protocols (Runes will be launched soon)",
  "Supports Ordinal NFT",
  "Supports MetaID Connect",
];

const show = ref(false);
</script>

<template>
  <div class="w-full min-h-screen relative pt-6">
    <header class="flex items-center justify-between">
      <div class="flex items-center gap-1 cursor-pointer">
        <img src="/metalet.svg" class="w-6 w-[38px]" alt="Metalet" />
        <span class="text-[28px] font-bold">Metalet</span>
      </div>
      <div class="gap-x-3 sm:gap-x-9 items-center hidden sm:flex">
        <a
          target="_blank"
          href="https://github.com/mvc-labs/metalet-extension"
          class="hover:text-blue-primary hover:opacity-70"
          >Build</a
        >
        <a
          target="_blank"
          href="https://github.com/mvc-labs/metalet-extension"
          class="hover:text-blue-primary hover:opacity-70"
          >Documentation</a
        >
        <a
          target="_blank"
          href="https://chromewebstore.google.com/detail/metalet/lbjapbcmmceacocpimbpbidpgmlmoaao"
          class="text-white w-24 h-[27px] leading-[27px] text-center text-xs bg-blue-primary rounded-[28px] inline-block"
        >
          Download
        </a>
      </div>
      <img :src="ManagerIcon" alt="" class="sm:hidden cursor-pointer" @click="show = !show" />
    </header>
    <div v-if="show">
      <a
        target="_blank"
        href="https://github.com/mvc-labs/metalet-extension"
        class="w-full h-14 leading-14 block opacity-80 hover:font-bold active:opacity-100"
        >Build</a
      >
      <a
        target="_blank"
        href="https://github.com/mvc-labs/metalet-extension"
        class="w-full h-14 leading-14 block opacity-80 hover:font-bold active:opacity-100"
        >Documentation</a
      >
      <a
        target="_blank"
        href="https://chromewebstore.google.com/detail/metalet/lbjapbcmmceacocpimbpbidpgmlmoaao"
        class="w-full h-14 leading-14 block opacity-80 hover:font-bold active:opacity-100"
        >Download</a
      >
    </div>
    <main
      class="pt-10 lg:pt-[107px] flex items-center flex-col gap-20 xl:gap-0 xl:flex-row xl:justify-between"
    >
      <div class="pt-[1.5px] max-w-[496px] flex flex-col items-center">
        <h1 class="text-4xl lg:text-[50px] lg:leading-[60px] font-bold">
          One Wallet for All Bitcoin Ecosystems
        </h1>
        <div class="w-full space-y-5 mt-[34px]">
          <div
            :key="index"
            v-for="(solgan, index) in solgans"
            class="flex items-center gap-x-[20.61px]"
          >
            <img :src="CheckIcon" alt="" />
            <span class="sm:text-xl">{{ solgan }}</span>
          </div>
        </div>
        <div
          class="mt-[49px] grid grid-cols-2 gap-4 sm:gap-8 items-center w-full"
        >
          <a
            target="_blank"
            href="https://chromewebstore.google.com/detail/metalet/lbjapbcmmceacocpimbpbidpgmlmoaao"
            class="bg-white h-15 rounded-[60px] flex items-center justify-center gap-3"
          >
            <img class="w-6" :src="ChromeIcon" alt="" />
            <span>Download</span>
          </a>
          <a
            target="_blank"
            href="https://apps.apple.com/us/app/metalet/id6450825531?platform=iphone"
            class="bg-white h-15 rounded-[60px] flex items-center justify-center gap-3"
          >
            <img class="w-6" :src="AppleStoreIcon" alt="" />
            <span>APP Store</span>
          </a>
          <a
            target="_blank"
            href="https://play.google.com/store/search?q=metalet&c=apps"
            class="bg-white h-15 rounded-[60px] flex items-center justify-center gap-3"
          >
            <img class="w-6" :src="GooglePlayIcon" alt="" />
            <span>Google Play</span>
          </a>
          <a
            target="_blank"
            href="https://metalet.space/down/metalet.apk"
            class="bg-white h-15 rounded-[60px] flex items-center justify-center gap-3"
          >
            <img class="w-6" :src="AndroidAPKIcon" alt="" />
            <span>Android APK</span>
          </a>
        </div>
      </div>
      <img :src="WalletPNG" class="w-full lg:w-[650px]" />
    </main>
    <footer class="w-full absolute bottom-9 text-center">
      <a target="_blank" href="https://metalet.space">metalet.space</a>
      Copyrights @2024
    </footer>
  </div>
</template>

<style scoped></style>
