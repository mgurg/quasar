<template>
  <q-card bordered class="my-card no-shadow q-my-sm">
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedDescription = !expandedDescription">
          Opis
        </div>
        <q-space/>
        <q-btn :icon="expandedDescription ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
               color="grey"
               dense
               flat
               round
               @click="expandedDescription = !expandedDescription"/>
      </div>
    </q-card-section>

    <q-slide-transition>
      <div v-show="expandedDescription">
        <q-card-section>
          <div v-if="descriptionRawText!==''"
            :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-1', $q.screen.lt.sm?'q-py-md q-pl-sm':'q-py-lg q-pl-md'"
            class="rounded-borders">
            <tip-tap
              :body-content="descriptionContent"
              :readonly="true"
            />
          </div>
          <div v-else>
            Brak opisu
          </div>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script setup>
import {ref} from "vue";
import TipTap from 'src/components/editor/TipTap.vue'


const props = defineProps({
  textJson: {
    type: Object,
    default() {
      return null
    }
  },
  text: {
    type: String,
    default: "",
  },
  itemUuid: {
    type: String,
    default: null,
  },
  publicAccess: {
    type: Boolean,
    default: true,
  },
  expandedDescription: {
    type: Boolean,
    default: false,
  },
})

const expandedDescription = ref(props.expandedDescription)
const descriptionContent = ref(props.textJson)
const descriptionRawText = ref(props.text)
const publicAccess = ref(props.publicAccess)
</script>
