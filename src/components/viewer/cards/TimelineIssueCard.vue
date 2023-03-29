<template>
  <!--  Timeline -->
  <q-card bordered class="my-card no-shadow q-my-xs">
    <div :style="expandedTimeline ? 'border-left: 5px solid #a04d2c':''">
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedTimeline = !expandedTimeline">
            {{ $t("Timeline") }}
          </div>
          <q-space></q-space>
          <q-btn :icon="expandedTimeline ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat
                 round
                 @click="expandedTimeline = !expandedTimeline"/>
        </div>

      </q-card-section>

      <q-slide-transition>
        <div v-show="expandedTimeline">

          <q-card-section>
            <div class="q-px-lg q-pb-md">
              <q-timeline :layout="layout" color="secondary">
                <q-timeline-entry heading>
                  <!--                  Wydarzenia-->
                  <!--                  <br>-->
                  <!--                  ({{ $q.screen.lt.sm ? 'Dense' : ($q.screen.lt.md ? 'Comfortable' : 'Loose') }} layout)-->
                </q-timeline-entry>


                <!--                    :side="index%2 ===0? 'left':'right'"-->

                <div v-for="(timelineData, index) in timelineOrderedData" v-if="timelineOrderedData !== null" v-bind:key="index">
                  <q-timeline-entry heading>{{index}}</q-timeline-entry>
                  <q-timeline-entry
                    v-for="(event, index) in timelineData" v-if="timelineData !== null" v-bind:key="index"
                    :side="index%2 ===0? 'left':'right'"
                    :subtitle="formatDate(event.created_at)"
                    :title="$t(event.action)"
                  >
<!--                    :title="$t(event.action)"-->
                    <div>
                      <div class="text-body1">{{event.description}}</div>
<!--                      <div>{{event.value}}</div>-->
<!--                      <br>-->
                      <div class="text-caption">{{event.author_name}}</div>
<!--                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore-->
<!--                      et dolore magna aliqua.-->
                    </div>
                  </q-timeline-entry>
                </div>



              </q-timeline>
            </div>
          </q-card-section>
        </div>
      </q-slide-transition>
    </div>
  </q-card>
</template>

<script setup>
import {computed, onBeforeMount, ref} from "vue";
import {useQuasar} from "quasar";
import {errorHandler} from "components/api/errorHandler";
import {getItemTimelineRequest} from "components/api/ItemApiClient";
import {DateTime} from "luxon";
import {getIssueTimelineRequest} from "components/api/IssueApiClient";

const $q = useQuasar();

const props = defineProps({
  expandedTimeline: {
    type: Boolean,
    default: false,
  },
  issueUuid: {
    type: String,
    default: null,
  },
})

let isLoading = ref(false);

const issueUuid = ref(props.issueUuid)


let timelineData = ref(null);
let timelineOrderedData = ref(null);

const expandedTimeline = ref(props.expandedTimeline)

const layout = computed(() => {
  return $q.screen.lt.sm ? 'dense' : ($q.screen.lt.md ? 'comfortable' : 'loose')
});

function getTimeline() {
  isLoading.value = true;
  // console.log("UUID " + issueUuid.value)
  getIssueTimelineRequest(issueUuid.value).then(function (response) {
    timelineData.value = response.data
    // console.log(response.data)

    let timelineDates = [];

    for (const element of timelineData.value) {
      let key = element.created_at.slice(0, 7);
      timelineDates.push(key)
    }

    let uniqueDates = [...new Set(timelineDates)];

    let finalData = {};
    for (const eventDate of uniqueDates) {
      // console.log(eventDate)

      let events = timelineData.value.filter(event => String(event.created_at).startsWith(eventDate))

      finalData[eventDate] = events
      /* console.log(events) */
    }
    timelineOrderedData.value = finalData
    // console.log(finalData)


    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function formatDate(date) {
  let dateTime = DateTime.fromISO(date);
  return dateTime.toFormat('yyyy-MM-dd HH:mm')
}

function goToItem(resource, uuid){
  let url = resource +"/"+uuid;
  router.push(url)
}

onBeforeMount(() => {
  isLoading.value = true;
  // console.log(route.params.uuid)
  getTimeline();
});

</script>
