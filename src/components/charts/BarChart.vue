<template>
  <div>
    <q-card :class="$q.dark.isActive?'bg-dark':''" class="no-shadow">
      <q-card-section class="text-h6">
        Bar Chart
        <q-btn class="float-right" dense flat icon="download">
          <q-tooltip>Download PNG</q-tooltip>
        </q-btn>
      </q-card-section>
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
});

const parseData = (rawObject, type) => {
  if (type == 'xAxis') {


    return Object.keys(rawObject)
  }
  if (type == 'yAxis') {
    return Object.values(rawObject)
  }
}

const result = parseData(props.data, 'xAxis');

console.log('xAxis: ' + result)

const xAxis = ['2023-02-20']
const yAxis = [1]
const option = ref({
  title: {
    text: 'Traffic Sources',
    left: 'center',
  },
  xAxis: {
    type: 'category',
    data: parseData(props.data, 'xAxis')
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: parseData(props.data, 'yAxis'),
    type: 'bar'
  }]
})
</script>

<style scoped>
.chart {
  height: 100vh;
}
</style>
