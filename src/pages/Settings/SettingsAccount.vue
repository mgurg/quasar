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


      <div class="row q-col-gutter-sm">
      <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
        <q-card bordered class="my-card no-shadow q-mt-sm fit">
          <q-card-section v-if="companyInfo!== null">
            <div class="text-h5">Firma:</div>

            <div>{{companyInfo.name}}</div>
            <div>{{companyInfo.street}}</div>
            <div>{{companyInfo.city}}</div>
            <q-separator/>
            <div>{{companyInfo.nip}}</div>

          </q-card-section>
        </q-card >
        </div>
        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
        <q-card bordered class="my-card no-shadow q-mt-sm fit">
          <q-card-section>
            <div class="text-h5">Użytkownicy:</div>


          </q-card-section>
        </q-card>
        </div>
        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
        <q-card bordered class="my-card no-shadow q-mt-sm fit">
          <q-card-section>

          <div class="text-h5">Wykorzystane miejsce:</div>

          </q-card-section>
        </q-card>
        </div>
        </div>
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
