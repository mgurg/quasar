<template>

  <q-form autocapitalize="off" autocomplete="off" autocorrect="off" class="q-gutter-md" spellcheck="false"
          @submit.prevent>

    <q-input
      v-model="itemName"
      :disable="isLoading"
      :error="!!errors.itemName"
      :error-message="errors.itemName"
      :label="$t('Item title')" outlined
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
        @click="submit()"
      />

    </div>
  </q-form>

  <p>Uploaded Files</p>
  <p>{{ uploadedFiles }}</p>
  <p>Uploaded Photos</p>
  <p>{{ uploadedPhotos }}</p>
  <p>Uploaded All</p>
  <p>{{ uploadedAll }}</p>

</template>

<script setup>
import {ref} from "vue";
import {useField, useForm} from "vee-validate";
import * as yup from 'yup';
import {useRouter} from "vue-router";

import {createItemRequest} from 'src/components/api/ItemApiClient'
import {errorHandler} from 'src/components/api/errorHandler.js'


import TipTapBasic from 'src/components/editor/TipTapBasic.vue'
import PhotoUploader from 'src/components/uploader/PhotoUploader.vue'
import FileUploader from 'src/components/uploader/FileUploader.vue'

const router = useRouter();


const props = defineProps({
  item: {
    type: Object,
    // Object or array defaults must be returned from
    // a factory function
    default() {
      return {
        uuid: null,
        title: '',
        description: '',
        color: 'red',
        user: null,
        body_json: null,
        files_item: null
      }
    }
  },
  token: {
    type: String,
    default: null,
  },
  tenant_id: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['itemFormBtnClick', 'cancelBtnClick'])

let isError = ref(false);
let isLoading = ref(false);
let attachments = ref(props.item.files_item);

let jsonTxt = null;
let htmlTxt = null;

function logText(json, html) {
  jsonTxt = json
  htmlTxt = html
}

const tipTapText = ref(null)

if (props.item.body_json !== null) {
  tipTapText.value = props.item.body_json;
}

// ALL

const uploadedAll = ref([]);

// IMG

const uploadedPhotos = ref([]);

function listOfUploadedImages(images) {
  console.log("UPLOADED IMAGES:")
  console.log(JSON.stringify(images))
  uploadedPhotos.value = images;
  uploadedAll.value = [...uploadedPhotos.value, ...uploadedFiles.value];
}

// Files
const uploadedFiles = ref([]);

function listOfUploadedFiles(files) {
  console.log("UPLOADED IMAGES:")
  console.log(JSON.stringify(files))
  uploadedFiles.value = files;
  uploadedAll.value = [...uploadedPhotos.value, ...uploadedFiles.value];
}



// Form

const {handleReset} = useForm();

const validationSchema = yup.object({
  itemColor: yup.string().required(),
  itemName: yup.string(),//.required(),
  itemDescription: yup.string(), //.required('A cool description is required').min(3),
  email: yup.string().nullable().test(
    "check-startdate",
    "Start Date should not be later than current date",
    function (value) {
      if (value == "1") {
        return false;
      } else {
        return true;
      }
    }
  )
})


const {handleSubmit, errors} = useForm({
  validationSchema
})

const {value: itemName} = useField('itemName', undefined, {initialValue: props.item.title})
const {value: itemDescription} = useField('itemDescription', undefined, {initialValue: props.item.description})
const {value: itemColor} = useField('itemColor', undefined, {initialValue: props.item.color})
const {value: email} = useField('email')

function cancelButtonHandle() {
  emit('cancelBtnClick')
}

const submit = handleSubmit(values => {
  let data = {
    "name": itemName.value,
    "description": "Opis",
    "description_jsonb": jsonTxt,
    "qr_code": "string",
    "body_json": jsonTxt,
    "body_html": htmlTxt,
    "files": uploadedAll.value.map(a => a.uuid)
  }

  console.log(data)
  emit('itemFormBtnClick', data)

  // isLoading.value = true;
  //
  // isLoading.value = false;
  // router.push("/items");
  //
  // createItemRequest(data).then(function (response) {
  //   console.log(response)
  //   isLoading.value = false;
  //   router.push("/items");
  // }).catch((err) => {
  //   const errorMessage = errorHandler(err);
  // });

})

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

// .tiptap:hover {
//   transition: 0.5s;
//   border: 1px solid #000000 !important;
// }
</style>
