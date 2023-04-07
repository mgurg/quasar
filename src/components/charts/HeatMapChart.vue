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
          :key="currentPage"
        />
        <div class="row">
          <q-btn flat icon="navigate_before" @click="prev" :disable="isPrev()"/>
          <q-btn flat icon="navigate_next" @click="next" :disable="isNext()"/>
          <q-btn icon="event" :disable="true"></q-btn>
        </div>

        BTN: {{ minDate().toFormat("dd-MM-yyyy")}} DF: {{ earliestDate().toFormat("dd-MM-yyyy") }}  : {{ isPrev() }}  <br/>
        BTN: {{ maxDate().toFormat("dd-MM-yyyy")}} DF: {{ latestDate().toFormat("dd-MM-yyyy") }}  : {{ isNext() }} <br/>
        {{ segments() }}<br/>
        <hr />

      </q-card-section>
    </q-card>
  </div>
</template>


<script setup>
import {use} from 'echarts/core';
import {
  CalendarComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import {HeatmapChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import VChart, {THEME_KEY} from 'vue-echarts';
import {computed, provide, ref} from 'vue';
import {DateTime, Interval} from "luxon";


// https://echarts.apache.org/examples/en/editor.html?c=calendar-heatmap&random=kypnz0qfsr

use([
  CanvasRenderer,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent,
  CalendarComponent,
  HeatmapChart,
  DatasetComponent,
]);

provide(THEME_KEY, 'dark');

let barRef = ref(null);

const props = defineProps({
  data: Object,
  dateFrom: String,
  dateTo: String,
  chartTitle: {
    type: String,
    required: true
  },

});
console.log("propsy")
console.log(props.data)

let arrayOfEntries = ref(Object.entries(props.data).map(([key, value]) => [key, value]));

// arrayOfEntries.value = [["2023-03-09", 5], ["2023-02-11", 1], ["2023-01-12", 1], ["2022-12-17", 1], ["2022-10-23", 1]];

const totalPages = ref(0);
const currentPage = ref(0);

const prev = () => {
  currentPage.value = currentPage.value +1

  sss.value = "2023-01-01"

  option.value.calendar.range = [minDate().toFormat("yyyy-MM-dd"), maxDate().toFormat("yyyy-MM-dd")]
  console.log("prev")
}

function isPrev(){
  return minDate().startOf("month") <= earliestDate().startOf("month")
}
function isNext() {
  return maxDate().startOf("month") >= latestDate().startOf("month")
}
const next = () => {
  currentPage.value = currentPage.value -1
  option.value.calendar.range = [minDate().toFormat("yyyy-MM-dd"), maxDate().toFormat("yyyy-MM-dd")]
  console.log("next")
}

const earliestDate = () => {
  const dates = Object.keys(props.data); // pobranie tablicy kluczy (czyli dat) z obiektu
  let jsDate = new Date(Math.min(...dates.map(date => new Date(date))));
  return DateTime.fromJSDate(jsDate);
}

const latestDate = () => {
  const dates = Object.keys(props.data); // pobranie tablicy kluczy (czyli dat) z obiektu
  let jsDate = new Date(Math.max(...dates.map(date => new Date(date))));
  return DateTime.fromJSDate(jsDate);
}

const minDate= () =>{
  let d = DateTime.fromISO(latestDate()).minus({months: currentPage.value + 2})
  return d
}

const maxDate = () =>{
  let d = DateTime.fromISO(latestDate()).minus({months: currentPage.value})
  return d
}

const segments = () => {
  const diff = Interval.fromDateTimes(DateTime.fromISO(earliestDate()), DateTime.fromISO(latestDate()));
  return Math.ceil(diff.length('months'));
}

//
//
console.log("E " + earliestDate(props.data).startOf('month').toFormat('yyyy-MM-dd'));
console.log("L " + latestDate(props.data).endOf('month').toFormat('yyyy-MM-dd'));
console.log(segments())

const filteredData = arrayOfEntries.value.filter(([date, count]) => {
  const d = new Date(date);
  return d.getFullYear() === 2023 && d.getMonth() === 2; // 2 oznacza marzec, ponieważ w JavaScript indeksy miesięcy zaczynają się od zera
  // return d.getFullYear() === 2023 // 2 oznacza marzec, ponieważ w JavaScript indeksy miesięcy zaczynają się od zera
});
console.log(arrayOfEntries.value)
// console.log(filteredData)

// let keys = Object.keys(props.data);
// const datesArray = keys.map((element) => new Date(element));

// const maxDate = new DateTime(Math.max(...datesArray)); // Math.min
// const minDate = new DateTime(Math.min(...datesArray));
//
// let endPeriod = DateTime.fromISO(maxDate).endOf('month').toFormat('yyyy-MM-dd')
// let startPeriod = DateTime.fromISO(minDate).startOf('month').toFormat('yyyy-MM-dd') // .minus({month: 2})

const startPeriod = ref(props.dateFrom)
const endPeriod = ref(props.dateTo)


const sss = ref("2023-02-01")

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
    range: [minDate().toFormat("yyyy-MM-dd"), maxDate().toFormat("yyyy-MM-dd")],
    // range: [sss.value, "2023-04-01"],
    itemStyle: {
      borderWidth: 0.8
    },
    yearLabel: {show: false},
    monthLabel: {
      nameMap: ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAZ', 'LIS', 'GRU'],
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
    data: arrayOfEntries
  }
})
</script>

<style scoped>
.chart {
  height: 100vh;
}
</style>
