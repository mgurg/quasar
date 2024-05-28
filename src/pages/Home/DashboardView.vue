<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">

      <q-banner class="text-brown-10 bg-yellow-14 q-mt-md" inline-actions rounded>
        <template v-slot:avatar>
          <q-icon color="warning" name="warning"/>
        </template>
        Ten projekt nie jest oficjalnie wydany. Po zakończeniu testów dane zostaną usunięte!
        Pomysły/sugestie? <a class="text-weight-bold text-black"
                             href="mailto:wsparcie@malgori.pl?subject=Aplikacja do zgłaszania awarii"
                             style="text-decoration: underline;">Napisz do mnie</a>
        📧
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

              <VisibilityButton/>

              <!--              <q-btn-->
              <!--                :label="$q.screen.gt.xs ? $t('Search') : ''"-->
              <!--                size="md"-->
              <!--                class="float-right"-->
              <!--                color="primary"-->
              <!--                flat-->
              <!--                icon="search"-->
              <!--                no-caps-->
              <!--              />-->
              <span v-if="$q.screen.gt.xs" class="text-body2 text-weight-medium q-pr-lg">
                {{ currentDate() }}, Dzisiaj:</span>
              <span v-else class="text-body2 text-weight-medium q-pr-lg">Dzisiaj:</span>
            </div>
          </q-item-section>
        </q-item>

      </q-list>


      <!-- <card-dashboard></card-dashboard> -->
      <IssuesSummary :status="status"/>


      <!-- MY ISSUES -->
      <!--      <my-tasks-card-->
      <!--        v-if="userUuid!=null"-->
      <!--        :key="'T'+ componentKey"-->
      <!--        :expanded-my-tasks="expandedUserIssues"-->
      <!--        :user-uuid="userUuid"/>-->

      <!-- MY ITEMS -->
            <my-items-card v-if="userUuid!=null"
                           :key="'I'+ componentKey"
                           :expanded-my-items="expandedUserItems"
                           :user-uuid="userUuid"/>

      <!-- INTRO-->
            <my-intro-card v-if="showIntroCard" :expanded-my-intro="true"/>
    </q-page>
  </div>
</template>

<script setup>
import {onBeforeMount, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
// import {getUserSettingRequest} from 'components/api/SettingsApiClient'
import {useUserStore} from "stores/user";
import {DateTime} from 'luxon';
import VisibilityButton from "components/common/VisibilityButton.vue";
import IssuesSummary from "pages/Home/IssuesSummary.vue";
import {useQuasar} from "quasar";
import {useI18n} from "vue-i18n";
import {useNoAuthAPI} from "src/composables/useNoAuthAPI.js";
import {useAuthAPI} from "src/composables/useAuthAPI.js";
import MyIntroCard from "components/viewer/cards/MyIntroCard.vue";
// import MyTasksCard from "components/viewer/cards/MyTasksCard.vue";
import MyItemsCard from "components/viewer/cards/MyItemsCard.vue";


const $q = useQuasar()
const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();
const noAuthAPI = useNoAuthAPI();
const authAPI = useAuthAPI();


const userUuid = UserStore.getCurrentUserId
const userIssues = ref(null)


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

async function getStatistics() {
  const {data, error} = await authAPI.get("/statistics/issues_counter")
  if (error !== null) {
    console.log(error)
  }
  status.new = data.new
  status.accepted = data.accepted
  status.rejected = data.rejected
  status.assigned = data.assigned
  status.in_progress = data.in_progress
  status.paused = data.paused
  status.done = data.done
}

async function getSettings() {
  const settingName = "dashboard_show_intro"
  const {data, error} = await authAPI.get(`/settings/?settings=${settingName}`)
  if (error !== null) {
    console.log(error)
  }
  showIntroCard.value = data.dashboard_show_intro

}

const expandedUserItems = ref(JSON.parse(localStorage.getItem('visibility-home-items')) ?? true)
const expandedUserIssues = ref(JSON.parse(localStorage.getItem('visibility-home-tasks')) ?? true)
const showIntroCard = ref(false)


const componentKey = ref(0);

const forceRerender = () => {
  componentKey.value += 1;
};

function goToIssues(status) {
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
