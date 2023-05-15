<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs active-color="grey" class="q-ma-sm text-grey">
        <template v-slot:separator>
          <q-icon
            color="grey"
            name="chevron_right"
            size="1.5em"
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
                    :flat="!showSearchBar"
                    :unelevated="showSearchBar"
                    :label="$q.screen.gt.xs ? $t('Search') : ''"
                    class="float-right"
                    color="primary"
                    flat
                    icon="search"
                    no-caps
                    @click="showSearchBar = !showSearchBar"
                  />
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('New employee') : ''"
                    class="float-right  q-mr-xs"
                    color="primary"
                    flat icon="add" no-caps
                    to="/users/add"
                    v-if="hasPermission('USER_ADD')"
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
        <q-list v-if="users != null" class="q-mt-none q-pt-none" padding>
          <q-item :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'" class="q-pa-xs">
            <q-item-section avatar>
              <div class="q-pa-none">
                <q-btn-dropdown color="primary" dropdown-icon="sort" flat>
                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Sortuj wyniki po:</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item v-close-popup clickable @click="setSortingParams('first_name')">
                      <q-item-section>
                        <q-item-label>Imię</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-close-popup clickable @click="setSortingParams('last_name')">
                      <q-item-section>
                        <q-item-label>Nazwisko</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-close-popup clickable @click="setSortingParams('created_at')">
                      <q-item-section>
                        <q-item-label>Wiek</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </q-item-section>
            <q-item-section>
              <span>{{ $t(sortName) }}
                <q-btn :icon="getSortIcon()" color="primary"
                       flat padding="xs"
                       size="sm" @click="changeSortOrder()"/>
              </span>
            </q-item-section>
          </q-item>

          <div v-for="(user, index) in verifiedUsers" v-if="users" v-bind:key="index">
            <user-list-row :user="user"/>
          </div>
          <task-index-skeleton v-else/>
        </q-list>



        <div v-if="pagination.total > 10" class="q-pa-md flex flex-center">
          <q-pagination v-model="pagination.page" :max='pagesNo' direction-links/>
        </div>
      </q-card>

      <q-card bordered class="my-card no-shadow q-mt-sm q-pt-none" v-if="1===2 && newUsers!==null">
        <div class="q-pa-md">
          <p class="text-h5">Użytkownicy oczekujący na weryfikację</p>
          <p>Masz uprawnienia pozwalające na zatwierdzanie nowych użytkowników. </p>
        </div>

        <q-list v-if="users != null" class="q-mt-none q-pt-none" padding>

          <q-separator/>

          <div v-for="(user, index) in newUsers" v-if="users !== null && newUsers!==null" v-bind:key="index">
            <user-unverified-list-row :user="user"/>
          </div>
        </q-list>
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
import UserUnverifiedListRow from 'components/listRow/UserUnverifiedListRow.vue'
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
let sort = reactive({first_name: "asc", last_name: "asc", created_at: "asc", active: "last_name"})
let sortName = ref("Name")

function setSortingParams(name) {
  switch (name) {
    case 'first_name':
      sort.active = "first_name"
      sortName.value = "Name"
      break;
    case 'last_name':
      sort.active = "last_name"
      sortName.value = "Name"
      break;
    case 'created_at':
      sort.active = "created_at"
      sortName.value = "Age"
      break;
  }
  fetchUsers();
}

function getSortIcon() {
  let field = sort.active
  return sort[field] === 'asc' ? 'arrow_upward' : 'arrow_downward'
}

function changeSortOrder() {
  let field = sort.active
  sort[field] === "asc" ? sort[field] = 'desc' : sort[field] = "asc"
  fetchUsers();
}

// PAGINATE
const pagination = reactive({page: 1, size: 10, total: 1});
const pagesNo = computed(() => {
  return Math.ceil(pagination.total / pagination.size)
})
watch(() => pagination.page, (oldPage, newPage) => {
  fetchUsers();
})


const verifiedUsers = computed(() => {
  if (users.value != null && isLoading.value === false) {
    return users.value.filter(user => (user.is_verified == true))
  } else {
    return null;
  }
});

const newUsers = computed(() => {
  if (users.value != null  && isLoading.value == false) {
    return users.value.filter(user => (user.is_verified == false))
  } else {
    return users.value;
  }
});


function fetchUsers() {
  isLoading.value = true;
  let params = {
    search: search.value,
    page: pagination.page,
    size: pagination.size,
    field: sort.active,
    order: sort[sort.active],
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
