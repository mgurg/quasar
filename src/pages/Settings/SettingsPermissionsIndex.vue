<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings" />
          <q-breadcrumbs-el :label="$t('Permissions')" icon="info" to="/settings/permissions"  />
        </q-breadcrumbs>
      </div>
      <div class="row justify-around q-mt-sm">
        <div class="col-6"><p class="text-h4">{{ $t("Permissions") }}</p></div>
        <div class="col-6">
          <!-- v-if="hasPermission('USERS_ADD')"  -->
          <q-btn padding="sm" class="float-right" outline  size="md" icon="add" to="/users/add" color="primary" no-caps>
          {{ $t("New permission") }}
          </q-btn></div>
      </div>

      <q-list padding v-if="!isLoading">
      <q-item class="bg-blue-grey-1 rounded-borders">
        <q-item-section avatar>

        </q-item-section>
        <q-item-section>
          <span>{{ $t("Name") }} 
            <q-btn 
            padding="xs" 
            :unelevated="sort.active=='title'? true:false" 
            :flat="sort.active=='title'? false:true" 
            size="sm" 
            color="primary" 
            :icon="sort.title=='asc'? 'arrow_upward':'arrow_downward'" 
            @click="changeSortOrder('title')" />
          </span>
          
        </q-item-section>
        <q-item-section side>

        </q-item-section>
      </q-item>
        <div v-for="(permission, index) in permissions" v-bind:key="index">
        <permission-item @selectedItem="selectPermission" @refreshList="fetchPermissions" :permission="permission" :selected="selected" v-if="!isLoading"></permission-item>
        </div>

      </q-list>


    </q-page>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch,onBeforeMount } from "vue";
import { authApi } from "boot/axios";
import { useQuasar } from 'quasar'
import PermissionItem from 'components/PermissionItem.vue'

const $q = useQuasar()
let isLoading = ref(false);
let selected = ref(null);

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


// const pagination = reactive({
//   page: 1,
//   size: 10,
//   total: 1
// })

// const pagesNo = computed(() => {
//   return Math.ceil(pagination.total / pagination.size)
// })

// watch(() => pagination.page, (oldPage, newPage) => {
//   console.log(oldPage, newPage);
//   fetchPermissions();
// })

const permissions = ref(null);

function fetchPermissions() {
  isLoading.value = true;
  console.log('fetching permissions');
    // let params = {page: pagination.page, size: pagination.size };
  authApi
    .get("/permissions/")
    .then((res) => {
      permissions.value = res.data
      // pagination.total = res.data.total
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


onBeforeMount(() => {
  console.log('b')
  fetchPermissions();
});






</script>

<style lang="scss"  scoped>
a {
  text-decoration: none;
}
</style>

