<template>
  <q-card bordered class="my-card no-shadow q-mt-sm">
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedMyItems = !expandedMyItems">
          Moje urządzenia
          <!--              <q-badge floating align="top">{{ documentFiles.length }}</q-badge>-->
        </div>
        <q-space></q-space>
        <q-btn
          class="q-mr-lg"
          color="primary"
          flat
          label="Wszystkie"
          no-caps
          to="/issues/"
        />
        <q-btn
          :icon="expandedMyItems ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          color="grey"
          dense
          flat
          round
          @click="expandedMyItems = !expandedMyItems"
        />
      </div>
    </q-card-section>

    <q-separator v-if="expandedMyItems"/>
    <q-slide-transition>
      <div v-show="expandedMyItems">
        <q-card-section>
          <p v-if="userIssues === null || userIssues.length == 0" class="q-pt-xs text-body2">
            Nie masz jeszcze żadnych przypisanych urządzeń. Przejdź do
            <q-btn color="primary" dense flat icon="apps" no-caps to="/items">listy maszyn</q-btn>
            kliknij nazwę i dodaj do ulubionych klikając ikonę serca
            <q-icon color="accent" name="favorite_border" size="sm"/>
          </p>

          <q-list v-if="userIssues !== null && userIssues.length > 0">
            <q-item :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'" class="rounded-borders">
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
                           size="sm" @click="changeSortOrder()"/>
                    </span>
              </q-item-section>
            </q-item>

            <div v-for="(item, index) in userIssues" v-if="userIssues !== null" v-bind:key="index">
              <item-list-row :item="item" />
            </div>

          </q-list>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import {getManyIssuesRequest} from "components/api/IssueApiClient";
import {errorHandler} from "components/api/errorHandler";

import IssueListRow from "components/listRow/IssueListRow.vue";
import ItemListRow from "components/listRow/ItemListRow.vue";
import {getManyItemsRequest} from "components/api/ItemApiClient";

const props = defineProps({
  expandedMyItems: {
    type: Boolean,
    default: false,
  },
  userUuid: {
    type: String,
    default: false,
  },
})

const expandedMyItems = ref(props.expandedMyItems)
const userIssues = ref(null)
const userUuid = ref(props.userUuid)

const isLoading = ref(false)
const isError = ref(false)


let sort = reactive({status: "asc", title: "asc", created_at: "desc", name: "asc", active: "created_at"})
let sortName = ref("Age")

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
  getUserItems();
}

function changeSortOrder() {
  let field = sort.active

  sort[field] === "asc" ? sort[field] = 'desc' : sort[field] = "asc"
  getUserItems();
}

function getSortIcon() {
  let column = sortName.value.toLowerCase();
  switch (column) {
    case 'age':
      column = 'created_at'
      break;
  }

  return sort[column] === 'asc' ? 'arrow_upward' : 'arrow_downward'
}

const pagination = reactive({page: 1, size: 10, total: 1})

const pagesNo = computed(() => {
  // console.log(Math.ceil(pagination.total/pagination.size))
  return Math.ceil(pagination.total / pagination.size)
})

watch(() => pagination.page, (oldPage, newPage) => {
  console.log(oldPage, newPage);
  getUserItems();
})


function getUserItems() {
  isLoading.value = true;
  let params ={
    user_uuid: userUuid.value,
    page: pagination.page,
    size: pagination.size,
  }
  getManyItemsRequest(params).then(function (response) {
    userIssues.value = response.data.items
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

onBeforeMount(() => {
  getUserItems()
});

</script>
