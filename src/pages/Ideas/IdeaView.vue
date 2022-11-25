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
                    :label="$q.screen.gt.xs ? $t('Edit') : ''" @click="editGuide(ideaDetails.uuid)" />
                  <q-btn flat color="red" icon="delete" class="float-right q-mr-sm" no-caps
                    :label="$q.screen.gt.xs ? $t('Delete') : ''" @click="deleteGuide(ideaDetails.uuid)" />

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
            <div style="border: 1px solid #c2c2c2; border-radius: 5px; padding-left: 5px;">
            <tiptap :body-content="ideaDetails.body_json" :readonly="true" v-if="ideaDetails && !isLoading" />
          </div>
          <div class="q-mt-md">
            <photo-viewer :pictures-list="ideaDetails.files_idea" v-if="ideaDetails && !isLoading"/>
        </div>
          
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>


    
      <!-- <q-card class="my-card" bordered flat v-if="ideaDetails && !isLoading">
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
        <div :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'">


          <photo-viewer :pictures-list="ideaDetails.pictures"/>



          <div style="border: 0px solid #c2c2c2; border-radius: 5px; padding-left: 5px;">
            <tiptap :model-value="json" :readonly=true />
          </div>


          <q-card-actions align="right" v-if="ideaDetails.status != 'pending'">
  
            <q-btn flat color="primary" icon="thumb_down" @click="sendVote('down')"
              :disable="lastVote == 'down' || ideaDetails.status == 'rejected' || ideaDetails.status == 'todo'"></q-btn>
            <q-btn flat color="red-12" icon="thumb_up" @click="sendVote('up')"
              :disable="lastVote == 'up' || ideaDetails.status == 'rejected' || ideaDetails.status == 'todo'"></q-btn>
          </q-card-actions>
          <q-separator />
        </div>
        <q-card-actions>

          <q-btn @click="setState('accepted')" flat color="primary" icon="check_circle"
            v-if="ideaDetails.status == 'pending'">&nbsp; Akceptuj</q-btn>
          <q-btn @click="setState('rejected')" flat color="primary" icon="delete_forever"
            v-if="ideaDetails.status == 'pending' || ideaDetails.status == 'accepted'">&nbsp; Odrzuć</q-btn>
          <q-btn @click="setState('todo')" flat color="primary" icon="verified" v-if="ideaDetails.status == 'accepted'">
            &nbsp; Wykonaj</q-btn>
        </q-card-actions>
      </q-card>
      <task-view-skeleton v-else /> -->

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
import PhotoViewer from 'src/components/uploader/PhotoViewer.vue'

const UserStore = useUserStore();

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
