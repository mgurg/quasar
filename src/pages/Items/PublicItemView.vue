<template>
  <q-layout>
    <q-page-container>
      <div class="row justify-center">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">

          <div v-if="isError===false && validToProgress < 0.9">

            <q-linear-progress :value="validToProgress" rounded size="20px" stripe/>

            <q-card bordered class="my-card no-shadow q-mt-sm">
              <q-card-section v-if="itemDetails && !isLoading">
                <q-list>
                  <q-item class="q-px-none">
                    <q-item-section>
                      <q-item-label class="text-h4">{{ itemDetails.name }}</q-item-label>
                      <!-- <q-item-label caption>{{ itemDetails.last_name }}</q-item-label> -->
                    </q-item-section>
                    <q-item-section side>
                      <div class="col-12 text-h6 q-mt-none">
                        <q-btn
                          :label="$q.screen.gt.xs ? 'Zaloguj i zobacz pełny spis' : ''"
                          class="float-right q-mr-sm" color="primary"
                          icon="login" no-caps
                          outline
                          @click="redirectToPage()"
                        />

                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-separator/>

              <q-card-actions align="right">
                <q-btn color="primary" flat icon="bug_report" no-caps>Zgłoś awarie</q-btn>
              </q-card-actions>
            </q-card>

<!--            <guide-card v-if="guides!==null && itemDetails !==null"-->
<!--                        :anonymous-token="anonymousToken"-->
<!--                        :expanded-guide="false"-->
<!--                        :guides="guides"-->
<!--                        :item-uuid="null"-->
<!--                        :public-access="true"-->
<!--            />-->

            <q-card bordered class="my-card no-shadow q-my-sm">
              <q-card-section>
                <div class="row q-col-gutter-xs">
                  <div class="text-h5">Awaria</div>
                  <q-space></q-space>
                  <q-btn :icon="expandedFailureReport ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense
                         flat
                         round
                         @click="expandedFailureReport = !expandedFailureReport"/>
                </div>

              </q-card-section>

              <q-slide-transition>
                <div v-show="expandedFailureReport" :class="$q.screen.gt.xs ? 'q-px-md':'q-px-xs'" class="q-py-md">

                  <issue-public-form @issueFormBtnClick="addButtonPressed"/>

                </div>
              </q-slide-transition>
            </q-card>
          </div>

          <div v-if="isError===false && validToProgress > 0.9"
               class="window-height window-width row justify-center items-center">
            <q-card bordered class="my-card" flat style="max-width: 300px">
              <q-card-section class="bg-grey-1">
                <div class="text-h6">Nie znalazłem kodu QR</div>
              </q-card-section>
              <q-separator dark/>
              <q-card-section>
                Kod QR Stracił ważność. Zeskanuj go ponownie, lub zaloguj się żeby mieć stały dostęp do rozszerzonego
                opisu
              </q-card-section>

              <q-separator/>

              <q-card-actions vertical>
                <q-btn v-if="isAuthenticated === false" color="primary" flat to="/login">Zaloguj się żeby przejrzeć
                  listę
                  wszystkich maszyn
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>

          <div v-if="isError===true" class="window-height window-width row justify-center items-center">
            <q-card bordered class="my-card" flat style="max-width: 300px">
              <q-card-section class="bg-grey-1">
                <div class="text-h6">Nie znalazłem kodu QR</div>
                <!--              <div class="text-subtitle2">by John Doe</div>-->

              </q-card-section>
              <q-separator dark/>
              <q-card-section>
                Nie mogłem odnaleźć maszyny. Być może została ona usunięta z spisu maszyn
              </q-card-section>

              <q-separator/>

              <q-card-actions vertical>
                <q-btn v-if="isAuthenticated === false" color="primary" flat to="/login">Zaloguj się żeby przejrzeć
                  listę
                  wszystkich maszyn
                </q-btn>
                <q-btn v-if="isAuthenticated === true" color="primary" flat to="/items">Otwórz listę wszystkich maszyn
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>

        </q-page>
      </div>
    </q-page-container>
  </q-layout>

</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {errorHandler} from "components/api/errorHandler";
import {useUserStore} from "stores/user";
import {getAnonymousItemUuidRequest} from "components/api/ItemApiClient";

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
const validToProgress = ref(0);
const redirectTo = ref(null);

let expandedGuide = ref(true)
let expandedFailureReport = ref(true)

const isLoading = ref(false);
let isError = ref(false);


async function verifyToken() {
  await UserStore.autoLogin();
}

function redirectToPage() {
  router.push({name: 'login', query: {redirect: redirectTo.value}})
}

function goToPage() {
  if (UserStore.isAuthenticated === true) {
    router.push(redirectTo.value);
  }
}

// function countDown() {
//
//   if (validTo.value !== null) {
//     // console.log("validTo: " + DateTime.fromFormat(validTo.value, 'yyyy-MM-dd HH:mm:ss', {zone: 'UTC'}).toFormat('yyyy-LL-dd HH:mm:ss z'))
//     // console.log("validFrom: " + DateTime.now().setZone("UTC").toFormat('yyyy-LL-dd HH:mm:ss z'))
//
//     const to = DateTime.fromFormat(validTo.value, 'yyyy-MM-dd HH:mm:ss', {zone: 'UTC'})
//     const now = DateTime.now().setZone("UTC")
//
//     const remainingTime = Math.abs(now.diff(to, 'minutes').as('minutes'));
//     console.log("remainingTime: " + remainingTime)
//     console.log(1 - (remainingTime / 15))
//     validToProgress.value = 1 - (remainingTime / 15)
//   }
//   setTimeout(countDown, 5000);
// }
//
// countDown();

// function resolveQrCode(qrCode) {
//   isLoading.value = true;
//
//   resolveQRtoURL(qrCode).then(function (response) {
//     itemUuid.value = response.data.resource_uuid;
//     redirectTo.value = response.data.url;
//     anonymousToken.value = response.data.anonymous_token
//     tenantId.value = atob(anonymousToken.value).split(".")[0]
//     validTo.value = atob(anonymousToken.value).split(".")[1]
//
//     sessionStorage.clear();
//     sessionStorage.setItem("anonymousToken", anonymousToken.value);
//     sessionStorage.setItem("anonymousTenantId", tenantId.value);
//     sessionStorage.setItem("anonymousTokenValidTo", validTo.value);
//
//     isAuthenticated.value = UserStore.isAuthenticated;
//     if (UserStore.isAuthenticated === true) {
//       router.push(redirectTo.value);
//     } else {
//       getItemDetails(itemUuid.value)
//     }
//     isLoading.value = false;
//   }).catch((err) => {
//     const errorMessage = errorHandler(err);
//     isAuthenticated.value = UserStore.isAuthenticated;
//     console.log(errorMessage.status);
//     isError.value = true;
//   });
// }


let itemDetails = ref(null);
let photoFiles = ref(null);
let documentFiles = ref(null);
const guides = ref([]);


function getItemDetails(uuid) {
  isLoading.value = true;
  getAnonymousItemUuidRequest(uuid, anonymousToken.value, tenantId.value).then(function (response) {
    itemDetails.value = response.data;

    photoFiles.value = response.data.files_item.filter((item) => item.mimetype.match('image.*'));
    documentFiles.value = response.data.files_item.filter((item) => !item.mimetype.match('image.*'));
    guides.value = response.data.item_guides;

    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage);
  });
}

function addButtonPressed(issueForm) {
  issueForm["item_uuid"] = itemUuid.value
  isLoading.value = true;
  addAnonymousIssueRequest(issueForm, anonymousToken.value, tenantId.value).then(function (response) {
    isLoading.value = false;
    router.push("/new_submission")
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(err);
  });
}

onBeforeMount(() => {

  // sessionStorage.clear();
  anonymousToken.value = sessionStorage.getItem("anonymousToken");
  tenantId.value = sessionStorage.getItem("anonymousTenantId");
  validTo.value = sessionStorage.getItem("anonymousTokenValidTo");
  isLoading.value = true;
  // verifyToken();
  // if (route.params.qr !== null) {
  //   qrId.value = route.params.qr
  //   resolveQrCode(qrId.value);
  // }

  console.log("Anonymous: " + route.params.uuid);
  getItemDetails(route.params.uuid);
  isLoading.value = false;
});


</script>
