<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el label="Ideas" icon="tips_and_updates" to="/ideas" />
          <q-breadcrumbs-el label="Add" icon="add" />
        </q-breadcrumbs>
      </div>

      <q-card class="my-card" bordered flat v-if="ideaDetails && !isLoading">
        <q-item>
          <q-item-section avatar>
            <q-avatar rounded color="green" text-color="white">{{ counter }}</q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-h5">{{ ideaDetails.title }}</q-item-label>
            <q-item-label caption>
              <q-icon name="schedule" />
              {{ convertTime(ideaDetails.created_at) }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />
        <div class="row q-col-gutter-xs q-pa-md">
          <div
            class="col-xs-6 col-sm-6 col-md-3 col-lg-3"
            v-for="(file, index) in ideaDetails.pictures"
            v-bind:key="index"
          >
            <q-img
              :src="downloadFileUrl(file.uuid)"
              spinner-color="black"
              style="height: 100%; width: 100%"
              fit="contain"
              @click="displayFullscreen(downloadFileUrl(file.uuid))"
            >
            </q-img>
          </div>
        </div>

        <q-card-section class="q-pt-md">{{ ideaDetails.description }}</q-card-section>
        <q-card-actions align="right">
          <q-btn flat color="primary" icon="thumb_down" @click="sendVote('down')" :disable="lastVote=='down'"></q-btn>
          <q-btn flat color="red" icon="thumb_up" @click="sendVote('up')" :disable="lastVote=='up'"></q-btn>
        </q-card-actions>
        <q-separator />

        <q-card-actions>
          <q-btn @click="setState('accepted')" flat color="primary" icon="check_circle" v-if="ideaDetails.status==null">&nbsp; Akceptuj</q-btn>
          <q-btn @click="setState('rejected')" flat color="primary" icon="delete_forever" v-if="ideaDetails.status==(null||'accepted')">&nbsp; Odrzuć</q-btn>
          <q-btn @click="setState('todo')" flat color="primary" icon="verified" v-if="ideaDetails.status=='accepted'">&nbsp; Wykonaj</q-btn>
        </q-card-actions>
      </q-card>

      <task-view-skeleton v-else />
      <q-dialog
        v-model="dialog"
        persistent
        :maximized="true"
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card class="bg-primary text-white">
          <q-bar>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Musikverein%2C_Viena%2C_Austria%2C_2020-01-31%2C_DD_170-172_HDR.jpg/1908px-Musikverein%2C_Viena%2C_Austria%2C_2020-01-31%2C_DD_170-172_HDR.jpg"
          />
          <a
            href="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Musikverein%2C_Viena%2C_Austria%2C_2020-01-31%2C_DD_170-172_HDR.jpg/1908px-Musikverein%2C_Viena%2C_Austria%2C_2020-01-31%2C_DD_170-172_HDR.jpg"
            >Get</a
          >
          <q-btn>Get</q-btn>
        </q-card>
      </q-dialog>
    </q-page>
  </div>
</template>

<script setup>
import { ref, onActivated, computed } from "vue";
import { DateTime } from "luxon";
import { useRoute } from "vue-router";
import { authApi } from "boot/axios";
import TaskViewSkeleton from "components/skeletons/TaskViewSkeleton";

let isLoading = ref(false);
let dialog = ref(false);

const counter = computed(() => ideaDetails.value.upvotes - ideaDetails.value.downvotes);
let lastVote = ref(null);

function displayFullscreen(url) {
  // alert(url)
  dialog.value = !dialog.value;
}

const route = useRoute();
let taskUuid = ref(route.params.uuid);
let ideaDetails = ref(null);

function downloadFileUrl(uuid) {
  return process.env.VUE_APP_URL + "/files/download/" + uuid;
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
    .get("/ideas/" + uuid)
    .then((res) => {
      console.log(uuid);
      console.log(res.data);
      ideaDetails.value = res.data;
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

function sendVote(state) {
  authApi
    .post("ideas/vote", { idea_uuid: ideaDetails.value.uuid, vote: state })
    .then((res) => {
      console.log(uuid);
      console.log(res.data);
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

function getLastVote(state) {
  authApi
    .get("/ideas/vote_last/" + route.params.uuid)
    .then((res) => {
      console.log("LastVote: ", res.data.vote);
      lastVote.value = res.data.vote;
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


function setState(status) {
  authApi
    .patch("/ideas/" + route.params.uuid , {"status" : status, "vote": null})
    .then((res) => {
      ideaDetails.value.status = status

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
  getDetails(route.params.uuid);
  getLastVote(route.params.uuid);
});
</script>