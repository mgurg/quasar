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
        <q-breadcrumbs-el :label="$t('Issues')" icon="bug_report" to="/issues"/>
      </q-breadcrumbs>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-medium">{{ $t("Issues") }}</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn
                    v-if="issues.length !== 0"
                    :flat="!showSearchBar"
                    :label="$q.screen.gt.xs ? $t('Search') : ''"
                    :unelevated="showSearchBar"
                    class="float-right"
                    color="primary"
                    icon="search"
                    no-caps
                    @click="showSearchBar = !showSearchBar"
                  />
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('New issue') : ''"
                    class="float-right"
                    color="primary"
                    flat
                    icon="add"
                    no-caps
                    to="/issues/add"
                  />
                </div>
              </q-item-section>
            </q-item>

          </q-list>
          <span class="grey text-grey full-width q-pt-sm">
                  <q-icon name="auto_awesome" size="xs"/>&nbsp;nowy
                  <q-icon name="playlist_add_check_circle" size="xs"/>&nbsp;zaakceptowany
            <!--                  <q-icon name="delete_forever" size="xs"/> odrzucony-->
                  <q-icon name="build_circle" size="xs"/>&nbsp;w trakcie
                  <q-icon name="pause_circle" size="xs"/>&nbsp;pauza
            <!--                  <q-icon name="check_circle" size="xs"/> zakończony-->
                  <q-icon color="primary" name="stop" size="xs"/>
                  <q-icon color="orange" name="stop" size="xs"/>
            <q-icon color="red" name="stop" size="xs"/>&nbsp;priorytet
                </span>
        </q-card-section>
      </q-card>

      <q-slide-transition>
        <div v-show="showSearchBar===true">
          <q-card class="no-border no-shadow bg-transparent">
            <q-card-section>
              <q-input
                v-model="search"
                :label="$t('Type your search text')"
                clearable
                debounce="300"
                outlined
                type="search"
                @update:model-value="fetchIssues()">
                <template v-if="!search" v-slot:append>
                  <q-icon name="search"/>
                </template>

              </q-input>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="row sm-gutter">
                <!-- STATUS -->
                <q-btn-dropdown :label="$t('Status')" class="float-right" color="primary" icon="filter_list" no-caps outline>
                  <div class="q-pa-xs" style="max-width: 350px">
                    <q-list>
                      <q-item v-close-popup clickable>
                        <q-item-section>
                          <q-item-label
                            :class="hasStatus === 'active' ? 'text-weight-bold' : 'text-weight-regular'"
                            @click="setStatusFilter('active')">
                            {{ $t("Active") }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-close-popup clickable>
                        <q-item-section>
                          <q-item-label
                            :class="hasStatus === 'inactive' ? 'text-weight-bold' : 'text-weight-regular'"
                            @click="setStatusFilter('inactive')">
                            {{ $t("Inactive") }}
                          </q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-separator/>

                      <q-item v-close-popup clickable>
                        <q-item-section>
                          <q-item-label
                            :class="hasStatus === 'new' ? 'text-weight-bold' : 'text-weight-regular'"
                            @click="setStatusFilter('new')">
                            {{ $t("New") }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-icon color="grey" name="auto_awesome"/>
                        </q-item-section>
                      </q-item>

                      <q-item v-close-popup clickable>
                        <q-item-section>
                          <q-item-label
                            :class="hasStatus === 'accepted' ? 'text-weight-bold' : 'text-weight-regular'"
                            @click="setStatusFilter('accepted')">
                            {{ $t("Accepted") }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-icon color="grey" name="playlist_add_check_circle"/>
                        </q-item-section>
                      </q-item>

                      <q-item v-close-popup clickable>
                        <q-item-section>
                          <q-item-label :class="hasStatus === 'in_progress' ? 'text-weight-bold' : 'text-weight-regular'"
                                        @click="setStatusFilter('in_progress')">
                            {{ $t("In progress") }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-icon color="grey" name="build_circle"/>
                        </q-item-section>
                      </q-item>
                      <q-item v-close-popup clickable>
                        <q-item-section>
                          <q-item-label :class="hasStatus == 'paused' ? 'text-weight-bold' : 'text-weight-regular'"
                                        @click="setStatusFilter('paused')">
                            {{ $t("Paused") }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-icon color="grey" name="pause_circle"/>
                        </q-item-section>
                      </q-item>

                      <q-item v-close-popup clickable>
                        <q-item-section>
                          <q-item-label :class="hasStatus == 'resolved' ? 'text-weight-bold' : 'text-weight-regular'"
                                        @click="setStatusFilter('resolved')">
                            {{ $t("Resolved") }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-icon color="grey" name="check_circle"/>
                        </q-item-section>
                      </q-item>

                      <q-item v-close-popup clickable>
                        <q-item-section>
                          <q-item-label :class="hasStatus == 'rejected' ? 'text-weight-bold' : 'text-weight-regular'"
                                        @click="setStatusFilter('rejected')">
                            {{ $t("Rejected") }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section avatar>
                          <q-icon color="grey" name="delete_forever"/>
                        </q-item-section>
                      </q-item>
                    </q-list>

                  </div>
                </q-btn-dropdown>
                <!-- DATE -->
                <q-btn class="q-ma-xs" color="primary" icon="event" label="Data" outline>
                  <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                    <q-date v-model="proxyDate" range today-btn>
                      <div class="row items-center justify-end q-gutter-sm">
                        <q-btn v-close-popup color="primary" dense flat no-caps @click="setDateRange('Today', 0,0)">Dziś</q-btn>
                        <q-btn v-close-popup color="primary" dense flat no-caps @click="setDateRange('Yesterday',1,1)">Wczoraj</q-btn>
                        <q-btn v-close-popup color="primary" dense flat no-caps @click="setDateRange('Week',7,0)">Tydzień</q-btn>
                        <q-btn v-close-popup color="primary" dense flat no-caps @click="setDateRange('All',null, null)">Wszystko</q-btn>
                        <q-separator/>
                        <!--                                                <q-btn label="Cancel" color="primary" flat v-close-popup />-->
                        <q-btn v-close-popup color="primary" flat label="OK" @click="saveDate"/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-btn>
                <!-- PRIORITY -->
                <q-btn class="q-ma-xs" color="primary" icon="cancel" outline @click="clearFilterSearch">Wyczyść</q-btn>

<!--                {{ proxyDate }}-->
              </div>


            </q-card-section>
          </q-card>
        </div>

      </q-slide-transition>

      <div class="q-pa-xs">
        <q-chip :icon="getIcon()" clickable @click="showSearchBar = !showSearchBar">{{ $t(getStatusName()) }}</q-chip>
        <q-chip clickable icon="date_range" @click="showSearchBar = !showSearchBar">{{ $t(getDateRangeName()) }}</q-chip>
      </div>

      <q-card v-if="pagination.total > 0 || search!==null || hasStatus!=='active'" bordered class="my-card no-shadow q-mt-sm q-pt-none">
        <q-list v-if="!isLoading" class="q-mt-none q-pt-none" padding>
          <q-item :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'">
            <q-item-section avatar>
              <div class="q-pa-none">
                <q-btn-dropdown color="primary" dropdown-icon="sort" flat>
                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Sortuj wyniki po:</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-close-popup clickable @click="setSortingParams('status')">
                      <q-item-section>
                        <q-item-label>Status</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-close-popup clickable @click="setSortingParams('name')">
                      <q-item-section>
                        <q-item-label>Nazwa</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-close-popup clickable @click="setSortingParams('priority')">
                      <q-item-section>
                        <q-item-label>Priorytet</q-item-label>
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

          <div v-for="(issue, index) in issues" v-if="issues != null" v-bind:key="index">
            <issue-list-row v-if="!isLoading" :issue="issue" @forceRefresh="fetchIssues"></issue-list-row>
          </div>
          <task-index-skeleton v-else/>

        </q-list>
        <div v-if="pagination.total > 10" class="q-pa-lg flex flex-center">
          <q-pagination v-model="pagination.page" :max='pagesNo' direction-links @click="goToPage(pagination.page)"/>
        </div>


        <q-space class="q-pa-sm"/>
      </q-card>
      <div v-if="pagination.total === 0 && hasStatus==='active'" class="text-h5 text-center q-pa-lg">
        Brak problemów 🥳 ! <br/><br/> Chyba że coś własne przestało działać? 🧐 <br/>Zgłoś, klikając przycisk 👇
        <div class="col-12 text-h6 q-mt-none">
          <q-btn :label="$t('New issue')" class="q-py-md q-my-md" color="primary" icon="add" no-caps to="/issues/add"/>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";


import TaskIndexSkeleton from "components/skeletons/tasks/TaskIndexSkeleton.vue";
import IssueListRow from "components/listRow/IssueListRow.vue";
import {getManyIssuesRequest} from "components/api/IssueApiClient";
import {errorHandler} from "components/api/errorHandler";
import {DateTime} from "luxon";

const route = useRoute();
const router = useRouter();

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let search = ref(null);

const showSearchBar = ref(false);
const withPhoto = ref(null)
const withUser = ref(null)

const date = ref(DateTime.now().setZone('Europe/Warsaw').toFormat("yyyy/LL/dd"))

const hasDateFrom = ref(DateTime.now().setZone('Europe/Warsaw').minus({days: 31}).toFormat("yyyy/LL/dd"));
const hasDateTo = ref(DateTime.now().setZone('Europe/Warsaw').toFormat("yyyy/LL/dd"));
const proxyDate = ref({"from": hasDateFrom.value, "to": hasDateTo.value})
const dateRangeName = ref("Month");
function getDateRangeName(){
  return dateRangeName.value
}

function setDateRange(name ,daysFrom = null, daysTo = null) {
  dateRangeName.value = name;
  if (daysFrom == null && daysTo == null) {
    hasDateFrom.value = null;
    hasDateTo.value = null;
    fetchIssues();
    return;
  }

  const toDate = DateTime.now().setZone('Europe/Warsaw').minus({days: daysTo}).toFormat("yyyy/LL/dd");
  const fromDate = DateTime.now().setZone('Europe/Warsaw').minus({days: daysFrom}).toFormat("yyyy/LL/dd");
  hasDateFrom.value = fromDate
  hasDateTo.value = toDate
  proxyDate.value = {"from": fromDate, "to": toDate}

  console.log({"from": fromDate, "to": toDate});
}

function saveDate() {
  console.log(proxyDate.value);
}

watch(() => proxyDate.value, (newValue, oldValue) => {

  if (typeof newValue === 'object') {
    console.log("isRange")
    // dateRangeName.value = "Custom";
    console.log(proxyDate.value);
    fetchIssues();
  } else {
    // dateRangeName.value = "Custom";
    console.log("isSingleDate")
    fetchIssues();
  }

});


// function updateProxy() {
//   proxyDate.value = date.value
// }

const issues = ref([]);
let selected = ref(null);

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
    case 'status':
      sort.active = "status"
      sortName.value = "Status"
      break;
    case 'priority':
      sort.active = "priority"
      sortName.value = "Priority"
      break;

    default:
      console.log(`Sorry, we are out of ${name}.`);
  }
  fetchIssues();
}

function changeSortOrder() {
  let field = sort.active

  sort[field] === "asc" ? sort[field] = 'desc' : sort[field] = "asc"
  fetchIssues();
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

function getStatusName() {

  switch (hasStatus.value) {
    case 'active':
      return "Active"
      break;
    case 'inactive':
      return "Inactive"
      break;
    case 'new':
      return "New"
      break;
    case 'accepted':
      return "Accepted"
      break;
    case 'rejected':
      return "Rejected"
      break;
    case 'assigned':
      return "New"
      break;
    case 'in_progress':
      return "In progress"
      break;
    case 'paused':
      return "Paused"
      break;
    case 'resolved':
      return "Resolved"
      break;
    default:
      return "New"
  }


  // "New"
  //   "Active"
  //   "Inactive"
  //   "Accepted"
  //   "Rejected"
  //   "In progress"
  //   "Paused"
  //
  // return  "New"
}


function getIcon() {
  switch (hasStatus.value) {
    case 'new':
      return 'auto_awesome'
      break;
    case 'accepted':
      return 'playlist_add_check_circle'
      break;
    case 'rejected':
      return 'delete_forever'
      break;
    case 'in_progress':
      return 'build_circle'
      break;
    case 'paused':
      return 'pause_circle'
      break;
    case 'resolved':
      return 'check_circle'
      break;
    default:
      return 'offline_bolt'
  }
}

const pagination = reactive({page: 1, size: 10, total: 1})

const pagesNo = computed(() => {
  // console.log(Math.ceil(pagination.total/pagination.size))
  return Math.ceil(pagination.total / pagination.size)
})

watch(() => pagination.page, (oldPage, newPage) => {
  console.log(oldPage, newPage);
  fetchIssues();
})

let hasPhotos = ref(null);
let hasStatus = ref('active');


function setAttachmentFilter(condition) {
  hasPhotos.value = condition;
  fetchIssues()
}

function setStatusFilter(condition) {
  hasStatus.value = condition;
  router.replace({'query.filter': null})
  fetchIssues();
}

function clearFilterSearch() {
  hasStatus.value = 'active';
  search.value = null;
  router.replace({'query.filter': null})
  fetchIssues();
}

function goToPage(value) {
  console.log(value)
}


// const myTasks = computed(() => {
//   if (tasks.value != null && isLoading.value == false) {
//     return tasks.value.filter(task => (task.assignee != null && task.assignee.uuid == "767a600e-8549-4c27-a4dc-656ed3a9af7d"))
//   } else {
//     return null;
//   }
// });

// const otherTasks = computed(() => {
//   if (tasks.value != null  && isLoading.value == false) {
//     return tasks.value.filter(task => (task.assignee == null || task.assignee.uuid != "767a600e-8549-4c27-a4dc-656ed3a9af7d"))
//   } else {
//     return tasks.value;
//   }
// });

async function fetchIssues() {
  isLoading.value = true;
  let params = {
    search: search.value,
    hasImg: hasPhotos.value,
    status: hasStatus.value,
    page: pagination.page,
    size: pagination.size,
    field: sort.active,
    order: sort[sort.active]
  };

  if (hasDateFrom.value !== null) {
    params['dateFrom'] = DateTime.fromFormat(hasDateFrom.value, "yyyy/LL/dd").toFormat('yyyy-LL-dd 00:00:00');

  }
  if (hasDateTo.value !== null) {
    params['dateTo'] = DateTime.fromFormat(hasDateTo.value, "yyyy/LL/dd").toFormat('yyyy-LL-dd 23:59:00');
  }

  getManyIssuesRequest(params).then(function (response) {
    issues.value = response.data.items;
    pagination.total = response.data.total
    isLoading.value = false;
    console.log(response.data.items)
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


onBeforeMount(() => {
  isLoading.value = true;

  if (["new", "in_progress", "paused", "resolved"].includes(route.query.filter)) {
    hasStatus.value = route.query.filter;
    // showSearchBar.value = true;
  }


  fetchIssues();


});
</script>
