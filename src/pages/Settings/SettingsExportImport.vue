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

<!--        <q-card bordered class="my-card no-shadow q-mt-sm q-pt-none">-->
<!--          <q-card-section>-->
<!--            <div class="text-h5">Import</div>-->
<!--            <q-separator></q-separator>-->
<!--            <p>Obecnie możliwy jest wyłącznie import użytkowników. Jest to możliwe dla pliku CSV o formacie:</p>-->
<!--            <p>Imię, Nazwisko, Email, Hasło, Telefon, Rola</p>-->
<!--            <div>-->
<!--              <table style="border-color:black;border-style:solid;border-width:1px;">-->
<!--                <thead>-->
<!--                <tr >-->
<!--                  <th>Imię</th>-->
<!--                  <th>Nazwisko</th>-->
<!--                  <th>Email</th>-->
<!--                  <th>Hasło</th>-->
<!--                  <th>Telefon</th>-->
<!--                  <th>Rola</th>-->
<!--                </tr>-->
<!--                </thead>-->
<!--                <tbody style="border-color:black;border-style:solid;border-width:1px;">-->
<!--                <tr>-->
<!--                  <td>Obowiązkowe</td>-->
<!--                  <td>Obowiązkowe</td>-->
<!--                  <td>Obowiązkowe</td>-->
<!--                  <td></td>-->
<!--                  <td></td>-->
<!--                  <td></td>-->
<!--                </tr>-->
<!--                </tbody>-->
<!--              </table>-->
<!--            </div>-->
<!--            <div class="text-h6">Użytkownicy</div>-->

<!--            <q-file outlined v-model="model">-->
<!--              <template v-slot:prepend>-->
<!--                <q-icon name="attach_file" />-->
<!--              </template>-->
<!--            </q-file>-->

<!--          </q-card-section>-->
<!--        </q-card>-->

        <q-card bordered class="my-card no-shadow q-mt-sm q-pt-none">
          <q-card-section>
            <div class="text-h5">Export</div>
            <q-separator></q-separator>
          </q-card-section>
          <q-card-section>
            <q-btn  icon="file_download" flat color="primary" @click="usersExportToCsv">Pracownicy</q-btn>
            <div class="q-py-md">Eksport listy pracowników zawierający pola: Imię, Nazwisko, Email, Telefon</div>

            <q-separator/>
            <q-btn class="q-mt-lg" icon="file_download" flat color="primary" @click="itemsExportToCsv">Przedmioty</q-btn>
            <div class="q-py-md">Eksport listy Przedmiotów zawierający pola: Nazwa, Symbol, Opis, Kod QR</div>

            <q-separator/>

            <q-btn class="q-mt-lg" icon="file_download" flat color="primary" @click="issuesExportToCsv">Zgłoszenia</q-btn>
            <div class="q-py-md">Eksport listy Przedmiotów zawierający pola: Nazwa, Symbol, Opis, Kod QR</div>

          </q-card-section>

        </q-card>

      </q-page>
    </div>
</template>

<script setup>

import {ref} from "vue";
import {getUserCsvRequest} from "components/api/UserApiClient";
import {errorHandler} from "components/api/errorHandler";
import {exportFile} from "quasar";


const isLoading = ref(false)
const isError = ref(false)
function usersExportToCsv() {
  isLoading.value = true;
  getUserCsvRequest().then(function (response) {
    const status = exportFile(`users_${new Date().toJSON().slice(0,10)}.csv`, response.data)
    console.log(response.headers)
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


function itemsExportToCsv() {
  isLoading.value = true;
  getUserCsvRequest().then(function (response) {
    const status = exportFile(`items_${new Date().toJSON().slice(0,10)}.csv`, response.data)
    console.log(response.headers)
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function issuesExportToCsv() {
  isLoading.value = true;
  getUserCsvRequest().then(function (response) {
    const status = exportFile(`issues_${new Date().toJSON().slice(0,10)}.csv`, response.data)
    console.log(response.headers)
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


const model= ref(null)
</script>
