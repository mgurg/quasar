<template>
  <q-card bordered class="my-card no-shadow q-mt-sm">
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <div class="text-h6 text-weight-regular cursor-pointer" @click="toggleExpand">
          Moje urządzenia
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
          :icon="expandIcon"
          color="grey"
          dense
          flat
          round
          @click="toggleExpand"
        />
      </div>
    </q-card-section>

    <q-separator v-if="expandedMyItems"/>
    <q-slide-transition>
      <div v-show="expandedMyItems">
        <q-card-section>
          <template v-if="isEmptyUserIssues">
            <p class="q-pt-xs text-body2">
              Nie masz jeszcze żadnych przypisanych urządzeń. Przejdź do
              <q-btn color="primary" dense flat icon="apps" no-caps to="/items">listy maszyn</q-btn>
              kliknij nazwę i dodaj do ulubionych klikając ikonę serca
              <q-icon color="accent" name="favorite_border" size="sm"/>
            </p>
          </template>

          <q-list v-else>
            <q-item :class="itemClass" class="rounded-borders q-pa-xs">
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
                <span>
                  {{ $t(sortName) }}
                  <q-btn :icon="sortIcon" color="primary" flat padding="xs" size="sm" @click="changeSortOrder"/>
                </span>
              </q-item-section>
              <q-item-section side>
                <div class="text-grey-8 q-gutter-xs">
                  <!--                  TODO: paginated navigation-->
                  <q-btn flat dense icon="navigate_before"/>
                  <q-btn flat dense icon="navigate_next"/>
                </div>
              </q-item-section>
            </q-item>
            <div v-if="userIssues">
              <div v-for="(item, index) in userIssues" :key="index">
                <item-list-row :item="item"/>
              </div>
            </div>

          </q-list>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import ItemListRow from "components/listRow/ItemListRow.vue";
import {useQuasar} from "quasar";
import {useAuthAPI} from "src/composables/useAuthAPI.js";

const props = defineProps({
  expandedMyItems: {
    type: Boolean,
    default: false,
  },
  userUuid: {
    type: String,
    default: null,
  },
});

const $q = useQuasar()
const authAPI = useAuthAPI();

const expandedMyItems = ref(props.expandedMyItems);
const userIssues = ref(null);

const isLoading = ref(false);

const sort = reactive({
  status: "asc",
  title: "asc",
  created_at: "desc",
  name: "asc",
  active: "created_at"
});
const sortName = ref("Name");

const pagination = reactive({page: 1, size: 10, total: 1});

const pagesNo = computed(() => Math.ceil(pagination.total / pagination.size));

const isEmptyUserIssues = computed(() => userIssues.value === null || userIssues.value.length === 0);
const itemClass = computed(() => $q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11');
const expandIcon = computed(() => expandedMyItems.value ? 'keyboard_arrow_up' : 'keyboard_arrow_down');
const sortIcon = computed(() => sort[sortName.value.toLowerCase()] === 'asc' ? 'arrow_upward' : 'arrow_downward');

function toggleExpand() {
  expandedMyItems.value = !expandedMyItems.value;
}

function setSortingParams(name) {
  sort.active = name;
  sortName.value = name === 'name' ? 'Name' : 'Age';
  getUserItems();
}

function changeSortOrder() {
  const field = sort.active;
  sort[field] = sort[field] === "asc" ? "desc" : "asc";
  getUserItems();
}

async function getUserItems() {
  isLoading.value = true;
  const params = {
    user_uuid: props.userUuid,
    page: pagination.page,
    size: pagination.size,
    field: sort.active,
    order: sort[sort.active]
  };

  // TODO: fix on backend trailing slash / at end
  const {data, error} = await authAPI.get("/items/", {params});
  if (error) {
    console.log(error);
    return;
  }
  userIssues.value = data.items;
  isLoading.value = false;
}

watch(() => pagination.page, () => getUserItems());

onBeforeMount(() => {
  getUserItems();
});
</script>
