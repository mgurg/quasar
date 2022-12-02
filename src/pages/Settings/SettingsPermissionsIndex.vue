<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings" />
          <q-breadcrumbs-el :label="$t('Permissions')" icon="info" to="/settings/permissions"  />
        </q-breadcrumbs>
      </div>
      <div class="row justify-around q-mt-sm">
        <div class="col-6">
          <p class="text-h4" :class="$q.dark.isActive?'text-blue-grey-1':'text-blue-grey-10'">{{ $t("Permissions") }}</p></div>
        <div class="col-6">
          <!-- v-if="hasPermission('USERS_ADD')"  -->
          <q-btn padding="sm" class="float-right" outline  size="md" icon="add" to="/settings/permissions/add" color="primary" no-caps>
          {{ $t("New permission") }}
          </q-btn></div>
      </div>

      <q-card class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section>
      <q-list padding v-if="!isLoading">
      <q-item class="rounded-borders" :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-11'">
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
        <div v-for="(permission, index) in permissions" v-bind:key="index">
        <permission-item @selectedItem="selectPermission" @refreshList="fetchPermissions" :permission="permission" :selected="selected" v-if="!isLoading"></permission-item>
        </div>

      </q-list>
      <div class="q-pa-xs flex flex-center">
        <q-pagination v-model="pagination.page" :max='pagesNo' direction-links @click="goToPage(pagination.page)" />
      </div>

      </q-card-section>
    </q-card>


    </q-page>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch,onBeforeMount } from "vue";
import { authApi } from "boot/axios";
import { useQuasar } from 'quasar'
import PermissionItem from 'components/listRow/PermissionListRow.vue'

const $q = useQuasar()
let isLoading = ref(false);
let selected = ref(null);
let search = ref(null);

let sort = reactive({
  name: "asc",
  active: "name"
})

function selectPermission(uuid) {
  if (selected.value == null) {
    selected.value = uuid;
  } else if (selected.value !== uuid) {
    selected.value = uuid;
  } else {
    selected.value = null;
  }
}

function changeSortOrder(column){
  sort[column] == "asc" ?  sort[column] = 'desc' : sort[column] = "asc"
  sort.active = column
  fetchPermissions()
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
  fetchPermissions();
})

const permissions = ref(null);

function fetchPermissions() {
  isLoading.value = true;
  let params = {
      search: search.value,
      page: pagination.page,
      size: pagination.size,
      sortOrder: sort[sort.active],
      sortColumn: sort.active
    };
    console.log(params)
  authApi
    .get("/permissions/", { params: params })
    .then((res) => {
      permissions.value = res.data.items
      pagination.total = res.data.total
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


onBeforeMount(() => {

  fetchPermissions();
});






</script>

<style lang="scss"  scoped>
a {
  text-decoration: none;
}
</style>

