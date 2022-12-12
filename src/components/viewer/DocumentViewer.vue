<template>
  <q-list v-for="(file, index) in files" v-if="files != null" v-bind:key="index" separator>
    <q-item>
      <q-item-section avatar>
        <q-avatar color="green" rounded text-color="white">F</q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ file.file_name }}</q-item-label>
        <q-item-label caption>Dodaj</q-item-label>
      </q-item-section>

      <q-item-section side>
        <div class="text-grey-8">
          <q-btn v-ripple class="gt-xs" clickable dense flat icon="download" round size="12px"
                 @click="downloadFile(file.uuid)"/>
        </div>
      </q-item-section>

    </q-item>
    <q-separator />
  </q-list>
</template>

<script setup>
import { ref } from "vue";


const props = defineProps({
  filesList: {
    type: Object,
    default() {
      return {
        uuid: null,
        file_name : null,
        extension: null,
        mimetype:null,
        size: null,
        url: null
      };
    },
  },
});

const files = ref(props.filesList)

console.log(JSON.stringify(props.filesList))


function downloadFile(uuid) {
  console.log("Downloading" + uuid)
}

</script>
