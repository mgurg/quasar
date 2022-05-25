<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-ml-md">{{ $t("Users") }}</h5>

      <q-list bordered padding v-if="!isLoading">

        <div v-for="(user, index) in users" v-bind:key="index">
        <user-item @selectedItem="selectUser" @refreshList="fetchUsers" :user="user" :selected="selected" v-if="!isLoading"></user-item>
        </div>

      </q-list>
      <!-- Skeleton -->
      <task-index-skeleton v-else />

      <q-space class="q-pa-sm" />
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" to="/users/add" color="accent" />
      </q-page-sticky>
    </q-page>
  </div>
</template>

<script setup>
import { onActivated, ref, computed, onBeforeMount, onMounted } from "vue";
import { authApi } from "boot/axios";
import UserItem from 'components/UserItem.vue'

import TaskIndexSkeleton from 'components/skeletons/TaskIndexSkeleton.vue';

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);

const users = ref(null);
let selected = ref(null);


// const myTasks = computed(() => {
//   if (users.value != null && isLoading.value == false) {
//     return users.value.filter(user => (user.assignee != null && user.assignee.uuid == "767a600e-8549-4c27-a4dc-656ed3a9af7d"))
//   } else {
//     return null;
//   }
// });

// const otherTasks = computed(() => {
//   if (users.value != null  && isLoading.value == false) {
//     return users.value.filter(user => (user.assignee == null || user.assignee.uuid != "767a600e-8549-4c27-a4dc-656ed3a9af7d"))
//   } else {
//     return users.value;
//   }
// });


function fetchUsers() {
  isLoading.value = true;
  console.log('fetching users');
  authApi
    .get("/user/")
    .then((res) => {
      users.value = res.data
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


function selectUser(uuid) {
  if (selected.value == null) {
    selected.value = uuid;
  } else if (selected.value !== uuid) {
    selected.value = uuid;
  } else {
    selected.value = null;
  }
}

// onActivated(() => {
//   isLoading.value = true;
//   fetchUsers()
// });

onBeforeMount(() => {
  console.log('b')
  isLoading.value = true;
  fetchUsers()
});

onMounted(() => {
    console.log('m')
  // isLoading.value = true;
  // fetchUsers()
});


</script>
