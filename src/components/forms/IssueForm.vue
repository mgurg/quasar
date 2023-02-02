<template>

  <q-form autocapitalize="off" autocomplete="off" autocorrect="off" class="q-gutter-md" spellcheck="false"
          @submit.prevent>
    <div class="row">
      <span><span class="text-h6">Przedmiot: </span>
        <q-btn color="primary" flat icon="apps" no-caps to="/items">Wybierz urządzenie</q-btn>
      </span>

    </div>

    <q-input
      v-model="issueName"
      :disable="isLoading"
      :error="!!errors.issueName"
      :error-message="errors.issueName"
      :label="$t('Issue name')" outlined
    />

    <div class="row q-mt-sm">
      <div class="q-gutter-none">
      <span class="text">
        Priorytet
      </span>
        <q-chip v-model:selected="priority.low"
                :color="priority.low==true? 'primary':''"
                :disable="priority.medium == true|| priority.high==true"
                :text-color="priority.low==true? 'white':''"
                icon="info"
                label="Niski"
        />
        <q-chip v-model:selected="priority.medium"
                :color="priority.medium==true? 'orange':''"
                :disable="priority.low == true|| priority.high==true"
                :text-color="priority.medium==true? 'white':''"
                icon="error_outline"
                label="Średni"
        />
        <q-chip v-model:selected="priority.high"
                :color="priority.high==true? 'red':''"
                :disable="priority.low == true|| priority.medium==true"
                :text-color="priority.high==true? 'white':''"
                icon="priority_high"
                label="Wysoki"
        />
      </div>
    </div>

    <div class="tiptap">
      <tip-tap :body-content="tipTapText" @editor-content="logText"/>
    </div>

    <div>
      <span>Kategoria: </span>
      <span v-for="(tag, index) in selectedTags" v-if="selectedTags != null" v-bind:key="index" class="q-gutter-sm">
            <q-chip color="primary" removable @remove="unAssignTag(tag.uuid)" text-color="white">
              {{ tag.name }}
            </q-chip>
          </span>
      <q-btn flat icon="add">
        <q-menu auto-close>
          <div class="q-pa-sm" style="max-width: 320px">
            <span v-for="(tag, index) in availableTags" v-if="availableTags != null" v-bind:key="index"
                  class="q-gutter-sm">
            <q-chip color="primary" text-color="white" clickable @click="assignTag(tag.name, tag.uuid)">
              {{ tag.name }}
            </q-chip>
          </span>
          </div>
        </q-menu>
      </q-btn>
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
import {onBeforeMount, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useField, useForm} from "vee-validate";
import * as yup from 'yup';


import {useSpeechRecognition} from 'src/composables/useSpeechRecognition.js'
import TipTap from 'src/components/editor/TipTap.vue'
import PhotoUploader from 'src/components/uploader/PhotoUploader.vue'
import {getTagsRequest} from "components/api/TagsApiClient";
import {errorHandler} from "components/api/errorHandler";

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
        name: '',
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
const availableTags = ref(null)
const selectedTags = ref([])

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
  issueName: yup.string().required(),
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

// Lowest - Trivial problem with little or no impact on progress. Colour: Light grey.
// Low - Minor problem or easily worked around. Colour: Dark grey.
// Medium - Has the potential to affect progress. Colour: Yellow.
// High - Serious problem that could block progress. Colour: Orange.
// Highest - The problem will block progress. Colour: A dark red.

const priority = reactive({
  low: false,
  medium: false,
  high: false
})


const submit = handleSubmit(values => {
  // isLoading.value = true;
  let priorityLevel = 0
  Object.keys(priority).forEach(key => {
    // if key matches selected section, set to true
    if (priority[key] == true) {
      switch (key) {
        case 'low':
          priorityLevel = 10;
          break;
        case 'medium':
          priorityLevel = 20;
          break;
        case 'high':
          priorityLevel = 30;
          break;
      }

      console.log(priorityLevel);
    }
  });

  let data = {
    "color": issueColor.value,
    "name": issueName.value,
    "description": "issueDescription.value",
    "priority": priorityLevel,
    "text_json": jsonTxt,
    "text_html": htmlTxt,
    "files": uploadedPhotos.value.map(a => a.uuid), //attachments.value.map(a => a.uuid)
    "availableTags": selectedTags.value.map(a => a.uuid),
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
  uploadedPhotos.value = images;
}

// TAGS
function fetchTags() {
  isLoading.value = true;
  getTagsRequest().then(function (response) {
    availableTags.value = response.data;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function assignTag(name, uuid) {
  console.log(name, uuid)
  let index = selectedTags.value.findIndex(x => x.uuid==uuid);
  if (index === -1) {
    selectedTags.value.push({"name": name, "uuid":uuid})
  }else {
    console.log("Tag already exists")
  }

}

function unAssignTag(uuid) {
  console.log(name, uuid)
  // selectedTags.value.filter()
  selectedTags.value = selectedTags.value.filter(item => item.uuid !== uuid)
}

onBeforeMount(() => {
  fetchTags();
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

// .tiptap:hover {
//   transition: 0.5s;
//   border: 1px solid #000000 !important;
// }
</style>
