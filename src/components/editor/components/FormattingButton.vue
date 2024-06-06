<template>
  <q-btn
    flat
    @click="click"
    :disabled="disabled"
    :class="buttonClass"
    :icon="icon"
    :label="label"
  />
</template>

<script setup>
import {computed, defineProps} from 'vue';

const props = defineProps({
  click: Function,
  disabled: Boolean,
  isActive: Boolean,
  icon: String,
  label: String,
});

const buttonClass = computed(() => ({
  'shadow-1': props.isActive,
}));
</script>
