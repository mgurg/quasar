<template>
  <q-layout>
    <div class="row justify-center text-blue-grey-10">
      <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
        <div class="q-pa-md">
          <idea-form button-text="Add" :token="anonymousToken" @ideaFormBtnClick="signUpButtonPressed"></idea-form>

        </div>
      </q-page>
    </div>
  </q-layout>
</template>

<script setup>
import IdeaForm from 'src/components/forms/IdeaForm.vue'
import { ref, computed } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { api } from "boot/axios";


const route = useRoute()
const router = useRouter();
const path = computed(() => route.path)
const activationId = ref(route.params.id)

let isLoading = ref('false')
let anonymousToken = ref(null);


function checkId(id) {
  console.log(id + '+234')
  api.post('ideas/new_idea/' + id + '+234').then((res) => {
    console.log(res.data.token)
    anonymousToken.value = res.data.token

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

if (activationId.value != null)
  checkId(activationId.value)

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