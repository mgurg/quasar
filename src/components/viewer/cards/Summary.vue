<template>
  <!--  QR CODE -->
  <q-card bordered class="my-card no-shadow q-my-xs">
    <div :style="expandedSummary ? 'border-left: 5px solid #4c29bb':''">
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedSummary = !expandedSummary">
            Podsumowanie
          </div>
          <q-space></q-space>
          <q-btn :icon="expandedSummary ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat round
                 @click="expandedSummary = !expandedSummary"/>
        </div>

      </q-card-section>


      <q-slide-transition>
        <div v-show="expandedSummary">

          <q-card-section>

          AAAA

          </q-card-section>
        </div>
      </q-slide-transition>
    </div>
  </q-card>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps({
  qrCode: {
    type: Object,
    default() {
      return {
        ecc: null,
        qr_code_full_id: null,
        resource: null,
      }
    }
  },
  expandedSummary: {
    type: Boolean,
    default: false,
  },
})

const expandedSummary = ref(props.expandedSummary)
</script>
