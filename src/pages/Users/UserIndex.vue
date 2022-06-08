<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-ml-md">{{ $t("Users") }}</h5>

      <q-input clearable outlined v-model="search" label="Szukaj"  type="search" @keyup="fetchUsers()" @clear="fetchUsers()"/>

      <q-list padding v-if="!isLoading">

        <div v-for="(user, index) in users" v-bind:key="index">
        <user-item @selectedItem="selectUser" @refreshList="fetchUsers" :user="user" :selected="selected" v-if="!isLoading"></user-item>
        </div>

      </q-list>
      <!-- Skeleton -->
      <task-index-skeleton v-else />

      <div class="q-pa-lg flex flex-center">
        <q-pagination v-model="pagination.page" :max='pagesNo' direction-links @click="goToPage(pagination.page)" />
      </div>

      <q-space class="q-pa-sm" />
      <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="hasPermission('USERS_ADD')">
        <q-btn fab icon="add" to="/users/add" color="accent" />
      </q-page-sticky>
    </q-page>
  </div>
</template>

<script setup>
import { onActivated, ref, computed, watch, onBeforeMount, onMounted, reactive } from "vue";
import { authApi } from "boot/axios";
import UserItem from 'components/UserItem.vue'
import { useUserStore } from "stores/user";

import TaskIndexSkeleton from 'components/skeletons/TaskIndexSkeleton.vue';

const UserStore = useUserStore();
const permissions = computed(() => UserStore.getPermissions );

function hasPermission(permission) {
  return Boolean(permissions.value.includes(permission));
}

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);

const users = ref(null);
let selected = ref(null);
let search = ref(null);

const pagination = reactive({
  page: 1,
  size: 5,
  total: 1
})

function goToPage(value) {
  console.log(value)
}

const pagesNo = computed(() => {
  // console.log(Math.ceil(pagination.total/pagination.size))
  return Math.ceil(pagination.total / pagination.size)
})

watch(() => pagination.page, (oldPage, newPage) => {
  console.log(oldPage, newPage);
  fetchUsers();
})



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
    let params = { search: search.value ,page: pagination.page, size: pagination.size };
  authApi
    .get("/user/", { params: params })
    .then((res) => {
      users.value = res.data.items
      pagination.total = res.data.total
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
  isLoading.value = true;
  fetchUsers()
});




</script>
