<template>
  <div v-if="files.length">
    <q-list v-for="(file, index) in files" :key="index" separator>
      <q-item>
        <q-item-section avatar>
          <q-avatar rounded>
            <img :src="getIcon(file.extension)" alt="file icon"/>
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
            :download="file.file_name"
            :href="file.url"
          />
        </q-item-section>
      </q-item>
      <q-separator/>
    </q-list>
  </div>
</template>

<script setup>
import {ref} from 'vue';

const props = defineProps({
  filesList: {
    type: Array,
    default: () => [],
  },
});

const files = ref(props.filesList);

const prettyBytes = (num, precision = 3, addSpace = true) => {
  const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  if (Math.abs(num) < 1) return num + (addSpace ? ' ' : '') + UNITS[0];
  const exponent = Math.min(Math.floor(Math.log10(Math.abs(num)) / 3), UNITS.length - 1);
  const n = Number((Math.abs(num) / 1000 ** exponent).toPrecision(precision));
  return (num < 0 ? '-' : '') + n + (addSpace ? ' ' : '') + UNITS[exponent];
};

const getIcon = (extension) => {
  switch (extension) {
    case '.pdf':
      return '/public/fileIcons/pdf-o.svg';
    case '.doc':
    case '.docx':
      return '/public/fileIcons/word-o.svg';
    case '.xls':
    case '.xlsx':
      return '/public/fileIcons/excel-o.svg';
    case '.ppt':
    case '.pptx':
      return '/public/fileIcons/powerpoint-o.svg';
    default:
      return '/public/fileIcons/text-o.svg';
  }
};
</script>
