<template>
  <q-layout>
    <div class="row justify-center text-blue-grey-10">
      <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
        <div class="q-pa-md">
          <idea-form button-text="Add" :mode="registrationMode" :mail="registrationMailDomain" :token="anonymousToken"
            @ideaFormBtnClick="signUpButtonPressed" v-if="registrationMode != 'logged_only'"></idea-form>

          <div v-if="registrationMode == 'logged_only'">
            Administrator nie pozwala na dokonywanie anonimowyc zgłoszeń, <router-link to="/login">{{ $t("Login") }}
            </router-link> się zeby wysłać pomysł
          </div>

        </div>
      </q-page>
    </div>
  </q-layout>
</template>

<script setup>
import IdeaForm from 'src/components/forms/IdeaForm.vue'
import { ref, computed, onBeforeMount } from "vue";
import { authApi } from "boot/axios";
import { useRoute, useRouter } from 'vue-router';
import { api } from "boot/axios";


const route = useRoute()
const router = useRouter();
const path = computed(() => route.path)
const activationId = ref(route.params.id)

let isLoading = ref('false')
let anonymousToken = ref(null);

let registrationMode = ref('anonymous')
let registrationMailDomain = ref('twojafirma.pl')

onBeforeMount(() => {
  console.log('b')
  if (activationId.value != null)
    checkId(activationId.value)
});

function checkId(id) {
  console.log(id + '+234')
  api.post('ideas/new_idea/' + id).then((res) => {
    console.log(res.data.token)
    anonymousToken.value = res.data.token
    registrationMode.value = res.data.mode
    registrationMailDomain.value = res.email

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
  api.post("/ideas/", body, { headers: { Authorization: AuthStr } })
    .then((res) => {
      console.log(res.data);
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


</script>