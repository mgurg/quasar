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
                <q-item-label class="text-h5">Import/Export</q-item-label>
                <!--                 <q-item-label caption>{{ itemDetails.summary }}</q-item-label>-->
                <!--                <q-item-label caption>{{permissionDetails.role_description}}</q-item-label>-->
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
      <q-card bordered class="my-card no-shadow q-mt-sm q-pt-none">
        <q-card-section>
          <div class="text-h5">Export</div>
          <p class="q-pt-md">Eksport wybranych danych do prostych plików CSV. </p>
        </q-card-section>
      </q-card>

      <div class="row q-col-gutter-sm q-pb-md q-mt-sm" >
        <div class="col-lg-6 col-md-6 col-xs-12 col-sm-12" v-if="hasPermission('USER_EXPORT')">
          <q-item class="q-pa-none rounded-borders fit" style="background-color: #FFFFFF">
            <q-item-section
              v-ripple class=" q-pa-lg q-mr-none text-white rounded-borders cursor-pointer"
              clickable
              side
              style="background-color: #93b7be"
              @click="usersExportToCsv"
            >
              <q-icon color="blue-grey-10" name="file_download" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-blue-grey-10 text-h5 text-weight-bolder">Eksport użytkowników</q-item-label>

              <q-item-label class="text-blue-grey-10">Imie, nazwisko, mail, telefon</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-lg-6 col-md-6 col-xs-12 col-sm-12" v-if="hasPermission('ITEM_EXPORT')">
          <q-item class="q-pa-none rounded-borders fit" style="background-color: #FFFFFF">
            <q-item-section
              v-ripple class=" q-pa-lg q-mr-none text-white rounded-borders cursor-pointer"
              clickable
              side
              style="background-color: #93b7be"
              @click="itemsExportToCsv"
            >
              <q-icon color="blue-grey-10" name="file_download" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-blue-grey-10 text-h5 text-weight-bolder">Eksport urządzeń</q-item-label>
              <q-item-label class="text-blue-grey-10"> Nazwa, Opis, Symbol</q-item-label>
            </q-item-section>
          </q-item>

        </div>
        <div class="col-lg-6 col-md-6 col-xs-12 col-sm-12"  v-if="hasPermission('ISSUE_EXPORT')">
          <q-item class="q-pa-none rounded-borders fit" style="background-color: #FFFFFF">
            <q-item-section
              v-ripple class=" q-pa-lg q-mr-none text-white rounded-borders cursor-pointer"
              clickable
              side
              style="background-color: #93b7be"
              @click="issuesExportToCsv"
            >
              <q-icon color="blue-grey-10" name="file_download" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-blue-grey-10 text-h5 text-weight-bolder">Eksport zgłoszeń</q-item-label>

              <q-item-label class="text-blue-grey-10">Symbol, nazwa, Opis, Autor, Status, Data utwoezenia</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>


<!--      <q-card bordered class="my-card no-shadow q-mt-sm q-pt-none">-->
<!--        <q-card-section>-->
<!--          <div class="text-h5">Import</div>-->
<!--          <p class="q-pt-md">Import Danych </p>-->
<!--        </q-card-section>-->
<!--      </q-card>-->


<!--      <div class="row q-col-gutter-sm q-pb-md q-mt-sm" >-->
<!--        <div class="col-lg-6 col-md-6 col-xs-12 col-sm-12" v-if="hasPermission('USER_IMPORT')">-->
<!--          <q-item class="q-pa-none rounded-borders fit" style="background-color: #FFFFFF">-->
<!--            <q-item-section-->
<!--              v-ripple class=" q-pa-lg q-mr-none text-white rounded-borders cursor-pointer"-->
<!--              clickable-->
<!--              side-->
<!--              style="background-color: #93b7be"-->
<!--              @click="usersExportToCsv"-->
<!--            >-->
<!--              <q-icon color="blue-grey-10" name="file_upload" size="24px"></q-icon>-->
<!--            </q-item-section>-->
<!--            <q-item-section class=" q-pa-md q-ml-none  text-white">-->
<!--              <q-item-label class="text-blue-grey-10 text-h5 text-weight-bolder">Import użytkowników</q-item-label>-->

<!--              <q-item-label class="text-blue-grey-10"><a href="">Pobierz szablon pliku CSV</a></q-item-label>-->
<!--            </q-item-section>-->
<!--          </q-item>-->
<!--        </div>-->
<!--        <div class="col-lg-6 col-md-6 col-xs-12 col-sm-12"  v-if="hasPermission('ITEM_IMPORT')">-->
<!--          <q-item class="q-pa-none rounded-borders fit" style="background-color: #FFFFFF">-->
<!--            <q-item-section-->
<!--              v-ripple class=" q-pa-lg q-mr-none text-white rounded-borders cursor-pointer"-->
<!--              clickable-->
<!--              side-->
<!--              style="background-color: #93b7be"-->
<!--              @click="itemsExportToCsv"-->
<!--            >-->
<!--              <q-icon color="blue-grey-10" name="file_upload" size="24px"></q-icon>-->
<!--            </q-item-section>-->
<!--            <q-item-section class=" q-pa-md q-ml-none  text-white">-->
<!--              <q-item-label class="text-blue-grey-10 text-h5 text-weight-bolder">Import urządzeń</q-item-label>-->
<!--              <q-item-label class="text-blue-grey-10"><a href="">Pobierz szablon pliku CSV</a></q-item-label>-->
<!--            </q-item-section>-->
<!--          </q-item>-->

<!--        </div>-->
<!--        <div class="col-lg-6 col-md-6 col-xs-12 col-sm-12"  v-if="hasPermission('ISSUE_IMPORT')">-->
<!--          <q-item class="q-pa-none rounded-borders fit" style="background-color: #FFFFFF">-->
<!--            <q-item-section-->
<!--              v-ripple class=" q-pa-lg q-mr-none text-white rounded-borders cursor-pointer"-->
<!--              clickable-->
<!--              side-->
<!--              style="background-color: #93b7be"-->
<!--              @click="issuesExportToCsv"-->
<!--            >-->
<!--              <q-icon color="blue-grey-10" name="file_upload" size="24px"></q-icon>-->
<!--            </q-item-section>-->
<!--            <q-item-section class=" q-pa-md q-ml-none  text-white">-->
<!--              <q-item-label class="text-blue-grey-10 text-h5 text-weight-bolder">Import zgłoszeń</q-item-label>-->

<!--              <q-item-label class="text-blue-grey-10"><a href="">Pobierz szablon pliku CSV</a></q-item-label>-->
<!--            </q-item-section>-->
<!--          </q-item>-->
<!--        </div>-->
<!--      </div>-->

    </q-page>
  </div>
</template>

<script setup>

import {computed, ref} from "vue";
import {getUserCsvRequest} from "components/api/UserApiClient";
import {errorHandler} from "components/api/errorHandler";
import {exportFile} from "quasar";
import {useUserStore} from "stores/user";
import {useRouter} from "vue-router";
import {getItemCsvRequest} from "components/api/ItemApiClient";
import {getIssueCsvRequest} from "components/api/IssueApiClient";

const router = useRouter();
const UserStore = useUserStore();

const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return permissions.value === null ? false : Boolean(permissions.value.includes(permission));
}

const isLoading = ref(false)
const isError = ref(false)

function usersExportToCsv() {
  isLoading.value = true;
  getUserCsvRequest().then(function (response) {
    const status = exportFile(`users_${new Date().toJSON().slice(0, 10)}.csv`, response.data)
    console.log(response.headers)
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


function itemsExportToCsv() {
  isLoading.value = true;
  getItemCsvRequest().then(function (response) {
    const status = exportFile(`items_${new Date().toJSON().slice(0, 10)}.csv`, response.data)
    console.log(response.headers)
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function issuesExportToCsv() {
  isLoading.value = true;
  getIssueCsvRequest().then(function (response) {
    const status = exportFile(`issues_${new Date().toJSON().slice(0, 10)}.csv`, response.data)
    console.log(response.headers)
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


const model = ref(null)
</script>
