<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
    <q-toggle v-model="store.counter" />
  </q-page>
</template>



<script>
import { computed } from 'vue'
import { useCounterStore } from 'stores/counter'

export default {
  setup () {
    const store = useCounterStore()

    return {
      // you can return the whole store instance to use it in the template
      store
    }
  }
}
</script>