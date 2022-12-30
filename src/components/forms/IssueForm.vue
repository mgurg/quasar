<template>
  <q-form autocapitalize="off" autocomplete="off" autocorrect="off" class="q-gutter-md" spellcheck="false"
          @submit.prevent>

    <q-input
      v-model="issueName"
      :disable="isLoading"
      :error="!!errors.issueName"
      :error-message="errors.issueName"
      :label="$t('Issue name')" outlined
    />

    <div class="row q-mt-sm">
    <div class="q-gutter-xs">
      <span class="text">
        Priorytet:
      </span>
      <span>
        <q-radio keep-color v-model="issueColor" val="teal" color="deep-orange-11" />
      </span>
      <span>
        <q-radio keep-color v-model="issueColor" val="orange" color="orange" />
      </span>
      <span>
        <q-radio keep-color v-model="issueColor" val="red" color="red-12" />
      </span>
      <span>
        <q-radio keep-color v-model="issueColor" val="cyan" color="cyan" />
      </span>
    </div>
  </div>

    <div class="tiptap">
      <tip-tap :body-content="tipTapText" @editor-content="logText"/>
    </div>

    <div>
      <photo-uploader :file-list="props.issue.files_issue" @uploaded-photos="listOfUploadedImages"/>
    </div>
    <!-- QFILE -->


    <!-- MODE -->
    <div v-if="mode === 'anonymous_with_mail'">
      <q-input v-model="email" :disable="isLoading" :error="!!errors.email" :error-message="errors.email"
               :label="$t('E-mail')"
               outlined>
      </q-input>

      <p>Twój mail nie będzie nigdzie widoczny. Jego podanie jest konieczne żeby zweryfikować że jesteś
        pracownikiem firmy. Zgłoszenia z prywatnych skrzynek (interia.pl, gmail.com, wp.pl) nie są przyjmowane</p>

      <p>Posiadasz konto? Możesz się
        <router-link to="/login">zalogować i dokonać zgłoszenia jako
          zarejestrowany użytkownik
        </router-link>
      </p>
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
import {ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useField, useForm} from "vee-validate";
import * as yup from 'yup';


import {useSpeechRecognition} from 'src/composables/useSpeechRecognition.js'
import TipTap from 'src/components/editor/TipTap.vue'
import TipTapBasic from "components/editor/TipTapBasic.vue";
import PhotoUploader from 'src/components/uploader/PhotoUploader.vue'

const {isListening, isSupported, stop, result, raw, start, error} = useSpeechRecognition({
  lang: 'pl-PL',
  continuous: false,
  interimResults: false,
})

const router = useRouter();


const props = defineProps({
  issue: {
    type: Object,
    // Object or array defaults must be returned from
    // a factory function
    default() {
      return {
        uuid: null,
        name: null,
        description: '',
        color: 'red',
        user: null,
        text_json: null,
        files_issue: null

      }
    }
  },
  buttonText: {
    type: String,
    default: 'Save',
  },
  token: {
    type: String,
    default: null,
  },
  tenant_id: {
    type: String,
    default: null,
  },
  mode: {
    type: String,
    default: 'anonymous',
  },
  mail: {
    type: String,
    default: 'twojafirma.pl',
  }
})

const emit = defineEmits(['issueFormBtnClick', 'cancelBtnClick'])

let isError = ref(false);
let isLoading = ref(false);
let attachments = ref(props.issue.files_issue);

// IMG
const files = ref(null)

let jsonTxt = null;
let htmlTxt = null;

function logText(json, html) {
  jsonTxt = json
  htmlTxt = html
}

//voice recognition
watch(result, (newValue, oldValue) => {

  issueDescription.value = issueDescription.value + ' ' + newValue

})

const tipTapText = ref(null)


if (props.issue.text_json !== null) {
  tipTapText.value = props.issue.text_json;
}

// --------------- Form --------------

const {handleReset} = useForm();

const validationSchema = yup.object({
  issueColor: yup.string().required(),
  issueName: yup.string(),//.required(),
  issueDescription: yup.string(), //.required('A cool description is required').min(3),
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

const {value: issueName} = useField('issueName', undefined, {initialValue: props.issue.name})
const {value: issueDescription} = useField('issueDescription', undefined, {initialValue: props.issue.description})
const {value: issueColor} = useField('issueColor', undefined, {initialValue: props.issue.color})
const {value: email} = useField('email')


const submit = handleSubmit(values => {
  // isLoading.value = true;

  let data = {
    "color": issueColor.value,
    "name": issueName.value,
    "description": "issueDescription.value",
    "text_json": jsonTxt,
    "text_html": htmlTxt,
    "files": uploadedPhotos.value.map(a => a.uuid) //attachments.value.map(a => a.uuid)
  }

  console.log(data)
  emit('issueFormBtnClick', data)

})


// --------------- Form --------------

function cancelButtonHandle() {
  emit('cancelBtnClick')
}

const uploadedPhotos = ref([]);

function listOfUploadedImages(images) {
  console.log("UPLOADED IMAGES:")
  console.log(JSON.stringify(images))
  uploadedPhotos.value = images;
}


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
