<template>
  <q-form
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    class="q-gutter-md"
    spellcheck="false"
    @submit.prevent
  >
    <div v-if="hasPermission('ITEM_VIEW')" class="row">
      <span v-if="itemName===null"><span class="text-h6">Przedmiot: </span>
        <q-btn color="primary" flat icon="apps" no-caps to="/items/?mode=guide">Wybierz urządzenie</q-btn>
      </span>
      <span v-else>
        <span class="text-h6">Przedmiot: {{ itemName }}</span>
      </span>
    </div>

    <div v-if="itemName===null" class="text-caption text-grey">
      Tworzysz zgłoszenie <span class="text-weight-bold">nieprzypisane do żadnego urządzenia</span>.
    </div>

    <q-input
      v-model="guideName"
      :disable="isLoading"
      :error="!!errors.guideName"
      :error-message="errors.guideName"
      :label="$t('Guide name')"
      outlined
      maxlength="512"
    />

    <div class="tiptap">
      <tip-tap-guide :body-content="tipTapText" @editor-content="logText"/>
    </div>
    <q-banner class="text-brown-10 bg-yellow-14 q-mt-md" inline-actions rounded>
      <template v-slot:avatar>
        <q-icon color="warning" name="help_outline"/>
      </template>
      Potrzebujesz oprócz zdjęć załączać również  <span class="text-weight-bold text-black">filmy instruktażowe?</span>.
      <a class="text-weight-bold text-black" href="mailto:wsparcie@malgori.pl?subject=Aplikacja do zgłaszania awarii"
                              style="text-decoration: underline;">Napisz do mnie</a> i opowiedz o szczegółach.
    </q-banner>
<!--    <div>-->
<!--      <movie-uploader :video-id="props.guide.video_id" @uploaded-video-id="keepVideoId"/>-->
<!--    </div>-->
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
import {computed, ref} from "vue";
import {useField, useForm} from "vee-validate";
import * as yup from 'yup';
import {useRouter} from "vue-router";

import TipTapGuide from 'components/editor/TipTapBasic.vue'
import MovieUploader from 'components/uploader/MovieUploader.vue'
import PhotoUploader from 'components/uploader/PhotoUploader.vue'
import {useUserStore} from "stores/user";

const router = useRouter();
const UserStore = useUserStore();
const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return permissions.value === null ? false : Boolean(permissions.value.includes(permission));
}

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
  itemName: {
    type: String,
    default: null,
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

  // console.log(json)
  jsonTxt = json
  htmlTxt = html
}

const tipTapText = ref(null);

const uploadedVideoId = ref(null)
const uploadedVideoMetadata = ref(null)
const uploadedPhotos = ref([]);

function listOfUploadedImages(images) {
  // console.log("UPLOADED IMAGES:")
  // console.log(JSON.stringify(images))
  uploadedPhotos.value = images;
}


if (props.guide.text_json !== null) {
  tipTapText.value = props.guide.text_json;
}

const itemName = ref(null)

if (props.itemName !== null) {
  itemName.value = props.itemName;
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
  // console.log('Submitting')

  let data = {
    "name": guideName.value,
    "text_html": htmlTxt,
    "text_json": jsonTxt,
    "files": uploadedPhotos.value.map(a => a.uuid), //attachments.value.map(a => a.uuid)
    "video_id": uploadedVideoId.value,
    "video_json": uploadedVideoMetadata.value
  }

  // console.log(data)
  emit('guideFormBtnClick', data)

})

// VIDEO

function keepVideoId(videoId, videoMetadata) {
  // console.log("UPLOADED VIDEO_ID: ");
  // console.log(videoId);
  // console.log("UPLOADED METADATA: ");
  // console.log(videoMetadata);
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
