<template>
  <q-layout>
    <q-page-container>
      <div class="row justify-center">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">

          Authorisation Check...

        </q-page>
      </div>
    </q-page-container>
  </q-layout>

</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {resolveQRtoURL} from "components/api/AuthApiClient";
import {errorHandler} from "components/api/errorHandler";
import {useUserStore} from "stores/user";
import {getAnonymousItemUuidRequest} from "components/api/ItemApiClient";

import {DateTime} from "luxon";

import GuideCard from "components/viewer/cards/GuideCard.vue";
import IssuePublicForm from "components/forms/issue/IssuePublicForm.vue";
import {addAnonymousIssueRequest} from "components/api/IssueApiClient";

const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();

const qrId = ref(null);
const itemUuid = ref(null);

const isAuthenticated = ref(null);
const anonymousToken = ref(null);
const tenantId = ref(null);
const validTo = ref(null);
const redirectTo = ref(null);

const isLoading = ref(false);
let isError = ref(false);


async function verifyToken() {
  await UserStore.autoLogin();
}

// function redirectToPage() {
//   router.push({name: 'login', query: {redirect: redirectTo.value}})
// }
//
// function goToPage() {
//   if (UserStore.isAuthenticated === true) {
//     router.push(redirectTo.value);
//   }
// }

function resolveQrCode(qrCode) {
  isLoading.value = true;
  console.log("resolve QR")
  resolveQRtoURL(qrCode).then(function (response) {
    itemUuid.value = response.data.resource_uuid;
    redirectTo.value = response.data.url;
    anonymousToken.value = response.data.anonymous_token
    tenantId.value = atob(anonymousToken.value).split(".")[0]
    validTo.value = atob(anonymousToken.value).split(".")[1]

    sessionStorage.clear();
    console.log("SET anonymousToken")
    sessionStorage.setItem("anonymousToken", anonymousToken.value);
    sessionStorage.setItem("anonymousTenantId", tenantId.value);
    sessionStorage.setItem("anonymousTokenValidTo", validTo.value);

    isAuthenticated.value = UserStore.isAuthenticated;
    if (UserStore.isAuthenticated === true) {
      router.push(redirectTo.value);
    } else {
      router.push("/public" + redirectTo.value)
      console.log("/public" + redirectTo.value)
      // getItemDetails(itemUuid.value)
    }
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isAuthenticated.value = UserStore.isAuthenticated;
    console.log(errorMessage.status);
    isError.value = true;
  });
}

onBeforeMount(() => {
  isLoading.value = true;
  verifyToken();
  if (route.params.qr !== null) {
    qrId.value = route.params.qr
    resolveQrCode(qrId.value);
  }
  isLoading.value = false;
});


</script>
