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
      v-model="guideName"
      :disable="isLoading"
      :error="!!errors.guideName"
      :error-message="errors.guideName"
      :label="$t('Guide name')"
      outlined
    />

    <div class="tiptap">
      <tip-tap-guide :body-content="tipTapText" @editor-content="logText"/>
    </div>
    <div>
      <movie-uploader :video-id="props.guide.video_id" @uploaded-video-id="keepVideoId"/>
    </div>
    <div>
      <photo-uploader :file-list="props.guide.files_guide" @uploaded-photos="listOfUploadedImages"/>
    </div>
    <br/>

    <div class="row">
      <q-space/>
      <q-btn
        :label="$t('Cancel')"
        class="q-mr-lg"
        color="red-12"
        flat
        icon="cancel"
        type="submit"
        @click="cancelButtonHandle()"
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
</template>

<script setup>
import {ref} from "vue";
import {useField, useForm} from "vee-validate";
import * as yup from 'yup';
import {useRouter} from "vue-router";

import TipTapGuide from 'components/editor/TipTapBasic.vue'
import MovieUploader from 'src/components/uploader/MovieUploader.vue'
import PhotoUploader from 'src/components/uploader/PhotoUploader.vue'

const router = useRouter();

const props = defineProps({
  guide: {
    type: Object,
    default() {
      return {
        uuid: null,
        name: '',
        text: '',
        text_json: null,
        video_id: null,
        video_json: null,
        files_guide: null
      }
    }
  },
  buttonText: {
    type: String,
    default: 'Save',
  },
})

const emit = defineEmits(['guideFormBtnClick', 'cancelBtnClick'])

let isError = ref(false);
let isLoading = ref(false);
let attachments = ref([]);


const files = ref(null);

let jsonTxt = null;
let htmlTxt = null;

function logText(json, html) {

  console.log(json)
  jsonTxt = json
  htmlTxt = html
}

const tipTapText = ref(null);

const uploadedVideoId = ref(null)
const uploadedVideoMetadata = ref(null)
const uploadedPhotos = ref([]);

function listOfUploadedImages(images) {
  console.log("UPLOADED IMAGES:")
  console.log(JSON.stringify(images))
  uploadedPhotos.value = images;
}


if (props.guide.text_json !== null) {
  tipTapText.value = props.guide.text_json;
}

// FORM
const {handleReset} = useForm();
const validationSchema = yup.object({
  guideName: yup.string().required(),
})

const {handleSubmit, errors} = useForm({
  validationSchema
})

const {value: guideName} = useField('guideName', undefined, {initialValue: props.guide.name})

function cancelButtonHandle() {
  emit('cancelBtnClick')
}

const submit = handleSubmit(values => {
  console.log('Submitting')

  let data = {
    "name": guideName.value,
    "text_html": htmlTxt,
    "text_json": jsonTxt,
    "files": uploadedPhotos.value.map(a => a.uuid), //attachments.value.map(a => a.uuid)
    "video_id": uploadedVideoId.value,
    "video_jsonb": uploadedVideoMetadata.value
  }

  console.log(data)
  emit('guideFormBtnClick', data)

})

// VIDEO

function keepVideoId(videoId, videoMetadata) {
  console.log("UPLOADED VIDEO_ID: ");
  console.log(videoId);
  console.log("UPLOADED METADATA: ");
  console.log(videoMetadata);
  uploadedVideoId.value = videoId;
  uploadedVideoMetadata.value = videoMetadata;
}
</script>


<style lang="scss" scoped>
.tiptap {
  border: 1px solid #c2c2c2;
  border-radius: 5px;
  padding-left: 5px;
}

.tiptap:focus-within {
  transition: 0.3s;
  border: 2px solid #1976d2 !important;
}

// .tiptap:hover {
//   transition: 0.5s;
//   border: 1px solid #000000 !important;
// }
</style>
