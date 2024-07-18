<script setup lang="ts">
import NFTIcon from "@/assets/NFT.png";
import CheckIcon from "@/assets/Check.svg";
import MobileIcon from "@/assets/Mobile.png";
import ChromeIcon from "@/assets/Chrome.svg";
import MetaPInIcon from "@/assets/MetaPin.png";
import BitcoinIcon from "@/assets/bitcoin.svg";
import BlueFireIcon from "@/assets/blue-fire.svg";
import AndroidAPKIcon from "@/assets/Android.svg";
import AppleStoreIcon from "@/assets/AppleStore.svg";
import GooglePlayIcon from "@/assets/GooglePlay.svg";
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
  "Supports Ordinals, BRC20, MRC20, MVC20, MetaID PIN, MetaID and other protocols (Runes will be launched soon)",
  "Supports Ordinal NFT",
  "Support MetaID to connect with DApps",
];
</script>

<template>
  <main class="m-w-[1200px]">
    <div class="space-y-[30px] pb-[100px]">
      <div
        class="pt-10 flex items-center flex-col-reverse xl:flex-row gap-20 xl:gap-0  xl:justify-between">
        <div class="pt-[1.5px] flex flex-col items-start">
          <h1 class="text-4xl lg:text-[50px] lg:leading-[60px] font-bold">
            <span>One Wallet for All</span>
            <span class="flex items-center">
              <img class="w-9" :src="BitcoinIcon" alt="" />
              <span class="text-[#F7931A]">Bitcoin</span>
              <span>&nbsp;Ecosystems</span>
            </span>
          </h1>
          <div class="w-full space-y-5 mt-[34px]">
            <div
              :key="index"
              v-for="(slogan, index) in slogans"
              class="flex items-start gap-x-[20.61px]">
              <div
                class="bg-[#EAF2FA] w-[26px] aspect-square rounded-full flex items-center justify-center shrink-0">
                <img :src="CheckIcon" alt="" class="w-2.5" />
              </div>
              <span class="sm:text-xl">{{ slogan }}</span>
            </div>
          </div>
        </div>
        <img :src="MobileIcon" class="w-[500px]" />
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
          href="https://metalet.space/down/metalet.apk"
          class="bg-white h-15 rounded-[60px] flex items-center justify-center gap-3">
          <img class="w-6" :src="AndroidAPKIcon" alt="" />
          <span>Android APK</span>
        </a>
      </div>
    </div>

    <div class="pt-[60px]">
      <h4 class="text-center font-semibold text-2xl md:text-5xl">Ease To Use</h4>
      <p class="mt-4 text-[#A4AFC0] text-xl text-center">
        The Bitcoin Ecosystem wallet you've been anticipating.
      </p>
      <div class="mt-[60px] grid grid-cols-3 xl:gap-8 gap-4">
        <div
          class="lg:col-span-1 col-span-3 bg-white rounded-xl pt-[30px] pl-[30px] relative">
          <h6 class="text-[30px] font-semibold">NFT</h6>
          <p class="text-[#A4AFC0]">Support Ordinal NFT</p>
          <img :src="NFTIcon" alt="" class="lg:w-auto md:w-[50%] w-[80%] ml-auto" />
        </div>
        <div class="lg:col-span-2 col-span-3 bg-white rounded-xl pt-[30px] pl-[30px]">
          <h6 class="text-[30px] font-semibold">BRC20 and MRC20</h6>
          <p class="text-[#A4AFC0] max-w-[332px]">
            Support for minting BRC20 and the rapid, real-time transfer of MRC20
            tokens.
          </p>
          <div class="mt-10 pb-4 flex flex-col items-end px-5 lg:gap-y-2">
            <div class="flex items-center gap-x-6">
              <img :src="ordiIcon" alt="" class="md:size-12 size-8" />
              <img :src="satsIcon" alt="" class="md:size-12 size-8" />
              <img :src="BTCsIcon" alt="" class="md:size-12 size-8" />
              <img :src="ratsIcon" alt="" class="md:size-12 size-8" />
              <img :src="piinIcon" alt="" class="md:size-12 size-8" />
              <img :src="ordersIcon" alt="" class="md:size-12 size-8" />
              <img :src="coreIcon" alt="" class="md:size-12 size-8" />
              <img :src="satsIcon" alt="" class="md:size-12 size-8" />
            </div>
            <div class="flex items-center gap-x-6">
              <img :src="πIcon" alt="" class="md:size-12 size-8" />
              <img :src="kormIcon" alt="" class="md:size-12 size-8" />
              <img :src="ligoIcon" alt="" class="md:size-12 size-8" />
              <img :src="eorbIcon" alt="" class="md:size-12 size-8" />
              <img :src="inscIcon" alt="" class="md:size-12 size-8" />
              <img :src="mermcon" alt="" class="md:size-12 size-8" />
              <img :src="moonIcon" alt="" class="md:size-12 size-8" />
              <img :src="πtsIcon" alt="" class="md:size-12 size-8" />
              <div class="w-1"></div>
            </div>
            <div class="flex items-center gap-x-6 ml-8">
              <img :src="AISNIcon" alt="" class="md:size-12 size-8" />
              <img :src="WIcon" alt="" class="md:size-12 size-8" />
              <img :src="wzrdIcon" alt="" class="md:size-12 size-8" />
              <img :src="PUPSIcon" alt="" class="md:size-12 size-8" />
              <img :src="ORDGIcon" alt="" class="md:size-12 size-8" />
              <img :src="SHIDIcon" alt="" class="md:size-12 size-8" />
              <img :src="cowsIcon" alt="" class="md:size-12 size-8" />
              <img :src="NODEIcon" alt="" class="md:size-12 size-8" />
            </div>
          </div>
        </div>
        <div class="col-span-3 bg-white rounded-xl pt-[30px] pl-[30px]">
          <h6 class="text-[30px] font-semibold">MetaID PIN</h6>
          <p class="text-[#A4AFC0]">
            A MetaID PIN is a unique identifier associated with a user's
            on-chain activities within the MetaID ecosystem
          </p>
          <img :src="MetaPInIcon" alt="" class="ml-auto md:w-[80%]" />
        </div>
      </div>
    </div>

    <div class="pt-[90px] pb-[122px]">
      <h4 class="text-center font-semibold text-2xl md:text-5xl">
        Web3 application market
      </h4>
      <p class="mt-3 text-[#A4AFC0] text-xl text-center">
        Unleash the full potential of the decentralized world by accessing a
        diverse array of fascinating decentralized applications with just one
        seamless connection.
      </p>
      <div class="bg-white rounded-xl pt-[30px] pl-[30px] mt-[60px] flex items-center lg:flex-row flex-col">
        <div class="flex flex-col gap-y-[18px] items-start">
          <div class="flex items-center gap-x-2">
            <img :src="BlueFireIcon" alt="" class="w-5" />
            <span>Mobile App 3.0</span>
            <div
              class="text-white bg-[#171AFF] px-2.5 inline-block rounded-full">
              NEW
            </div>
          </div>
          <h4 class="text-center font-semibold text-2xl md:text-5xl">
            Seamless connection
          </h4>
          <p class="text-[#A4AFC0] text-xl">
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

<style scoped></style>
