<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings" />
          <q-breadcrumbs-el :label="$t('Groups')" icon="info" />
        </q-breadcrumbs>
      </div>
      <div class="row justify-around q-mt-sm">
        <div class="col-6"><p class="text-h4">{{ $t("Groups") }}</p></div>
        <div class="col-6">
          <!-- v-if="hasPermission('USERS_ADD')"  -->
          <q-btn padding="sm" class="float-right" outline  size="md" icon="add" to="/settings/groups/add" color="primary" no-caps>
          {{ $t("New Group") }}
          </q-btn></div>
      </div>

     
      <div class="text-h5 text-center q-pa-lg">  <!--  v-if="groups.length == 0"-->
        {{ $t("No groups, add a first one!") }} 🚀
      </div>


    </q-page>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch,onBeforeMount } from "vue";
import { authApi } from "boot/axios";
import { useQuasar } from 'quasar'

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
//   fetchGroups();
// })

const groups = ref(null);

function fetchGroups() {
  isLoading.value = true;
  console.log('fetching groups');
    // let params = {page: pagination.page, size: pagination.size };
  authApi
    .get("/groups/")
    .then((res) => {
      groups.value = res.data
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
  console.log('Groups')
  fetchGroups();
});






</script>

<style lang="scss"  scoped>
a {
  text-decoration: none;
}
</style>

