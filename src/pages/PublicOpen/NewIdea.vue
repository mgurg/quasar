<template>
  <q-layout>
    <q-page-container>
      <div class="row justify-center text-blue-grey-10">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
          <div class="q-pa-md">
            <idea-form v-if="registrationMode !== 'logged_only'" :mail="registrationMailDomain" :mode="registrationMode"
                       :tenant_id="tenant_id"
                       :token="anonymousToken"
                       button-text="Add" @ideaFormBtnClick="signUpButtonPressed"></idea-form>

            <div v-if="registrationMode === 'logged_only'">
              Administrator nie pozwala na dokonywanie anonimowych zgłoszeń,
              <router-link to="/login">{{ $t("Login") }}
              </router-link>
              się żeby wysłać pomysł.
            </div>

          </div>
        </q-page>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {useQuasar} from "quasar";
import IdeaForm from 'src/components/forms/IdeaForm.vue'
import {computed, onBeforeMount, ref, watch} from "vue";
import {api} from "boot/axios";
import {useRoute, useRouter} from 'vue-router';

import {useI18n} from "vue-i18n";


const $q = useQuasar();
const {locale} = useI18n({useScope: "global"});
const lang = ref(locale); // $q.lang.isoName


const route = useRoute()
const router = useRouter();
const path = computed(() => route.path)
const activationId = ref(route.params.id)

let isLoading = ref(false)
let anonymousToken = ref(null);
let tenant_id = ref(null)

let registrationMode = ref('anonymous')
let registrationMailDomain = ref('twojafirma.pl')

function checkId(id) {
  console.log(id + '+234')
  api.post('ideas/new_idea/' + id).then((res) => {
    console.log(res.data.token)
    anonymousToken.value = res.data.token
    registrationMode.value = res.data.mode
    registrationMailDomain.value = res.email
    tenant_id.value = atob(anonymousToken.value).split(".")[0]

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


function signUpButtonPressed(ideaForm) {
  console.log('outside', ideaForm)
  createAnonymousIdea(ideaForm)
  console.log('Add ok')
}

function createAnonymousIdea(body) {
  isLoading.value = true;
  const AuthStr = 'Bearer ' + anonymousToken.value;
  api.post("/ideas/", body, {headers: {Authorization: AuthStr, tenant: tenant_id.value}})
    .then((res) => {

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
  router.push("/new_submission");
}

// ----- i18n ------


watch(lang, (val) => {
  // dynamic import, so loading on demand only
  import(
    /* webpackInclude: /(pl|de|en-US)\.js$/ */
  "quasar/lang/" + val
    ).then((lang) => {
    $q.lang.set(lang.default);
  });
});

function getLocale() {
  const userLocale =
    localStorage.getItem("lang") ||
    sessionStorage.getItem("lang") ||
    navigator.language.split("-")[0] ||
    "en-US";

  // if detectedLocale is 'en' or 'es' return
  if (["de", "en-US", "fr", "pl"].indexOf(userLocale) >= 0) {
    return userLocale;
  }
  // else return default value
  return "en-US";
}

function setLocale(lang) {
  locale.value = lang;
}


onBeforeMount(() => {
  setLocale(getLocale())

  if (activationId.value != null)
    checkId(activationId.value)
});

</script>
