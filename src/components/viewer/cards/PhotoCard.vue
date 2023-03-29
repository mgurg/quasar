<template>
  <!--        PHOTOS -->
  <q-card bordered class="my-card no-shadow q-my-xs">
    <div :style="expandedPhotos ? 'border-left: 5px solid #2d7df8':''">
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedPhotos = !expandedPhotos">
            {{ $t("Photos") }}
            <q-badge v-if="photoFiles.length>0" align="top" floating>{{ photoFiles.length }}</q-badge>
          </div>
          <q-space></q-space>
<!--          <q-btn-->
<!--            :label="$t('Edit')"-->
<!--            class="q-mr-lg"-->
<!--            color="primary"-->
<!--            flat-->
<!--            no-caps-->
<!--          />-->
          <q-btn
            :icon="expandedPhotos ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            color="grey"
            dense
            flat
            round
            @click="expandedPhotos = !expandedPhotos"
          />
        </div>

      </q-card-section>

      <q-slide-transition>
        <div v-show="expandedPhotos">

          <q-card-section :class="$q.screen.lt.sm?'q-mx-xs q-px-xs':'q-mx-md q-px-md'">
            <div class="q-mt-md">
              <photo-viewer :pictures-list="photoFiles"/>
              <div v-if="photoFiles.length === 0" >
                <q-icon color="grey" size="lg" name="no_photography" />
              </div>

            </div>
          </q-card-section>
          <q-separator/>
        </div>
      </q-slide-transition>
    </div>
  </q-card>
</template>

<script setup>
import {ref} from "vue";
import PhotoViewer from "components/viewer/PhotoViewer.vue";

const props = defineProps({
  photoFiles: {
    type: Object,
    default() {
      return {
        uuid: null,
        file_name: null,
        extension: null,
        mimetype: null,
        size: null,
        url: null,
      }
    }
  },
  itemUuid: {
    type: String,
    default: null,
  },
  expandedPhotos: {
    type: Boolean,
    default: false,
  },
})

const expandedPhotos = ref(props.expandedPhotos)
const itemUuid = ref(props.itemUuid)
const documentFiles = ref(props.documentFiles)
</script>
