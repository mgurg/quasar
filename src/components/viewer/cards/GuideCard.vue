<template>
  <!--        GUIDES -->
  <q-card bordered class="my-card no-shadow q-my-xs">
    <div :style="expandedGuide ? 'border-left: 5px solid #2bba82':''">
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedGuide = !expandedGuide">
            {{ $t("Guides") }}
            <q-badge floating align="top"  v-if="guides!= null" >{{ guides.length }}</q-badge>
          </div>
          <q-space></q-space>
          <q-btn
            v-if="itemUuid"
            :label="$t('Add')"
            class="q-mr-lg"
            color="primary"
            flat
            no-caps
            @click="addGuide(itemUuid)"
          />
          <q-btn :icon="expandedGuide ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat round
                 @click="expandedGuide = !expandedGuide"/>
        </div>

      </q-card-section>


      <q-slide-transition>
        <div v-show="expandedGuide">
          <q-card-section>
            <q-list>
              <q-item :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'" class="rounded-borders q-pa-qs">
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

              <div v-for="(guide, index) in guides" v-if="guides!= null" v-bind:key="index">
                <guide-item :guide="guide" :public-access="publicAccess"></guide-item>
              </div>


            </q-list>

          </q-card-section>
        </div>
      </q-slide-transition>
    </div>
  </q-card>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import GuideItem from "components/listRow/GuideListRow.vue";
import {useRouter} from "vue-router";
import {getGuideRequest} from "components/api/GuideApiClient";
import {errorHandler} from "components/api/errorHandler";

const router = useRouter();

const props = defineProps({
  guides: {
    type: Object,
    default() {
      return {
        uuid: null,
        name: null,
        text: null,
      }
    }
  },
  itemUuid: {
    type: String,
    default: null,
  },
  publicAccess: {
    type: Boolean,
    default: true,
  },
  anonymousToken: {
    type: String,
    default: null,
  },
  expandedGuide: {
    type: Boolean,
    default: false,
  },
})

const anonymousToken = ref(props.anonymousToken)


const expandedGuide = ref(props.expandedGuide)
const itemUuid = ref(props.itemUuid)
const guides = ref(null)
const publicAccess = ref(props.publicAccess)


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
  getItemGuides();
}

function changeSortOrder() {
  let field = sort.active

  sort[field] === "asc" ? sort[field] = 'desc' : sort[field] = "asc"
  getItemGuides();
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
  getItemGuides();
})


function getItemGuides(){
  isLoading.value = true;
  let params = {
    item_uuid: itemUuid.value,
    page: pagination.page,
    size: pagination.size,
    // sortOrder: sort[sort.active],
    // sortColumn: sort.active
  };

  getGuideRequest(params).then(function (response) {
    guides.value = response.data.items;
    pagination.total = response.data.total;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
  });
}

function getPublicItemGuides(){

  tenantId.value = atob(anonymousToken.value).split(".")[0]
  validTo.value = atob(anonymousToken.value).split(".")[1]


  isLoading.value = true;
  let params = {
    item_uuid: itemUuid.value,
    page: pagination.page,
    size: pagination.size,
    // sortOrder: sort[sort.active],
    // sortColumn: sort.active
  };

  getAnonymousItemGuidesRequest(params, token, tenant_id).then(function (response) {
    guides.value = response.data.items;
    pagination.total = response.data.total;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
  });
}

function addGuide(itemUuid) {
  router.push({path: '/guides/add/', query: {item: itemUuid}})
}

onBeforeMount(() => {
  if (publicAccess.value === false ){
    getItemGuides();
  } else{
    getPublicItemGuides();
  }

});

</script>
