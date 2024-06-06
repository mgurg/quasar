<template>
  <svg height="20" width="20" viewBox="0 0 20 20" class="character-count__graph">
    <circle r="10" cx="10" cy="10" fill="#e9ecef" />
    <circle
      r="5"
      cx="10"
      cy="10"
      fill="transparent"
      stroke="currentColor"
      stroke-width="10"
      :stroke-dasharray="`calc(${percentage} * 31.4 / 100) 31.4`"
      transform="rotate(-90) translate(-20)"
    />
    <circle r="6" cx="10" cy="10" fill="white" />
  </svg>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  percentage: Number,
});
</script>

<style scoped>
.character-count__graph {
  margin-right: 0.5rem;
}
</style>
