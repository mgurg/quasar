<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section class="row q-pa-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/home" />
            <q-breadcrumbs-el :label="$t('Guides')" icon="fact_check" to="/guides" />
            <q-breadcrumbs-el :label="$t('Edit')" icon="edit" />
          </q-breadcrumbs>

        </q-card-section>

        <q-separator />
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">

              <q-item-section>
                <q-item-label class="text-h6" v-if="guideDetails != null">{{ $t('Edit') }}: {{guideDetails.name}} </q-item-label>
                <!-- <q-item-label caption>Nowy pracownik będzie musiał potwierdzić hasło. Wiecej użytkowników? Pamiętaj o opcji importu!</q-item-label> -->
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>


      <!-- https://github.com/oneriang/quasar_dashboard/blob/main/src/components/Editor.vue -->

      <div>&nbsp;</div>

      <q-card class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section>
          <guide-form v-if="guideDetails != null" :guide="guideDetails" />
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>


<script setup>
import { ref, watch, onBeforeUnmount, onBeforeMount } from "vue";
import GuideForm from 'src/components/forms/GuideForm.vue'
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "stores/user";
import { authApi } from "boot/axios";
import axios from "axios";
import { VideoUploader } from '@api.video/video-uploader'

import { component as Viewer } from 'v-viewer'
import 'viewerjs/dist/viewer.css'

const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();

let guideDetails = ref(null);




function getDetails(uuid) {
    authApi
        .get("/guides/" + uuid)
        .then((res) => {
            console.log(uuid);
            
            guideDetails.value = res.data

            // if (res.data.date_from == null) {
            //     guideDetails.value.mode = 'task'
            // }
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


let isLoading = ref(false);

function createGuide() {

  let data = {
    "name": "string",
    "text_html": htmlTxt,
    "text_json": jsonTxt,
    "video_id": videoId.value
  }

  // console.log(data)

  isLoading.value = true;
  authApi
    .post("/guides/", data)
    .then((res) => {
      
      isLoading.value = false;
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

}

function cancelButtonHandle() {
  router.push("/guides");
}

function submit() {
  router.push("/guides");
}



onBeforeMount(() => {
    if (route.params.uuid != null)
        getDetails(route.params.uuid)
    // getUsers();
    isLoading.value = false;
});



</script>
