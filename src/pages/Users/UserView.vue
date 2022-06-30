<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el label="Users" icon="people" to="/users" />
          <q-breadcrumbs-el :label="$t('View')" icon="info" />
        </q-breadcrumbs>
      </div>

      <q-card class="my-card" bordered flat v-if="userDetails && !isLoading">
        <q-item>
          <q-item-section avatar>
            <q-avatar rounded color="green" text-color="white">MG</q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-h5">{{ userDetails.first_name }} {{ userDetails.last_name }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />
        <div class="row q-col-gutter-xs">
          <div
            class="col-xs-6 col-sm-6 col-md-3 col-lg-3"
            v-for="(file, index) in userDetails.file"
            v-bind:key="index"
          >
            <q-img
              :src="downloadFileUrl(file.uuid)"
              spinner-color="black"
              style="height: 100%; width:100% "
              fit="contain"
            >
              <!-- <q-icon
              class="absolute all-pointer-events"
              size="sm"
              name="delete"
              color="blue-grey-5"
              style="top: 8px; right: 8px"
              @click="delete_file(file.uuid)"
            >
              <q-tooltip>Tooltip</q-tooltip>
              </q-icon>-->

              <!-- <q-icon
              class="absolute all-pointer-events"
              size="sm"
              name="download"
              color="blue-grey-5"
              style="top: 8px; left: 8px"
              @click="window.open(download_file(file.uuid))"
            >
              <q-tooltip>Tooltip</q-tooltip>
              </q-icon>-->
            </q-img>
          </div>
        </div>
        <q-card-actions align="right">
          <q-btn
            flat
            color="primary"
            icon="done"
            v-if="userDetails.status == null"
            @click="changeState('accepted')"
          >Edit</q-btn>

         
        </q-card-actions>

        <q-card-section class="q-pt-none">Phone: {{ userDetails.phone }}</q-card-section>
        <q-card-section class="q-pt-none">Email: {{ userDetails.email }}</q-card-section>
        <q-separator />

        <q-card-actions v-if="userDetails.is_verified==false">
          <q-btn flat  color="primary" icon="how_to_reg" @click="activateUser()"> Activate</q-btn>
          <!-- <q-btn flat color="primary">Activate</q-btn> -->
        </q-card-actions>
        
      </q-card>

      <task-view-skeleton v-else />
    </q-page>
  </div>
</template>

<script setup>
import { ref, onActivated ,onBeforeMount} from "vue";
import { DateTime } from "luxon";
import { useRoute } from "vue-router";
import { authApi } from "boot/axios";
import TaskViewSkeleton from 'components/skeletons/TaskViewSkeleton'

let isLoading = ref(false);
let slide = ref(1);


const route = useRoute();
let taskUuid = ref(route.params.uuid)
let userDetails = ref(null);



function getDetails(uuid) {
  authApi
    .get("/user/" + uuid)
    .then((res) => {
      console.log(uuid);
      console.log(res.data);
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
    .patch("user/" + userDetails.value.uuid, { "is_verified": true })
    .then((res) => {
      console.log(uuid);
      console.log(res.data);

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

// function editUser(uuid) {
//     router.push("/users/edit/" + uuid);
// }

onBeforeMount(() => {
  isLoading.value = true;
  getDetails(route.params.uuid);
});


</script>
