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
        <q-breadcrumbs-el :label="$t('Edit')" icon="edit"/>
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
                <q-item-label caption>Krótki, publicznie dostępny opis</q-item-label>

              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>

        <q-card-actions align="right">
          <q-btn class="q-px-xs" color="primary" flat icon="bug_report" no-caps>Zgłoś awarie
          </q-btn>
          <!--          <q-btn color="primary" class="q-px-xs" flat icon="lightbulb_outline" no-caps>Usprawnienie</q-btn>-->
          <q-btn class="q-px-xs" color="primary" flat icon="insights" no-caps>Raporty</q-btn>
        </q-card-actions>
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
                <q-item-label class="text-white text-h5 text-weight-bolder"> {{summaryTimes.quantity}}
                </q-item-label>
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
                <q-item-label class="text-white text-h5 text-weight-bolder"> {{summaryTimes.maxTime}} <span class="text-caption">min.</span>
                </q-item-label>
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
                <q-item-label class="text-white text-h5 text-weight-bolder">{{summaryTimes.avgTime}} <span class="text-caption">min.</span>
                </q-item-label>
                <q-item-label>Maks. czas naprawy </q-item-label>
              </q-item-section>
            </q-item>

        </div>
      </div>

      <!-- liczba usterek -->
      <q-card bordered class="my-card no-shadow q-my-sm">
        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">Liczba usterek</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>
        <q-card-section>
          liczba usterek
        </q-card-section>
      </q-card>

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
          <bar-chart/>
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
        <q-card-section>
          liczba usterek
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
        <q-card-section>
          liczba usterek
        </q-card-section>
      </q-card>

      <!-- czas najdłuższej awarii -->
      <q-card bordered class="my-card no-shadow q-my-sm">
        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">Czas najdłuższej awarii</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>
        <q-card-section>
          liczba usterek
        </q-card-section>
      </q-card>

      <!-- średni czas potrzebny na podjęcie zgłoszenia -->
      <q-card bordered class="my-card no-shadow q-my-sm">
        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">Średni czas potrzebny na podjęcie zgłoszenia</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>
        <q-card-section>
          liczba usterek
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
          liczba usterek
        </q-card-section>
      </q-card>

    </q-page>
  </div>
</template>

<script setup>
import BarChart from "components/charts/BarChart.vue";
import {onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getItemStatisticsRequest, getItemTimelineRequest} from "components/api/ItemApiClient";
import {errorHandler} from "components/api/errorHandler";


const route = useRoute();
const router = useRouter();

const itemUuid = ref(null);
let isLoading = ref(false);
let isError = ref(false);

const summaryTimes = ref({"maxTime" : 12, "avgTime": 6, "quantity" : 2 });
const issuesPerDay = ref(null);
const issuesPerHour = ref(null);
const issuesAvgRepairTime = ref(null);
const issuesMaxRepairTime = ref(null);

function getItemStatistics(uuid) {
  isLoading.value = true;
  getItemStatisticsRequest(uuid).then(function (response) {

    console.log(response.data)

    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

onBeforeMount(() => {
  if (route.params.uuid !== null){
    console.log("Report for: " + route.params.uuid)
    getItemStatistics(route.params.uuid)
  }


});


</script>
