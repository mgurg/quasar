<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el label="Tasks" icon="add_task" to="/tasks" />
          <q-breadcrumbs-el label="View" icon="info" />
        </q-breadcrumbs>
      </div>

      <q-card class="my-card" bordered flat v-if="taskDetails && !isLoading">
        <q-item>
          <q-item-section avatar>
            <q-avatar rounded color="green" text-color="white">MG</q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ taskDetails.title }}</q-item-label>
            <q-item-label caption>
              <q-icon name="schedule" />
              {{ convertTime(taskDetails.date_from) }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />
        <div class="row q-col-gutter-xs">
          <div
            class="col-xs-6 col-sm-6 col-md-3 col-lg-3"
            v-for="(file, index) in taskDetails.file"
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
        <!-- IMG -->
        <!-- <q-carousel
          swipeable
          animated
          arrows
          v-model="slide"
          v-model:fullscreen="fullscreen"
          infinite
          height="200px"
        >
          <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
          <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
          <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
          <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg" />

          <template v-slot:control>
            <q-carousel-control position="bottom-right" :offset="[18, 18]">
              <q-btn
                push
                round
                dense
                color="white"
                text-color="primary"
                :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="fullscreen = !fullscreen"
              />
            </q-carousel-control>
            <q-carousel-control position="top-right" :offset="[18, 18]">
              <q-btn push round dense color="white" text-color="primary" icon="download" />
            </q-carousel-control>
          </template>
        </q-carousel>-->
        <!-- IMG -->

        <q-card-actions align="right">
          <q-btn flat round color="red" icon="lock_open">Start</q-btn>
          <q-btn flat round color="teal" icon="pause_circle_outline">Hold</q-btn>
          <q-btn flat round color="primary" icon="done">Done</q-btn>
        </q-card-actions>

        <q-card-section class="q-pt-none">{{ taskDetails.description }}</q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat round icon="event" />
          <q-btn flat color="primary">Reserve</q-btn>
        </q-card-actions>
      </q-card>

      <task-view-skeleton v-else />
    </q-page>
  </div>
</template>

<script setup>
import { ref, onActivated } from "vue";
import { DateTime } from "luxon";
import { useRoute } from "vue-router";
import { api } from "boot/axios";
import TaskViewSkeleton from 'components/skeletons/TaskViewSkeleton'

let isLoading = ref(false);
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
  api
    .get("/tasks/" + uuid)
    .then((res) => {
      console.log(uuid);
      console.log(res.data);
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

onActivated(() => {
  isLoading.value = true;
  taskDetails.value = null; // Why? if not present data is fetched only once
  getDetails(route.params.uuid)
});


</script>
