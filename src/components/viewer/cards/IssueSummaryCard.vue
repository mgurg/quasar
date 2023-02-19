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
          <div>Czas całkowity : {{ summaryTimes(summaryReport).issueTotalTime }} sekund</div>
          <div>Czas reakcji : {{ summaryTimes(summaryReport).issueResponseTime }} sekund</div>
          <div>Czas naprawy : {{ summaryTimes(summaryReport).issueRepairTime }} sekund</div>

          <div>&nbsp;</div>
          <div class="text-h6"> Użytkownicy:</div>
          <div v-for="(user, index) in summaryUsers" v-if="summaryUsers != null" v-bind:key="index">
            <div>{{ user.name }} : {{ user.duration }} sekund</div>
          </div>


        </q-card-section>
      </div>
    </q-slide-transition>

  </q-card>
</template>

<script setup>

import {ref} from "vue";
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

const summaryTimes = (arr) => {
  const object = arr.reduce((obj, item) => (obj[item.action] = item.duration, obj), {});
  return object;
}


const isLoading = ref(false)
const isError = ref(false)

function getSummary() {
  isLoading.value = true;
  console.log("UUID " + issueUuid.value)
  getIssueSummaryRequest(issueUuid.value).then(function (response) {

    console.log(response.data)
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
