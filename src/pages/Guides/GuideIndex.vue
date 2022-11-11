<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h4">{{ $t("Guides") }}</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn outline class="float-right q-mr-xs"  icon="add" to="/guides/add" color="primary" no-caps :label="$q.screen.gt.xs ? $t('New guide') : ''" />
                </div>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>


      <!-- <div class="row q-gutter-xs items-center">
        <div>
          <q-input 
            dense 
            clearable 
            outlined 
            v-model="search" 
            :label="$t('Type your search text')" 
            type="search"
            @keyup="fetchIdeas()" 
            @clear="fetchIdeas()" 
          />
        </div>
        <div>
          <q-btn 
            outline 
            class="float-right" 
            color="primary" 
            icon="search">{{ $t("Search") }}
        </q-btn>
        </div>
        <div>
          <q-btn-dropdown outline class="float-right" color="primary" :label="$t('Filters')" icon="filter_list">
            <div class="q-pa-xs" style="max-width: 350px">
              <q-list class="rounded-borders">
                <q-expansion-item expand-separator icon="attach_file" :label="$t('Attachments')">
                  <q-card>
                    <q-list>
                      <q-item clickable v-close-popup>
                        <q-item-section>
                          <q-item-label @click="setAttachmentFilter(true)"
                            :class="hasPhotos == true ? 'text-weight-bold' : 'text-weight-regular'">{{ $t("Yes") }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup>
                        <q-item-section>
                          <q-item-label @click="setAttachmentFilter(false)"
                            :class="hasPhotos == false ? 'text-weight-bold' : 'text-weight-regular'">{{ $t("No") }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup>
                        <q-item-section>
                          <q-item-label @click="setAttachmentFilter(null)"
                            :class="hasPhotos == null ? 'text-weight-bold' : 'text-weight-regular'">{{ $t("All") }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </q-expansion-item>

                <q-expansion-item expand-separator icon="category" label="Status">
                  <q-card>
                    <q-list>
                      <q-item clickable v-close-popup>
                        <q-item-section>
                          <q-item-label @click="setStatusFilter('rejected')"
                            :class="hasStatus == 'rejected' ? 'text-weight-bold' : 'text-weight-regular'">
                            {{ $t("Rejected") }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup>
                        <q-item-section>
                          <q-item-label @click="setStatusFilter('accepted')"
                            :class="hasStatus == 'accepted' ? 'text-weight-bold' : 'text-weight-regular'">{{
                            $t("Accepted") }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup>
                        <q-item-section>
                          <q-item-label @click="setStatusFilter('todo')"
                            :class="hasStatus == 'todo' ? 'text-weight-bold' : 'text-weight-regular'">Todo
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>
                          <q-item-label @click="setStatusFilter(null)"
                            :class="hasStatus == null ? 'text-weight-bold' : 'text-weight-regular'">{{ $t("All") }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </div>
          </q-btn-dropdown>
        </div>
      </div> -->



      <q-list padding v-if="!isLoading">

        <q-item class=" rounded-borders" :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-1'">
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

        <div v-for="(idea, index) in ideas" v-bind:key="index" v-if="ideas!= null">
          <guide-item @selectedItem="selectIdea" @forceRefresh="fetchIdeas" :idea="idea" :selected="selected"
            v-if="!isLoading"></guide-item>
        </div>
        <task-index-skeleton v-else />

      </q-list>

      

      <div class="text-h5 text-center q-pa-lg" v-if="ideas.length == 0 || ideas == null">
        Brak pomyslów 🤔? <br />Niech Twój będzie pierwszy! 😎
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

import TaskIndexSkeleton from "components/skeletons/tasks/TaskIndexSkeleton.vue";
import GuideItem from "components/GuideItem.vue";

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);
let search = ref(null);

const ideas = ref([]);
let selected = ref(null);

let sort = reactive({
  counter: "asc",
  title: "asc",
  age: "asc",
  active: "age"
})

function changeSortOrder(column) {
  sort[column] == "asc" ? sort[column] = 'desc' : sort[column] = "asc"
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
    search: search.value,
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

onBeforeMount(() => {
  console.log('b')
  isLoading.value = true;
  fetchIdeas();
});
</script>
