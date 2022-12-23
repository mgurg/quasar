<template>
  <!-- DOCS -->
  <q-card bordered class="my-card no-shadow q-my-xs" v-if="documentFiles.length>0">
    <div :style="expandedDocs ? 'border-left: 5px solid #f31060':''">
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedDocs = !expandedDocs">
            {{ $t("Documents") }}
            <q-badge floating align="top">{{ documentFiles.length }}</q-badge>
          </div>
          <q-space></q-space>
          <q-btn
            :label="$t('Edit')"
            class="q-mr-lg"
            color="primary"
            flat
            no-caps
          />
          <q-btn
            :icon="expandedDocs ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            color="grey"
            dense
            flat
            round
            @click="expandedDocs = !expandedDocs"
          />
        </div>

      </q-card-section>

      <q-slide-transition>
        <div v-show="expandedDocs">
          <q-card-section :class="$q.screen.lt.sm?'q-mx-xs q-px-xs':'q-mx-md q-px-md'">

            <!--            <q-item :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-11'" class=" rounded-borders">-->
            <!--              <q-item-section avatar>-->
            <!--                <span>&nbsp;</span>-->
            <!--              </q-item-section>-->
            <!--              <q-item-section>-->
            <!--                    <span>-->
            <!--                      {{ $t("Name") }}-->
            <!--                      <q-btn-->
            <!--                        :flat="sort.active!=='title'"-->
            <!--                        :icon="sort.title==='asc'? 'arrow_upward':'arrow_downward'"-->
            <!--                        :unelevated="sort.active==='title'"-->
            <!--                        color="primary"-->
            <!--                        padding="xs"-->
            <!--                        size="sm"-->
            <!--                        @click="changeSortOrder('title')"/>-->
            <!--                    </span>-->
            <!--              </q-item-section>-->

            <!--            </q-item>-->
            <div>
              <document-viewer :files-list="documentFiles"/>
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
import DocumentViewer from "components/viewer/DocumentViewer.vue";


const props = defineProps({
  documentFiles: {
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
  expandedDocs: {
    type: Boolean,
    default: false,
  },
})

const expandedDocs = ref(props.expandedDocs)
const itemUuid = ref(props.itemUuid)
const documentFiles = ref(props.documentFiles)
</script>
