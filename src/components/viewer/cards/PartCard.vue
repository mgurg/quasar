<template>
  <!--  QR CODE -->
  <q-card bordered class="my-card no-shadow q-my-xs">
    <div :style="expandedSummary ? 'border-left: 5px solid #4c29bb':''">
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedSummary = !expandedSummary">
            Części
          </div>
          <q-space></q-space>
          <q-btn
            :label="$t('Add')"
            class="q-mr-lg"
            color="primary"
            flat
            no-caps
            @click="showUserDialog=true"
          />
          <q-btn :icon="expandedSummary ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat round
                 @click="expandedSummary = !expandedSummary"/>
        </div>

      </q-card-section>


      <q-slide-transition>
        <div v-show="expandedSummary">

          <q-card-section>

            Wymienione części

          </q-card-section>
        </div>
      </q-slide-transition>
    </div>
  </q-card>

  <q-dialog v-model="showUserDialog" :position="$q.platform.is.mobile ? 'top': 'standard'">
    <q-card :style="$q.platform.is.mobile ? 'width: 350px': 'width: 850px'">
      <q-card-section>
        <div class="text-h6">Wyszukaj użytkownika</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="row sm-gutter">
          <div class="q-pa-xs col-xs-12 col-sm-6">
            <q-input
              v-model="search"
              label="nazwa"
              clearable
              debounce="300"
              outlined
            />
          </div>
          <div class="q-pa-xs col-xs-12 col-sm-6">
            <q-input
              v-model="search"
              label="symbol"
              clearable
              debounce="300"
              outlined
            />
          </div>

        </div>
        <div class="row sm-gutter">
          <div class="q-pa-xs col-xs-6 col-sm-3">
            <q-input
              outlined
              label="cena"
            />
          </div>
          <div class="q-pa-xs col-xs-6 col-sm-3">
            <q-input
              outlined
              label="ilość"
            />
          </div>
          <div class="q-pa-xs col-xs-6 col-sm-3">
<!--            <q-input-->
<!--              outlined-->
<!--              label="jednostka"-->
<!--            />-->
            <q-select
              v-model="search"
              :options="options"
              label="jednostka"
              outlined />
          </div>
          <div class="q-pa-xs col-xs-6 col-sm-3">
            <q-input
              outlined
              label="wartość"
            />
          </div>
        </div>
<!--          <q-input-->
<!--            v-model="search"-->
<!--            label="opis"-->
<!--            clearable-->
<!--            debounce="300"-->
<!--            outlined/>-->



      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref} from "vue";

const showUserDialog = ref(false);
const search = ref(null);

const options = ref(['szt', 'l',])

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
