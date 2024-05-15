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
        @click="$router.replace('/')"
        class="cursor-pointer" />
      <h4 class="text-2xl">Privacy policy</h4>
    </div>
    <div class="pt-6 space-y-4">
      <h1 class="text-4xl font-semibold">Metalet Privacy Policy</h1>
      <h4>
        Metalet is a blockchain wallet application committed to protecting
        users’ privacy. This privacy policy aims to explain how Metalet
        collects, uses, stores, and shares your information.
      </h4>
      <h4>Information Collection</h4>
      <p>Metalet may collect the following information from you:</p>
      <ul class="pl-4 text-gray-primary">
        <li class="list-disc">Associated account addresses</li>
        <li class="list-disc">Balance information</li>
        <li class="list-disc">Transfer information</li>
        <li class="list-disc">Transaction signature information</li>
        <li class="list-disc">Token balance information, etc.</li>
      </ul>
      <p>
        You may choose whether or not to provide this information, but if you do
        not provide it, you may not be able to use all the features of Metalet.
      </p>
      <h4>Use of Information</h4>
      <p>Metalet uses your information for the following purposes:</p>
      <ul class="pl-4 text-gray-primary">
        <li class="list-disc">
          To provide services to you, including managing your account,
          processing your transaction requests, and offering customer support.
        </li>
        <li class="list-disc">
          To improve our products and services and conduct internal analytics.
        </li>
      </ul>
      <h4>Information Storage</h4>
      <p>
        Metalet stores your information on your local device. We have
        implemented reasonable technological measures to protect your
        information from unauthorized access, use, modification, or disclosure.
      </p>
      <h4>Information Sharing</h4>
      <p>
        Metalet does not sell or transfer your information to any third party,
        unless:
      </p>
      <ul class="pl-4 text-gray-primary">
        <li class="list-disc">You have explicitly consented.</li>
        <li class="list-disc">
          Required by law or by government law enforcement bodies.
        </li>
        <li class="list-disc">
          To protect the lawful rights and interests of Metalet and its users.
        </li>
        <li class="list-disc">
          In the event of a merger, acquisition, asset transfer, or bankruptcy
          liquidation, information will be transferred to the relevant parties.
        </li>
      </ul>
      <h4>Your Rights</h4>
      <p>You have the following rights:</p>
      <ul class="pl-4 text-gray-primary">
        <li class="list-disc">
          To inquire, correct, or delete your personal information.
        </li>
        <li class="list-disc">
          To withdraw your consent if you have agreed to our collection, use,
          storage, and sharing of your information.
        </li>
      </ul>
      <h4>Modification</h4>
      <p>
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

<style scoped>
h4 {
  @apply text-lg font-semibold;
}

p {
  @apply text-sm text-gray-primary;
}
</style>
