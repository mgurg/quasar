<template>
  <q-card bordered class="my-card no-shadow q-my-sm">
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedSummary = !expandedSummary">
          Podsumowanie
        </div>
        <q-space/>
        <q-btn :icon="expandedSummary ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
               color="grey"
               dense
               flat
               round
               @click="expandedSummary = !expandedSummary"/>
      </div>
    </q-card-section>

    <q-slide-transition>
      <div v-show="expandedSummary">
        <q-card-section v-if="summaryReport">
          <div class="text-h6"> Czasy:</div>
          <!--          <div>Całkowity: {{ summaryTimes(summaryReport).issueTotalTime }}</div>-->
          <!--          <div>Od zgłoszenia do akceptacji: {{ summaryTimes(summaryReport).issueResponseTime }}</div>-->
          <!--          <div>Od akceptacji do rozpoczęcia pracy: {{ summaryTimes(summaryReport).acceptToStartTime }}</div>-->
          <!--          <div>Naprawy: {{ summaryTimes(summaryReport).issueRepairTime }}</div>-->
          <!--          <div>Łącznej aktywności użytkowników: {{ summaryTimes(summaryReport).issueUserActivity }}</div>-->

          <div class="row q-py-sm">
            <div class="col">Całkowity:</div>
            <div class="col">{{ summaryTimes(summaryReport).issueTotalTime }}</div>
          </div>
          <q-separator/>
          <div class="row q-py-sm">
            <div class="col">Od zgłoszenia do akceptacji:</div>
            <div class="col">{{ summaryTimes(summaryReport).issueResponseTime }}</div>
          </div>
          <q-separator/>
          <div class="row q-py-sm">
            <div class="col">Od akceptacji do rozpoczęcia pracy:</div>
            <div class="col">{{ summaryTimes(summaryReport).acceptToStartTime }}</div>
          </div>
          <q-separator/>
          <div class="row q-py-sm">
            <div class="col">Naprawy:</div>
            <div class="col">{{ summaryTimes(summaryReport).issueRepairTime }}</div>
          </div>
          <q-separator/>
          <div class="row q-py-sm">
            <div class="col">Łącznej aktywności użytkowników:</div>
            <div class="col">{{ summaryTimes(summaryReport).issueUserActivity }}</div>
          </div>
          <q-separator/>

          <div>&nbsp;</div>
          <div class="text-h6">Aktywność użytkowników:</div>
          <div v-for="(user, index) in summaryUsers" v-if="summaryUsers != null" v-bind:key="index">
            <div class="row q-py-sm">
              <div class="col">{{ user.name }}</div>
              <div class="col">{{ humanizeSeconds(user.duration) }}</div>
            </div>
            <q-separator/>
          </div>


        </q-card-section>
      </div>
    </q-slide-transition>

  </q-card>
</template>

<script setup>

import {ref} from "vue";
import humanizeDuration from 'humanize-duration'
import {getIssueSummaryRequest} from "components/api/IssueApiClient";
import {errorHandler} from "components/api/errorHandler";

const props = defineProps({
  issueUuid: {
    type: String,
    default: null,
  },
  expandedSummary: {
    type: Boolean,
    default: true,
  },
})

const expandedSummary = ref(props.expandedSummary)
const issueUuid = ref(props.issueUuid)

const summaryReport = ref(null)
const summaryUsers = ref(null)

const byKey = (arr, key, value) => {

  let result = arr.filter(obj => {
    return obj.action === key
  })

  return result;
};

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
});

const summaryTimes = (arr) => {


  const object = arr.reduce((obj, item) => (obj[item.action] = humanizeSeconds(item.duration), obj), {});

  // console.log(object)

  return object;
}


function humanizeSeconds(seconds) {
  return shortEnglishHumanizer(seconds * 1000)
}

const isLoading = ref(false)
const isError = ref(false)

function getSummary() {
  isLoading.value = true;
  // console.log("UUID " + issueUuid.value)
  getIssueSummaryRequest(issueUuid.value).then(function (response) {

    // console.log(response.data)
    summaryReport.value = response.data.events
    summaryUsers.value = response.data.users

  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

// [ { "action": "issueRepairTime", "duration": 691, "counter": 1 } ]

getSummary();

</script>
