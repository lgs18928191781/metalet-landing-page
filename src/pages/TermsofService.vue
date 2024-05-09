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
      <h4 class="text-2xl">Terms of Service</h4>
    </div>
    <div class="pt-6 space-y-4">
      <h1 class="text-4xl font-semibold">
        Metalet Blockchain Wallet Application User Service Agreement
      </h1>
      <h4 class="text-lg font-semibold">I. General Provisions</h4>
      <p class="text-sm text-gray-primary">
        1.1 This Agreement is entered into between you (hereinafter referred to
        as "you" or "user") and the Metalet blockchain wallet application
        (hereinafter referred to as "Metalet" or "we") regarding your download,
        installation, use, and duplication of the Metalet blockchain wallet
        application (hereinafter referred to as "the software" or "the
        service"). This Agreement has contractual effect; please read and fully
        understand its content.
        <br />
        <br />
        1.2 You shall comply with the provisions of this Agreement and relevant
        laws and regulations when using the Metalet blockchain wallet
        application. Minors should read this Agreement in the company of their
        legal guardians before using the software.
        <br />
        <br />
        1.3 By clicking to accept this Agreement, you acknowledge that you have
        read and fully understood its content and agree to all its terms. Once
        you begin using the software, you are deemed to have agreed and accepted
        all terms of this Agreement. If you do not agree to any part of this
        Agreement, please do not use or voluntarily cancel the software's
        services.
      </p>
      <h4 class="text-lg font-semibold">II. Account and Private Key</h4>
      <p class="text-sm text-gray-primary">
        2.1 When using the Metalet blockchain wallet application, you need to
        create a digital asset wallet account and set a corresponding password.
        You shall keep your account and password safe. We shall not be liable
        for any loss resulting from your improper safekeeping.
        <br />
        <br />
        2.2 You understand and agree that the software does not provide a
        private key retrieval function. Therefore, please keep your private key
        secure; the loss of the private key will result in the inability to
        retrieve your digital assets.
        <br />
        <br />
        2.3 You shall ensure that the information you provide during the use of
        the software is true and accurate so that we can provide you with better
        service.
      </p>
      <h4 class="text-lg font-semibold">III. User Rights and Obligations</h4>
      <p class="text-sm text-gray-primary">
        3.1 You have the right to use the Metalet blockchain wallet application
        according to the provisions of this Agreement and enjoy the
        corresponding rights according to the provisions of relevant laws and
        regulations.
        <br />
        <br />
        3.2 You shall comply with the provisions of this Agreement and relevant
        laws and regulations and shall not use the software for any illegal
        activities.
        <br />
        <br />
        3.3 You understand and agree that if you violate this Agreement or
        relevant laws and regulations, we have the right to terminate or suspend
        the services provided to you and hold you legally responsible.
      </p>
      <h4 class="text-lg font-semibold">IV. Disclaimer</h4>
      <p class="text-sm text-gray-primary">
        4.1 You understand and agree that the Metalet blockchain wallet
        application is only a tool for managing your digital assets and cannot
        provide any investment advice, asset management, or other services.
        <br />
        <br />
        4.2 You understand and agree that we shall not be liable for any service
        interruption or data loss caused by network failures, equipment
        failures, system maintenance, hacker attacks, or other force majeure
        factors.
        <br />
        <br />
        4.3 You understand and agree that we are not responsible for any loss
        you may incur due to improper operation or third-party reasons during
        the use of the software.
        <br />
        <br />
        4.4 You understand and agree that we are not responsible for the risks
        of the digital asset market or any potential losses you may suffer from
        investing in digital assets.
      </p>
      <h4 class="text-lg font-semibold">V. Intellectual Property</h4>
      <p class="text-sm text-gray-primary">
        5.1 All intellectual property rights of the Metalet blockchain wallet
        application, including but not limited to copyrights, trademark rights,
        patent rights, etc., belong to us. Without our prior written consent,
        you shall not use or create any related derivative works in any form.
        <br />
        <br />
        5.2 You agree and warrant that you will not infringe any third party's
        intellectual property rights while using the Metalet blockchain wallet
        application. If you are involved in any infringing activity, you shall
        bear legal responsibility independently and ensure that we are exempt
        from any resulting loss.
      </p>
      <h4 class="text-lg font-semibold">VI. Applicable Law and Jurisdiction</h4>
      <p class="text-sm text-gray-primary">
        6.1 The conclusion, effectiveness, performance, interpretation, and
        dispute resolution of this Agreement shall be governed by international
        law and the laws of your country/region. In the event of a conflict of
        laws, the laws of your country/region shall prevail.
        <br />
        <br />
        6.2 If any dispute arises between you and us due to this Agreement, both
        parties shall first attempt to resolve the dispute through friendly
        negotiation. If negotiations fail, you agree to submit the dispute to a
        court of competent jurisdiction in your country/region for litigation
        resolution.
      </p>
      <h4 class="text-lg font-semibold">VII. Miscellaneous</h4>
      <p class="text-sm text-gray-primary">
        7.1 If any provision of this Agreement is found to be invalid or
        unenforceable, that provision shall be deemed severable and shall not
        affect the validity and enforceability of the remaining provisions.
        <br />
        <br />
        7.2 We reserve the right to modify the content of this Agreement at any
        time. If changes are made to this Agreement, we will display the
        modified agreement content on the relevant page. Your continued use of
        the software constitutes your acceptance of the modified agreement
        content.
        <br />
        <br />
        7.3 The headings in this Agreement are for convenience only and have no
        legal or contractual effect.
        <br />
        <br />
        Lastly, you confirm once again that you have fully read, understood, and
        agreed to accept all the content of this Agreement. If you have any
        questions, please contact us in a timely manner.
      </p>
    </div>
  </main>
</template>
