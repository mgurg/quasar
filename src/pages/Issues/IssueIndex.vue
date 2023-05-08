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
                    :unelevated="showSearchBar"
                    :label="$q.screen.gt.xs ? $t('Search') : ''"
                    class="float-right"
                    color="primary"
                    icon="search"
                    no-caps
                    @click="showSearchBar = !showSearchBar"
                  />
                  <q-btn
                    v-if="hasPermission('ISSUE_ADD')"
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


                <!-- DATE INPUT -->
                <q-btn class="float-right q-ma-xs q-py-none" color="primary" outline>
                  <div class="row items-center no-wrap">
                    <q-icon color="grey-8" left name="event"/>
                    <div class="text-center">
                      {{ dateRangeDisplay }}
                    </div>
                  </div>

                  <q-menu anchor="center left" cover>
                    <month-picker @date-range="updateDateRange"/>
                  </q-menu>

                </q-btn>

                <!-- STATUS -->
                <q-btn :label="$t('Status')" class="float-right q-ma-xs" color="primary" icon="filter_list" no-caps
                       outline>
                  <q-menu>
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
                            <q-item-label
                              :class="hasStatus === 'in_progress' ? 'text-weight-bold' : 'text-weight-regular'"
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
                            <q-item-label :class="hasStatus == 'done' ? 'text-weight-bold' : 'text-weight-regular'"
                                          @click="setStatusFilter('done')">
                              {{ $t("Resolved") }}
                            </q-item-label>
                          </q-item-section>
                          <q-item-section avatar>
                            <q-icon color="grey" name="check_circle"/>
                          </q-item-section>
                        </q-item>

                        <q-item v-close-popup clickable>
                          <q-item-section>
                            <q-item-label :class="hasStatus === 'rejected' ? 'text-weight-bold' : 'text-weight-regular'"
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
                  </q-menu>
                </q-btn>
                <!-- TAG -->
                <q-btn class="q-ma-xs" color="primary" icon="label" label="Tag" no-caps outline>
                  <q-menu>
                    <div class="q-pa-md" style="max-width: 350px">
                      <q-list>
                        <q-item>
                          <q-item-section>
                            <q-item-label>Pokaż ukryte</q-item-label>
                          </q-item-section>
                          <q-item-section avatar>
                            <q-toggle v-model="withHiddenTags" @update:model-value="updateTagList"/>
                          </q-item-section>
                        </q-item>
                        <q-separator/>
                        <q-item>
                          <q-item-section>
                            <div v-for="(tag, index) in availableTags" v-if="availableTags != null" v-bind:key="index">
                              <q-checkbox v-model="selectedTags" :val="tag.uuid" @click="setTag">
                                <q-chip :style="{ 'background-color':tag.color }">{{ tag.name }}</q-chip>
                              </q-checkbox>
                            </div>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </q-menu>
                </q-btn>
                <q-btn class="q-ma-xs" color="primary" icon="cancel" no-caps outline @click="clearFilterSearch">
                  Reset
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
        </div>

      </q-slide-transition>
      <div class="q-pa-xs">
        <q-chip :icon="getIcon()" clickable @click="showSearchBar = !showSearchBar">{{ $t(getStatusName()) }}</q-chip>
        <q-chip clickable icon="date_range" @click="showSearchBar = !showSearchBar">{{ dateRangeDisplay }}</q-chip>
        <!-- {{ $t(getDateRangeName()) }} -->
        <q-chip v-if="selectedTags !== null && selectedTags.length > 0" clickable icon="label"
                @click="showSearchBar = !showSearchBar">Tag
        </q-chip>
      </div>

      <q-card v-if="pagination.total > 0 || search!==null || hasStatus!=='active'|| selectedTags.length>0" bordered
              class="my-card no-shadow q-mt-sm q-pt-none">
        <q-list v-if="!isLoading" class="q-mt-none q-pt-none" padding>
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

      <q-card bordered class="my-card no-shadow q-mt-sm q-pt-none"
              v-if="pagination.total === 0 && hasStatus==='active' && selectedTags.length===0">
        <div class="text-body1 text-center q-pa-lg">
          <p>Brak problemów 🎉</p>
          <p v-if="hasPermission('ISSUE_ADD')"> Chyba że coś własne przestało działać? 🧐 <br/>Zgłoś, klikając przycisk
            👇
          </p>
          <div class="col-12 text-h6 q-mt-none">
            <q-btn
              v-if="hasPermission('ISSUE_ADD')"
              :label="$t('New issue')" class="q-py-md q-my-md"
              color="primary"
              icon="add"
              no-caps
              to="/issues/add"
            />
          </div>
        </div>
      </q-card>

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
import {getTagsRequest} from "components/api/TagsApiClient";
import {useUserStore} from "stores/user";
import MonthPicker from "components/custom/MonthPicker.vue";

const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();
const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return Boolean(permissions.value.includes(permission));
}

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);

const availableTags = ref(null)
const selectedTags = ref(JSON.parse(localStorage.getItem("issue-adv-filter-tags")) || [])
const withHiddenTags = ref(localStorage.getItem("issue-adv-filter-tags-hidden") === 'true' || false);

let search = ref(null);

const showSearchBar = ref(false);
const withPhoto = ref(null)
const withUser = ref(null)


// DATE
const dateTimeFrom = ref(DateTime.now().minus({month: 1}).setZone('UTC').startOf('month'))
const dateTimeTo = ref(DateTime.now().setZone('UTC'))

const dateRangeDisplay = computed(() => {
  if (dateTimeFrom.value.toFormat("dd.MM.yyyy") === dateTimeTo.value.toFormat("dd.MM.yyyy")) {
    return dateTimeTo.value.toFormat("dd.MM.yyyy");
  }
  if (dateTimeFrom.value.toFormat("MM.yyyy") === dateTimeTo.value.toFormat("MM.yyyy")) {
    return dateTimeFrom.value.toFormat("dd") + " - " + dateTimeTo.value.toFormat("dd.MM.yyyy");
  }
  if (dateTimeFrom.value.toFormat("yyyy") === dateTimeTo.value.toFormat("yyyy")) {
    return dateTimeFrom.value.toFormat("dd.MM") + " - " + dateTimeTo.value.toFormat("dd.MM.yyyy");
  }
  return dateTimeFrom.value.toFormat("dd.MM.yyyy") + " - " + dateTimeTo.value.toFormat("dd.MM.yyyy");
});

function updateDateRange(date) {
  dateTimeFrom.value = date.from
  dateTimeTo.value = date.to
  fetchIssues()
}

function setTag() {
  localStorage.setItem('issue-adv-filter-tags', JSON.stringify(selectedTags.value));
  fetchIssues();
}

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
    case 'done':
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
    case 'done':
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
  // console.log(oldPage, newPage);
  fetchIssues();
})

let hasPhotos = ref(null);
let hasStatus = ref(localStorage.getItem('issue-adv-filter-status') ?? 'active');


// function setAttachmentFilter(condition) {
//   hasPhotos.value = condition;
//   fetchIssues()
// }

function setStatusFilter(condition) {

  localStorage.setItem('issue-adv-filter-status', condition);

  hasStatus.value = condition;
  router.replace({'query.filter': null})
  fetchIssues();
}

function clearFilterSearch() {
  localStorage.removeItem('issue-adv-filter-status')
  localStorage.removeItem('issue-adv-filter-tags')

  dateTimeFrom.value = DateTime.now().minus({month: 1})
  dateTimeTo.value = DateTime.now()

  hasStatus.value = 'active';
  selectedTags.value = [];
  search.value = null;
  router.replace({'query.filter': null})
  fetchIssues();
}

function goToPage(value) {
  // console.log(value)
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
    tag: selectedTags.value,
    field: sort.active,
    order: sort[sort.active]
  };

  params['dateFrom'] = dateTimeFrom.value.toISO();
  params['dateTo'] = dateTimeTo.value.toISO();

  getManyIssuesRequest(params).then(function (response) {
    issues.value = response.data.items;
    pagination.total = response.data.total
    isLoading.value = false;
    // console.log(response.data.items)
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function fetchTags() {
  isLoading.value = true;
  let params = {
    is_hidden: !withHiddenTags.value
  }
  getTagsRequest(params).then(function (response) {
    availableTags.value = response.data;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function updateTagList() {
  selectedTags.value = [];
  localStorage.removeItem('issue-adv-filter-tags')
  localStorage.setItem("issue-adv-filter-tags-hidden", withHiddenTags.value)
  fetchTags()
}

onBeforeMount(() => {
  isLoading.value = true;

  if (["new", "in_progress", "paused", "done"].includes(route.query.filter)) {
    hasStatus.value = route.query.filter;
    // showSearchBar.value = true;
  }

  fetchIssues();
  fetchTags();


});
</script>
