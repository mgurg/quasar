<template>
  <q-layout>
    <q-page-container>
      <div class="row justify-center">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
          <div class="q-pa-md">



            <div v-if="itemDetails!==null">
              <h3>{{itemDetails.name}}</h3>
            </div>
            <div v-if="isAuthenticated===false">
              <q-btn outline @click="getItemDetails('094b4373-a120-42f5-90ed-23dbfbe1cd9d')">Zobacz przewodniki</q-btn>
              <q-btn outline>Zgłoś problem</q-btn>
            </div>

            <div v-if="redirectTo!=null">
              {{isAuthenticated}} <br>
              {{ qrId }} <br>
              {{ anonymousToken }} <br>
              {{ tenantId }} <br>
              {{redirectTo}}
            </div>
            <!-- <img
              src="https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=https://remontmaszyn.pl/new/8tl+234&choe=UTF-8&chld=M"
              alt="string"
            /> -->

          </div>
        </q-page>
      </div>
    </q-page-container>
  </q-layout>

</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";
import {resolveQRtoURL} from "components/api/AuthApiClient";
import {errorHandler} from "components/api/errorHandler";
import {useUserStore} from "stores/user";
import {getAnonymousItemUuidRequest, getItemUuidRequest} from "components/api/ItemApiClient";

const route = useRoute();
const UserStore = useUserStore();

const qrId = ref(null);
const isAuthenticated = ref(null);
const anonymousToken = ref(null);
const tenantId = ref(null);
const redirectTo = ref(null);

const isLoading = ref(false);
let isError = ref(false);

async function verifyToken() {
  console.log('verifyToken')
  await UserStore.autoLogin();
}

function resolveQrCode(qrCode) {
  isLoading.value = true;
  console.log("ID: ", qrCode)

  resolveQRtoURL(qrCode).then(function (response) {
    console.log(response.data)

    anonymousToken.value = response.data.anonymous_token
    tenantId.value = atob(anonymousToken.value).split(".")[0]
    redirectTo.value = response.data.url;
    isAuthenticated.value = UserStore.isAuthenticated;
    if (UserStore.isAuthenticated === true) {
      router.push(redirectTo.value);
    } else {
      getItemDetails('094b4373-a120-42f5-90ed-23dbfbe1cd9d')
      console.log('Czeka na logowanie')
    }
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


let itemDetails = ref(null);
let photoFiles = ref(null);
let documentFiles = ref(null);


function getItemDetails(uuid) {
  isLoading.value = true;

  getAnonymousItemUuidRequest(uuid, anonymousToken.value, tenantId.value).then(function (response) {
    console.log(response.data);
    itemDetails.value = response.data;


    console.log("photoFiles")

    photoFiles.value = response.data.files_item.filter((item) => item.mimetype.match('image.*'));
    documentFiles.value = response.data.files_item.filter((item) => !item.mimetype.match('image.*'));
    console.log(photoFiles.value)

    // documentFiles.value =  itemDetails.value;
    // json.value = res.data.body_json;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage);
  });
}

onBeforeMount(() => {
  isLoading.value = true;
  verifyToken();
  // UserStore.autoLogin();

  if (route.params.qr != null) {
    qrId.value = route.params.qr
    resolveQrCode(qrId.value);
  }
  isLoading.value = false;
});


</script>
