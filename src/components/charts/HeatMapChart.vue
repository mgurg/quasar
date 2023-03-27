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
  data:Object,
  dateFrom :String,
  dateTo :String,
  chartTitle: {
    type: String,
    required: true
  },

});
console.log("propsy")
console.log(props.dateFrom)

let arrayOfEntries = ref(Object.entries(props.data).map(([key, value]) => [key, value]));

console.log(arrayOfEntries.value)

// let keys = Object.keys(props.data);
// const datesArray = keys.map((element) => new Date(element));

// const maxDate = new DateTime(Math.max(...datesArray)); // Math.min
// const minDate = new DateTime(Math.min(...datesArray));
//
// let endPeriod = DateTime.fromISO(maxDate).endOf('month').toFormat('yyyy-MM-dd')
// let startPeriod = DateTime.fromISO(minDate).startOf('month').toFormat('yyyy-MM-dd') // .minus({month: 2})

const startPeriod = ref(props.dateFrom)
const endPeriod = ref(props.dateTo)

console.log("startPeriod: " + startPeriod.value)
console.log("endPeriod: " + endPeriod.value)

const option = ref({
  // title: {
  //   top: 30,
  //   left: 'center',
  //   text: props.chartTitle
  // },
  tooltip: {},
  visualMap: {
    min: 0,
    max: 10,
    type: 'piecewise',
    orient: 'horizontal',
    left: 'center',
    top: 0
  },
  calendar: {
    top: 60,
    left: 25,
    right: 5,
    cellSize: ['auto', 20],
    range: [startPeriod.value, endPeriod.value],
    itemStyle: {
      borderWidth: 0.8
    },
    yearLabel: {show: false},
    monthLabel: {
      nameMap: ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAZ' , 'LIS', 'GRU'],
    },
    dayLabel: {
      firstDay: 1,
      nameMap: ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'],
      // nameMap: 'EN'
    }
  },
  series: {
    type: 'heatmap',
    coordinateSystem: 'calendar',
    data: arrayOfEntries.value
  }
})
</script>

<style scoped>
.chart {
  height: 100vh;
}
</style>
