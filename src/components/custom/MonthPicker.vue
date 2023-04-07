<template>
<!--  BASED ON: https://github.com/louisameline/quasar-monthpicker/blob/master/src/MonthPicker.vue -->
  <div class="bg-primary" style="min-width: 300px; width: 300px">
    <div class="q-pa-md example-row-equal-width">

      <div class="row">
        <div class="col text-subtitle1 text-weight-medium text-light-blue-6">
          From:
        </div>
        <div class="col-9 text-subtitle1 text-weight-medium text-light-blue-1">
          {{ periodFrom().toFormat('yyyy-MM-dd') }}
        </div>
      </div>

      <div class="row">
        <div class="col text-subtitle1 text-weight-medium text-light-blue-6">
          To:
        </div>
        <div class="col-9 text-subtitle1 text-weight-medium text-light-blue-1">
          {{ periodTo().toFormat('yyyy-MM-dd') }}
        </div>
      </div>

    </div>
  </div>
  <div class="q-pa-sm">
    <div class="q-py-md">
      <div class="q-gutter-sm ">
        <input id="last" v-model="timePeriod" type="radio" value="last"/>&nbsp;
        <label for="last">Ostatni</label>
        <input id="current" v-model="timePeriod" type="radio" value="current"/>&nbsp;
        <label for="current">Obecny</label>
        <input id="prev" v-model="timePeriod" type="radio" value="prev"/>&nbsp;&nbsp;
        <label for="prev">Poprzedni</label>
        <input id="own" v-model="timePeriod" type="radio" value="own"/>&nbsp;&nbsp;
        <label for="own">Własny</label>
      </div>
    </div>

    <div class="q-py-sm"  v-if="timePeriod !=='own'">
      <div class="q-gutter-sm">
        <input id="day" v-model="timeUnit" type="radio" value="D"/>&nbsp;&nbsp;
        <label for="day">Dzień</label>
        <input id="week" v-model="timeUnit" type="radio" value="W"/>&nbsp;&nbsp;
        <label for="week">Tydzień</label>
        <input id="month" v-model="timeUnit" type="radio" value="M"/>&nbsp;&nbsp;
        <label for="month">Miesiąc</label>
        <input id="year" v-model="timeUnit" type="radio" value="Y"/>&nbsp;&nbsp;
        <label for="year">Rok</label>
      </div>
    </div>
    <div v-if="timePeriod ==='own'" class="monthpicker">
      <div class="monthpicker-header">
        <q-btn
          dense
          flat
          icon="navigate_before"
          round
          @click="changeYear(false)"
        />
        {{ selectedMonth.getFullYear() }}
        <q-btn
          dense
          flat
          icon="navigate_next"
          round
          @click="changeYear(true)"
        />
      </div>
      <div class="monthpicker-months">
        <q-btn
          v-for="month in displayedMonths"
          :key="month.getTime()"
          :class="{ 'monthpicker-current': isCurrentMonth(month) }"
          :color="isSelectedMonth(month) ? color : ''"
          :disable="isDisabled(month)"
          :flat="!isSelectedMonth(month)"
          :label="month.toLocaleDateString(localeArray, {
                month: 'short',
              })"
          :text-color="isCurrentMonth(month) && !isSelectedMonth(month) ? color : ''"
          dense
          no-caps
          no-outline
          no-ripple
          rounded
          @click="selectMonth(month)"
        />
      </div>

    </div>
    <q-separator/>
    <div class="row q-pt-md">
      <q-space/>
      <q-btn
        v-close-popup
        :label="$t('Cancel')"
        class="q-mr-lg"
        color="red-12"
        flat
        icon="cancel"
      />
      <q-btn
        v-close-popup
        :label="$t('Save')"
        class="q-mr-xs"
        color="primary"
        icon="done"
        type="submit"
        @click="submit"
      />
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {DateTime} from "luxon";

const emit = defineEmits(['dateRange'])

const timeUnit = ref('M');
const timePeriod = ref('last');

const selectedMonth = ref(new Date(2023, 4));

const periodFrom = (date = null) => {
  if (timePeriod.value === "own") {
    return DateTime.fromJSDate(selectedMonth.value).setZone('UTC').plus({months: 1}).startOf('month')
  }
  let luxDate = DateTime.now().setZone('UTC')

  if (timeUnit.value === "Y") {
    luxDate = luxDate.startOf('year')
    if (timePeriod.value === "prev" || timePeriod.value === "last") {
      luxDate = luxDate.minus({years: 1})
    }
  }
  if (timeUnit.value === "M") {
    luxDate = luxDate.startOf('month')
    if (timePeriod.value === "prev" || timePeriod.value === "last") {
      luxDate = luxDate.minus({months: 1})
    }
  }

  if (timeUnit.value === "W") {
    luxDate = luxDate.startOf('week')
    if (timePeriod.value === "prev" || timePeriod.value === "last") {
      luxDate = luxDate.minus({weeks: 1})
    }
  }
  if (timeUnit.value === "D") {
    luxDate = luxDate.startOf('day')
    if (timePeriod.value === "prev" || timePeriod.value === "last") {
      luxDate = luxDate.minus({days: 1})
    }
  }


  return luxDate;
}

const periodTo = () => {
  if (timePeriod.value === "own") {
    return DateTime.fromJSDate(selectedMonth.value).setZone('UTC').plus({months: 1}).endOf('month')
  }

  let luxDate = DateTime.now().setZone('UTC')

  if (timeUnit.value === "Y" && timePeriod.value === "prev") {
    luxDate = DateTime.now().setZone('UTC').minus({years: 1}).endOf('year')
  }

  if (timeUnit.value === "M" && timePeriod.value === "prev") {
    luxDate = DateTime.now().setZone('UTC').minus({months: 1}).endOf('month')
  }

  if (timeUnit.value === "W" && timePeriod.value === "prev") {
    luxDate = DateTime.now().setZone('UTC').minus({weeks: 1}).endOf('week')
  }

  if (timeUnit.value === "D" && timePeriod.value === "prev") {
    luxDate = DateTime.now().setZone('UTC').minus({days: 1}).endOf('day')
  }

  return luxDate;
}

// const path = computed(() => route.path)

const displayedMonths = computed(() => {
  let months = []

  for (let i = 0; i < 12; i++) {
    months.push(new Date(selectedMonth.value.getFullYear(), i))
  }

  return months
})

const selectMonth = (month) => {
  let year = selectedMonth.value.getFullYear()
  selectedMonth.value = new Date(year, month.getMonth())

  periodFrom(1)
  periodTo(1)
  // console.log(selectedMonth.value.getTime() + "|" + month.getTime())
}

function cleanDate(date) {
  let d = date ? new Date(date) : new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

function changeYear(up) {

  if (up) {
    let d = new Date(selectedMonth.value.getFullYear(), selectedMonth.value.getMonth())

    // console.log(d);
    d.setMonth(d.getMonth() + 12)

    // console.log(d);
    //
    // if (maxClean() && d > maxClean()) {
    //   d = maxClean()
    // }

    selectedMonth.value = new Date(d.getFullYear(), d.getMonth())
  } else {

    let d = new Date(selectedMonth.value.getFullYear(), selectedMonth.value.getMonth())
    d.setMonth(d.getMonth() - 12)
    selectedMonth.value = new Date(d.getFullYear(), d.getMonth())

    // let d = new Date(this.selectedMonth)
    // d.setMonth(d.getMonth() - 12)
    //
    // if (minClean() && d < minClean()) {
    //   d = minClean()
    // }
    //
    // selectMonth.value = d
  }
}


const color = ref('primary');
const locale = ref(null);
const max = ref(null);
const min = ref(null);
const value = ref(null);

function localeArray() {
  return this.locale ? [this.locale] : []
}

function maxClean() {
  return max.value ? cleanDate(max.value) : null
}

function minClean() {
  return min.value ? cleanDate(min.value) : null
}

function isSelectedMonth(month) {

  // console.log("isSelectedMonth")
  // if (selectedMonth.value.getTime() === month.getTime()) {
  // console.log(selectedMonth.value.getTime() + "|" + month.getTime())
  // }


  return selectedMonth.value ? (selectedMonth.value.getTime() === month.getTime()) : false
}


function currentMonth() {
  return cleanDate()
}

function isCurrentMonth(month) {
  // return true;
  return currentMonth().getTime() === month.getTime()
}

function isDisabled(month) {

  let disabled = false

  // if (	(this.minClean && month < this.minClean)
  //   ||	(this.maxClean && month > this.maxClean)
  // ) {
  //   disabled = true
  // }

  return disabled
}

function submit() {
  console.log("Emit")
  emit('dateRange', {from: periodFrom(), to: periodTo()})
}

</script>

<style lang="scss" scoped>

.monthpicker {
  width: 250px;
}

.monthpicker-current {
  font-weight: bold;
}

.monthpicker-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.monthpicker-months {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.monthpicker-months .q-btn {
  box-shadow: none;
  margin: 4px 0;
  width: 30%;
}


input[type="radio"] {
  display: none;
}

input[type="radio"] {
  display: none;
}

input[type="radio"] + label {
  color: #ccc;
  cursor: pointer;
}

input[type="radio"]:checked + label {
  color: #333;
  font-weight: bold;
}

</style>
