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
                    :label="$q.screen.gt.xs ? $t('Search') : ''"
                    class="float-right"
                    color="primary"
                    flat
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
        </q-card-section>
      </q-card>

      <q-slide-transition>
        <q-card v-show="showSearchBar===true" class="no-border no-shadow bg-transparent">
          <div class="row sm-gutter">
            <div class="q-pa-xs col-xs-12 col-sm-6">
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
            </div>
            <div class="q-pa-xs col-xs-12 col-sm-6">
              <q-btn-dropdown :label="$t('Status')" class="float-right" color="primary" icon="filter_list" outline>
                <div class="q-pa-xs" style="max-width: 350px">
                  <q-list>
                    <q-item v-close-popup clickable>
                      <q-item-section>
                        <q-item-label
                          :class="hasStatus === 'rejected' ? 'text-weight-bold' : 'text-weight-regular'"
                          @click="setStatusFilter('rejected')">
                          {{ $t("Rejected") }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-close-popup clickable>
                      <q-item-section>
                        <q-item-label
                          :class="hasStatus === 'accepted' ? 'text-weight-bold' : 'text-weight-regular'"
                          @click="setStatusFilter('accepted')">
                          {{
                            $t("Accepted")
                          }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-close-popup clickable>
                      <q-item-section>
                        <q-item-label :class="hasStatus === 'todo' ? 'text-weight-bold' : 'text-weight-regular'"
                                      @click="setStatusFilter('todo')">
                          Todo
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item v-close-popup clickable>
                      <q-item-section>
                        <q-item-label :class="hasStatus == null ? 'text-weight-bold' : 'text-weight-regular'"
                                      @click="setStatusFilter(null)">
                          {{ $t("All") }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>

                </div>
              </q-btn-dropdown>
              <div class="q-gutter-sm">
                <q-toggle
                  v-model="withPhoto"
                  checked-icon="check"
                  label="Załączniki"
                  toggle-indeterminate
                  unchecked-icon="clear"
                />
                <q-toggle
                  v-model="withUser"
                  checked-icon="check"
                  label="Przypisany"
                  toggle-indeterminate
                  unchecked-icon="clear"
                />
              </div>


            </div>
          </div>
        </q-card>
      </q-slide-transition>

      <q-card v-if="pagination.total > 0 || search!==null" bordered class="my-card no-shadow q-mt-sm q-pt-none">
        <q-list v-if="!isLoading" class="q-mt-none q-pt-none" padding>

          <q-item :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'">
            <q-item-section avatar>
            <span>&nbsp;
              <q-btn :flat="sort.active!=='counter'" :icon="sort.counter === 'asc' ? 'arrow_upward' : 'arrow_downward'"
                     :unelevated="sort.active === 'counter'" color="primary" padding="xs"
                     size="sm"
                     @click="changeSortOrder('counter')"/>
            </span>
            </q-item-section>
            <q-item-section>
            <span>{{ $t("Name") }}
              <q-btn :flat="sort.active!=='title'" :icon="sort.title === 'asc' ? 'arrow_upward' : 'arrow_downward'"
                     :unelevated="sort.active === 'title'" color="primary" padding="xs"
                     size="sm" @click="changeSortOrder('title')"/>
            </span>
            </q-item-section>
            <q-item-section side>
            <span>{{ $t("Age") }}
              <q-btn :flat="sort.active!=='age'" :icon="sort.age === 'asc' ? 'arrow_upward' : 'arrow_downward'"
                     :unelevated="sort.active === 'age'"
                     color="primary" padding="xs" size="sm"
                     @click="changeSortOrder('age')"/>
            </span>
            </q-item-section>
          </q-item>

          <div v-for="(issue, index) in issues" v-if="issues != null" v-bind:key="index">
            <issue-item v-if="!isLoading" :issue="issue" @forceRefresh="fetchIssues"></issue-item>
          </div>
          <task-index-skeleton v-else/>

        </q-list>
        <!-- Skeleton -->


        <div v-if="pagination.total > 10" class="q-pa-lg flex flex-center">
          <q-pagination v-model="pagination.page" :max='pagesNo' direction-links @click="goToPage(pagination.page)"/>
        </div>


        <q-space class="q-pa-sm"/>
      </q-card>
      <div v-if="pagination.total === 0" class="text-h5 text-center q-pa-lg">
        Brak pomysłów 🤔? <br/>Niech Twój będzie pierwszy!
        <div class="col-12 text-h6 q-mt-none">
          <q-btn :label="$t('New issue')" class="q-py-md q-my-md" color="primary" icon="add" no-caps to="/issues/add"/>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";


import TaskIndexSkeleton from "components/skeletons/tasks/TaskIndexSkeleton.vue";
import IssueItem from "components/listRow/IssueListRow.vue";
import {getManyIssuesRequest} from "components/api/IssueApiClient";
import {errorHandler} from "components/api/errorHandler";

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let search = ref(null);
const showSearchBar = ref(false);
const withPhoto = ref(null)
const withUser = ref(null)

const issues = ref([]);
let selected = ref(null);

let sort = reactive({counter: "asc", title: "asc", name: "asc", active: "name"})

function changeSortOrder(column) {
  sort[column] === "asc" ? sort[column] = 'desc' : sort[column] = "asc"
  sort.active = column
  fetchIssues()
}

let hasPhotos = ref(null);
let hasStatus = ref(null);

const pagination = reactive({page: 1, size: 10, total: 1})

function setAttachmentFilter(condition) {
  hasPhotos.value = condition;
  fetchIssues()
}

function setStatusFilter(condition) {
  hasStatus.value = condition;
  fetchIssues()
}

function goToPage(value) {
  console.log(value)
}

const pagesNo = computed(() => {
  // console.log(Math.ceil(pagination.total/pagination.size))
  return Math.ceil(pagination.total / pagination.size)
})

watch(() => pagination.page, (oldPage, newPage) => {
  console.log(oldPage, newPage);
  fetchIssues();
})


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
    sortOrder: sort[sort.active],
    sortColumn: sort.active
  };

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
  fetchIssues();
});
</script>
