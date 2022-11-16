<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el :label="$t('Ideas')" icon="tips_and_updates" to="/ideas" />
          <q-breadcrumbs-el :label="$t('View')" icon="info" />
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
        <div :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-1'">
          <div class="row q-col-gutter-xs q-pa-md">
            <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3" v-for="(file, index) in ideaDetails.pictures"
              v-bind:key="index">
              <q-img :src="file.url" spinner-color="black" style="height: 100%; width: 100%" fit="contain"
                @click="previewImgObject(index)">
              </q-img>
            </div>
          </div>

          <!-- <q-card-section class="q-pt-md text-body1">{{ ideaDetails.description }}</q-card-section> -->

          <div style="border: 0px solid #c2c2c2; border-radius: 5px; padding-left: 5px;">
            <tiptap :model-value="json" :readonly=true />
          </div>


          <q-card-actions align="right" v-if="ideaDetails.status != 'pending'">
            <!-- hasPermission('IDEAS_VOTE') && -->
            <q-btn flat color="primary" icon="thumb_down" @click="sendVote('down')"
              :disable="lastVote == 'down' || ideaDetails.status == 'rejected' || ideaDetails.status == 'todo'"></q-btn>
            <q-btn flat color="red-12" icon="thumb_up" @click="sendVote('up')"
              :disable="lastVote == 'up' || ideaDetails.status == 'rejected' || ideaDetails.status == 'todo'"></q-btn>
          </q-card-actions>
          <q-separator />
        </div>
        <q-card-actions>
          <!-- v-if="hasPermission('IDEAS_REVIEW')" -->
          <q-btn @click="setState('accepted')" flat color="primary" icon="check_circle"
            v-if="ideaDetails.status == 'pending'">&nbsp; Akceptuj</q-btn>
          <q-btn @click="setState('rejected')" flat color="primary" icon="delete_forever"
            v-if="ideaDetails.status == 'pending' || ideaDetails.status == 'accepted'">&nbsp; Odrzuć</q-btn>
          <q-btn @click="setState('todo')" flat color="primary" icon="verified" v-if="ideaDetails.status == 'accepted'">
            &nbsp; Wykonaj</q-btn>
        </q-card-actions>
      </q-card>
      <task-view-skeleton v-else />

    </q-page>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import Tiptap from 'src/components/editor/TipTap.vue'
import { useUserStore } from 'stores/user'
import { useRoute } from "vue-router";
import { authApi } from "boot/axios";
import TaskViewSkeleton from "components/skeletons/tasks/TaskViewSkeleton";
import { api as viewerApi } from "v-viewer";
import VueViewer from "v-viewer";
import "viewerjs/dist/viewer.css";

const UserStore = useUserStore();
const sourceImageURLs = ref([]);

VueViewer.setDefaults({
  zIndex: 2021,
  toolbar: {
    zoomIn: {
      show: 4,
      size: 'large'
    },
    zoomOut: {
      show: 4,
      size: 'large'
    },
    oneToOne: false,
    reset: false,
    prev: {
      show: 4,
      size: 'large'
    },
    play: {
      show: 4,
      size: 'large'
    },
    next: {
      show: 4,
      size: 'large'
    },
    rotateLeft: {
      show: 4,
      size: 'large'
    },
    rotateRight: {
      show: 4,
      size: 'large'
    },
    flipHorizontal: false,
    flipVertical: false,
  }
})

function previewURL() {
  const $viewer = viewerApi({
    images: sourceImageURLs.value,
    rotatable: false,
    scalable: false,
    transition: false
  })
  console.log($viewer)
}

function previewImgObject(index) {
      console.log(index)
      const $viewer = viewerApi({

          toolbar: true,
          url: 'data-source',
          initialViewIndex: index,

        images: sourceImageURLs.value,
      })
      console.log($viewer)
    }

const json = ref(null);
let isLoading = ref(false);
let dialog = ref(false);

const counter = computed(() => ideaDetails.value.upvotes - ideaDetails.value.downvotes);
const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return Boolean(permissions.value.includes(permission));
}

let lastVote = ref(null);
let fullscreenUrl = ref("")

function displayFullscreen(url) {
  fullscreenUrl.value = ref(url)
  dialog.value = !dialog.value;
}

const route = useRoute();
let ideaDetails = ref(null);

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
      json.value = res.data.body_json;
      sourceImageURLs.value = res.data.pictures.map((e) => {
        return {
          'data-source': e.url,
          'src': e.url,
          'alt': e.file_name
        }
      });
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
      // console.log(uuid);
      // console.log(res.data);
      // console.log(res.data.vote)
      lastVote.value = state
      getDetails(route.params.uuid)
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
    .patch("/ideas/" + route.params.uuid, { "status": status, "vote": null })
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

onBeforeMount(() => {
  isLoading.value = true;
  getDetails(route.params.uuid);
  getLastVote(route.params.uuid);
});

</script>

<style lang="scss" scoped>
img.img-responsive {
  display: block;
  max-width: 90%;
  height: auto;
}
</style>
