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

        <q-card-section v-if="itemDetails && !isLoading">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">{{ itemDetails.name }}</q-item-label>
                <!-- <q-item-label caption>{{ itemDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn outline color="primary" no-caps icon="edit" class="float-right q-mr-sm"
                    :label="$q.screen.gt.xs ? $t('Edit') : ''" @click="editItem(itemDetails.uuid)" />
                  <q-btn flat color="red" icon="delete" class="float-right q-mr-sm" no-caps
                    :label="$q.screen.gt.xs ? $t('Delete') : ''" @click="deleteItem(itemDetails.uuid)" />
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
                  <tiptap :body-content="itemDetails.description_jsonb" :readonly="true" v-if="itemDetails && !isLoading" />
                </div>
                <div class="q-mt-md">
                  <photo-viewer :pictures-list="itemDetails.files_item" v-if="itemDetails && !isLoading" />
                </div>
        
              </q-card-section>
            </div>
          </q-slide-transition>

          <q-card-section>
            <div class="row q-col-gutter-xs">
              <div class="text-h5">Instrukcje</div>
              <q-space></q-space>
              <q-btn color="grey" round flat dense :icon="expandedGuide ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                @click="expandedGuide = !expandedGuide" />
            </div>
        
          </q-card-section>
        
          <q-slide-transition>
            <div v-show="expandedGuide">
        
              <q-card-section>
        
                <q-list  v-if="!isLoading && pagination.total > 0">

<q-item class=" rounded-borders" :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-11'">
  <q-item-section avatar>
    <span>&nbsp;
      <q-btn padding="xs" :unelevated="sort.active=='counter'? true:false"
        :flat="sort.active=='counter'? false:true" size="sm" color="primary"
        :icon="sort.counter=='asc'? 'arrow_upward':'arrow_downward'" @click="changeSortOrder('counter')" />
    </span>
  </q-item-section>
  <q-item-section>
    <span>{{ $t("Name") }}
      <q-btn padding="xs" :unelevated="sort.active=='title'? true:false"
        :flat="sort.active=='title'? false:true" size="sm" color="primary"
        :icon="sort.title=='asc'? 'arrow_upward':'arrow_downward'" @click="changeSortOrder('title')" />
    </span>
  </q-item-section>
  <q-item-section side>
    <span>{{ $t("Age") }}
      <q-btn padding="xs" :unelevated="sort.active=='age'? true:false" :flat="sort.active=='age'? false:true"
        size="sm" color="primary" :icon="sort.age=='asc'? 'arrow_upward':'arrow_downward'"
        @click="changeSortOrder('age')" />
    </span>
  </q-item-section>
</q-item>

<div v-for="(guide, index) in guides" v-bind:key="index" v-if="guides!= null">
  <guide-item @forceRefresh="fetchGuides" :guide="guide" v-if="!isLoading"></guide-item>
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
import { ref, reactive, computed, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";

import GuideItem from "components/listRow/GuideItem.vue";
import Tiptap from 'src/components/editor/TipTap.vue'
import PhotoViewer from 'src/components/viewer/PhotoViewer.vue'

import { getGuideRequest } from 'src/components/api/GuideApiClient.js'
import { getItemUuidRequest } from 'src/components/api/ItemApiClient.js'
import {errorHandler} from 'src/components/api/errorHandler.js'

let itemDetails = ref(null);
const guides = ref([]);
let isLoading = ref(false);

const route = useRoute();
const router = useRouter();
let expandedDescription = ref(true)
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




function getDetails(uuid) {
  isLoading.value = true;

  getItemUuidRequest(uuid).then(function (response) {
    console.log(response.data);
    itemDetails.value = response.data;
    // json.value = res.data.body_json;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
  });

}

onBeforeMount(() => {
  isLoading.value = true;
  getDetails(route.params.uuid);
  fetchGuides();
});

</script>
