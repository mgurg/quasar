<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section class="row q-pa-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el :label="$t('Guides')" icon="tips_and_updates" to="/guides" />
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
        <!-- <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h5">Opis</div>
            <q-space></q-space>
            <q-btn color="grey" round flat dense icon="keyboard_arrow_down"
              @click="expandedDetails = !expandedDetails" />
          </div>
        </q-card-section> -->
        <q-card-section>
          <div style="border: 1px solid #c2c2c2; border-radius: 5px; padding-left: 5px;">
            <tip-tap-guide :model-value="guideDetails.text_jsonb" :readonly="true" v-if="guideDetails && !isLoading" />
          </div>
        </q-card-section>

        <q-card-section>
          <q-btn label="Alert" color="primary" @click="previewURL()" />
        </q-card-section>

        <!-- <q-card-section>
          <q-img src="https://placeimg.com/500/300/nature?t=1" class="q-ma-xs" style="height: 140px; max-width: 150px"
            native-context-menu />
          <q-img src="https://placeimg.com/500/300/nature?t=2" class="q-ma-xs" style="height: 140px; max-width: 150px"
            draggable />
          <q-img src="https://placeimg.com/500/300/nature?t=3" class="q-ma-xs"
            style="height: 140px; max-width: 150px" />
          <q-img src="https://placeimg.com/500/300/nature?t=4" class="q-ma-xs"
            style="height: 140px; max-width: 150px" />
        </q-card-section>
        <q-card-section>
          <q-btn label="Alert" color="primary" @click="previewURL()" />
        </q-card-section> -->

      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import TipTapGuide from 'src/components/editor/TipTapGuide.vue'
import { useUserStore } from 'stores/user'
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { authApi } from "boot/axios";
import TaskViewSkeleton from "components/skeletons/tasks/TaskViewSkeleton";
import { api as viewerApi } from "v-viewer";
import VueViewer from "v-viewer";
import "viewerjs/dist/viewer.css";

const router = useRouter();

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

const UserStore = useUserStore();

const json = ref(null);
let isLoading = ref(false);
let dialog = ref(false);


let map
let portales
let viales
let images
let control
let viewer

function getViewer() {
  const options = {
    navbar: false,
    rotatable: false,
    scalable: false,
    title: [true, (image) => `${image.alt}`],
  }
  return viewerApi({ options, images })
}

function getImg(data) {
  return { src: "https://placeimg.com/500/300/nature?t=4", alt: "alt_text" }
}


function showImg(index) {
  viewer = getViewer()
  viewer.view(index)
}

const sourceImageURLs = ["https://placeimg.com/1000/1000/nature?t=4", "https://placeimg.com/1000/1000/nature?t=5"]

function previewURL() {
  const $viewer = viewerApi({
    images: sourceImageURLs,
    rotatable: false,
    scalable: false,
    transition: false
  })
  console.log($viewer)
}



const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return Boolean(permissions.value.includes(permission));
}


const route = useRoute();
let guideDetails = ref(null);

function getDetails(uuid) {
  authApi
    .get("/guides/" + uuid)
    .then((res) => {
      console.log(uuid);
      console.log(res.data);
      guideDetails.value = res.data;
      json.value = res.data.text_jsonb;
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

onBeforeMount(() => {
  isLoading.value = true;
  getDetails(route.params.uuid);
});

</script>

<style lang="scss" scoped>

</style>
