<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">

      <div class="row justify-beteen no-wrap q-mb-sm q-mt-sm">
        <div class="col-6  q-ml-sm"><p class="text-h4">{{ $t("Ideas") }}</p></div>
        <div class="col-6  q-ml-md"><q-btn padding="sm" outline  size="md" icon="add" to="/ideas/add" color="primary" label="Nowy pomysł" no-caps  /></div>
      </div>

      <div class="q-pb-md">
        <q-btn-group>
          <q-btn-dropdown rounded color="primary" icon="image">
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label @click="setAttachmentFilter(true)"
                    :class="hasPhotos == true ? 'text-weight-bold' : 'text-weight-regular'">Tak</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label @click="setAttachmentFilter(false)"
                    :class="hasPhotos == false ? 'text-weight-bold' : 'text-weight-regular'">Nie</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label @click="setAttachmentFilter(null)"
                    :class="hasPhotos == null ? 'text-weight-bold' : 'text-weight-regular'">Wszystkie</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

          </q-btn-dropdown>

          <!-- <q-btn rounded color="primary" label="Two" /> -->

          <q-btn-dropdown auto-close color="primary" label="Status">
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label @click="setStatusFilter('rejected')"
                    :class="hasStatus == 'rejected' ? 'text-weight-bold' : 'text-weight-regular'">
                    Rejected
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label @click="setStatusFilter('accepted')"
                    :class="hasStatus == 'accepted' ? 'text-weight-bold' : 'text-weight-regular'">Accepted
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label @click="setStatusFilter('todo')"
                    :class="hasStatus == 'todo' ? 'text-weight-bold' : 'text-weight-regular'">Todo</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label @click="setStatusFilter(null)"
                    :class="hasStatus == null ? 'text-weight-bold' : 'text-weight-regular'">All</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-btn-group>
      </div>

      <q-input clearable outlined v-model="search" label="Szukaj"  type="search" @keyup="fetchIdeas()" @clear="fetchIdeas()"/>
      <q-list  padding v-if="!isLoading">
      
      <q-item class="bg-blue-grey-1 rounded-borders">
        <q-item-section avatar>
          <span>&nbsp;
            <q-btn 
              padding="xs" 
              :unelevated="sort.active=='counter'? true:false" 
              :flat="sort.active=='counter'? false:true" 
              size="sm" color="primary" 
              :icon="sort.counter=='asc'? 'arrow_upward':'arrow_downward'" 
              @click="changeSortOrder('counter')"/>
          </span>
        </q-item-section>
        <q-item-section>
          <span>Nazwa 
            <q-btn 
            padding="xs" 
            :unelevated="sort.active=='title'? true:false" 
            :flat="sort.active=='title'? false:true" 
            size="sm" 
            color="primary" 
            :icon="sort.title=='asc'? 'arrow_upward':'arrow_downward'" 
            @click="changeSortOrder('title')" />
          </span>
        </q-item-section>
        <q-item-section side>
          <span>Wiek 
            <q-btn 
            padding="xs" 
            :unelevated="sort.active=='age'? true:false" 
            :flat="sort.active=='age'? false:true" 
            size="sm" 
            color="primary" 
            :icon="sort.age=='asc'? 'arrow_upward':'arrow_downward'" 
            @click="changeSortOrder('age')"/>
          </span>
        </q-item-section>
      </q-item>
        <div v-for="(idea, index) in ideas" v-bind:key="index">
          <idea-item @selectedItem="selectIdea" @forceRefresh="fetchIdeas" :idea="idea" :selected="selected"
            v-if="!isLoading"></idea-item>
        </div>
      </q-list>
      <!-- Skeleton -->
      <task-index-skeleton v-else />

      <div class="text-h5" v-if="ideas.length == 0">
          Brak pomyslów 🤔? <br/>Niech Twój będzie pierwszy! 😎
      </div>

      <div class="q-pa-lg flex flex-center">
        <q-pagination v-model="pagination.page" :max='pagesNo' direction-links @click="goToPage(pagination.page)" />
      </div>
      <q-space class="q-pa-sm" />

    </q-page>
  </div>
</template>

<script setup>
import { onActivated, ref, computed, watch, reactive, onBeforeMount } from "vue";
import { authApi } from "boot/axios";

import TaskIndexSkeleton from "components/skeletons/TaskIndexSkeleton.vue";
import IdeaItem from "components/IdeaItem.vue";

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);
let search = ref(null);

const ideas = ref([]);
let selected = ref(null);

let sort = reactive({
  counter: "asc",
  title : "asc",
  age: "asc",
  active: "age"
})

function changeSortOrder(column){
  sort[column] == "asc" ?  sort[column] = 'desc' : sort[column] = "asc"
  sort.active = column
  fetchIdeas()
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
  fetchIdeas()
}

function setStatusFilter(condition) {
  hasStatus.value = condition;
  fetchIdeas()
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
  fetchIdeas();
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

async function fetchIdeas() {
  isLoading.value = true;
  let params = { 
    search: search.value , 
    hasImg: hasPhotos.value, 
    status: hasStatus.value, 
    page: pagination.page, 
    size: pagination.size,
    sortOrder: sort[sort.active],
    sortColumn: sort.active 
     };
  authApi
    .get("/ideas/", { params: params })
    .then((res) => {
      ideas.value = res.data.items;
      pagination.total = res.data.total;

      console.log(res.data);
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

function selectIdea(uuid) {
  if (selected.value == null) {
    selected.value = uuid;
  } else if (selected.value !== uuid) {
    selected.value = uuid;
  } else {
    selected.value = null;
  }
}

// onActivated(() => {
//   console.log('onActivated')
//   isLoading.value = true;
//   fetchIdeas();
// });

onBeforeMount(() => {
  console.log('b')
  isLoading.value = true;
  fetchIdeas();
});
</script>
