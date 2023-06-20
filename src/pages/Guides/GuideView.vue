<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-list>
          <q-item class="q-px-sm">
            <q-item-section avatar>
              <q-btn icon="arrow_back_ios" color="grey" dense no-caps flat @click="router.back()">{{
                  $t("Return")
                }}
              </q-btn>
            </q-item-section>
            <q-item-section></q-item-section>
            <q-item-section side>
              <div class="col-12 text-h6 q-mt-none">
                <q-btn
                  :label="$q.screen.gt.xs ? $t('Edit') : ''"
                  class="float-right q-mr-sm" color="primary" flat
                  icon="edit" no-caps
                  outline @click="editGuide(guideDetails.uuid)"
                />
                <q-btn
                  :label="$q.screen.gt.xs ? $t('Delete') : ''"
                  class="float-right q-mr-sm" color="red" flat
                  icon="delete"
                  no-caps @click="deleteGuide(guideDetails.uuid)"
                />

              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <q-card-section v-if="guideDetails && !isLoading" class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5">{{ guideDetails.name }}</q-item-label>
                <!--                 <q-item-label caption>{{ itemDetails.summary }}</q-item-label>-->
                <q-item-label caption>Krótki, publicznie dostępny opis</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <!--        <q-separator/>-->

        <!--        <q-card-actions align="right">-->
        <!--          <q-btn color="primary" class="q-px-xs" flat icon="bug_report" no-caps>Zgłoś awarie</q-btn>-->
        <!--          &lt;!&ndash;          <q-btn color="primary" class="q-px-xs" flat icon="lightbulb_outline" no-caps>Usprawnienie</q-btn>&ndash;&gt;-->
        <!--          <q-btn color="primary" class="q-px-xs" flat icon="insights" no-caps>Raporty</q-btn>-->
        <!--        </q-card-actions>-->
      </q-card>
      <!--      <q-card bordered class="my-card no-shadow q-my-sm">-->
      <!--        &lt;!&ndash;        VIDEO &ndash;&gt;-->
      <!--        <q-card-section v-if="guideDetails && guideDetails.video_id !==null">-->
      <!--          <div class="row q-col-gutter-xs">-->
      <!--            <div class="text-h5">Film</div>-->
      <!--            <q-space></q-space>-->
      <!--            <q-btn :icon="expandedDetails ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat round-->
      <!--                   @click="expandedDetails = !expandedDetails"/>-->
      <!--          </div>-->

      <!--        </q-card-section>-->
      <!--        <q-separator v-if="guideDetails && guideDetails.video_id !==null"/>-->
      <!--        <q-slide-transition>-->
      <!--          <div v-show="expandedDetails">-->
      <!--            &lt;!&ndash; <q-separator /> &ndash;&gt;-->
      <!--            <q-card-section v-if="guideDetails && guideDetails.video_id !==null">-->
      <!--              <movie-viewer v-if="guideDetails && guideDetails.video_id !==null && !isLoading"-->
      <!--                            :video-id="guideDetails.video_id"-->
      <!--                            :video-metadata="guideDetails.video_jsonb.encoding.metadata"/>-->
      <!--            </q-card-section>-->
      <!--          </div>-->
      <!--        </q-slide-transition>-->
      <!--      </q-card>-->

<!--      <video-card-->
<!--        v-if="guideDetails!==null && guideDetails.video_id!==null"-->
<!--        :expanded-video="true"-->
<!--        :video-id="guideDetails.video_id"-->
<!--        :video-metadata="guideDetails.video_json.encoding.metadata"-->
<!--      />-->
      <description-card v-if="guideDetails!==null" :expanded-description="true" :textJson="guideDetails.text_json"/>
      <photo-card v-if="photoFiles!==null" :expanded-photos="false" :photo-files="photoFiles"/>

    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, ref} from "vue";
import {useQuasar} from "quasar";

import {useUserStore} from 'stores/user'
import {useRoute, useRouter} from "vue-router";
import {authApi} from "boot/axios";
import DescriptionCard from "components/viewer/cards/DescriptionCard.vue";
import PhotoCard from "components/viewer/cards/PhotoCard.vue";
import VideoCard from "components/viewer/cards/VideoCard.vue";

const $q = useQuasar();

const router = useRouter();

const UserStore = useUserStore();
const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return permissions.value === null ? false : Boolean(permissions.value.includes(permission));
}

let isLoading = ref(false);

const route = useRoute();
let guideDetails = ref(null);
let photoFiles = ref(null);
let documentFiles = ref(null);

let expandedDetails = ref(true)
let expandedDescription = ref(true)
let expandedPhotos = ref(true)

function geGuideDetails(uuid) {
  authApi
    .get("/guides/" + uuid)
    .then((response) => {
      console.log(response.data);
      guideDetails.value = response.data;
      photoFiles.value = response.data.files_guide.filter((item) => item.mimetype.match('image.*'));
      documentFiles.value = response.data.files_guide.filter((item) => !item.mimetype.match('image.*'));
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
  geGuideDetails(route.params.uuid);
});

</script>

<style lang="scss" scoped>

</style>
