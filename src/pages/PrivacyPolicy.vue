<script setup lang="ts">
import ArrowLeftIcon from "@/assets/arrow-left.svg";
import { onBeforeUnmount, onMounted } from "vue";

onMounted(() => {
  document.body.classList.add("white");
});

onBeforeUnmount(() => {
  document.body.classList.remove("white");
});
</script>

<template>
  <main class="pt-[54px] grow">
    <div class="flex items-center gap-3">
      <img
        :src="ArrowLeftIcon"
        alt=""
        @click="$router.back()"
        class="cursor-pointer" />
      <h4 class="text-2xl">Privacy policy</h4>
    </div>
    <div class="pt-6 space-y-4">
      <h1 class="text-4xl font-semibold">Metalet Privacy Policy</h1>
      <h4 class="text-lg font-semibold">
        Metalet is a blockchain wallet application dedicated to protecting
        users' privacy. This privacy policy aims to explain how Metalet
        collects, uses, stores and shares your information.
      </h4>
      <h4 class="text-lg font-semibold">Information Collection</h4>
      <p class="text-sm text-gray-primary">
        Metalet may collect the following information from you:
        <br />
        <br />
        Address of the connected account Balance information Transfer
        information Transaction signature information Token balance information,
        etc. You may choose whether to provide this information, but if you do
        not, you may not be able to use all the features of Metalet.
      </p>
      <h4 class="text-lg font-semibold">Information Use</h4>
      <p class="text-sm text-gray-primary">
        Metalet uses your information for the following tasks:
        <br />
        <br />
        To provide you with services, including managing your account,
        processing your transaction requests, providing customer support, etc.
        To improve our products and services and conduct internal analysis.
        Information Storage
        <br />
        <br />
        Metalet stores your information on your local device. We have taken
        reasonable technical measures to protect your information from
        unauthorized access, use, modification or disclosure.
      </p>
      <h4 class="text-lg font-semibold">Information Sharing</h4>
      <p class="text-sm text-gray-primary">
        Metalet will not sell or transfer your information to any third party,
        unless:
        <br />
        <br />
        With your explicit consent; Required by law or government enforcement;
        To protect Metalet and its users' legitimate interests; In the case of a
        merger, acquisition, asset transfer or bankruptcy liquidation, the
        information is transferred to the relevant party.
      </p>
      <h4 class="text-lg font-semibold">Your Rights</h4>
      <p class="text-sm text-gray-primary">
        You have the following rights:
        <br />
        <br />
        To inquire, correct and delete your personal information. To withdraw
        your consent if you have already agreed to our collection, use, storage
        and sharing of your information.
      </p>
      <h4 class="text-lg font-semibold">Modification</h4>
      <p class="text-sm text-gray-primary">
        Metalet may modify this privacy policy from time to time. We will post
        any changes on Metalet's website and notify you before the changes take
        effect. If you continue to use Metalet, it means that you agree to be
        bound by the amended privacy policy.
        <br />
        <br />
        If you have any questions about Metalet's privacy policy, please contact
        us.
      </p>
    </div>
  </main>
</template>
