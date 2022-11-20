<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings" />
          <q-breadcrumbs-el :label="$t('Groups')" icon="info" to="/settings/groups"  />
        </q-breadcrumbs>
      </div>
      <div class="row justify-around q-mt-sm">
        <div class="col-6">
          <p class="text-h4" :class="$q.dark.isActive?'text-blue-grey-1':'text-blue-grey-10'">{{ $t("Groups") }}</p></div>
        <div class="col-6">
          <!-- v-if="hasPermission('USERS_ADD')"  -->
          <q-btn padding="sm" class="float-right" outline  size="md" icon="add" to="/settings/groups/add" color="primary" no-caps>
          {{ $t("New group") }}
          </q-btn></div>
      </div>

      <div style="background-color: white;" class="q-pa-md rounded-borders" v-if="groups.length > 0">
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
      <div v-for="(group, index) in groups" v-bind:key="index">
        <group-item @selectedItem="selectGroup" @refreshList="fetchGroups" :group="group" :selected="selected" v-if="!isLoading">
        </group-item>
        </div>
      </q-list>

      <div v-else class="q-pa-lg flex flex-center">
        <q-pagination v-model="pagination.page" :max='pagesNo' direction-links @click="goToPage(pagination.page)" />
      </div>

    </div>

    <div  v-if="groups.length == 0" class="text-h5 text-center q-pa-lg">  <!-- -->
        {{ $t("No groups, add a first one!") }} 🚀
      </div>

    </q-page>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch,onBeforeMount } from "vue";
import { authApi } from "boot/axios";
import { useQuasar } from 'quasar'
import GroupItem from 'components/GroupItem.vue'

const $q = useQuasar()

let isLoading = ref(false);
let selected = ref(null);
let search = ref(null);


let sort = reactive({
  name: "asc",
  active: "name"
})

function selectGroup(uuid) {
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
  fetchGroups()
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
      sortOrder: sort[sort.active],
      sortColumn: sort.active 
    };

    console.log(params)
  authApi
    .get("/groups/" , { params: params })
    .then((res) => {
      groups.value = res.data.items
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
  fetchGroups();
});






</script>

<style lang="scss"  scoped>
a {
  text-decoration: none;
}
</style>

