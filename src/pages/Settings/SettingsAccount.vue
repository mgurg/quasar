<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs active-color="grey" class="q-ma-sm text-grey">
        <template v-slot:separator>
          <q-icon
            color="grey"
            name="chevron_right"
            size="1.5em"
          />
        </template>
        <q-breadcrumbs-el icon="home" to="/"/>
        <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings"/>
        <q-breadcrumbs-el :label="$t('Ideas')" icon="info"/>
      </q-breadcrumbs>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-list>
          <q-item class="q-px-sm">
            <q-item-section avatar>
              <q-btn color="grey" dense flat icon="arrow_back_ios" no-caps @click="router.back()">{{
                  $t("Return")
                }}
              </q-btn>
            </q-item-section>
            <q-item-section></q-item-section>
          </q-item>
        </q-list>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5">Konto</q-item-label>
                <!--                 <q-item-label caption>{{ itemDetails.summary }}</q-item-label>-->
                <!--                <q-item-label caption>{{permissionDetails.role_description}}</q-item-label>-->
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>


      <div class="row q-col-gutter-sm q-py-md">
        <div class="col-md-4 col-sm-6 col-xs-6">
          <q-item class="q-pa-none rounded-borders fit" style="background-color: #e91e63">

            <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                            side
                            style="background-color: #d81b60">
              <q-icon color="white" name="factory" size="24px"></q-icon>
            </q-item-section>
            <q-item-section v-if="companyInfo" class="q-pa-md q-ml-none  text-white">
              <!--              <q-item-label>{{ $t('New') }}</q-item-label>-->
              <!--              <q-item-label>{{ $t('New') }}</q-item-label>-->


              <q-item-label class="text-weight-bold">{{ companyInfo.name }}</q-item-label>
              <q-item-label>{{ companyInfo.street }}</q-item-label>
              <q-item-label>{{ companyInfo.city }}</q-item-label>
              <q-item-label>NIP: {{ companyInfo.nip }}</q-item-label>


            </q-item-section>
          </q-item>
        </div>
        <div class="col-md-4 col-sm-6 col-xs-6">
          <q-item class="q-pa-none rounded-borders fit" style="background-color: #ffb300">
            <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                            side
                            style="background-color: #ffa000">
              <q-icon color="white" name="people" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h5 text-weight-bolder">{{ userCount }}
              </q-item-label>
              <q-item-label>Użytkownicy</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-md-4 col-sm-6 col-xs-6">
          <q-item class="q-pa-none rounded-borders fit" style="background-color: #009688">
            <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                            side
                            style="background-color: #00897b">
              <q-icon color="white" name="storage" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h5 text-weight-bolder">{{ formatBytes(usedSpace) }}
              </q-item-label>
              <q-item-label>Used space</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>

      <!--      <div class="row q-col-gutter-sm">-->
      <!--        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">-->
      <!--          <q-card bordered class="my-card no-shadow q-mt-sm fit">-->
      <!--            <q-card-section v-if="companyInfo!== null">-->
      <!--              <div class="text-h5">Firma:</div>-->

      <!--              <div>{{ companyInfo.name }}</div>-->
      <!--              <div>{{ companyInfo.street }}</div>-->
      <!--              <div>{{ companyInfo.city }}</div>-->
      <!--              <q-separator/>-->
      <!--              <div>{{ companyInfo.nip }}</div>-->

      <!--            </q-card-section>-->
      <!--          </q-card>-->
      <!--        </div>-->
      <!--        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">-->
      <!--          <q-card bordered class="my-card no-shadow q-mt-sm fit">-->
      <!--            <q-card-section>-->
      <!--              <div class="text-h5">Użytkownicy:</div>-->
      <!--              <div class="text-h5">{{ userCount }}</div>-->


      <!--            </q-card-section>-->
      <!--          </q-card>-->
      <!--        </div>-->
      <!--        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">-->
      <!--          <q-card bordered class="my-card no-shadow q-mt-sm fit">-->
      <!--            <q-card-section>-->

      <!--              <div class="text-h5">Wykorzystane miejsce:</div>-->
      <!--              <div class="text-h5">{{ usedSpace }}</div>-->
      <!--            </q-card-section>-->
      <!--          </q-card>-->
      <!--        </div>-->
      <!--      </div>-->
    </q-page>
  </div>

</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {errorHandler} from "components/api/errorHandler";
import {getCompanyInfoRequest} from "components/api/AuthApiClient";
import {getUserCountRequest} from "components/api/UserApiClient";
import {getUsedSpaceRequest} from "components/api/FilesApiClient";
import {useRouter} from "vue-router";

const router = useRouter();

let isLoading = ref(false);
let isError = ref(false);

const tags = ref(null);
const companyInfo = ref(null);
const userCount = ref(null);
const usedSpace = ref(null);


const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bajtów";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bajtów", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

function fetchCompanyInfo() {
  isLoading.value = true;
  getCompanyInfoRequest().then(function (response) {
    companyInfo.value = response.data;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


function fetchUserCountInfo() {
  isLoading.value = true;
  getUserCountRequest().then(function (response) {
    userCount.value = response.data;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function fetchUsedSpaceInfo() {
  isLoading.value = true;
  getUsedSpaceRequest().then(function (response) {
    usedSpace.value = response.data;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

onBeforeMount(() => {
  fetchCompanyInfo()
  fetchUserCountInfo()
  fetchUsedSpaceInfo()
});


</script>
