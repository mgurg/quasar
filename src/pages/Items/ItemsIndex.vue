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
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('Search') : ''"
                    class="float-right"
                    color="primary"
                    icon="search"
                    no-caps
                    outline
                    @click="showSearchBar = !showSearchBar"
                  />
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('New item') : ''"
                    class="float-right q-mr-xs"
                    color="primary" icon="add"
                    no-caps outline
                    to="/items/add"
                  />
                </div>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <q-slide-transition>
      <q-card class="no-border no-shadow bg-transparent" v-show="showSearchBar===true">
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
<!--              <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''"/>-->
            </template>
          </q-input>
        </q-card-section>
      </q-card>
      </q-slide-transition>

      <q-card  v-if="pagination.total > 0" bordered class="my-card no-shadow q-mt-sm q-pt-none">

<!--        <q-card-section class="row q-pa-sm">-->
<!--          <div class="row q-gutter-sm items-center">-->
<!--            <div>-->
<!--              <q-input-->
<!--                v-model="search"-->
<!--                :label="$t('Type your search text')"-->
<!--                clearable-->
<!--                debounce="300"-->
<!--                dense-->
<!--                outlined-->
<!--                type="search"-->
<!--                @update:model-value="fetchItems()"-->
<!--              >-->
<!--                <template v-if="!search" v-slot:append>-->
<!--                  <q-icon name="search"/>-->
<!--                </template>-->
<!--              </q-input>-->
<!--            </div>-->
<!--            &lt;!&ndash; <div>-->
<!--              <q-btn outline class="float-right" color="primary" icon="search">{{ $t("Search") }}</q-btn>-->
<!--            </div> &ndash;&gt;-->
<!--          </div>-->
<!--        </q-card-section>-->
        <!-- <q-separator /> -->
        <q-list v-if="!isLoading && items != null" class="q-mt-none q-pt-none" padding>
          <q-item :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'">
            <q-item-section avatar>

            </q-item-section>
            <q-item-section>
      <span>{{ $t("Name") }}
        <q-btn :flat="sort.active!=='name'" :icon="sort.name === 'asc' ? 'arrow_upward' : 'arrow_downward'"
               :unelevated="sort.active === 'name'" color="primary" padding="xs"
               size="sm" @click="changeSortOrder('name')"/>
      </span>

            </q-item-section>
            <q-item-section side>

            </q-item-section>
          </q-item>

          <div v-for="(item, index) in items" v-if="items != null" v-bind:key="index">
            <item-list-row :item="item"/>
            <!-- <user-item @selectedItem="selectUser" @refreshList="fetchItems" :user="user" :selected="selected"
              v-if="!isLoading"></user-item> -->
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

import {getItemRequest} from 'src/components/api/ItemApiClient'
import {errorHandler} from 'src/components/api/errorHandler.js'

let sort = reactive({
  name: "asc",
  active: "name"
})

function changeSortOrder(column) {
  sort[column] === "asc" ? sort[column] = 'desc' : sort[column] = "asc"
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
  fetchItems();
})


let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
// let errorMsg = ref(null);

const items = ref(null);
let selected = ref(null);
let search = ref(null);
const showSearchBar = ref(false);

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
