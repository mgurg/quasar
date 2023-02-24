<template>
  <div>
    <q-card :class="$q.dark.isActive?'bg-dark':''" class="no-shadow">
<!--      <q-card-section class="text-h6">-->
<!--        Heatmap Chart-->
<!--        <q-btn class="float-right" dense flat icon="download">-->
<!--          <q-tooltip>Download PNG</q-tooltip>-->
<!--        </q-btn>-->
<!--      </q-card-section>-->
      <q-card-section>
        <v-chart
          ref="barRef"
          :option="option"
          :style="{height: `300px !important`, width: `100%`}"
          autoresize
          theme="light"
        />
      </q-card-section>
    </q-card>
  </div>
</template>


<script setup>
import {use} from 'echarts/core';
import {
  CalendarComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components';
import {HeatmapChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import VChart, {THEME_KEY} from 'vue-echarts';
import {provide, ref} from 'vue';

import {DateTime} from "luxon";

// https://echarts.apache.org/examples/en/editor.html?c=calendar-heatmap&random=kypnz0qfsr

use([
  CanvasRenderer,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  CalendarComponent,
  HeatmapChart
]);

provide(THEME_KEY, 'dark');

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartTitle: {
    type: String,
    required: true
  },

});
console.log("propsy")
console.log(props.chartData)

let arrayOfEntries = Object.entries(props.chartData).map(([key, value]) => [key, value]);
let keys = Object.keys(props.chartData);
const datesArray = keys.map((element) => new Date(element));

const maxDate = new DateTime(Math.max(...datesArray)); // Math.min

let endPeriod = DateTime.fromISO(maxDate).endOf('month').toFormat('yyyy-MM-dd')
let startPeriod = DateTime.fromISO(maxDate).startOf('month').minus({month: 2}).toFormat('yyyy-MM-dd')

console.log(startPeriod)
console.log(endPeriod)

const option = ref({
  title: {
    top: 30,
    left: 'center',
    text: props.chartTitle
  },
  tooltip: {},
  visualMap: {
    min: 0,
    max: 10,
    type: 'piecewise',
    orient: 'horizontal',
    left: 'center',
    top: 65
  },
  calendar: {
    top: 120,
    left: 25,
    right: 5,
    cellSize: ['auto', 20],
    range: [startPeriod, endPeriod],
    itemStyle: {
      borderWidth: 0.8
    },
    yearLabel: {show: false}
  },
  series: {
    type: 'heatmap',
    coordinateSystem: 'calendar',
    chartData: arrayOfEntries
  }
})
</script>

<style scoped>
.chart {
  height: 100vh;
}
</style>
