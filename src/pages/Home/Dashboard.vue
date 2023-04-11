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
                             href="mailto:wiadomosc.michal@gmail.com?subject=Aplikacja do zgłaszania awarii">Napisz do mnie ➡️</a>
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

              <q-btn-dropdown class="float-left q-mr-sm" color="grey" dense dropdown-icon="settings" flat round>
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
                      <q-toggle
                        v-model="expandedUserIssues"
                        @update:model-value="setSectionVisibility('visibility-home-tasks')"
                      />
                    </q-item-section>
                  </q-item>

                  <q-item v-ripple tag="label">
                    <q-item-section>
                      <q-item-label>Moje urządzenia</q-item-label>
                      <q-item-label caption>Lista zapisanych przez Ciebie urządzeń</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-toggle
                        v-model="expandedUserItems"
                        @update:model-value="setSectionVisibility('visibility-home-items')"
                      />
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
              <span v-if="$q.screen.gt.xs" class="text-body2 text-weight-medium q-pr-lg">{{ currentDate() }}, Dzisiaj:</span>
              <span class="text-body2 text-weight-medium q-pr-lg" v-else>
                Dzisiaj:
              </span>
            </div>
          </q-item-section>
        </q-item>

      </q-list>


      <!-- <card-dashboard></card-dashboard> -->
          <div class="row q-col-gutter-sm">
            <div class="col-md-3 col-sm-6 col-xs-6">
                <q-item clickable @click="goToIssues('new')" class="q-pa-none rounded-borders fit" style="background-color: #e91e63">

                  <q-item-section class="q-pa-md q-mr-none text-white rounded-borders"
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
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6">
                <q-item clickable @click="goToIssues('in_progress')" class="q-pa-none rounded-borders fit" style="background-color: #ffb300">
                  <q-item-section class=" q-pa-md q-mr-none text-white rounded-borders"
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
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6">
                <q-item clickable  @click="goToIssues('paused')" class="q-pa-none rounded-borders fit" style="background-color: #009688">
                  <q-item-section class="q-pa-md q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #00897b">
                    <q-icon color="white" name="pause" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class="q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.paused }}
                    </q-item-label>
                    <q-item-label>{{ $t('Paused') }}</q-item-label>
                  </q-item-section>
                </q-item>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6">
                <q-item clickable @click="goToIssues('done')" class="q-pa-none rounded-borders fit" style="background-color: #455a64">
                  <q-item-section class=" q-pa-md q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #37474f">
                    <q-icon color="white" name="stop" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.done }}
                    </q-item-label>
                    <q-item-label>{{ $t('Done') }}</q-item-label>
                  </q-item-section>
                </q-item>
            </div>
          </div>


      <!-- MY ISSUES -->
      <my-tasks-card v-if="userUuid!=null" :expanded-my-tasks="expandedUserIssues" :user-uuid="userUuid" :key="expandedUserIssues"/>

      <!-- MY ITEMS -->
      <my-items-card v-if="userUuid!=null" :expanded-my-items="expandedUserItems" :user-uuid="userUuid" :key="expandedUserItems"/>

      <!-- INTRO-->
      <my-intro-card :expanded-my-intro="true"  v-if="showIntroCard" />
    </q-page>
  </div>
</template>

<script setup>
import {onBeforeMount, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {errorHandler} from 'src/components/api/errorHandler.js'
import {getIssuesCounterRequest} from "components/api/StatisticsApiClient";
import {getUserSettingRequest} from 'components/api/SettingsApiClient'

import {useUserStore} from "stores/user";
import {DateTime} from 'luxon';
import MyIntroCard from "components/viewer/cards/MyIntroCard.vue";
import MyTasksCard from "components/viewer/cards/MyTasksCard.vue";
import MyItemsCard from "components/viewer/cards/MyItemsCard.vue";


const UserStore = useUserStore();
const userUuid = UserStore.getCurrentUserId
const userIssues = ref(null)
const router = useRouter();


function currentDate() {
  const now = DateTime.now();

  return now.setLocale('pl').toFormat('cccc, dd LLL yyyy')
}


const status = reactive({
  "new": 0,
  "accepted": 0,
  "rejected": 0,
  "assigned": 0,
  "in_progress": 0,
  "paused": 0,
  "done": 0
});

const isLoading = ref(false)
const isError = ref(false)

function getStatistics() {
  isLoading.value = true;
  getIssuesCounterRequest().then(function (response) {
    status.new = response.data.new
    status.accepted = response.data.accepted
    status.rejected = response.data.rejected
    status.assigned = response.data.assigned
    status.in_progress = response.data.in_progress
    status.paused = response.data.paused
    status.done = response.data.done
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function getSettings(){
  isLoading.value = true;
  getUserSettingRequest("dashboard_show_intro").then(function (response) {
    // console.log(response.data.dashboard_show_intro)
    showIntroCard.value = response.data.dashboard_show_intro
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);

    if (err.response != 200) {
      console.log("ERROR")
    }
    isError.value = true;
  });
}

const expandedUserItems = ref(JSON.parse(localStorage.getItem('visibility-home-items')) ??  true)
const expandedUserIssues = ref(JSON.parse(localStorage.getItem('visibility-home-tasks')) ??  true)
const showIntroCard = ref(false)

function setSectionVisibility(condition) {
  // if (localStorage.getItem(condition) === null){
  //   localStorage.setItem(condition, JSON.stringify('true'))
  // }
  // else{
  //   let currentValue = JSON.parse(localStorage.getItem(condition))
  //   localStorage.setItem(condition, JSON.stringify(!currentValue))
  // }
}

function goToIssues(status){
  router.push({path: "/issues", query: {filter: status}})
}

onBeforeMount(() => {
  isLoading.value = true;
  getSettings()
  getStatistics()

});
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
