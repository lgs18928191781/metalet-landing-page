<script setup lang="ts">
import NFTIcon from "@/assets/NFT.png";
import CheckIcon from "@/assets/Check.svg";
import MobileIcon from "@/assets/Mobile.png";
import ChromeIcon from "@/assets/Chrome.png";
import MetaPInIcon from "@/assets/MetaPin.png";
import BitcoinIcon from "@/assets/bitcoin.svg";
import BlueFireIcon from "@/assets/blue-fire.svg";
import AndroidAPKIcon from "@/assets/Android.png";
import AppleStoreIcon from "@/assets/AppleStore.png";
import GooglePlayIcon from "@/assets/GooglePlay.png";
import MetaletMobileIcon from "@/assets/MetaletMobile.png";
import AISNIcon from "@/assets/brc20/AISN@2x.png";
import BTCsIcon from "@/assets/brc20/BTCs@2x.png";
import NODEIcon from "@/assets/brc20/NODE@2x.png";
import ORDGIcon from "@/assets/brc20/ORDG@2x.png";
import PUPSIcon from "@/assets/brc20/PUPS@2x.png";
import SHIDIcon from "@/assets/brc20/SHID@2x.png";
import WIcon from "@/assets/brc20/W☮@2x.png";
import coreIcon from "@/assets/brc20/core@2x.png";
import cowsIcon from "@/assets/brc20/cows@2x.png";
import eorbIcon from "@/assets/brc20/eorb@2x.png";
import inscIcon from "@/assets/brc20/insc@2x.png";
import kormIcon from "@/assets/brc20/korm@2x.png";
import ligoIcon from "@/assets/brc20/ligo@2x.png";
import mermcon from "@/assets/brc20/merm@2x.png";
import moonIcon from "@/assets/brc20/moon@2x.png";
import ordersIcon from "@/assets/brc20/orders@2x.png";
import ordiIcon from "@/assets/brc20/ordi@2x.png";
import piinIcon from "@/assets/brc20/piin@2x.png";
import ratsIcon from "@/assets/brc20/rats@2x.png";
import satsIcon from "@/assets/brc20/sats@2x.png";
import wzrdIcon from "@/assets/brc20/wzrd@2x.png";
import πIcon from "@/assets/brc20/π@2x.png";
import πtsIcon from "@/assets/brc20/πts@2x.png";

const slogans = [
  "Lightweight and Fast",
  "Supports Android, iOS and Chrome",
  "Supports BTC and Bitcoin sidechain MVC",
  "Supports Ordinals, BRC20, Runes, MRC20, MVC20, MetaID PIN, MetaID and other protocols",
  "Supports Ordinal NFT",
  "Support MetaID to connect with DApps",
];
</script>

<template>
  <main class="m-w-[1200px]">
    <div class="space-y-[30px] pb-[100px]">
      <div
        class="pt-10 flex items-center flex-col xl:flex-row gap-20 xl:gap-0 xl:justify-between">
        <div class="pt-[1.5px] flex flex-col items-start">
          <h1 class="text-4xl lg:text-[50px] lg:leading-[60px] font-bold">
            <span>One Wallet for All</span>
            <span class="flex items-center">
              <img class="lg:w-12 w-9" :src="BitcoinIcon" alt="" />
              <span class="text-[#F7931A]">&nbsp;Bitcoin</span>
              <span>&nbsp;Ecosystems</span>
            </span>
          </h1>
          <div class="w-full space-y-5 mt-[34px] hidden xl:block">
            <div
              :key="index"
              v-for="(slogan, index) in slogans"
              class="flex items-start gap-x-[20.61px]">
              <div
                class="bg-[#EAF2FA] w-[26px] aspect-square rounded-full flex items-center justify-center shrink-0">
                <img :src="CheckIcon" alt="" class="w-2.5" />
              </div>
              <span class="sm:text-xl text-balance">{{ slogan }}</span>
            </div>
          </div>
        </div>
        <img :src="MobileIcon" class="w-[500px]" />
      </div>

      <div class="w-full space-y-5 mt-[34px] block xl:hidden">
        <div
          :key="index"
          v-for="(slogan, index) in slogans"
          class="flex items-start gap-x-[20.61px]">
          <div
            class="bg-[#EAF2FA] w-[26px] aspect-square rounded-full flex items-center justify-center shrink-0">
            <img :src="CheckIcon" alt="" class="w-2.5" />
          </div>
          <span class="sm:text-xl text-balance">{{ slogan }}</span>
        </div>
      </div>

      <!-- download button -->
      <div
        class="grid lg:grid-cols-4 grid-cols-2 gap-4 sm:gap-8 items-center w-full">
        <a
          target="_blank"
          href="https://chromewebstore.google.com/detail/metalet/lbjapbcmmceacocpimbpbidpgmlmoaao"
          class="bg-white h-15 rounded-[60px] flex items-center justify-center gap-3">
          <img class="w-6" :src="ChromeIcon" alt="" />
          <span>Download</span>
        </a>
        <a
          target="_blank"
          href="https://apps.apple.com/us/app/metalet/id6450825531?platform=iphone"
          class="bg-white h-15 rounded-[60px] flex items-center justify-center gap-3">
          <img class="w-6" :src="AppleStoreIcon" alt="" />
          <span>APP Store</span>
        </a>
        <a
          target="_blank"
          href="https://play.google.com/store/search?q=metalet&c=apps"
          class="bg-white h-15 rounded-[60px] flex items-center justify-center gap-3">
          <img class="w-6" :src="GooglePlayIcon" alt="" />
          <span>Google Play</span>
        </a>
        <a
          target="_blank"
          href="https://expo.dev/artifacts/eas/naANjt7HMwjQeTzuKJMoCP.apk "
          class="bg-white h-15 rounded-[60px] flex items-center justify-center gap-3">
          <img class="w-6" :src="AndroidAPKIcon" alt="" />
          <span>Android APK</span>
        </a>
      </div>
    </div>

    <div class="pt-[60px]">
      <h4 class="title text-center">Ease To Use</h4>
      <p class="mt-4 sub-title text-center">
        The Bitcoin Ecosystem wallet you've been anticipating.
      </p>
      <div class="mt-[60px] grid grid-cols-3 xl:gap-8 gap-4">
        <div
          class="md:col-span-1 col-span-3 bg-white rounded-xl pt-[30px] pl-[30px] relative flex flex-row md:flex-col">
          <div>
            <h6 class="inner-title">NFT</h6>
            <p class="inner-sub-title mt-1.5">Support Ordinal NFT</p>
          </div>
          <img
            :src="NFTIcon"
            alt=""
            class="w-40 sm:w-64 ml-auto mt-auto" />
        </div>
        <div
          class="md:col-span-2 col-span-3 bg-white rounded-xl pt-[30px] pl-[30px]">
          <h6 class="inner-title">BRC20 and MRC20</h6>
          <p class="inner-sub-title max-w-[400px] mt-1.5">
            Support for minting BRC20 and the rapid, real-time transfer of MRC20
            tokens.
          </p>
          <div
            class="mt-5 lg:mt-10 pb-4 flex flex-col items-end px-5 lg:gap-y-2">
            <div class="flex items-center gap-x-3 xs:gap-x-6">
              <img
                :src="ordiIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="satsIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="BTCsIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="ratsIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="piinIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="ordersIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="coreIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="satsIcon"
                alt=""
                class="size-6 sm:size-11" />
            </div>
            <div class="flex items-center gap-x-3 xs:gap-x-6">
              <img
                :src="πIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="kormIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="ligoIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="eorbIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="inscIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="mermcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="moonIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="πtsIcon"
                alt=""
                class="size-6 sm:size-11" />
              <div class="w-1"></div>
            </div>
            <div class="flex items-center gap-x-3 xs:gap-x-6">
              <img
                :src="AISNIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="WIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="wzrdIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="PUPSIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="ORDGIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="SHIDIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="cowsIcon"
                alt=""
                class="size-6 sm:size-11" />
              <img
                :src="NODEIcon"
                alt=""
                class="size-6 sm:size-11" />
            </div>
          </div>
        </div>
        <div
          class="col-span-3 bg-white rounded-xl pl-[30px] pt-[30px] relative overflow-hidden flex lg:flex-row flex-col">
          <div>
            <h6 class="inner-title">MetaID PIN</h6>
            <p class="inner-sub-title max-w-[500px] mt-1.5">
              A MetaID PIN is a unique identifier associated with a user's
              on-chain activities within the MetaID ecosystem
            </p>
          </div>
          <img :src="MetaPInIcon" alt="" class="w-[600px] mx-auto" />
          <!-- <div class="absolute bg-[#171AFF] w-[481px] h-[462px] -bottom-40" style="filter: blur(82px);"></div> -->
        </div>
      </div>
    </div>

    <div class="pt-[90px] pb-[122px]">
      <h4 class="text-center title">
        Web3 application market
      </h4>
      <p class="mt-3 sub-title text-center">
        Unleash the full potential of the decentralized world by accessing a
        diverse array of fascinating decentralized applications with just one
        seamless connection.
      </p>
      <div
        class="bg-white rounded-xl pl-[30px] pt-[30px] lg:pt-0 mt-[60px] flex items-center lg:flex-row flex-col">
        <div class="flex flex-col gap-y-[18px] items-start">
          <div class="flex items-center gap-x-2">
            <img :src="BlueFireIcon" alt="" class="w-5" />
            <span>Mobile App 3.0</span>
            <div
              class="text-white bg-[#171AFF] px-2.5 inline-block rounded-full">
              NEW
            </div>
          </div>
          <h4 class="text-center inner-title">
            Seamless connection
          </h4>
          <p class="inner-sub-title">
            Connect through MetaID for a seamless access to a diverse array of
            captivating decentralized applications, exploring the world of Web3
            applications.
          </p>
        </div>

        <img :src="MetaletMobileIcon" alt="" class="w-[600px]" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.title {
  @apply font-semibold text-2xl md:text-3xl lg:text-4xl xl:text-5xl;
}

.inner-title {
  @apply font-semibold text-lg md:text-xl lg:text-2xl xl:text-3xl;
}

.sub-title {
  @apply text-[#A4AFC0] text-sm md:text-base lg:text-lg xl:text-xl text-balance;
}

.inner-sub-title {
  @apply text-[#A4AFC0] text-xs md:text-sm lg:text-base xl:text-lg text-balance;
}
</style>
