<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-medium">{{ $t("Guides") }}</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('Search') : ''"
                    class="float-right"
                    color="primary"
                    icon="search"
                    no-caps
                    flat
                    @click="showSearchBar = !showSearchBar"
                  />
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('New guide') : ''"
                    class="float-right q-mr-xs"
                    color="primary"
                    icon="add"
                    no-caps
                    flat
                    to="/guides/add"
                  />
                </div>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <q-slide-transition>
        <q-card v-show="showSearchBar===true" class="no-border no-shadow bg-transparent">
          <q-card-section class="q-pa-sm">
            <q-input
              v-model="search"
              :label="$t('Type your search text')"
              clearable
              debounce="300"
              outlined
              type="search"
              @update:model-value="fetchGuides()"
            >
              <template v-slot:append>
                <q-icon v-if="!search" name="search"/>
              </template>
            </q-input>
          </q-card-section>
        </q-card>
      </q-slide-transition>

      <q-card v-if="pagination.total > 0" bordered class="my-card no-shadow q-mt-sm q-pt-none">

        <q-list v-if="!isLoading && pagination.total > 0">

          <q-item :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-11'" class=" rounded-borders">
            <q-item-section avatar>
            <span>&nbsp;
              <q-btn :flat="sort.active=='counter'? false:true"
                     :icon="sort.counter=='asc'? 'arrow_upward':'arrow_downward'"
                     :unelevated="sort.active=='counter'? true:false" color="primary" padding="xs"
                     size="sm" @click="changeSortOrder('counter')"/>
            </span>
            </q-item-section>
            <q-item-section>
            <span>{{ $t("Name") }}
              <q-btn :flat="sort.active=='title'? false:true" :icon="sort.title=='asc'? 'arrow_upward':'arrow_downward'"
                     :unelevated="sort.active=='title'? true:false" color="primary" padding="xs"
                     size="sm" @click="changeSortOrder('title')"/>
            </span>
            </q-item-section>
            <q-item-section side>
            <span>{{ $t("Age") }}
              <q-btn :flat="sort.active=='age'? false:true" :icon="sort.age=='asc'? 'arrow_upward':'arrow_downward'"
                     :unelevated="sort.active=='age'? true:false"
                     color="primary" padding="xs" size="sm"
                     @click="changeSortOrder('age')"/>
            </span>
            </q-item-section>
          </q-item>

          <div v-for="(guide, index) in guides" v-if="guides!= null" v-bind:key="index">
            <guide-list-row v-if="!isLoading" :guide="guide" :public-access="false"
                            @forceRefresh="fetchGuides"></guide-list-row>
          </div>
          <task-index-skeleton v-else/>

        </q-list>

        <div v-if="pagination.total > 10" class="q-pa-lg flex flex-center">
          <q-pagination v-model="pagination.page" :max='pagesNo' direction-links @click="goToPage(pagination.page)"/>
        </div>
      </q-card>

      <div v-if="pagination.total == 0" class="text-h5 text-center q-pa-lg">
        Brak instrukcji 🤔? <br/>Niech Twoja będzie pierwsza!
        <div class="col-12 text-h6 q-mt-none">
          <q-btn :label="$t('New guide')" class="q-py-md q-my-md" color="primary" icon="add" no-caps to="/guides/add"/>
        </div>

      </div>


    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import {authApi} from "boot/axios";

import TaskIndexSkeleton from "components/skeletons/tasks/TaskIndexSkeleton.vue";
import GuideListRow from "components/listRow/GuideListRow.vue";
import {getManyItemsRequest} from "components/api/ItemApiClient";
import {errorHandler} from "components/api/errorHandler";
import {getGuideRequest} from "components/api/GuideApiClient";

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);
let search = ref(null);
const showSearchBar = ref(false);

const guides = ref([]);

let sort = reactive({
  counter: "asc",
  title: "asc",
  name: "asc",
  active: "name"
})

function changeSortOrder(column) {
  sort[column] == "asc" ? sort[column] = 'desc' : sort[column] = "asc"
  sort.active = column
  fetchGuides()
}

let hasPhotos = ref(null);
let hasStatus = ref(null);

const pagination = reactive({
  page: 1,
  size: 10,
  total: 1
})

function setAttachmentFilter(condition) {
  hasPhotos.value = condition;
  fetchGuides()
}

function setStatusFilter(condition) {
  hasStatus.value = condition;
  fetchGuides()
}

function goToPage(value) {
  console.log(value)
}

const pagesNo = computed(() => {
  // console.log(Math.ceil(pagination.total/pagination.size))
  return Math.ceil(pagination.total / pagination.size)
})

watch(() => pagination.page, (oldPage, newPage) => {
  console.log(oldPage, newPage);
  fetchGuides();
})


// const myTasks = computed(() => {
//   if (tasks.value != null && isLoading.value == false) {
//     return tasks.value.filter(task => (task.assignee != null && task.assignee.uuid == "767a600e-8549-4c27-a4dc-656ed3a9af7d"))
//   } else {
//     return null;
//   }
// });

// const otherTasks = computed(() => {
//   if (tasks.value != null  && isLoading.value == false) {
//     return tasks.value.filter(task => (task.assignee == null || task.assignee.uuid != "767a600e-8549-4c27-a4dc-656ed3a9af7d"))
//   } else {
//     return tasks.value;
//   }
// });

async function fetchGuides() {
  isLoading.value = true;
  let params = {
    search: search.value,
    hasImg: hasPhotos.value,
    status: hasStatus.value,
    page: pagination.page,
    size: pagination.size,
    sortOrder: sort[sort.active],
    sortColumn: sort.active
  };

  getGuideRequest(params).then(function (response) {
        guides.value = response.data.items;
        pagination.total = response.data.total;
        isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
  });
}

onBeforeMount(() => {
  isLoading.value = true;
  fetchGuides();
});
</script>
