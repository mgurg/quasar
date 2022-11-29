<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section class="row q-pa-sm">
          <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el :label="$t('Ideas')" icon="tips_and_updates" to="/ideas" />
          <q-breadcrumbs-el :label="$t('View')" icon="info" />
        </q-breadcrumbs>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="ideaDetails && !isLoading">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section avatar>
            <q-avatar rounded color="green" text-color="white">{{ counter }}</q-avatar>
          </q-item-section>

              <q-item-section>
                <q-item-label class="text-h6">{{ ideaDetails.title }}</q-item-label>
                <!-- <q-item-label caption>{{ ideaDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn outline color="primary" no-caps icon="edit" class="float-right q-mr-sm"
                    :label="$q.screen.gt.xs ? $t('Edit') : ''" @click="editIdea(ideaDetails.uuid)" />
                  <q-btn flat color="red" icon="delete" class="float-right q-mr-sm" no-caps
                    :label="$q.screen.gt.xs ? $t('Delete') : ''" @click="deleteIdea(ideaDetails.uuid)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>


      <q-card class="my-card no-shadow q-my-sm" bordered>
      <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h5">Opis</div>
            <q-space></q-space>
            <q-btn color="grey" round flat dense :icon="expandedDescription ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="expandedDescription = !expandedDescription" />
          </div>
          
        </q-card-section>

        <q-slide-transition>
        <div v-show="expandedDescription">
   
          <q-card-section>
            <div class="rounded-borders q-py-md q-pl-sm" :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-1'">
            <tiptap :body-content="ideaDetails.body_json" :readonly="true" v-if="ideaDetails && !isLoading" />
          </div>
          <div class="q-mt-md">
            <photo-viewer :pictures-list="ideaDetails.files_idea" v-if="ideaDetails && !isLoading"/>
        </div>
          
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
    </q-page>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useUserStore } from 'stores/user';
import { useRoute, useRouter } from "vue-router";
import { authApi } from "boot/axios";
import TaskViewSkeleton from "components/skeletons/tasks/TaskViewSkeleton";

import Tiptap from 'src/components/editor/TipTap.vue'
import PhotoViewer from 'src/components/viewer/PhotoViewer.vue'

const $q = useQuasar();
const UserStore = useUserStore();
const route = useRoute();
const router = useRouter();

const json = ref(null);
let isLoading = ref(false);
let dialog = ref(false);

let expandedDescription = ref(true)

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
      console.log(res.data);
      
      ideaDetails.value = res.data;
      json.value = res.data.body_json;

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
      // 
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

function editIdea(uuid){
  router.push("/ideas/edit/" + uuid);
}

function deleteIdea(uuid) {
  $q.dialog({
    title: "Confirm",
    message: "Really delete?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    authApi
      .delete("/ideas/" + uuid)
      .then((res) => {
        router.push("/ideas");
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
    $q.notify("Idea deleted");
    // fetchTasks()
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
