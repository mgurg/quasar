<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">Settings</h5>

      <div class="q-pa-mt">&nbsp;</div>
      <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" class="q-gutter-md"
        @submit.prevent>

        <p class="text-h6">Kod QR:</p>
        <q-input outlined v-model="ActionUrl" readonly>
          <template v-slot:after>
            <q-btn round dense flat icon="content_copy" @click="copyToClipBoard()" />
            <q-btn round dense flat icon="qr_code_2" @click="toggleQr()" />
          </template>
        </q-input>

        <img  v-if="showQR"  :src="ActionUrlQr"   alt="QR code" />




        <p class="text-h6">Wysłanie zgłoszenia:</p>
        <q-list>
          <q-item tag="label">
            <q-item-section avatar>
              <q-radio v-model="registrationMode" val="anonymous" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Anonimowo</q-item-label>
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section avatar>
              <q-radio v-model="registrationMode" val="anonymous_with_mail" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Anonimowo po podaniu maila w domenie:
                <q-input outlined dense :placeholder="registrationMailDomain"></q-input>
              </q-item-label>
              <q-item-label caption>Przyśpiesz zakładanie konta</q-item-label>
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section avatar top>
              <q-radio v-model="registrationMode" val="logged_only" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Wyłącznie po zalogowaniu</q-item-label>
              <q-item-label caption>Wymagane jest posiadanie konta</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>


        <!-- <q-input
                outlined
                v-model="ActionUrl"
                :disable="isLoading"
                :error="!!errors.ActionUrl"
                :error-message="errors.ActionUrl"
                :label="$t('First name')"
            /> -->
        <div class="row">
          <q-space />
          <q-btn color="primary" :disable="isLoading" :loading="isLoading" type="submit" @click="save">Save</q-btn>
        </div>
      </q-form>

    </q-page>
  </div>
</template>

<script setup>

import { ref, onBeforeMount } from "vue";
import { authApi } from "boot/axios";
import { useQuasar } from 'quasar'

const $q = useQuasar()
// -----------------------------


onBeforeMount(() => {
  console.log('b')
  //   isLoading.value = true;
  getBoardId()
  load()
});

function load() {
  isLoading.value = true;

  var arr = ["idea_registration_mode", "issue_registration_email"]
  var params = new URLSearchParams();
  arr.forEach(element => {
    params.append("setting_names", element);
  });

  authApi
    .get("/settings/", { params: params })
    .then((res) => {
      console.log(res.data);
      registrationMode.value = res.data.idea_registration_mode
      registrationMode.value = res.data.idea_registration_mode
      isLoading.value = false;
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("General Error");
      }

    });
}

function getBoardId() {
  isLoading.value = true;

  authApi
    .get("/settings/board/")
    .then((res) => {
      console.log(res.data);
      ActionUrl.value = 'remontmaszyn.pl/new/' + res.data + '+234'
      isLoading.value = false;
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("General Error");
      }

    });
}

function save() {
  console.log('save')
  isLoading.value = true;

  let data = [{
    "entity": "idea_registration_mode",
    "value": registrationMode.value,
    "value_type": "string"
  }]


  authApi
    .post("/settings/", data)
    .then((res) => {
      console.log(res.data);
      ActionUrl.value = res.data
      isLoading.value = false;

      $q.notify({
        message: 'Zapisano ustawienia',
        color: 'purple'
      })
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("General Error");
      }

    });
}

let isLoading = ref(false);

let ActionUrl = ref(null)
let ActionUrlQr = ref("https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl="+ActionUrl.value+"&choe=UTF-8&chld=M")
let showQR = ref(false)

let registrationMode = ref('anonymous')
let registrationMailDomain = ref('twojafirma.pl')

function copyToClipBoard() {
  navigator.clipboard.writeText(ActionUrl.value);

  $q.notify({
    message: 'Skopiowano',
    color: 'purple'
  })
}


function toggleQr() {
  showQR.value = !showQR.value
}

</script>
