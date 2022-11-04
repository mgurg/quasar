<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el label="Users" icon="people" to="/users" />
          <q-breadcrumbs-el :label="$t('View')" icon="info" />
        </q-breadcrumbs>
      </div>

      <q-card  v-if="userDetails && !isLoading" bordered class="my-card no-shadow">
      <q-item>
        <q-item-section avatar>
          <q-avatar rounded color="green" text-color="white">MG</q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ userDetails.first_name }} {{ userDetails.last_name }}</q-item-label>
          <q-item-label caption>{{ userDetails.last_name }}</q-item-label>
          <q-btn flat  v-if="userDetails.is_verified==false" color="primary" icon="how_to_reg" @click="activateUser()"> Activate</q-btn>
        </q-item-section>
        <q-card-actions>
        
        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />
      </q-card-actions>
      <q-card-actions v-if="userDetails.is_verified==false">
          <q-btn flat  color="primary" icon="how_to_reg" @click="activateUser()"> Activate</q-btn>
          <!-- <q-btn flat color="primary">Activate</q-btn> -->
        </q-card-actions>

      </q-item>

      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            <p>Phone: {{userDetails.phone}}</p>
            <p>Email: {{userDetails.email}}</p>
            <div class="row">
    <q-space />
            <q-btn            flat
            color="primary"
            icon="done" @click="editUser(userDetails.uuid)">Edit</q-btn>
            </div>
            
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
    <div>&nbsp;</div>
      <!-- <q-card class="my-card" bordered flat v-if="userDetails && !isLoading">
        <q-item>

          <q-item-section>
            <q-item-label class="text-h5">Pomysły</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        
      </q-card> -->

      <div v-for="(idea, index) in ideas" v-bind:key="index" v-if="ideas!= null">
          <idea-item :idea="idea" v-if="!isLoading"></idea-item>
        </div>
        <task-index-skeleton v-else />
    </q-page>
  </div>
</template>

<script setup>
import { ref, onActivated ,onBeforeMount} from "vue";
import { DateTime } from "luxon";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { authApi } from "boot/axios";
import TaskViewSkeleton from 'components/skeletons/tasks/TaskViewSkeleton'

import TaskIndexSkeleton from "components/skeletons/tasks/TaskIndexSkeleton.vue";
import IdeaItem from "components/IdeaItem.vue";

const router = useRouter();

let isLoading = ref(false);
let slide = ref(1);
let expanded =  ref(false);

const route = useRoute();
let userUuid = ref(route.params.uuid)
let userDetails = ref(null);
let ideas = ref(null);



function getDetails(uuid) {
  authApi
    .get("/users/" + uuid)
    .then((res) => {
      userDetails.value = res.data;
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

function activateUser() {
  authApi
    .patch("users/" + userDetails.value.uuid, { "is_verified": true })
    .then((res) => {

      userDetails.value.is_verified = true

      // getDetails(taskDetails.value.uuid);
      // taskDetails.value = res.data;
      // isLoading.value = false;
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

function getUserIdeas(){
  authApi
    .get("ideas/user/" + userUuid.value)
    .then((res) => {
      console.log(res.data.items);
      ideas.value = res.data.items

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

getUserIdeas()

function editUser(uuid) {
    router.push("/users/edit/" + uuid);
}

onBeforeMount(() => {
  isLoading.value = true;
  getDetails(route.params.uuid);
});


</script>
