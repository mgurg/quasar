<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/"/>
          <q-breadcrumbs-el icon="add_task" label="Tasks" to="/tasks"/>
          <q-breadcrumbs-el :label="$t('View')" icon="info"/>
        </q-breadcrumbs>
      </div>

      <q-card v-if="taskDetails && !isLoading" bordered class="my-card" flat>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="green" rounded text-color="white">MG</q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ taskDetails.title }}</q-item-label>
            <q-item-label caption>
              <q-icon name="schedule"/>
              {{ convertTime(taskDetails.date_from) }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator/>
        <div class="row q-col-gutter-xs">
          <div
            v-for="(file, index) in taskDetails.file"
            v-bind:key="index"
            class="col-xs-6 col-sm-6 col-md-3 col-lg-3"
          >
            <q-img
              :src="downloadFileUrl(file.uuid)"
              fit="contain"
              spinner-color="black"
              style="height: 100%; width:100% "
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
            v-if="taskDetails.status == null"
            color="primary"
            flat
            icon="done"
            @click="changeState('accepted')"
          >Accept
          </q-btn>

          <q-btn
            v-if="taskDetails.status == null"
            color="red-12"
            flat
            icon="lock_open"
            @click="changeState('rejected')"
          >Reject
          </q-btn>

          <q-btn
            v-if="taskDetails.status === 'accepted' || taskDetails.status === 'paused'"
            color="red-12"
            flat
            icon="play_arrow"
            @click="changeState('start')"
          >Start
          </q-btn>
          <q-btn
            v-if="taskDetails.status === ('in_progress')"
            color="deep-orange-11"
            flat
            icon="pause"
            @click="changeState('pause')"
          >Hold
          </q-btn>

          <q-btn
            v-if="taskDetails.status != null"
            color="primary"
            flat
            icon="stop"
            @click="changeState('stop')"
          >Done
          </q-btn>
        </q-card-actions>

        <q-card-section class="q-pt-none">{{ taskDetails.description }}</q-card-section>

        <q-separator/>

        <q-card-actions>
          <q-btn flat icon="event" round/>
          <q-btn color="primary" flat>Reserve</q-btn>
        </q-card-actions>
      </q-card>

      <task-view-skeleton v-else/>
    </q-page>
  </div>
</template>

<script setup>
import {onActivated, ref} from "vue";
import {useRoute} from "vue-router";
import {authApi} from "boot/axios";
import TaskViewSkeleton from 'components/skeletons/tasks/TaskViewSkeleton'

let isLoading = ref(false);
const isError = ref(false);
let slide = ref(1);


const route = useRoute();
let taskUuid = ref(route.params.uuid)
let taskDetails = ref(null);

function downloadFileUrl(uuid) {
  return process.env.VUE_APP_URL + "/files/download/" + uuid
}

function convertTime(datetime) {
  let timeZone = "America/Los_Angeles";
  const dateObject = new Date(datetime).toLocaleString("en-US", {
    timeZone,
  });

  return dateObject;
}

function getDetails(uuid) {
  authApi
    .get("/tasks/" + uuid)
    .then((res) => {
      // console.log(uuid);

      taskDetails.value = res.data;
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

function changeState(state) {
  authApi
    .post("tasks/action/" + taskDetails.value.uuid, {"action_type": state})
    .then((res) => {
      console.log(uuid);


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

onActivated(() => {
  isLoading.value = true;
  taskDetails.value = null; // Why? if not present data is fetched only once
  getDetails(route.params.uuid)
});


</script>
