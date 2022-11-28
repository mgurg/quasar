<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-medium">{{ $t("Items") }}</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn outline class="float-right" icon="add" to="/items/add" color="primary" no-caps  :label="$q.screen.gt.xs ? $t('New item') : ''"
                     />
                  </div>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>


      <q-card class="my-card no-shadow q-mt-sm q-pt-none">

<q-card-section class="row q-pa-sm">
  <div class="row q-gutter-sm items-center">
    <div>
      <q-input dense clearable outlined v-model="search" :label="$t('Type your search text')" type="search"
        @keyup="fetchItems()" @clear="fetchItems()">
        <template v-if="!search" v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <!-- <div>
      <q-btn outline class="float-right" color="primary" icon="search">{{ $t("Search") }}</q-btn>
    </div> -->
  </div>
</q-card-section>
<!-- <q-separator /> -->
<q-list padding v-if="!isLoading && items != null" class="q-mt-none q-pt-none">
  <q-item :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'">
    <q-item-section avatar>

    </q-item-section>
    <q-item-section>
      <span>{{ $t("Name") }}
        <q-btn padding="xs" :unelevated="sort.active == 'name' ? true : false"
          :flat="sort.active == 'name' ? false : true" size="sm" color="primary"
          :icon="sort.name == 'asc' ? 'arrow_upward' : 'arrow_downward'" @click="changeSortOrder('name')" />
      </span>

    </q-item-section>
    <q-item-section side>

    </q-item-section>
  </q-item>

  <div v-for="(item, index) in items" v-bind:key="index" v-if="items != null">
    <item-item @refreshList="fetchItems" :item="item" />
    <!-- <user-item @selectedItem="selectUser" @refreshList="fetchItems" :user="user" :selected="selected"
      v-if="!isLoading"></user-item> -->
  </div>



</q-list>



<div class="q-pa-lg flex flex-center">
  <q-pagination v-model="pagination.page" :max='pagesNo' direction-links @click="goToPage(pagination.page)" />
</div>

<!-- <q-space class="q-pa-sm" /> -->
</q-card>

    </q-page>
  </div>
</template>

<script setup>
import { onActivated, ref, computed, watch, onBeforeMount, onMounted, reactive } from "vue";
import { authApi } from "boot/axios";
import ItemItem from "components/ItemItem.vue";

import { getItemRequest, editItemRequest, addItemRequest, deleteItemRequest } from 'src/components/api/ItemApiClient'
import { errorHandler } from 'src/components/api/errorHandler.js'

let sort = reactive({
  name: "asc",
  active: "name"
})

function changeSortOrder(column) {
  sort[column] == "asc" ? sort[column] = 'desc' : sort[column] = "asc"
  sort.active = column
  fetchItems()
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


let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);

const items = ref(null);
let selected = ref(null);
let search = ref(null);

function fetchItems() {
  isLoading.value = true;

  let params = {
    search: search.value,
    page: pagination.page,
    size: pagination.size,
    sortOrder: sort[sort.active],
    sortColumn: sort.active
  };

  getItemRequest(params).then(function (response) {
    items.value = response.data.items
    pagination.total = response.data.total
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
  });
}

onBeforeMount(() => {
  isLoading.value = true;
  fetchItems()
});


</script>
