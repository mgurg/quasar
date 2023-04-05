<template>
  <div class="monthpicker">
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
        no-caps
        dense
        no-outline
        no-ripple
        rounded
        @click="selectMonth(month)"
      />
    </div>
    <!--    <q-separator/>-->
    <!--    <div class="row q-pt-sm">-->
    <!--      <q-btn flat no-caps>rok</q-btn>-->
    <!--    </div>-->
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'

const emit = defineEmits(['input'])

// const path = computed(() => route.path)

const displayedMonths = computed(() => {
  let months = []

  for (let i = 0; i < 12; i++) {
    months.push(new Date(2023, i))
  }

  return months
})

const selectMonth = (month) => {
  console.log("emit " + month.getTime());
  emit('input', month)

  selectedMonth.value = new Date(month)


}

const selectedMonth = ref(new Date(2023, 4));

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

  console.log("isSelectedMonth")
  if (selectedMonth.value.getTime() === month.getTime()) {
    console.log(selectedMonth.value.getTime() + "|" + month.getTime())
  }


  return selectedMonth.value ? (selectedMonth.value.getTime() === month.getTime()) : false
}


function currentMonth() {
  return cleanDate()
}

function isCurrentMonth(month) {
  return true;
  // return currentMonth().getTime() === month.getTime()
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

</script>

<style>

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

</style>
