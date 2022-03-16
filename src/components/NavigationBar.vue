<template>
  <div class="row justify-center">
    <div class="q-pa-md q-gutter-sm row">
      <q-btn no-caps outline class="text-primary q-ma-xs" @click="$emit('today')">Today</q-btn>
      <q-btn no-caps outline class="text-primary q-ma-xs" @click="$emit('prev')">&lt; Prev</q-btn>
      <q-btn no-caps outline class="text-primary q-ma-xs" @click="$emit('next')">Next &gt;</q-btn>
    </div>
  </div>
</template>
