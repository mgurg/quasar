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
  data: Object,
});

const option = ref({
  title: {
    top: 30,
    left: 'center',
    text: 'Daily Step Count'
  },
  tooltip: {},
  visualMap: {
    min: 0,
    max: 10000,
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
    range: ['2016-01-01', '2016-03-23'],
    itemStyle: {
      borderWidth: 0.8
    },
    yearLabel: {show: false}
  },
  series: {
    type: 'heatmap',
    coordinateSystem: 'calendar',
    data: [["2016-01-01", 2187], ["2016-01-02", 3505],]
  }
})
</script>

<style scoped>
.chart {
  height: 100vh;
}
</style>
