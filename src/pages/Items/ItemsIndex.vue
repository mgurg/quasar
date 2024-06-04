<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs active-color="grey" class="q-ma-sm text-grey">
        <template v-slot:separator>
          <q-icon color="grey" name="chevron_right" size="1.5em"/>
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
                <q-item-label v-if="itemListMode !== null" caption>Wskaż powiązany przedmiot</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn
                    :flat="!showSearchBar"
                    :label="$q.screen.gt.xs ? $t('Search') : ''"
                    :unelevated="showSearchBar"
                    class="float-right"
                    color="primary"
                    icon="search"
                    no-caps
                    @click="toggleSearchBar"
                  />
                  <q-btn
                    v-if="hasPermission('ITEM_ADD') && itemListMode === null"
                    :label="$q.screen.gt.xs ? $t('New item') : ''"
                    class="float-right q-mr-xs"
                    color="primary" flat
                    icon="add" no-caps
                    to="/items/add"
                  />
                  <q-btn
                    v-if="itemListMode === null"
                    :label="$q.screen.gt.xs ? $t('Reports') : ''"
                    class="float-right q-mr-xs"
                    color="primary" flat
                    icon="insights" no-caps
                    to="/items/summary"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-slide-transition>
        <q-card v-show="showSearchBar" class="no-border no-shadow bg-transparent">
          <q-card-section class="q-pa-sm">
            <q-input
              v-model="search"
              :label="$t('Type your search text')"
              clearable
              debounce="300"
              outlined
              type="search"
              @update:model-value="fetchItems"
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
                       size="sm" @click="changeSortOrder"/>
              </span>
            </q-item-section>
          </q-item>

          <div v-if="items">
            <div v-for="(item, index) in items" v-bind:key="index">
              <item-list-row :display-mode="itemListMode" :item="item"/>
            </div>
          </div>
        </q-list>
        <div v-if="pagination.total > 10" class="q-pa-lg flex flex-center">
          <q-pagination v-model="pagination.page" :max='pagesNo' direction-links @click="goToPage(pagination.page)"/>
        </div>
      </q-card>

      <q-card v-if="pagination.total === 0" bordered class="my-card no-shadow q-mt-sm q-pt-none">
        <div class="text-body1 text-center q-pa-lg">
          <p>Brak dodanych przedmiotów 🤔</p>
          <p v-if="hasPermission('ITEM_ADD')">Dodaj pierwsze urządzenie, klikając przycisk! 👇</p>
          <div class="col-12 text-h6 q-mt-none">
            <q-btn
              v-if="hasPermission('ITEM_ADD')"
              :label="$t('New item')"
              class="q-py-md q-my-md"
              color="primary"
              icon="add"
              no-caps
              to="/items/add"
            />
          </div>
        </div>
      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import ItemListRow from "components/listRow/ItemListRow.vue";
import {useUserStore} from "stores/user";
import {useRoute} from "vue-router";
import {useQuasar} from "quasar";
import {useI18n} from "vue-i18n";
import {useAuthAPI} from "src/composables/useAuthAPI.js";

const $q = useQuasar();
const {t} = useI18n();
const route = useRoute();
const UserStore = useUserStore();
const authAPI = useAuthAPI();
const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return permissions.value === null ? false : permissions.value.includes(permission);
}

const sort = reactive({
  name: "asc",
  created_at: "asc",
  active: "name"
});

const sortName = ref("Name");

function setSortingParams(name) {
  sort.active = name;
  sortName.value = name === 'name' ? 'Name' : 'Age';
  fetchItems();
}

function getSortIcon() {
  return sort[sort.active] === 'asc' ? 'arrow_upward' : 'arrow_downward';
}

function changeSortOrder() {
  sort[sort.active] = sort[sort.active] === "asc" ? "desc" : "asc";
  fetchItems();
}

const pagination = reactive({
  page: 1,
  size: 10,
  total: 1
});

const pagesNo = computed(() => Math.ceil(pagination.total / pagination.size));

watch(() => pagination.page, fetchItems);

let isLoading = ref(false);
const items = ref(null);
let search = ref(null);
const showSearchBar = ref(false);
const itemListMode = ref(null);

async function fetchItems() {
  isLoading.value = true;

  const params = {
    search: search.value,
    page: pagination.page,
    size: pagination.size,
    field: sort.active,
    order: sort[sort.active]
  };

  const {data, error} = await authAPI.get("/items/", {params});
  if (error) {
    console.log(error);
    return;
  }

  items.value = data.items;
  pagination.total = data.total;
  isLoading.value = false;
}

onBeforeMount(fetchItems);

</script>
