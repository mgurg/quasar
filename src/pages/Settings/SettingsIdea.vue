<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs class="q-ma-sm text-grey" active-color="grey">
        <template v-slot:separator>
          <q-icon
            size="1.5em"
            name="chevron_right"
            color="grey"
          />
        </template>
        <q-breadcrumbs-el icon="home" to="/"/>
        <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings"/>
        <q-breadcrumbs-el :label="$t('Ideas')" icon="info"/>
      </q-breadcrumbs>

      <q-card class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section>
          <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" class="q-gutter-md"
                  @submit.prevent>

            <p class="text-h5"> Powiadomienia </p>

            <p class="text-h6"> SMS </p>
            <p>Informuj mnie o:</p>
            <ul>
              <li>każdym nowym problemie, o priorytecie wyższym lub równym: </li>
              <ul>
                <li>brak priorytetu (usterka, maszyna działa)</li>
                <li>niskim</li>
                <li>średnim</li>
                <li>wysokim (poważna awaria, zatrzymanie)</li>
              </ul>
              <li>Tylko o problemie przypisanym do mnie (nieważne jaki priorytet)</li>
            </ul>

            <p class="text-h6"> Email </p>
            <p>Informuj mnie o:</p>
            <ul>
              <li>każdym nowym problemie, o priorytecie wyższym lub równym: </li>
              <ul>
                <li>brak priorytetu (usterka, maszyna działa)</li>
                <li>niskim</li>
                <li>średnim</li>
                <li>wysokim (poważna awaria, zatrzymanie)</li>
              </ul>
              <li>Tylko o problemie przypisanym do mnie (nieważne jaki priorytet)</li>
            </ul>

<!--            <q-input outlined v-model="ActionUrl" readonly>-->
<!--              <template v-slot:after>-->
<!--                <q-btn round dense flat icon="content_copy" @click="copyToClipBoard()"/>-->
<!--                <q-btn round dense flat icon="qr_code_2" @click="toggleQr()"/>-->
<!--              </template>-->
<!--            </q-input>-->

<!--            <img v-if="showQR" :src="ActionUrlQr" alt="QR code"/>-->

            <p class="text-h6">{{ $t("Submission type") }}</p>
            <q-list>
              <q-item tag="label">
                <q-item-section avatar>
                  <q-radio v-model="registrationMode" val="anonymous"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t("Anonymous") }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label">
                <q-item-section avatar>
                  <q-radio v-model="registrationMode" val="anonymous_with_mail"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t("Anonymous with required confirmation") }}
                    <q-input outlined dense :placeholder="registrationMailDomain"></q-input>
                  </q-item-label>
                  <q-item-label caption>Przyśpiesz zakładanie konta</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label">
                <q-item-section avatar top>
                  <q-radio v-model="registrationMode" val="logged_only"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t("Only for logged users") }}</q-item-label>
                  <q-item-label caption>{{ $t("You must have an account") }}</q-item-label>
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
              <q-space/>
              <q-btn color="primary" :disable="isLoading" :loading="isLoading" type="submit" @click="save">Save</q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>


    </q-page>
  </div>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {authApi} from "boot/axios";
import {useQuasar} from 'quasar'

const $q = useQuasar()
let ActionUrl = ref("https://beta.remontmaszyn.pl/");
// -----------------------------


onBeforeMount(() => {

  //   isLoading.value = true;
  // getBoardId()
  // load()
});

// function load() {
//   isLoading.value = true;
//
//   var arr = ["idea_registration_mode", "issue_registration_email"]
//   var params = new URLSearchParams();
//   arr.forEach(element => {
//     params.append("setting_names", element);
//   });
//
//   authApi
//     .get("/settings/", {params: params})
//     .then((res) => {
//
//       registrationMode.value = res.data.idea_registration_mode
//       registrationMode.value = res.data.idea_registration_mode
//       isLoading.value = false;
//     })
//     .catch((err) => {
//       if (err.response) {
//         console.log(err.response);
//       } else if (err.request) {
//         console.log(err.request);
//       } else {
//         console.log("General Error");
//       }
//
//     });
// }

// function getBoardId() {
//   isLoading.value = true;
//
//   authApi
//     .get("/settings/board/")
//     .then((res) => {
//
//       ActionUrl.value = 'https://beta.remontmaszyn.pl/new/' + res.data + '+234'
//       isLoading.value = false;
//     })
//     .catch((err) => {
//       if (err.response) {
//         console.log(err.response);
//       } else if (err.request) {
//         console.log(err.request);
//       } else {
//         console.log("General Error");
//       }
//
//     });
// }

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


let ActionUrlQr = ref("https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" + ActionUrl.value + "&choe=UTF-8&chld=M")
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
