<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section class="row q-pa-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el :label="$t('Items')" icon="tips_and_updates" to="/guides" />
            <q-breadcrumbs-el :label="$t('View')" icon="info" />
          </q-breadcrumbs>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="guideDetails && !isLoading">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">{{ guideDetails.name }}</q-item-label>
                <!-- <q-item-label caption>{{ guideDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn outline color="primary" no-caps icon="edit" class="float-right q-mr-sm"
                    :label="$q.screen.gt.xs ? $t('Edit') : ''" @click="editGuide(guideDetails.uuid)" />
                  <q-btn flat color="red" icon="delete" class="float-right q-mr-sm" no-caps
                    :label="$q.screen.gt.xs ? $t('Delete') : ''" @click="deleteGuide(guideDetails.uuid)" />

                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card class="my-card no-shadow q-my-sm" bordered>
        <q-card-section v-if="guideDetails && guideDetails.video_id !==null">
          <div class="row q-col-gutter-xs">
            <div class="text-h5">Film</div>
            <q-space></q-space>
            <q-btn color="grey" round flat dense :icon="expandedDetails ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="expandedDetails = !expandedDetails" />
          </div>
          
        </q-card-section>
        <q-separator v-if="guideDetails && guideDetails.video_id !==null" />
        <q-slide-transition>
        <div v-show="expandedDetails">
          <!-- <q-separator /> -->
          <q-card-section v-if="guideDetails && guideDetails.video_id !==null">
            <movie-viewer :video-id="guideDetails.video_id" :video-metadata="guideDetails.video_jsonb.encoding.metadata" v-if="guideDetails && guideDetails.video_id !==null && !isLoading" />
          </q-card-section>
        </div>
      </q-slide-transition>
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
          <!-- <q-separator /> -->
          <q-card-section :class="$q.screen.lt.sm?'q-mx-xs q-px-xs':'q-mx-md q-px-md'">
            <div class="rounded-borders" :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-1', $q.screen.lt.sm?'q-py-md q-pl-sm':'q-py-lg q-pl-md'">
            <tip-tap-guide :body-content="guideDetails.text_jsonb" :readonly="true" v-if="guideDetails && !isLoading" />
          </div>

          
          </q-card-section>
        </div>
      </q-slide-transition>
      <q-separator v-if="guideDetails && guideDetails.files_guide !==null" />
      <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h5">Zdjęcia</div>
            <q-space></q-space>
            <q-btn color="grey" round flat dense :icon="expandedPhotos ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="expandedPhotos = !expandedPhotos" />
          </div>
          
        </q-card-section>
        <q-slide-transition>
        <div v-show="expandedPhotos">
          <!-- <q-separator /> -->
          <q-card-section :class="$q.screen.lt.sm?'q-mx-xs q-px-xs':'q-mx-md q-px-md'">
            <div class="q-mt-md">
            <photo-viewer :pictures-list="guideDetails.files_guide" v-if="guideDetails && !isLoading"/>
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
import TipTapGuide from 'src/components/editor/TipTapGuide.vue'
import { useUserStore } from 'stores/user'
import { useRoute, useRouter } from "vue-router";
import { authApi } from "boot/axios";
import PhotoViewer from 'src/components/viewer/PhotoViewer.vue'
import MovieViewer from 'src/components/viewer/MovieViewer.vue'

const $q = useQuasar();

const router = useRouter();

const UserStore = useUserStore();
const permissions = computed(() => UserStore.getPermissions);
function hasPermission(permission) {
  return Boolean(permissions.value.includes(permission));
}

let isLoading = ref(false);

const route = useRoute();
let guideDetails = ref(null);
let expandedDetails = ref(true)
let expandedDescription = ref(true)
let expandedPhotos = ref(true)

function getDetails(uuid) {
  authApi
    .get("/guides/" + uuid)
    .then((res) => {
      console.log(res.data);
      guideDetails.value = res.data;
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

function editGuide(uuid) {
  router.push("/guides/edit/" + uuid);
}

function deleteGuide(uuid) {
  $q.dialog({
    title: "Confirm",
    message: "Really delete?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    authApi
      .delete("/guides/" + uuid)
      .then((res) => {
        router.push("/guides");
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
    $q.notify("Task deleted");
    // fetchTasks()
  });
}

onBeforeMount(() => {
  isLoading.value = true;
  getDetails(route.params.uuid);
});

</script>

<style lang="scss" scoped>

</style>
