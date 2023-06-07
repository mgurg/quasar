<template>

  <q-layout>
    <q-page-container>
      <div class="row justify-center">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">

          <q-card bordered class="my-card no-shadow q-mt-sm">
            <q-card-section class="row q-pa-sm">
              <q-space></q-space>
              <q-btn color="grey" dense flat icon="arrow_back_ios" no-caps @click="router.back()">{{
                  $t("Return")
                }}
              </q-btn>
            </q-card-section>

            <q-separator/>

            <q-card-section v-if="guideDetails && !isLoading">
              <q-list>
                <q-item class="q-px-none">
                  <q-item-section>
                    <q-item-label class="text-h6">{{ guideDetails.name }}</q-item-label>
                    <!-- <q-item-label caption>{{ guideDetails.last_name }}</q-item-label> -->
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>

          <q-card bordered class="my-card no-shadow q-my-sm">
            <!--        DESCRIPTION -->
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
                <!-- <q-separator /> -->
                <q-card-section :class="$q.screen.lt.sm?'q-mx-xs q-px-xs':'q-mx-md q-px-md'">
                  <div
                    :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-1', $q.screen.lt.sm?'q-py-md q-pl-sm':'q-py-lg q-pl-md'"
                    class="rounded-borders">
                    <tip-tap-guide v-if="guideDetails && !isLoading" :body-content="guideDetails.text_json"
                                   :readonly="true"/>
                  </div>


                </q-card-section>
              </div>
            </q-slide-transition>

            <!--        PHOTOS -->
            <q-separator v-if="guideDetails && guideDetails.files_guide !==null"/>
            <q-card-section>
              <div class="row q-col-gutter-xs">
                <div class="text-h5">Zdjęcia</div>
                <q-space></q-space>
                <q-btn :icon="expandedPhotos ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat
                       round
                       @click="expandedPhotos = !expandedPhotos"/>
              </div>

            </q-card-section>
            <q-slide-transition>
              <div v-show="expandedPhotos">
                <!-- <q-separator /> -->
                <q-card-section :class="$q.screen.lt.sm?'q-mx-xs q-px-xs':'q-mx-md q-px-md'">
                  <div class="q-mt-md">
                    <photo-viewer v-if="guideDetails && !isLoading" :pictures-list="guideDetails.files_guide"/>
                  </div>


                </q-card-section>
              </div>
            </q-slide-transition>


          </q-card>


        </q-page>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {api} from "boot/axios";
import {onBeforeMount, ref} from "vue";
import {DateTime} from "luxon";
import {useRoute, useRouter} from "vue-router";
import TipTapGuide from 'components/editor/TipTapBasic.vue'
import PhotoViewer from 'src/components/viewer/PhotoViewer.vue'


const route = useRoute();
const router = useRouter();

let isLoading = ref(false);
let guideDetails = ref(null);
let expandedDetails = ref(true)
let expandedDescription = ref(true)
let expandedPhotos = ref(true)


function geGuideDetails(uuid) {
  let token = sessionStorage.getItem("anonymousToken") || null;
  let tenantId = sessionStorage.getItem("anonymousTenantId") || null;
  let validTo = sessionStorage.getItem("anonymousTokenValidTo") || null;
  if (token !== null && tenantId !== null && validTo !== null) {

    const diff = DateTime.fromSQL(validTo, {zone: 'UTC'}).diffNow('seconds');
    console.log("Time  diff: " + diff)

  }

  api
    .get("/guides/" + uuid, {
      headers: {
        Authorization: "Bearer " + token,
        tenant: tenantId,
      },
    })
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

// geGuideDetails();

onBeforeMount(() => {
  isLoading.value = true;
  // console.log(route.params.uuid)
  geGuideDetails(route.params.uuid);
});


</script>
