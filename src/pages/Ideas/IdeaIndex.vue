<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-medium">{{ $t("Ideas") }}</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn :label="$q.screen.gt.xs ? $t('New idea') : ''" class="float-right" color="primary" icon="add"
                         no-caps outline
                         to="/ideas/add"
                  />
                </div>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <q-card v-if="pagination.total > 0 || search!==null" class="my-card no-shadow q-mt-sm q-pt-none">

        <q-card-section class="row q-pa-sm">
          <div class="row q-gutter-xs items-center">
            <div>
              <q-input
                v-model="search"
                :label="$t('Type your search text')"
                clearable
                dense
                outlined
                type="search"
                debounce="300"
                @update:model-value="fetchIdeas()">
                <template v-if="!search" v-slot:append>
                  <q-icon name="search"/>
                </template>

              </q-input>
            </div>
            <div>
              <q-btn-dropdown :label="$t('Filters')" class="float-right" color="primary" icon="filter_list" outline>
                <div class="q-pa-xs" style="max-width: 350px">
                  <q-list class="rounded-borders">
                    <q-expansion-item :label="$t('Attachments')" expand-separator icon="attach_file">
                      <q-card>
                        <q-list>
                          <q-item v-close-popup clickable>
                            <q-item-section>
                              <q-item-label :class="hasPhotos === true ? 'text-weight-bold' : 'text-weight-regular'"
                                            @click="setAttachmentFilter(true)">
                                {{ $t("Yes") }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item v-close-popup clickable>
                            <q-item-section>
                              <q-item-label :class="hasPhotos === false ? 'text-weight-bold' : 'text-weight-regular'"
                                            @click="setAttachmentFilter(false)">
                                {{ $t("No") }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item v-close-popup clickable>
                            <q-item-section>
                              <q-item-label :class="hasPhotos == null ? 'text-weight-bold' : 'text-weight-regular'"
                                            @click="setAttachmentFilter(null)">
                                {{ $t("All") }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card>
                    </q-expansion-item>

                    <q-expansion-item expand-separator icon="category" label="Status">
                      <q-card>
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
                      </q-card>
                    </q-expansion-item>
                  </q-list>
                </div>
              </q-btn-dropdown>
            </div>
          </div>
        </q-card-section>


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

          <div v-for="(idea, index) in ideas" v-if="ideas != null" v-bind:key="index">
            <idea-item v-if="!isLoading" :idea="idea" @forceRefresh="fetchIdeas"></idea-item>
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
          <q-btn :label="$t('New idea')" class="q-py-md q-my-md" color="primary" icon="add" no-caps to="/ideas/add"/>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";


import TaskIndexSkeleton from "components/skeletons/tasks/TaskIndexSkeleton.vue";
import IdeaItem from "components/listRow/IdeaListRow.vue";
import {getIdeasRequest} from "components/api/IdeaApiClient";
import {errorHandler} from "components/api/errorHandler";

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let search = ref(null);

const ideas = ref([]);
let selected = ref(null);

let sort = reactive({counter: "asc", title: "asc", age: "asc", active: "age"})

function changeSortOrder(column) {
  sort[column] === "asc" ? sort[column] = 'desc' : sort[column] = "asc"
  sort.active = column
  fetchIdeas()
}

let hasPhotos = ref(null);
let hasStatus = ref(null);

const pagination = reactive({page: 1, size: 10, total: 1})

function setAttachmentFilter(condition) {
  hasPhotos.value = condition;
  fetchIdeas()
}

function setStatusFilter(condition) {
  hasStatus.value = condition;
  fetchIdeas()
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
  fetchIdeas();
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

async function fetchIdeas() {
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

  getIdeasRequest(params).then(function (response) {
    ideas.value = response.data.items;
    pagination.total = response.data.total
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


onBeforeMount(() => {
  isLoading.value = true;
  fetchIdeas();
});
</script>
