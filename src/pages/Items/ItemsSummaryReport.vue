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
        <q-breadcrumbs-el icon="home" to="/home"/>
        <q-breadcrumbs-el :label="$t('Items')" icon="apps" to="/items"/>
        <q-breadcrumbs-el :label="$t('Edit')" icon="insights"/>
      </q-breadcrumbs>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-list>
          <q-item class="q-px-sm">
            <q-item-section avatar>
              <q-btn color="grey" dense flat icon="arrow_back_ios" no-caps @click="router.back()">{{
                  $t("Return")
                }}
              </q-btn>
            </q-item-section>
            <q-item-section></q-item-section>
            <q-item-section side>

            </q-item-section>
          </q-item>
        </q-list>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5">Raport zbiorczy</q-item-label>
                <!--                 <q-item-label caption>{{ itemDetails.summary }}</q-item-label>-->
                <!--                <q-item-label caption>Podsumowanie awarii w okresie ostatnich 3 miesięcy</q-item-label>-->

              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>
        <q-card-actions align="right">
          <q-input
            :label="dateRangeDisplay"
            autogrow

            class="float-right q-ma-xs q-pa-none"
            dense
            disable
            outlined
          >
            <template v-slot:after>
              <q-btn dense flat icon="event" round>

                <q-popup-proxy ref="qDateProxy" cover transition-hide="scale" transition-show="scale">
                  <q-date
                    v-model="dateRange"
                    navigation-min-year-month="2023/01"
                    :multiple=false mask="DD-MM-YYYY"
                    no-unset
                    range
                    today-btn
                  >
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-separator/>
                      <!-- <q-btn label="Cancel" color="primary" flat v-close-popup />-->
                      <q-btn v-close-popup color="primary" flat label="OK"/>
                    </div>
                  </q-date>
                </q-popup-proxy>

              </q-btn>
            </template>
          </q-input>
        </q-card-actions>
      </q-card>

      <!--      https://github.com/quasarframework/quasar/issues/8037-->



      <!--      QUICK SUMMARY -->
<!--      <div class="row q-col-gutter-sm q-pb-md q-mt-sm">-->
<!--        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">-->
<!--          <q-item class="q-pa-none no-shadow rounded-borders fit" style="background-color: #e91e63">-->
<!--            <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"-->
<!--                            side-->
<!--                            style="background-color: #d81b60">-->
<!--              <q-icon color="white" name="functions" size="24px"></q-icon>-->
<!--            </q-item-section>-->
<!--            <q-item-section class=" q-pa-md q-ml-none  text-white">-->
<!--              <q-item-label v-if="issuesCounter" class="text-white text-h5 text-weight-bolder">{{ issuesCounter }}-->
<!--              </q-item-label>-->
<!--              <q-item-label v-else class="text-white text-h5 text-weight-bolder">-&#45;&#45;</q-item-label>-->
<!--              <q-item-label>Liczba wszystkich awarii</q-item-label>-->
<!--            </q-item-section>-->
<!--          </q-item>-->
<!--        </div>-->
<!--        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">-->
<!--          <q-item class="q-pa-none no-shadow rounded-borders fit" style="background-color: #ffb300">-->
<!--            <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"-->
<!--                            side-->
<!--                            style="background-color: #ffa000">-->
<!--              <q-icon color="white" name="alarm_on" size="24px"></q-icon>-->
<!--            </q-item-section>-->
<!--            <q-item-section class=" q-pa-md q-ml-none  text-white">-->
<!--              <q-item-label v-if="summaryTimes.max" class="text-white text-h5 text-weight-bolder">-->
<!--                {{ summaryTimes.max }} <span class="text-caption">min.</span>-->
<!--              </q-item-label>-->
<!--              <q-item-label v-else class="text-white text-h5 text-weight-bolder">-&#45;&#45;</q-item-label>-->
<!--              <q-item-label>Średni czas naprawy</q-item-label>-->
<!--            </q-item-section>-->
<!--          </q-item>-->


<!--        </div>-->
<!--        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">-->
<!--          <q-item class="q-pa-none no-shadow rounded-borders fit" style="background-color: #009688">-->
<!--            <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"-->
<!--                            side-->
<!--                            style="background-color: #00897b">-->
<!--              <q-icon color="white" name="alarm_on" size="24px"></q-icon>-->
<!--            </q-item-section>-->
<!--            <q-item-section class=" q-pa-md q-ml-none  text-white">-->
<!--              <q-item-label v-if="summaryTimes.avg" class="text-white text-h5 text-weight-bolder">-->
<!--                {{ summaryTimes.avg }} <span class="text-caption">min.</span>-->
<!--              </q-item-label>-->
<!--              <q-item-label v-else class="text-white text-h5 text-weight-bolder">-&#45;&#45;</q-item-label>-->
<!--              <q-item-label>Maks. czas naprawy</q-item-label>-->
<!--            </q-item-section>-->
<!--          </q-item>-->

<!--        </div>-->
<!--      </div>-->


      <!-- liczba usterek z podziałem na dni -->
      <q-card bordered class="my-card no-shadow q-my-sm">
        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">Liczba usterek z podziałem na dni</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>
        <q-card-section>
          <heat-map-chart
            :key="componentKey"
            v-if="issuesPerDay"
            :data="issuesPerDay"
            date-from="2022-01-01"
            date-to="2023-01-01"
            chart-title="Liczba usterek z podziałem na dni"/>
          <div v-else> Brak danych 😟</div>
        </q-card-section>
      </q-card>

      <!-- liczba usterek z podziałem na godziny -->
      <q-card bordered class="my-card no-shadow q-my-sm">
        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">liczba usterek z podziałem na godziny</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>
        <q-card-section>
          <bar-chart
            v-if="issuesPerHour"
            :data="issuesPerHour"
            chart-title="Liczba usterek z podziałem na godziny"/>
          <div v-else> Brak danych 😟</div>
        </q-card-section>
      </q-card>

      <!-- usterki z podziałem na status -->
      <q-card bordered class="my-card no-shadow q-my-sm">
        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">Usterki z podziałem na status</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>
        <q-card-section class="q-pa-none q-ma-none">

          <bar-chart
            v-if="issuesStatus"
            :data="issuesStatus"
            chart-title="Usterki z podziałem na status"
          />
          <div v-else> Brak danych 😟</div>
        </q-card-section>
      </q-card>

      <!-- czas napraw -->
      <q-card bordered class="my-card no-shadow q-my-sm">
        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">Czas napraw</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>
        <q-card-section v-if="issuesRepairTime">
          <div class="row q-py-sm">
            <div class="col">Naprawy (Średni):</div>
            <div class="col"> {{ humanizeSeconds(issuesRepairTime.avg) }}</div>
          </div>
          <!--          <q-separator/>-->
          <div class="row q-py-sm">
            <div class="col">Naprawy (Maksymalny):</div>
            <div class="col">{{ humanizeSeconds(issuesRepairTime.max) }}</div>
          </div>
          <q-separator/>
          <div class="row q-py-sm">
            <div class="col">Obsługi całej awarii (Średni):</div>
            <div class="col"> {{ humanizeSeconds(issuesTotalTime.avg) }}</div>
          </div>
          <!--          <q-separator/>-->
          <div class="row q-py-sm">
            <div class="col">Obsługi całej awarii (Maksymalny):</div>
            <div class="col">{{ humanizeSeconds(issuesTotalTime.max) }}</div>
          </div>

        </q-card-section>
      </q-card>


      <!-- użytkownicy biorący udział w naprawach -->
      <q-card bordered class="my-card no-shadow q-my-sm">
        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">Użytkownicy biorący udział w naprawach</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>
        <q-card-section>
          Liczba usterek
        </q-card-section>
      </q-card>

    </q-page>
  </div>
</template>

<script setup>
import BarChart from "components/charts/BarChart.vue";
import HeatMapChart from "components/charts/HeatMapChart.vue";
import {computed, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getAllItemStatisticsRequest} from "components/api/ItemApiClient";
import {errorHandler} from "components/api/errorHandler";
import {DateTime, Duration, Interval} from "luxon";


const route = useRoute();
const router = useRouter();

const itemUuid = ref(null);
let isLoading = ref(false);
let isError = ref(false);

const issuesCounter = ref(null);
const summaryTimes = ref({max: null, avg: null});
const issuesPerDay = ref(null);
const issuesPerHour = ref(null);
const issuesStatus = ref(null);
const issuesRepairTime = ref(null);
const issuesTotalTime = ref(null);

const componentKey = ref(0);

const forceRerender = () => {
  componentKey.value += 1;
};

// --- BTN DATE PICKER -

const dateFrom = ref(DateTime.now().minus({month: 1}).toFormat("dd-MM-yyyy"));
const dateTo = ref(DateTime.now().toFormat("dd-MM-yyyy"));

const dateTimeFrom = computed(() => {
  return DateTime.fromFormat(dateRange.value.from, "dd-MM-yyyy", {locale: "pl-PL"}).startOf('day')
});

const dateTimeTo = computed(() => {
  if (DateTime.now().toFormat("dd-MM-yyyy") == dateTo.value) {
    console.log(DateTime.now({locale: "pl-PL"}))
    return DateTime.now({locale: "pl-PL"})
  }
  return DateTime.fromFormat(dateRange.value.to, "dd-MM-yyyy", {locale: "pl-PL"}).endOf('day')
});

const dateRange = ref({from: dateFrom, to: dateTo});
const dateRangeDisplay = computed(() => {
  return dateRange.value.from + " ~ " + dateRange.value.to;
});

watch(() => dateRange.value, (newValue, oldValue) => {
  if (typeof newValue === 'object') {
    getItemStatistics();
    console.log("isRange")
  } else {
    // dateRangeName.value = "Custom";
    console.log("isSingleDate");
    dateRange.value = {"from": newValue, "to": newValue}
  }
});

const duration = computed(() => {
  let startDate = dateTimeFrom.value.endOf('day') // DateTime.fromFormat(dateFrom.value, "dd-MM-yyyy", {locale: "pl-PL"}).startOf('day')
  let endDate = dateTimeTo.value.endOf('day')  //DateTime.fromFormat(dateTo.value, "dd-MM-yyyy", {locale: "pl-PL"}).startOf('day')
  const durationHelper = Interval.fromDateTimes(startDate, endDate).toDuration(['months', 'days'], {conversionAccuracy: "casual"})

  console.log(durationHelper)

  if (durationHelper.values.months === 0) {
    console.log("days")
    return Interval.fromDateTimes(startDate, endDate).toDuration(['days']).toHuman({listStyle: 'narrow'})
  }
  if (durationHelper.values.months !== 0 && durationHelper.values.days == 0) {
    console.log("months")
    return Interval.fromDateTimes(startDate, endDate).toDuration(['months']).toHuman({listStyle: 'narrow'})
  }

  console.log("else")
  return durationHelper.toHuman({listStyle: 'narrow'});
});

const durationFromSeconds = (seconds) => {

  let duration = Duration.fromMillis(63 * 60 * 1000, {locale: "pl-PL"})

  let durationHelper = duration.shiftTo("hours", "minutes")
  if (durationHelper.values.hours === 0) {
    return duration.shiftTo("minutes").toHuman({listStyle: 'narrow'})
  }
  // if (durationHelper.values.months !== 0 && durationHelper.values.days === 0){
  //   return Interval.fromDateTimes(startDate, endDate).toDuration(['months']).toHuman({ listStyle: 'narrow' })
  // }

  return duration.shiftTo("hours", "minutes").toHuman()

}


// watch(dateFrom, (value) => {
//   console.log(value)
//   getItemStatistics()
// })
//
// watch(dateTo, (value) => {
//   console.log(value)
//
// })

// const convertDate = (date, mode) => {
//   if (mode === 'start') {
//     return DateTime.fromFormat(date, "yyyy/MM/dd").startOf('day').toISO()
//   }
//   if (mode === 'end') {
//     return DateTime.fromFormat(date, "yyyy/MM/dd").endOf('day').toISO()
//   }
// }

const showSearchBar = ref(false);


function resetFilters() {
  dateFrom.value = DateTime.now().minus({month: 1}).toFormat("yyyy/MM/dd");
  dateTo.value = DateTime.now().toFormat("yyyy/MM/dd");
}

function getItemStatistics() {
  isLoading.value = true;

  let dtFrom = dateTimeFrom.value.toISO()
  let dtTo = dateTimeTo.value.toISO()

  getAllItemStatisticsRequest(dtFrom, dtTo).then(function (response) {

    // issuesCounter.value = response.data.issuesCount
    // summaryTimes.value = response.data.repairTime
    issuesPerDay.value = response.data.issuesPerDay
    issuesPerHour.value = response.data.issuesPerHour
    issuesStatus.value = response.data.issuesStatus

    // issuesRepairTime.value = response.data.repairTime
    // issuesTotalTime.value = response.data.totalTime
    console.log(response.data)

    isLoading.value = false;
    forceRerender();
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

getItemStatistics()

</script>
