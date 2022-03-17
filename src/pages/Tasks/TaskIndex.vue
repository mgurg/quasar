<!-- 
  TODO:
  - Wydzielić komunikację API jeszcze bardziej na zewnątrz (Zrobić generyczny GET/POST/PATCH/DELETE)? 
  - użyć isLoading
  - wyliczenie relatywnego czasu (+ odświeżanie co 1 min?)
  - strefy czasowe

 -->

<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-ml-md">{{ $t("Tasks") }}</h5>

      <q-list bordered padding v-if="!isLoading">
        <q-item-label header v-if="myTasks">{{ $t("Your tasks") }}</q-item-label>

        <div v-for="task in myTasks" v-bind:key="task.uuid">
          <task-item @selectedItem="selectTask" :task="task" :selected="selected" v-if="!isLoading"></task-item>
        </div>

        <!-- ALL TASKS -->
        <q-item-label header v-if="otherTasks">{{ $t("All tasks") }}</q-item-label>

        <div v-for="task in otherTasks" v-bind:key="task.uuid">
          <task-item @selectedItem="selectTask" :task="task" :selected="selected" v-if="!isLoading"></task-item>
        </div>
      </q-list>
      <!-- Skeleton -->
      <task-index-skeleton v-else />

      <q-space class="q-pa-sm" />
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" to="/tasks/add" color="accent" />
      </q-page-sticky>
    </q-page>
  </div>
</template>

<script setup>
import { onActivated, ref, computed } from "vue";
import { api } from "boot/axios";

import TaskIndexSkeleton from 'components/skeletons/TaskIndexSkeleton.vue';
import TaskItem from 'components/TaskItem.vue'


let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);

const tasks = ref(null);
let selected = ref(null);


const myTasks = computed(() => {
  console.log("my",)
  if (tasks.value != null && tasks.value.assignee != null && isLoading.value == false) {

    return tasks.value.filter((task) => task.assignee.uuid == "767a600e-8549-4c27-a4dc-656ed3a9af7d")
  } else {
    return null;
  }
});

const otherTasks = computed(() => {
  console.log("other",)
  if (tasks.value != null && tasks.value.assignee != null && isLoading.value == false) {

    return tasks.value.filter((task) => task.assignee.uuid != "767a600e-8549-4c27-a4dc-656ed3a9af7d")
  } else {
    return tasks.value;
  }
});



function fetchTasks() {
  api
    .get("/tasks/index?offset=0&limit=20")
    .then((res) => {
      tasks.value = res.data
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


function selectTask(uuid) {
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
  fetchTasks()
});


</script>
