<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs class="q-ma-sm text-grey" active-color="grey">
        <template v-slot:separator>
          <q-icon
            size="1.5em"
            name="chevron_right"
            color="grey"
          />
        </template>
        <q-breadcrumbs-el icon="home" to="/"/>
        <q-breadcrumbs-el :label="$t('Employees')" icon="apps" to="/users"/>
      </q-breadcrumbs>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-medium">{{ $t("Employees") }}</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('Search') : ''"
                    class="float-right"
                    color="primary"
                    icon="search"
                    no-caps
                    flat
                    @click="showSearchBar = !showSearchBar"
                  />
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('New employee') : ''"
                    class="float-right  q-mr-xs"
                    color="primary"
                    icon="add" no-caps flat
                    to="/users/add"
                  />
<!--                  <q-btn :label="$q.screen.gt.xs ? 'Importuj' : ''" class="float-right q-mr-xs" color="primary"-->
<!--                         icon="backup" no-caps flat-->
<!--                         to="/users/add"-->
<!--                  />-->

                </div>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <q-slide-transition>
        <q-card v-show="showSearchBar===true" class="no-border no-shadow bg-transparent">
          <q-card-section class="q-pa-sm">
            <q-input
              v-model="search"
              :label="$t('Type your search text')"
              clearable
              debounce="300"
              outlined
              type="search"
              @update:model-value="fetchUsers()"
            >
              <template v-slot:append>
                <q-icon v-if="!search" name="search"/>
              </template>
            </q-input>
          </q-card-section>
        </q-card>
      </q-slide-transition>

      <q-card bordered class="my-card no-shadow q-mt-sm q-pt-none">
        <q-list v-if="!isLoading && users != null" class="q-mt-none q-pt-none" padding>
          <q-item :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'">
            <q-item-section avatar>

            </q-item-section>
            <q-item-section>
              <span>{{ $t("Name") }}
                <q-btn :flat="sort.active == 'name' ? false : true"
                       :icon="sort.name == 'asc' ? 'arrow_upward' : 'arrow_downward'"
                       :unelevated="sort.active == 'name' ? true : false" color="primary" padding="xs"
                       size="sm" @click="changeSortOrder('name')"/>
              </span>

            </q-item-section>
            <q-item-section side>

            </q-item-section>
          </q-item>

          <div v-for="(user, index) in users" v-if="users != null" v-bind:key="index">
            <user-list-row :user="user"/>
          </div>
          <task-index-skeleton v-else/>


        </q-list>


        <div v-if="pagination.total > 10" class="q-pa-lg flex flex-center">
          <q-pagination v-model="pagination.page" :max='pagesNo' direction-links @click="goToPage(pagination.page)"/>
        </div>
      </q-card>

    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";

import {getUsersRequest} from 'src/components/api/UserApiClient.js'
import {errorHandler} from 'src/components/api/errorHandler.js'
import {useUserStore} from "stores/user";

import UserListRow from 'components/listRow/UserListRow.vue'
import TaskIndexSkeleton from 'components/skeletons/tasks/TaskIndexSkeleton.vue';

const UserStore = useUserStore();
const permissions = computed(() => UserStore.getPermissions);

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
const showSearchBar = ref(false);


// sort & paginate
let sort = reactive({
  name: "asc",
  active: "name"
})

function changeSortOrder(column) {
  sort[column] == "asc" ? sort[column] = 'desc' : sort[column] = "asc"
  sort.active = column
  fetchUsers()
}

const pagination = reactive({page: 1, size: 5, total: 1});

function goToPage(value) {
  console.log(value)
}

const pagesNo = computed(() => {
  return Math.ceil(pagination.total / pagination.size)
})

watch(() => pagination.page, (oldPage, newPage) => {
  fetchUsers();
})
// sort & paginate


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
  let params = {
    search: search.value,
    page: pagination.page,
    size: pagination.size,
    sortOrder: sort[sort.active],
    sortColumn: sort.active
  };

  getUsersRequest(params).then(function (response) {
    users.value = response.data.items
    pagination.total = response.data.total
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });

}


onBeforeMount(() => {
  isLoading.value = true;
  fetchUsers()
});

</script>
