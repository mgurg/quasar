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

<div v-for="task in tasks" v-bind:key="task.uuid">
    <div @click="handleSelect(task.uuid)">
        <q-item :class="{ 'done bg-blue-1': task.uuid == selected }">
            <q-item-section avatar cursor-pointer ripple @click="viewTask(task.uuid)">
            <q-avatar rounded color="red" text-color="white" icon="question_mark" />
                <!-- <q-avatar rounded>
                    <img src="~assets/stecker.jpg" />
                    <q-badge floating rounded color="green" />
                </q-avatar> -->
            </q-item-section>

            <q-item-section>
                <q-item-label lines="1">{{ task.title }}</q-item-label>
                <q-item-label caption lines="2">{{ task.description }}</q-item-label>
                <q-item-label lines="1">
                    <q-chip square size="sm" color="blue" text-color="white">#111</q-chip>
                    <q-chip
                        square
                        size="sm"
                        color="blue"
                        text-color="white"
                        icon="account_circle"
                        v-if="task.assignee != null"
                    >{{ task.assignee.first_name + ' ' + task.assignee.last_name }}</q-chip>
                </q-item-label>
            </q-item-section>

            <q-item-section side v-if="task.uuid === selected">
                <div class="text-grey-8 q-gutter-xs">
                    <q-btn size="12px" flat dense round icon="edit" @click="editTask(task.uuid)" />
                    <q-btn
                        size="12px"
                        flat
                        dense
                        round
                        icon="delete"
                        @click="deleteTask(task.uuid)"
                    />
                    <q-btn size="12px" flat dense round icon="info" @click="viewTask(task.uuid)" />
                </div>
            </q-item-section>
            <q-item-section side v-else>
                <q-item-label caption>sdf</q-item-label>
                <q-icon name="priority_high" color="red" />
            </q-item-section>
        </q-item>

        <q-separator />
    </div>
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
import { authApi } from "boot/axios";

import TaskIndexSkeleton from 'components/skeletons/TaskIndexSkeleton.vue';
import TaskItem from 'components/TaskItem.vue'


let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);

const tasks = ref(null);
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


function fetchTasks() {
  authApi
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
