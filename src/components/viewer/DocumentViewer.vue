<template>
  <q-list v-for="(file, index) in files" v-if="files != null" v-bind:key="index" separator>
    <q-item>
      <q-item-section avatar>
        <q-avatar rounded>
          <img :src="getIcon('.pdf')" alt="file icon">
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ file.file_name }}</q-item-label>
        <q-item-label caption>{{ prettyBytes(file.size) }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-btn
          v-ripple
          clickable
          dense
          flat
          icon="download"
          round
          size="12px"
          type="a"
          :download="file.file_name"
          :href="file.url"
        />
      </q-item-section>

    </q-item>
    <q-separator/>
  </q-list>
</template>

<script setup>
import {ref} from "vue";


const props = defineProps({
  filesList: {
    type: Object,
    default() {
      return {
        uuid: null,
        file_name: null,
        extension: null,
        mimetype: null,
        size: null,
        url: null
      };
    },
  },
});

const files = ref(props.filesList)

// console.log(JSON.stringify(props.filesList))

const prettyBytes = (num, precision = 3, addSpace = true) => {
  const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  if (Math.abs(num) < 1) return num + (addSpace ? ' ' : '') + UNITS[0];
  const exponent = Math.min(Math.floor(Math.log10(num < 0 ? -num : num) / 3), UNITS.length - 1);
  const n = Number(((num < 0 ? -num : num) / 1000 ** exponent).toPrecision(precision));
  return (num < 0 ? '-' : '') + n + (addSpace ? ' ' : '') + UNITS[exponent];
};

function downloadFile(uuid) {
  console.log("Downloading" + uuid)
}

function getIcon(extension) {

  // SOURCE: https://cpe-patterns.netlify.app/patterns/identity/icons.html
  switch (extension) {
    case '.pdf':
      return "./fileIcons/pdf-o.svg";
    case '.doc':
    case '.docx':
      return "./fileIcons/word-o.svg";
    case '.xls':
    case '.xlsx':
      return "./fileIcons/excel-o.svg";
    case '.ppt':
    case '.pptx':
      return "./fileIcons/excel-o.svg";
    default:
      console.log(`Sorry, we are out of ${extension}.`);
  }


  return "~assets/fileIcons/pdf-o.svg";
}

</script>
