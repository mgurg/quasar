<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section class="row q-pa-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/"/>
            <q-breadcrumbs-el :label="$t('Ideas')" icon="tips_and_updates" to="/ideas"/>
            <q-breadcrumbs-el :label="$t('View')" icon="info"/>
          </q-breadcrumbs>
        </q-card-section>

        <q-separator/>

        <q-card-section v-if="ideaDetails && !isLoading">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section avatar>
                <q-avatar color="green" rounded text-color="white">{{ counter }}</q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-h6">{{ ideaDetails.title }}</q-item-label>
                <q-item-label caption>{{ convertTime(ideaDetails.created_at) }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn :label="$q.screen.gt.xs ? $t('Edit') : ''" class="float-right q-mr-sm" color="primary"
                         icon="edit" no-caps
                         outline @click="editIdea(ideaDetails.uuid)"/>
                  <q-btn :label="$q.screen.gt.xs ? $t('Delete') : ''" class="float-right q-mr-sm" color="red" flat
                         icon="delete"
                         no-caps @click="deleteIdea(ideaDetails.uuid, ideaDetails.title)"/>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>


      <q-card bordered class="my-card no-shadow q-my-sm">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h5">Opis</div>
            <q-space></q-space>
            <q-btn :icon="expandedDescription ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat
                   round
                   @click="expandedDescription = !expandedDescription"/>
          </div>

        </q-card-section>

        <q-slide-transition>
          <div v-show="expandedDescription">

            <q-card-section>
              <div :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-1'" class="rounded-borders q-py-md q-pl-sm">
                <tip-tap v-if="ideaDetails && !isLoading" :body-content="ideaDetails.body_json" :readonly="true"/>
              </div>
              <div class="q-mt-md">
                <photo-viewer v-if="ideaDetails && !isLoading" :pictures-list="ideaDetails.files_idea"/>
              </div>

            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, ref} from "vue";
import {useQuasar} from "quasar";
import {useUserStore} from 'stores/user';
import {useRoute, useRouter} from "vue-router";
import {authApi} from "boot/axios";

import TipTap from 'src/components/editor/TipTap.vue'
import PhotoViewer from 'src/components/viewer/PhotoViewer.vue'
import {useI18n} from "vue-i18n";
import {deleteIdeaRequest} from "components/api/IdeaApiClient";
import {errorHandler} from "components/api/errorHandler";

const $q = useQuasar();
const UserStore = useUserStore();
const route = useRoute();
const router = useRouter();

const {t} = useI18n({useScope: "global"});
const confirmDeleteMessage = computed(() => t("Delete:"));
const successfulDeleteMessage = computed(() => t("Deleted:"));

const json = ref(null);
let isLoading = ref(false);
let dialog = ref(false);

let expandedDescription = ref(true)

const counter = computed(() => ideaDetails.value.upvotes - ideaDetails.value.downvotes);
const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return permissions.value === null ? false : Boolean(permissions.value.includes(permission));
}

let lastVote = ref(null);

let ideaDetails = ref(null);

function convertTime(datetime, timeZone = "America/Los_Angeles") {
  const dateObject = new Date(datetime).toLocaleString("en-US", {
    timeZone,
  });

  return dateObject;
}

function getIdeaDetails(uuid) {
  authApi
    .get("/ideas/" + uuid)
    .then((res) => {
      // console.log(res.data);

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
    .post("ideas/vote", {idea_uuid: ideaDetails.value.uuid, vote: state})
    .then((res) => {
      // console.log(uuid);
      //
      // console.log(res.data.vote)
      lastVote.value = state
      getIdeaDetails(route.params.uuid)
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
      // console.log("LastVote: ", res.data.vote);
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
    .patch("/ideas/" + route.params.uuid, {"status": status, "vote": null})
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

function editIdea(uuid) {
  router.push("/ideas/edit/" + uuid);
}

function deleteIdea(uuid, ideaName) {
  // console.log(ideaName);
  $q.dialog({
    title: "Confirm",
    message: confirmDeleteMessage.value + " '" + ideaName + "' ?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    isLoading.value = true;
    deleteIdeaRequest(uuid).then(function (response) {
      $q.notify({
        type: 'warning',
        message: successfulDeleteMessage.value + " " + ideaName,
      });
      router.push("/users/edit/" + uuid);
      isLoading.value = false;
    }).catch((err) => {
      const errorMessage = errorHandler(err);
      isError.value = true;
    });
  });
}

onBeforeMount(() => {
  isLoading.value = true;
  getIdeaDetails(route.params.uuid);
  getLastVote(route.params.uuid);
});

</script>

<style lang="scss" scoped>
//img.img-responsive {
//  display: block;
//  max-width: 90%;
//  height: auto;
//}
</style>
