<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">

      <q-banner class="text-brown-10 bg-yellow-14 q-mt-md" inline-actions rounded>
        <template v-slot:avatar>
          <q-icon color="warning" name="warning"/>
        </template>
        Ten projekt nie jest jeszcze wydany! Możesz stracić wszystkie swoje dane. Publiczna beta już wkrótce.
      </q-banner>

      <!-- <card-dashboard></card-dashboard> -->
      <q-card class="bg-transparent no-shadow no-border q-pt-md">
        <q-card-section class="q-pa-none">
          <div class="row q-col-gutter-sm ">
            <div class="col-md-3 col-sm-6 col-xs-6">
              <router-link to="/ideas">
                <q-item class="q-pa-none rounded-borders" style="background-color: #e91e63">
                  <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #d81b60">
                    <q-icon color="white" name="auto_awesome" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.new }}
                    </q-item-label>
                    <q-item-label>New</q-item-label>
                  </q-item-section>
                </q-item>
              </router-link>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6">
              <router-link to="/ideas">
                <q-item class="q-pa-none rounded-borders" style="background-color: #ffb300">
                  <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #ffa000">
                    <q-icon color="white" name="build" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.in_progress }}
                    </q-item-label>
                    <q-item-label>In progress</q-item-label>
                  </q-item-section>
                </q-item>
              </router-link>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6">
              <router-link to="/ideas">
                <q-item class="q-pa-none rounded-borders" style="background-color: #009688">
                  <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #00897b">
                    <q-icon color="white" name="pause" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.paused }}
                    </q-item-label>
                    <q-item-label>Paused</q-item-label>
                  </q-item-section>
                </q-item>
              </router-link>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6">
              <router-link to="/ideas">
                <q-item class="q-pa-none rounded-borders" style="background-color: #455a64">
                  <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #37474f">
                    <q-icon color="white" name="stop" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.resolved }}
                    </q-item-label>
                    <q-item-label>Resolved</q-item-label>
                  </q-item-section>
                </q-item>
              </router-link>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h6 text-weight-regular cursor-pointer">
              Twoje zadania
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <p class="q-pt-xs text-body2" v-if="userIssues === null || userIssues.length == 0">
            Nie masz żadnych nieprzypisanych zadań. Przejdź do
            <q-btn to="/issues" flat icon="bug_report" dense no-caps>listy zgłoszeń</q-btn>
            i wybierz dla siebie jedno z <span class="text-weight-bold">{{ status.new }} zadań</span> które nie są do
            nikogo przypisane.

          </p>

          <q-list v-if="userIssues !== null && userIssues.length > 0">
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
            <div v-for="(issue, index) in userIssues" v-if="userIssues !== null" v-bind:key="index">
              <issue-list-row :issue="issue"/>
            </div>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <p class="q-pt-xs text-body1">
            Zbieraj
            prawdziwe i <b>szczere sugestie</b> od każdego.
            Rozpocznij błyskawicznie zbieranie informacji od pracowników korzystając z anonimowej skrzynki sugestii
            online.
          </p>

        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import {errorHandler} from 'src/components/api/errorHandler.js'
import {getIssuesStatsRequest, getUserIssuesRequest} from "components/api/IssueApiClient";
import {useUserStore} from "stores/user";
import IssueListRow from "components/listRow/IssueListRow.vue";


const UserStore = useUserStore();
const userUuid = UserStore.getCurrentUserId
const userIssues = ref(null)

let sort = reactive({counter: "asc", title: "asc", name: "asc", active: "name"})

function changeSortOrder(column) {
  sort[column] === "asc" ? sort[column] = 'desc' : sort[column] = "asc"
  sort.active = column
  getUserIssues()
}

const pagination = reactive({page: 1, size: 10, total: 1})

const pagesNo = computed(() => {
  // console.log(Math.ceil(pagination.total/pagination.size))
  return Math.ceil(pagination.total / pagination.size)
})

watch(() => pagination.page, (oldPage, newPage) => {
  console.log(oldPage, newPage);
  getUserIssues();
})

const status = reactive({
  "new": 0,
  "accepted": 0,
  "rejected": 0,
  "assigned": 0,
  "in_progress": 0,
  "paused": 0,
  "resolved": 0
});

const isLoading = ref(false)
const isError = ref(false)

function getStatistics() {
  isLoading.value = true;
  getIssuesStatsRequest().then(function (response) {
    status.new = response.data.new
    status.accepted = response.data.accepted
    status.rejected = response.data.rejected
    status.assigned = response.data.assigned
    status.in_progress = response.data.in_progress
    status.paused = response.data.paused
    status.resolved = response.data.resolved
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function getUserIssues() {
  isLoading.value = true;
  getUserIssuesRequest(userUuid).then(function (response) {
    userIssues.value = response.data.items
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

onBeforeMount(() => {
  isLoading.value = true;
  getStatistics()
  getUserIssues()
});
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
