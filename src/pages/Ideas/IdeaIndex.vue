<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-ml-md">{{ $t("Ideas") }}</h5>

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

      <q-list bordered padding v-if="!isLoading">
        <div v-for="(idea, index) in ideas" v-bind:key="index">
          <idea-item @selectedItem="selectIdea" @forceRefresh="fetchIdeas" :idea="idea" :selected="selected"
            v-if="!isLoading"></idea-item>
        </div>
      </q-list>
      <!-- Skeleton -->
      <task-index-skeleton v-else />
      <div class="q-pa-lg flex flex-center">
        <q-pagination 
        v-model="pagination.page" 
        :max='pagesNo' 
        direction-links
        @click="goToPage(pagination.page)" />
      </div>
      <q-space class="q-pa-sm" />
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" to="/ideas/add" color="accent" />
      </q-page-sticky>
    </q-page>
  </div>
</template>

<script setup>
import { onActivated, ref, computed, watch, reactive } from "vue";
import { authApi } from "boot/axios";

import TaskIndexSkeleton from "components/skeletons/TaskIndexSkeleton.vue";
import IdeaItem from "components/IdeaItem.vue";

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);
let currentPage = ref(2);
let total = ref(1);

const ideas = ref(null);
let selected = ref(null);

let hasPhotos = ref(null);
let hasStatus = ref(null);

const pagination = reactive({
  page: 1,
  size: 10,
  total: 1

}

)

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

const pagesNo = computed(()=>{
  // console.log(Math.ceil(pagination.total/pagination.size))
  return Math.ceil(pagination.total/pagination.size)
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
  let params = { hasImg: hasPhotos.value, status: hasStatus.value, page: pagination.page, size: pagination.size };
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

onActivated(() => {
  console.log('onActivated')
  isLoading.value = true;
  fetchIdeas();
});
</script>
