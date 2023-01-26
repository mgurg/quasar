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

      <q-card bordered class="my-card no-shadow q-mt-sm q-mb-md">
        <q-card-section>

          Statystyki

        </q-card-section>
        <q-card-section>
          <bar-chart></bar-chart>
        </q-card-section>
      </q-card>

    </q-page>
  </div>
</template>

<script setup>
// import {defineComponent} from 'vue'
// import LineChart from "components/LineChart.vue";
import BarChart from "components/charts/BarChart.vue";
// import PieChart from "components/PieChart.vue";
// import ScatterChart from "components/ScatterChart.vue";
// import DottedBarChart from "components/DottedBarChart.vue";
// import GuageChart from "components/GuageChart.vue";
// import Boxplot from "components/BoxChart.vue";
// import AreaChart from "components/AreaChart.vue";

</script>
