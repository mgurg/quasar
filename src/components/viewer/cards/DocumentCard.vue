<template>
  <q-card bordered class="my-card no-shadow q-my-xs">
    <div :style="expandedDocs ? 'border-left: 5px solid #f31060' : ''">
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="text-h6 text-weight-regular cursor-pointer" @click="toggleDocs">
            {{ $t("Documents") }}
            <q-badge v-if="documentFiles.length > 0" floating align="top">{{ documentFiles.length }}</q-badge>
          </div>
          <q-space/>
          <q-btn
            :icon="expandedDocs ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            color="grey"
            dense
            flato
            round
            @click="toggleDocs"
          />
        </div>
      </q-card-section>

      <q-slide-transition>
        <div v-show="expandedDocs">
          <q-card-section :class="$q.screen.lt.sm ? 'q-mx-xs q-px-xs' : 'q-mx-md q-px-md'">
            <document-viewer v-if="documentFiles.length > 0" :files-list="documentFiles"/>
            <div v-else>
              <q-icon color="grey" size="lg" name="do_disturb_alt"/>
            </div>
          </q-card-section>
          <q-separator/>
        </div>
      </q-slide-transition>
    </div>
  </q-card>
</template>

<script setup>
import {ref} from 'vue';
import DocumentViewer from 'components/viewer/DocumentViewer.vue';
import {useQuasar} from 'quasar';

const props = defineProps({
  documentFiles: {
    type: Array,
    default: () => [],
  },
  itemUuid: {
    type: String,
    default: null,
  },
  expandedDocs: {
    type: Boolean,
    default: false,
  },
});

const $q = useQuasar();
const expandedDocs = ref(props.expandedDocs);
const itemUuid = ref(props.itemUuid);
const documentFiles = ref(props.documentFiles);

const toggleDocs = () => {
  expandedDocs.value = !expandedDocs.value;
};
</script>
