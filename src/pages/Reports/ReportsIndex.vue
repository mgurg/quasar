<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs class="q-ma-sm text-grey" active-color="grey">
        <template v-slot:separator>
          <q-icon
            size="1.5em"
            name="chevron_right"
            color="grey"
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
                <q-item-label class="text-h5">Raport</q-item-label>
                <!--                 <q-item-label caption>{{ itemDetails.summary }}</q-item-label>-->
                <q-item-label caption>Podsumowanie awarii w okresie ostatnich 3 miesięcy</q-item-label>

              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>

        <!--        <q-card-actions align="right">-->
        <!--          <q-btn class="q-px-xs" color="primary" flat icon="bug_report" no-caps>Zgłoś awarie-->
        <!--          </q-btn>-->
        <!--          &lt;!&ndash;          <q-btn color="primary" class="q-px-xs" flat icon="lightbulb_outline" no-caps>Usprawnienie</q-btn>&ndash;&gt;-->
        <!--          <q-btn class="q-px-xs" color="primary" flat icon="insights" no-caps>Raporty</q-btn>-->
        <!--        </q-card-actions>-->
      </q-card>

      <!--      QUICK SUMMARY -->
      <div class="row q-col-gutter-sm q-pb-md q-mt-sm">
        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
          <q-item class="q-pa-none no-shadow rounded-borders fit" style="background-color: #e91e63">
            <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                            side
                            style="background-color: #d81b60">
              <q-icon color="white" name="functions" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h5 text-weight-bolder" v-if="issuesCounter">{{ issuesCounter}}</q-item-label>
              <q-item-label class="text-white text-h5 text-weight-bolder" v-else>---</q-item-label>
              <q-item-label>Liczba wszystkich awarii</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
          <q-item class="q-pa-none no-shadow rounded-borders fit" style="background-color: #ffb300">
            <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                            side
                            style="background-color: #ffa000">
              <q-icon color="white" name="alarm_on" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h5 text-weight-bolder" v-if="summaryTimes.max"> {{summaryTimes.max}} <span class="text-caption">min.</span>
              </q-item-label>
              <q-item-label class="text-white text-h5 text-weight-bolder" v-else>---</q-item-label>
              <q-item-label>Średni czas naprawy</q-item-label>
            </q-item-section>
          </q-item>


        </div>
        <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
          <q-item class="q-pa-none no-shadow rounded-borders fit" style="background-color: #009688">
            <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                            side
                            style="background-color: #00897b">
              <q-icon color="white" name="alarm_on" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h5 text-weight-bolder" v-if="summaryTimes.avg">{{summaryTimes.avg}} <span class="text-caption">min.</span>
              </q-item-label>
              <q-item-label class="text-white text-h5 text-weight-bolder" v-else>---</q-item-label>
              <q-item-label>Maks. czas naprawy </q-item-label>
            </q-item-section>
          </q-item>

        </div>
      </div>

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
          <heat-map-chart v-if="issuesPerDay" :data="issuesPerDay" chart-title="Liczba usterek z podziałem na dni" />
          <div v-else> Brak danych 😟</div>
        </q-card-section>
      </q-card>

      <!-- liczba usterek z podziałem na godziny -->
      <q-card bordered class="my-card no-shadow q-my-sm" >
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
        <q-card-section class="q-pa-none q-ma-none">
          <bar-chart  v-if="issuesPerHour" :data="issuesPerHour" chart-title="Liczba usterek z podziałem na godziny" />
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

          <bar-chart  v-if="issuesStatus" :data="issuesStatus" chart-title="Usterki z podziałem na status" />
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
import {onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {
  getAllItemStatisticsRequest,
  getItemStatisticsRequest,
  getItemTimelineRequest
} from "components/api/ItemApiClient";
import {errorHandler} from "components/api/errorHandler";
import humanizeDuration from "humanize-duration";


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


function getItemStatistics() {
  isLoading.value = true;
  getAllItemStatisticsRequest().then(function (response) {

    // issuesCounter.value = response.data.issuesCount
    // summaryTimes.value = response.data.repairTime
    issuesPerDay.value = response.data.issuesPerDay
    issuesPerHour.value = response.data.issuesPerHour
    issuesStatus.value = response.data.issuesStatus
    // issuesRepairTime.value = response.data.repairTime
    // issuesTotalTime.value = response.data.totalTime
    console.log(response.data)

    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

getItemStatistics()

</script>
