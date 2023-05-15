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
        <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings"/>
        <q-breadcrumbs-el :label="$t('Permissions')" icon="ballot" to="/settings/permissions"/>
      </q-breadcrumbs>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-medium">{{ $t("Groups") }}</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <!-- v-if="hasPermission('USERS_ADD')"  -->
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('New group') : ''"
                    class="float-right"
                    color="primary"
                    flat
                    icon="add"
                    no-caps size="md"
                    to="/settings/groups/add"
                  />

                </div>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <q-card v-if="groups.length > 0" bordered class="my-card no-shadow q-mt-sm q-pt-none">
        <q-list v-if="groups !== null" class="q-mt-none q-pt-none" padding>
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
                        <q-item-label>Liczbie osób</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-close-popup clickable @click="setSortingParams('last_name')">
                      <q-item-section>
                        <q-item-label>Nazwie</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-close-popup clickable @click="setSortingParams('created_at')">
                      <q-item-section>
                        <q-item-label>Uprawnienia własne/systemowe</q-item-label>
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

          <div v-for="(group, index) in groups" v-bind:key="index">
            <group-item v-if="!isLoading" :group="group"
                        @refreshList="fetchGroups"/>
          </div>

        </q-list>
        <div v-if="pagination.total > 10" class="q-pa-lg flex flex-center">
          <q-pagination v-model="pagination.page" :max='pagesNo' direction-links/>
        </div>

      </q-card>

      <div v-if="groups.length == 0" class="text-h5 text-center q-pa-lg">  <!-- -->
        {{ $t("No groups, add a first one!") }} 🚀
      </div>

    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import {useQuasar} from 'quasar'
import GroupItem from 'components/listRow/GroupListRow.vue'
import {errorHandler} from "components/api/errorHandler";
import {getUsersGroupsRequest} from "components/api/UserGroupsApiClient";

const $q = useQuasar()

let isLoading = ref(false);
let selected = ref(null);
let search = ref(null);

let sort = reactive({name: "asc", is_custom: "asc", active: "name"})
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
  fetchGroups();
}

function getSortIcon() {
  let field = sort.active
  return sort[field] === 'asc' ? 'arrow_upward' : 'arrow_downward'
}

function changeSortOrder() {
  let field = sort.active
  sort[field] === "asc" ? sort[field] = 'desc' : sort[field] = "asc"
  fetchGroups();
}


const pagination = reactive({
  page: 1,
  size: 10,
  total: 1
})

const pagesNo = computed(() => {
  return Math.ceil(pagination.total / pagination.size)
})

watch(() => pagination.page, (oldPage, newPage) => {
  console.log(oldPage, newPage);
  fetchGroups();
})

const groups = ref(0);

function fetchGroups() {
  isLoading.value = true;

  let params = {
    search: search.value,
    page: pagination.page,
    size: pagination.size,
    field: sort.active,
    order: sort[sort.active],
  };
  getUsersGroupsRequest(params).then(function (response) {
    groups.value = response.data.items
    pagination.total = response.data.total
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

onBeforeMount(() => {
  fetchGroups();
});


</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>

