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
      <q-card-section>
        Hey! {{issueUuid}}
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
    default: false,
  },
})

const expandedSummary = ref(props.expandedSummary)
const issueUuid = ref(props.issueUuid)

const isLoading = ref(false)
const isError = ref(false)

function getSummary() {
  isLoading.value = true;
  console.log("UUID " + issueUuid.value)
  // getIssueSummaryRequest(issueUuid.value).then(function (response) {
  //
  //   console.log(response.data)
  //
  //
  // }).catch((err) => {
  //   const errorMessage = errorHandler(err);
  //   isError.value = true;
  // });
}

getSummary();

</script>
