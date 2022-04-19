<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-ml-md">{{ $t("Ideas") }}</h5>

      <q-list bordered padding v-if="!isLoading">

        <div v-for="(idea, index) in ideas" v-bind:key="index">
          <idea-item @selectedItem="selectIdea" :idea="idea" :selected="selected" v-if="!isLoading"></idea-item>
        </div>

      </q-list>
      <!-- Skeleton -->
      <task-index-skeleton v-else />

      <q-space class="q-pa-sm" />
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" to="/ideas/add" color="accent" />
      </q-page-sticky>
    </q-page>
  </div>
</template>

<script setup>
import { onActivated, ref, computed } from "vue";
import { authApi } from "boot/axios";

import TaskIndexSkeleton from 'components/skeletons/TaskIndexSkeleton.vue';
import IdeaItem from 'components/IdeaItem.vue'


let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);

const ideas = ref(null);
let selected = ref(null);


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


function fetchIdeas() {
  authApi
    .get("/ideas/")
    .then((res) => {
      ideas.value = res.data
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
  isLoading.value = true;
  fetchIdeas()
});


</script>
