<template>
  <div>
    <q-card :class="$q.dark.isActive?'bg-dark':''" class="no-shadow">
      <!--      <q-card-section class="text-h6">-->
      <!--        <q-btn class="float-right" dense flat icon="download">-->
      <!--          <q-tooltip>Download PNG</q-tooltip>-->
      <!--        </q-btn>-->
      <!--      </q-card-section>-->
      <q-card-section>
        <v-chart
          ref="barRef"
          :option="option"
          :style="{height: `300px !important`, width: `100% !important`}"
          autoresize
          theme="light"
        />
      </q-card-section>
    </q-card>
  </div>
</template>


<script setup>
import {use} from 'echarts/core';
import {GridComponent, LegendComponent, TitleComponent, TooltipComponent, DatasetComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import {BarChart} from 'echarts/charts';
import VChart, {THEME_KEY} from 'vue-echarts';
import {provide, ref} from 'vue';

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent
]);

provide(THEME_KEY, 'dark');

const props = defineProps({
  data: Object,
  chartTitle: {
    type: String,
    required: true
  }
});

// console.log(props.data)
const parseData = (rawObject, type) => {
  if (type == 'xAxis') {
    return Object.keys(rawObject)
  }
  if (type == 'yAxis') {
    return Object.values(rawObject)
  }
}

const result = parseData(props.data, 'xAxis');

let dataset = [
  ["00", 0], ["01", 0], ["02", 0], ["03", 0], ["04", 0], ["05", 0], ["06", 0], ["07", 0], ["08", 0], ["09", 0],
  ["10", 0], ["11", 0], ["12", 5], ["13", 0], ["14", 1], ["15", 0], ["16", 1], ["17", 1], ["18", 2], ["19", 0],
  ["20", 0], ["21", 0], ["22", 0], ["23", 0]
]


// const obj = { "10": 0, "11": 0, "12": 5, "13": 0, "14": 1, "15": 0, "16": 1, "17": 1, "18": 2, "19": 0, "20": 0, "21": 0, "22": 0, "23": 0, "00": 0, "01": 0, "02": 0, "03": 0, "04": 0, "05": 0, "06": 0, "07": 0, "08": 0, "09": 0 };
//
// const arr = Object.entries(obj); // Convert object to array of key-value pairs
// arr.sort(([a], [b]) => parseInt(a) - parseInt(b)); // Sort the array by key
//
// console.log(arr); // Output sorted array of key-value pairs


// const option = ref({
//   xAxis: {
//     type: 'category',
//     data: parseData(props.data, 'xAxis')
//   },
//   yAxis: {
//     type: 'value'
//   },
//   series: [{
//     data: parseData(props.data, 'yAxis'),
//     type: 'bar',
//   }],
//   legend: {
//     orient: 'vertical',
//     right: 10,
//     top: 'center'
//   },
// })


const option = ref(
  {
    legend: {},
    tooltip: {},
    dataset: {
      // Here the declared `dimensions` is mainly for providing the order of
      // the dimensions, which enables ECharts to apply the default mapping
      // from dimensions to axes.
      // Alternatively, we can declare `series.encode` to specify the mapping,
      // which will be introduced later.
      dimensions: ['product', '2015', '2016', '2017'],
      source: [
        ["00", 0], ["01", 0], ["02", 0], ["03", 0], ["04", 0], ["05", 0], ["06", 0], ["07", 0], ["08", 0], ["09", 0],
        ["10", 0], ["11", 0], ["12", 5], ["13", 0], ["14", 1], ["15", 0], ["16", 1], ["17", 1], ["18", 2], ["19", 0],
        ["20", 0], ["21", 0], ["22", 0], ["23", 0]
      ]
    },
    xAxis: {type: 'category'},
    yAxis: {},
    series: [
      {type: 'bar'},
    ]
  }
)

</script>

<!-- https://apache.github.io/echarts-handbook/en/concepts/legend -->
<style scoped>
.chart {
  height: 100vh;
}
</style>
