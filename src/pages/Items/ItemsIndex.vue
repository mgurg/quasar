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
        <q-breadcrumbs-el :label="$t('Items')" icon="apps" to="/items"/>
      </q-breadcrumbs>
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
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('Search') : ''"
                    class="float-right"
                    color="primary"
                    flat
                    icon="search"
                    no-caps
                    @click="showSearchBar = !showSearchBar"
                  />
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('New item') : ''"
                    class="float-right q-mr-xs"
                    color="primary" flat
                    icon="add" no-caps
                    to="/items/add"
                  />
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
              @update:model-value="fetchItems()"
            >
              <template v-slot:append>
                <q-icon v-if="!search" name="search"/>
              </template>
            </q-input>
          </q-card-section>
        </q-card>
      </q-slide-transition>

      <q-card v-if="pagination.total > 0" bordered class="my-card no-shadow q-mt-sm q-pt-none">
        <q-list v-if="!isLoading && items != null" class="q-mt-none q-pt-none" padding>
          <q-item :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'">
            <q-item-section avatar>
              <div class="q-pa-none">
                <q-btn-dropdown color="primary" dropdown-icon="sort" flat>
                  <q-list>
                    <q-item v-close-popup clickable @click="setSortingParams('name')">
                      <q-item-section>
                        <q-item-label>Nazwa</q-item-label>
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

          <div v-for="(item, index) in items" v-if="items != null" v-bind:key="index">
            <item-list-row :item="item"/>
          </div>

        </q-list>
        <div v-if="pagination.total > 10" class="q-pa-lg flex flex-center">
          <q-pagination v-model="pagination.page" :max='pagesNo' direction-links @click="goToPage(pagination.page)"/>
        </div>
      </q-card>

      <div v-if="pagination.total == 0" class="text-h5 text-center q-pa-lg">
        Brak przedmiotów 🤔? <br/>Dodaj pierwsze urządzenie!
        <div class="col-12 text-h6 q-mt-none">
          <q-btn :label="$t('New item')" class="q-py-md q-my-md" color="primary" icon="add" no-caps to="/items/add"/>
        </div>

      </div>


    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import ItemListRow from "components/listRow/ItemListRow.vue";

import {getManyItemsRequest} from 'src/components/api/ItemApiClient'
import {errorHandler} from 'src/components/api/errorHandler.js'

let sort = reactive({
  name: "asc",
  created_at: "asc",
  active: "name"
})

let sortName = ref("Name")

function setSortingParams(name) {
  switch (name) {
    case 'name':
      sort.active = "name"
      sortName.value = "Name"
      break;
    case 'created_at':
      sort.active = "created_at"
      sortName.value = "Age"
      break;
    default:
      console.log(`Sorry, we are out of ${name}.`);
  }
  fetchItems();
}

function getSortIcon() {
  let field = sort.active
  return sort[field] === 'asc' ? 'arrow_upward' : 'arrow_downward'
}

function changeSortOrder() {
  let field = sort.active
  sort[field] === "asc" ? sort[field] = 'desc' : sort[field] = "asc"
  fetchItems();
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
  fetchItems();
})


let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
// let errorMsg = ref(null);

const items = ref(null);
let search = ref(null);
const showSearchBar = ref(false);

function fetchItems() {
  isLoading.value = true;

  let params = {
    search: search.value,
    page: pagination.page,
    size: pagination.size,
    field: sort.active,
    order: sort[sort.active],
  };

  getManyItemsRequest(params).then(function (response) {
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
