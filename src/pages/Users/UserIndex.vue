<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="row justify-around q-mt-sm">
        <div class="col-6"><p class="text-h4">{{ $t("Employees") }}</p></div>
        <div class="col-6">
          <!-- v-if="hasPermission('USERS_ADD')" -->
          <q-btn  padding="sm" class="float-right" outline  size="md" icon="add" to="/users/add" color="primary" no-caps>
          {{ $t("New employee") }}
          </q-btn></div>
      </div>

<div class="row q-gutter-sm items-center">
  <div><q-input dense clearable outlined v-model="search" :label="$t('Type your search text')"  type="search" @keyup="fetchUsers()" @clear="fetchUsers()">
  </q-input></div>
  <div><q-btn outline class="float-right" color="primary" icon="search">{{ $t("Search") }}</q-btn></div>
</div>
      

      <q-list padding v-if="!isLoading">
      <q-item class="bg-blue-grey-1 rounded-borders">
        <q-item-section avatar>

        </q-item-section>
        <q-item-section>
          <span>{{ $t("Name") }} 
            <q-btn 
            padding="xs" 
            :unelevated="sort.active=='name'? true:false" 
            :flat="sort.active=='name'? false:true" 
            size="sm" 
            color="primary" 
            :icon="sort.name=='asc'? 'arrow_upward':'arrow_downward'" 
            @click="changeSortOrder('name')" />
          </span>
          
        </q-item-section>
        <q-item-section side>

        </q-item-section>
      </q-item>
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

    </q-page>
  </div>
</template>

<script setup>
import { onActivated, ref, computed, watch, onBeforeMount, onMounted, reactive } from "vue";
import { authApi } from "boot/axios";
import UserItem from 'components/UserItem.vue'
import { useUserStore } from "stores/user";

import TaskIndexSkeleton from 'components/skeletons/tasks/TaskIndexSkeleton.vue';

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

let sort = reactive({
  name: "asc",
  active: "name"
})

function changeSortOrder(column){
  sort[column] == "asc" ?  sort[column] = 'desc' : sort[column] = "asc"
  sort.active = column
  fetchUsers()
}

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
    let params = { 
      search: search.value,
      page: pagination.page,
      size: pagination.size,
      sortOrder: sort[sort.active],
      sortColumn: sort.active
    };
  authApi
    .get("/users/", { params: params })
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
