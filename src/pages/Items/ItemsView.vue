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
          <q-btn color="red" no-caps outline>Awaria</q-btn>
          <q-btn color="warning" icon="lightbulb_outline" no-caps outline>Usprawnienie</q-btn>
          <q-btn no-caps outline>Statystyki</q-btn>
        </q-card-actions>
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
              <div
                :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-1', $q.screen.lt.sm?'q-py-md q-pl-sm':'q-py-lg q-pl-md'"
                class="rounded-borders">
                <tip-tap
                  v-if="itemDetails && !isLoading"
                  :body-content="itemDetails.description_jsonb"
                  :readonly="true"
                />
              </div>
            </q-card-section>
          </div>
        </q-slide-transition>

        <!--        PHOTOS -->
        <q-separator v-if="itemDetails && photoFiles !==null"/>
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h5">Zdjęcia</div>
            <q-space></q-space>
            <q-btn
              :icon="expandedPhotos ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              color="grey"
              dense
              flat
              round
              @click="expandedPhotos = !expandedPhotos"
            />
          </div>

        </q-card-section>
        <q-slide-transition>
          <div v-show="expandedPhotos">
            <!-- <q-separator /> -->
            <q-card-section :class="$q.screen.lt.sm?'q-mx-xs q-px-xs':'q-mx-md q-px-md'">
              <div class="q-mt-md">
                <photo-viewer v-if="photoFiles && !isLoading" :pictures-list="photoFiles"/>
              </div>


            </q-card-section>
          </div>
        </q-slide-transition>

        <!--        DOCS  -->
        <q-separator v-if="itemDetails && photoFiles !==null"/>
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h5">Dokumenty</div>
            <q-space></q-space>
            <q-btn
              :icon="expandedDocs ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              color="grey"
              dense
              flat
              round
              @click="expandedDocs = !expandedDocs"
            />
          </div>

        </q-card-section>
        <q-separator />
        <q-slide-transition>
          <div v-show="expandedDocs">
            <!-- <q-separator /> -->
            <q-card-section :class="$q.screen.lt.sm?'q-mx-xs q-px-xs':'q-mx-md q-px-md'">
              <div class="q-mt-md">
                <document-viewer v-if="photoFiles && !isLoading" :files-list="photoFiles" />
              </div>


            </q-card-section>
          </div>
        </q-slide-transition>

        <!--        GUIDES -->
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h5">Instrukcje</div>
            <q-space></q-space>
            <q-btn class="q-mr-lg" color="primary" flat no-caps>Dodaj nową</q-btn>
            <q-btn :icon="expandedGuide ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat round
                   @click="expandedGuide = !expandedGuide"/>
          </div>

        </q-card-section>


        <q-slide-transition>
          <div v-show="expandedGuide">

            <q-card-section>

              <q-list v-if="!isLoading && pagination.total > 0">

                <q-item :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-11'" class=" rounded-borders">
                  <q-item-section avatar>
                    <span>&nbsp;    </span>
                  </q-item-section>
                  <q-item-section>
    <span>
      {{ $t("Name") }}
      <q-btn
        :flat="sort.active!=='title'"
        :icon="sort.title==='asc'? 'arrow_upward':'arrow_downward'"
        :unelevated="sort.active==='title'"
        color="primary"
        padding="xs"
        size="sm"
        @click="changeSortOrder('title')"/>
    </span>
                  </q-item-section>

                </q-item>

                <div v-for="(guide, index) in guides" v-if="guides!= null" v-bind:key="index">
                  <guide-item v-if="!isLoading" :guide="guide" @forceRefresh="fetchGuides"></guide-item>
                </div>

              </q-list>

            </q-card-section>
          </div>
        </q-slide-transition>

      </q-card>
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

import {getGuideRequest} from 'src/components/api/GuideApiClient.js'
import {deleteItemRequest, getItemUuidRequest} from 'src/components/api/ItemApiClient.js'
import {errorHandler} from 'src/components/api/errorHandler.js'
import {useQuasar} from "quasar";
import {useUserStore} from "stores/user";
import {useI18n} from "vue-i18n";


let itemDetails = ref(null);
let photoFiles = ref(null);
let documentFiles = ref(null);
const guides = ref([]);
let isLoading = ref(false);


const $q = useQuasar();
const UserStore = useUserStore();
const route = useRoute();
const router = useRouter();

const {t} = useI18n({useScope: "global"});
const confirmDeleteMessage = computed(() => t("Delete:"));
const successfulDeleteMessage = computed(() => t("Deleted:"));

let expandedDescription = ref(true)
let expandedPhotos = ref(true)
let expandedDocs = ref(true)
let expandedGuide = ref(true)

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


    console.log("photoFiles")

    photoFiles.value =  response.data.files_item.filter((item) => item.mimetype.match('image.*'));
    console.log(photoFiles.value)

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
  getItemDetails(route.params.uuid);
  fetchGuides();
});

</script>
