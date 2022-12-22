<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section class="row q-pa-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/"/>
            <q-breadcrumbs-el :label="$t('Items')" icon="tips_and_updates" to="/items"/>
            <q-breadcrumbs-el :label="$t('View')" icon="info"/>
          </q-breadcrumbs>
        </q-card-section>

        <q-separator/>

        <q-card-section v-if="itemDetails && !isLoading">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">{{ itemDetails.name }}</q-item-label>
                <!-- <q-item-label caption>{{ itemDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('Edit') : ''"
                    class="float-right q-mr-sm" color="primary"
                    icon="edit" no-caps
                    outline @click="editItem(itemDetails.uuid)"
                  />
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('Delete') : ''"
                    class="float-right q-mr-sm" color="red" flat
                    icon="delete"
                    no-caps @click="deleteItem(itemDetails.uuid, itemDetails.name)"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>

        <q-card-actions align="right">
          <q-btn color="primary" flat icon="bug_report" no-caps>Zgłoś awarie</q-btn>
          <q-btn color="primary" flat icon="lightbulb_outline" no-caps>Usprawnienie</q-btn>
          <q-btn color="primary" flat icon="insights" no-caps>Raporty</q-btn>
        </q-card-actions>
      </q-card>


      <q-card bordered class="my-card no-shadow q-my-sm">
        <q-card-section class="q-py-sm">
          <div class="row q-col-gutter-xs">

            <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedDescription = !expandedDescription">
              Opis
            </div>
            <q-space/>
            <q-btn :icon="expandedDescription ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                   color="grey"
                   dense
                   flat
                   round
                   @click="expandedDescription = !expandedDescription"/>
          </div>
        </q-card-section>
        <q-separator v-if="!expandedDescription"/>
        <q-slide-transition>
          <div v-show="expandedDescription">
            <q-card-section>
              <div
                :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-1', $q.screen.lt.sm?'q-py-md q-pl-sm':'q-py-lg q-pl-md'"
                class="rounded-borders">
                <tip-tap
                  v-if="itemDetails && !isLoading"
                  :body-content="itemDetails.text_json"
                  :readonly="true"
                />
              </div>
            </q-card-section>
          </div>
        </q-slide-transition>

      </q-card>
      <photo-card :expanded-photos="false" :photo-files="photoFiles" v-if="photoFiles!==null" />
      <document-card :expanded-docs="false" :document-files="documentFiles" v-if="documentFiles!==null" />
      <guide-card :expanded-guide="false" :guides="guides" :item-uuid="itemDetails.uuid" v-if="guides!==null && itemDetails !==null" />
      <qr-card :expanded-q-r="false" :qr-code="qrCode" v-if="qrCode!==null" />
      <chat-card :expanded-comments="false" />
      <timeline-card :expanded-timeline="false" />
    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

import GuideItem from "components/listRow/GuideListRow.vue";
import TipTap from 'src/components/editor/TipTap.vue'
import PhotoViewer from 'src/components/viewer/PhotoViewer.vue'
import DocumentViewer from 'src/components/viewer/DocumentViewer.vue'

import DocumentCard from "components/viewer/cards/DocumentCard.vue";
import GuideCard from "components/viewer/cards/GuideCard.vue";
import QrCard from "components/viewer/cards/QrCard.vue";
import ChatCard from "components/viewer/cards/ChatCard.vue";
import TimelineCard from "components/viewer/cards/TimelineCard.vue";

import {getGuideRequest} from 'src/components/api/GuideApiClient.js'
import {deleteItemRequest, getItemUuidRequest} from 'src/components/api/ItemApiClient.js'
import {errorHandler} from 'src/components/api/errorHandler.js'
import {useQuasar} from "quasar";
import {useUserStore} from "stores/user";
import {useI18n} from "vue-i18n";
import PhotoCard from "components/viewer/cards/PhotoCard.vue";


let itemDetails = ref(null);
let photoFiles = ref(null);
let documentFiles = ref(null);
let qrCode = ref(null);
let qrCodeSize = ref(300);
const guides = ref([]);
let isLoading = ref(false);
let isError = ref(false);


const $q = useQuasar();
const UserStore = useUserStore();
const route = useRoute();
const router = useRouter();

const {t} = useI18n({useScope: "global"});
const confirmDeleteMessage = computed(() => t("Delete:"));
const successfulDeleteMessage = computed(() => t("Deleted:"));

// const layout = computed(() => {return $q.screen.lt.sm ? 'dense' : ($q.screen.lt.md ? 'comfortable' : 'loose');

const layout = computed(() => {
  return $q.screen.lt.sm ? 'dense' : ($q.screen.lt.md ? 'comfortable' : 'loose')
});

let expandedDescription = ref(true)
let expandedPhotos = ref(false)
let expandedDocs = ref(false)
let expandedGuide = ref(false)
let expandedQR = ref(false)
let expandedComments = ref(false)
let expandedTimeline = ref(false)


let sort = reactive({
  name: "asc",
  active: "name"
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 1
})

function fetchGuides() {
  isLoading.value = true;

  let params = {
    search: null,
    page: pagination.page,
    size: pagination.size,
    sortOrder: sort[sort.active],
    sortColumn: sort.active
  };

  getGuideRequest(params).then(function (response) {
    console.log(response.data);
    guides.value = response.data.items;
    pagination.total = response.data.total
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
  });
}


function getItemDetails(uuid) {
  isLoading.value = true;

  getItemUuidRequest(uuid).then(function (response) {
    console.log(response.data);
    itemDetails.value = response.data;


    // console.log("photoFiles")

    photoFiles.value = response.data.files_item.filter((item) => item.mimetype.match('image.*'));
    documentFiles.value = response.data.files_item.filter((item) => !item.mimetype.match('image.*'));
    qrCode.value = response.data.qr_code;
    // console.log(photoFiles.value)

    // documentFiles.value =  itemDetails.value;
    // json.value = res.data.body_json;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage);
  });

}

function changeSortOrder(column) {
  sort[column] === "asc" ? sort[column] = 'desc' : sort[column] = "asc"
  sort.active = column
  fetchItems()
}

function editItem(uuid) {
  router.push("/items/edit/" + uuid);
}

function deleteItem(uuid, itemName) {
  console.log(itemName);
  $q.dialog({
    title: "Confirm",
    message: confirmDeleteMessage.value + " '" + itemName + "' ?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    isLoading = true;
    deleteItemRequest(uuid).then(function (response) {
      $q.notify({
        type: 'warning',
        message: successfulDeleteMessage.value + " " + itemName,
      });
      router.push("/items/");
      isLoading.value = false;
    }).catch((err) => {
      const errorMessage = errorHandler(err);
      isError.value = true;
    });
  });
}

function generateQRUrl(qrCodeId) {
  return process.env.VUE_BASE_URL + "/qr/" + qrCodeId;
}

function GenerateQR(qrCodeId, ecc, size = 300) {
  // http://beta.remontmaszyn.pl/qr/mxw+234

  let url = process.env.VUE_BASE_URL + "/qr/" + qrCodeId;
  console.log(url)

  return "https://chart.googleapis.com/chart?chs=" + size + "x" + size + "&cht=qr&chl=" + url + "&choe=UTF-8&chld=" + ecc
}

function addGuide(itemUuid){
  console.log(itemUuid)
  // router.push("/guides/add/" + itemUuid);
  router.push({ path: '/guides/add/', query: { item: itemUuid }})
}

onBeforeMount(() => {
  isLoading.value = true;
  getItemDetails(route.params.uuid);
  fetchGuides();
});

</script>
