<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">

      <q-banner class="text-brown-10 bg-yellow-14 q-mt-md" inline-actions rounded>
        <template v-slot:avatar>
          <q-icon color="warning" name="warning"/>
        </template>
        Ten projekt nie jest jeszcze wydany, możesz stracić wszystkie dane! Publiczna beta już wkrótce.
        <br>
        Pomysły/sugestie? <a class="text-weight-bold text-black"
                             href="mailto:wiadomosc.michal@gmail.com?subject=Aplikacja do zgłaszania awarii">Napisz do mnie!</a>
      </q-banner>

      <q-list>
        <q-item class="q-px-none">
          <q-item-section avatar>
            <q-btn
              class="float-right"
              color="red-12"
              dense
              flat
              icon="bug_report"
              label="Zgłoś nową awarię"
              size="md"
              to="/issues/add"
            />
          </q-item-section>
          <q-item-section>

          </q-item-section>
          <q-item-section side>
            <div class="col-12 text-h6 q-mt-none">

              <q-btn-dropdown class="float-right q-mr-sm" color="grey" dense dropdown-icon="settings" flat round>
                <q-list bordered padding>
                  <q-item>
                    <q-item-section>

                      <q-item-label>Domyślnie rozwinięte sekcje</q-item-label>
                      <q-item-label caption>Określ które sekcje (Moje zadania/urządzenia) będę domyślnie rozwinięte</q-item-label>
                    </q-item-section>

                  </q-item>

                  <q-item v-ripple tag="label">
                    <q-item-section>
                      <q-item-label>Moje zadania</q-item-label>
                      <q-item-label caption>Zadania przypisane do Ciebie</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle v-model="expandedUserIssues"/>
                    </q-item-section>
                  </q-item>

                  <q-item v-ripple tag="label">
                    <q-item-section>
                      <q-item-label>Moje urządzenia</q-item-label>
                      <q-item-label caption>Lista zapisanych przez Ciebie urządzeń</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-toggle v-model="expandedUserItems"/>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <!--              <q-btn-->
              <!--                :label="$q.screen.gt.xs ? $t('Search') : ''"-->
              <!--                size="md"-->
              <!--                class="float-right"-->
              <!--                color="primary"-->
              <!--                flat-->
              <!--                icon="search"-->
              <!--                no-caps-->
              <!--              />-->
              <span v-if="$q.screen.gt.xs" class="text-body1 text-weight-medium q-pr-lg">{{ currentDate() }}</span>
            </div>
          </q-item-section>
        </q-item>

      </q-list>


      <!-- <card-dashboard></card-dashboard> -->
      <q-card class="bg-transparent no-shadow no-border q-pb-md">
        <q-card-section class="q-pa-none">
          <div class="row q-col-gutter-sm ">
            <div class="col-md-3 col-sm-6 col-xs-6">
              <router-link to="/issues">
                <q-item class="q-pa-none rounded-borders" style="background-color: #e91e63">
                  <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #d81b60">
                    <q-icon color="white" name="auto_awesome" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.new }}
                    </q-item-label>
                    <q-item-label>{{ $t('New') }}</q-item-label>
                  </q-item-section>
                </q-item>
              </router-link>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6">
              <router-link to="/issues">
                <q-item class="q-pa-none rounded-borders" style="background-color: #ffb300">
                  <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #ffa000">
                    <q-icon color="white" name="build" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.in_progress }}
                    </q-item-label>
                    <q-item-label>{{ $t('Ongoing') }}</q-item-label>
                  </q-item-section>
                </q-item>
              </router-link>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6">
              <router-link to="/issues">
                <q-item class="q-pa-none rounded-borders" style="background-color: #009688">
                  <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #00897b">
                    <q-icon color="white" name="pause" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.paused }}
                    </q-item-label>
                    <q-item-label>{{ $t('Paused') }}</q-item-label>
                  </q-item-section>
                </q-item>
              </router-link>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6">
              <router-link to="/issues">
                <q-item class="q-pa-none rounded-borders" style="background-color: #455a64">
                  <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #37474f">
                    <q-icon color="white" name="stop" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.resolved }}
                    </q-item-label>
                    <q-item-label>{{ $t('Done') }}</q-item-label>
                  </q-item-section>
                </q-item>
              </router-link>
            </div>
          </div>
        </q-card-section>
      </q-card>


      <!-- MY ISSUES -->
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedUserIssues = !expandedUserIssues">
              Moje zadania
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
              :icon="expandedUserIssues ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              color="grey"
              dense
              flat
              round
              @click="expandedUserIssues = !expandedUserIssues"
            />
          </div>

        </q-card-section>
        <q-separator v-if="expandedUserIssues"/>
        <q-slide-transition>
          <div v-show="expandedUserIssues">
            <q-card-section>
              <p v-if="userIssues === null || userIssues.length == 0" class="q-pt-xs text-body2">
                Nie masz żadnych nieprzypisanych zadań. Przejdź do
                <q-btn dense flat icon="bug_report" no-caps to="/issues">listy zgłoszeń</q-btn>
                i wybierz dla siebie jedno z <span class="text-weight-bold">{{ status.new }} zadań</span> które nie są do
                nikogo przypisane.

              </p>

              <q-list v-if="userIssues !== null && userIssues.length > 0">
                <q-item :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'" class="rounded-borders">
                  <q-item-section avatar>
                    <div class="q-pa-none">
                      <q-btn-dropdown color="primary" dropdown-icon="sort" flat>
                        <q-list>
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

                <div v-for="(issue, index) in userIssues" v-if="userIssues !== null" v-bind:key="index">
                  <issue-list-row :issue="issue"/>
                </div>
              </q-list>
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>

      <!-- MY ITEMS -->
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedUserItems = !expandedUserItems">
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
              to="/items/"
            />
            <q-btn
              :icon="expandedUserItems ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              color="grey"
              dense
              flat
              round
              @click="expandedUserItems = !expandedUserItems"
            />
          </div>

        </q-card-section>
        <q-separator/>
        <q-slide-transition>
          <div v-show="expandedUserItems">
            <q-card-section>
              <p class="q-pt-xs text-body2">
                Nie masz jeszcze żadnych przypisanych urządzeń. Przejdź do
                <q-btn color="primary" dense flat icon="apps" no-caps to="/items">listy maszyn</q-btn>
                kliknij nazwę i dodaj do ulubionych klikając ikonę serca
                <q-icon color="accent" name="favorite_border" size="sm"/>

              </p>

            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>


      <!--      <q-card bordered class="my-card no-shadow q-mt-sm">-->
      <!--        <q-card-section>-->
      <!--          <p class="q-pt-xs text-body1">-->
      <!--            Zbieraj-->
      <!--            prawdziwe i <b>szczere sugestie</b> od każdego.-->
      <!--            Rozpocznij błyskawicznie zbieranie informacji od pracowników korzystając z anonimowej skrzynki sugestii-->
      <!--            online.-->
      <!--          </p>-->

      <!--        </q-card-section>-->
      <!--      </q-card>-->
    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import {errorHandler} from 'src/components/api/errorHandler.js'
import {getIssuesStatsRequest, getUserIssuesRequest} from "components/api/IssueApiClient";
import {useUserStore} from "stores/user";
import {DateTime} from 'luxon';

import IssueListRow from "components/listRow/IssueListRow.vue";


const UserStore = useUserStore();
const userUuid = UserStore.getCurrentUserId
const userIssues = ref(null)


function currentDate() {
  const now = DateTime.now();

  return now.setLocale('pl').toFormat('cccc, dd LLL yyyy')
}

let sort = reactive({status: "asc", title: "asc", created_at: "asc", name: "asc", active: "created_at"})
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
  getUserIssues();
}

function changeSortOrder() {
  let field = sort.active

  sort[field] === "asc" ? sort[field] = 'desc' : sort[field] = "asc"
  getUserIssues();
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

const expandedUserItems = ref(true)
const expandedUserIssues = ref(true)

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
