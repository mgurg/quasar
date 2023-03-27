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
import {GridComponent, LegendComponent, TitleComponent, TooltipComponent} from 'echarts/components';
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


const option = ref({
  xAxis: {
    type: 'category',
    data: parseData(props.data, 'xAxis')
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: parseData(props.data, 'yAxis'),
    type: 'bar',
  }],
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center'
  },
})


// const option = ref({
//   legend: {
//     // Try 'horizontal'
//     orient: 'vertical',
//     right: 10,
//     top: 'center'
//   },
//   dataset: {
//     source: [
//       ['product', '2015', '2016', '2017'],
//       ['Matcha Latte', 43.3, 85.8, 93.7],
//       ['Milk Tea', 83.1, 73.4, 55.1],
//       ['Cheese Cocoa', 86.4, 65.2, 82.5],
//       ['Walnut Brownie', 72.4, 53.9, 39.1]
//     ]
//   },
//   xAxis: { type: 'category' },
//   yAxis: {},
//   series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
// })

</script>

<!-- https://apache.github.io/echarts-handbook/en/concepts/legend -->
<style scoped>
.chart {
  height: 100vh;
}
</style>
