<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-ml-md">{{ $t("Issues") }}</h5>
      <q-list v-if="!isLoading" padding>
        <div v-for="(issue, index) in issues" v-bind:key="index">
          <issue-item v-if="!isLoading" :issue="issue" @forceRefresh="fetchIssues"></issue-item>
        </div>
      </q-list>
      <!-- Skeleton -->
      <task-index-skeleton v-else/>
      <div class="q-pa-lg flex flex-center">
        <q-pagination v-model="pagination.page" :max='pagesNo' direction-links @click="goToPage(pagination.page)"/>
      </div>
      <q-space class="q-pa-sm"/>
      <q-page-sticky :offset="[18, 18]" position="bottom-right">
        <q-btn color="accent" fab icon="add" to="/issues/add"/>
      </q-page-sticky>
    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {authApi} from "boot/axios";

import TaskIndexSkeleton from "components/skeletons/tasks/TaskIndexSkeleton.vue";
import IssueItem from "components/listRow/IssueListRow.vue";

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);

const route = useRoute();
let userUuid = ref(route.params.uuid);

const issues = ref([]);
let selected = ref(null);

let hasPhotos = ref(null);
let hasStatus = ref(null);

const pagination = reactive({
  page: 1,
  size: 10,
  total: 1
})

function setAttachmentFilter(condition) {
  hasPhotos.value = condition;
  fetchIssues()
}

function setStatusFilter(condition) {
  hasStatus.value = condition;
  fetchIssues()
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
  fetchIssues();
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

async function fetchIssues() {
  isLoading.value = true;
  let params = {hasImg: hasPhotos.value, status: hasStatus.value, page: pagination.page, size: pagination.size};
  authApi
    .get("/issues/user/" + userUuid.value) //, { params: params }
    .then((res) => {
      if (res.data.items.length > 0) {
        issues.value = res.data.items;
        pagination.total = res.data.total;
      }


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


// onActivated(() => {
//   console.log('onActivated')
//   isLoading.value = true;
//   fetchIssues();
// });

onBeforeMount(() => {

  isLoading.value = true;
  fetchIssues();
});
</script>
