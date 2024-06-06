<template>
  <q-form
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    class="q-gutter-md"
    spellcheck="false"
    @submit.prevent
  >
    <q-input
      v-model="itemName"
      :disable="isLoading"
      :error="!!errors.itemName"
      :error-message="errors.itemName"
      :label="$t('Item title')"
      outlined
      maxlength="512"
    />

    <q-input
      v-model="itemSymbol"
      :disable="isLoading"
      :error="!!errors.itemSymbol"
      :error-message="errors.itemSymbol"
      label="Symbol"
      outlined
      maxlength="32"
    />

    <div class="tiptap">
      <tip-tap-basic :body-content="tipTapText" @editor-content="logText"/>
    </div>

    <div>
      <photo-uploader :file-list="props.item.files_item" @uploaded-photos="listOfUploadedImages"/>
    </div>

    <div>
      <file-uploader :file-list="props.item.files_item" @uploaded-files="listOfUploadedFiles"/>
    </div>

    <div class="row">
      <q-space/>
      <q-btn
        :label="$t('Cancel')"
        class="q-mr-lg"
        color="red-12"
        flat
        icon="cancel"
        type="submit"
        @click="cancelButtonHandle"
      />
      <q-btn
        :label="$t('Save')"
        class="q-mr-xs"
        color="primary"
        icon="done"
        type="submit"
        @click="submit"
      />
    </div>
  </q-form>
</template>

<script setup>
import {ref} from 'vue';
import {useField, useForm} from 'vee-validate';
import * as yup from 'yup';
import {useRouter} from 'vue-router';

import TipTapBasic from 'components/editor/TipTapBasic.vue';
import PhotoUploader from 'components/uploader/PhotoUploader.vue';
import FileUploader from 'components/uploader/FileUploader.vue';

const router = useRouter();

const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      uuid: null,
      name: '',
      text: '',
      color: 'red',
      user: null,
      text_json: null,
      files_item: null,
    }),
  },
  token: {
    type: String,
    default: null,
  },
  tenant_id: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['itemFormBtnClick', 'cancelBtnClick']);

const isLoading = ref(false);
const attachments = ref(props.item.files_item);
const tipTapText = ref(props.item.text_json || null);
const uploadedPhotos = ref([]);
const uploadedFiles = ref([]);
const uploadedAll = ref([]);

const {handleSubmit, handleReset, errors} = useForm({
  validationSchema: yup.object({
    itemName: yup.string().required().max(512),
    itemSymbol: yup.string().max(64).nullable(),
  }),
});

const {value: itemName} = useField('itemName', undefined, {initialValue: props.item.name});
const {value: itemSymbol} = useField('itemSymbol', undefined, {initialValue: props.item.symbol});

let jsonTxt = null;
let htmlTxt = null;

function logText(json, html) {
  jsonTxt = json;
  htmlTxt = html;
}

function listOfUploadedImages(images) {
  uploadedPhotos.value = images;
  updateUploadedAll();
}

function listOfUploadedFiles(files) {
  uploadedFiles.value = files;
  updateUploadedAll();
}

function updateUploadedAll() {
  uploadedAll.value = [...uploadedPhotos.value, ...uploadedFiles.value];
}

function cancelButtonHandle() {
  emit('cancelBtnClick');
}

const submit = handleSubmit(values => {
  const data = {
    name: itemName.value,
    symbol: itemSymbol.value,
    summary: "Some public summary",
    text_html: htmlTxt,
    text_json: jsonTxt,
    files: uploadedAll.value.map(a => a.uuid),
  };

  emit('itemFormBtnClick', data);
});
</script>

<style lang="scss" scoped>
.tiptap {
  border: 1px solid #c2c2c2;
  border-radius: 5px;
  padding-left: 5px;
}

.tiptap:focus-within {
  transition: 0.1s;
  border: 2px solid #1976d2 !important;
}
</style>
