<template>
  <div>
    <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" class="q-gutter-md"
      @submit.prevent>
      <div class="row justify-between items-center">
        <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">{{ $t("Idea") }}</h5>
        <div class="q-gutter-sm">
          <span>
            <q-radio keep-color v-model="ideaColor" val="teal" color="deep-orange-11" />
          </span>
          <span>
            <q-radio keep-color v-model="ideaColor" val="orange" color="orange" />
          </span>
          <span>
            <q-radio keep-color v-model="ideaColor" val="red" color="red-12" />
          </span>
          <span>
            <q-radio keep-color v-model="ideaColor" val="cyan" color="cyan" />
          </span>
        </div>
      </div>

      <div style="border: 1px solid #c2c2c2; border-radius: 5px; padding-left: 5px;">
        <tiptap @editorContent="logText"  />
      </div>

      <!-- <q-input outlined v-model="ideaTitle" :disable="isLoading" :error="!!errors.ideaTitle"
        :error-message="errors.ideaTitle" :label="$t('Idea title')">
      </q-input>
      <q-input outlined type="textarea" rows="5" v-model="ideaDescription" :disable="isLoading"
        :error="!!errors.ideaDescription" :error-message="errors.ideaDescription" :label="$t('Idea description')">
        <template v-if="isSupported" v-slot:append>
          <q-btn round dense flat icon="mic" v-if="!isListening" @click="start" />
          <q-btn round dense flat icon="mic_off" v-if="isListening" color="red-12" @click="stop" />
        </template>
      </q-input> -->

      <!-- QFILE -->
      <div class="column items-start q-gutter-y-xs  ">
      <q-file 
      outlined 
      v-model="files" 
      @update:model-value="compressorFn" 
      label="Pick files"
      :error="!!qFileError"
      :error-message="qFileError" 
      :clearable="!isUploading"
      accept=".jpg, image/*"
      @rejected="onRejected"
      style="max-width: 400px" 
      v-if="attachments.length < 4"
      >
      <template v-slot:prepend>
          <q-icon name="photo" />
        </template>
      <template v-slot:file="{ index, file }">
        <q-chip
          class="full-width q-my-xs"
          :removable="isUploading"
          @remove="cancelFile()"
          square
        >
          <q-linear-progress
            class="absolute-full full-height"
            :value="uploadProgress"
            stripe
            color="green-2"
            track-color="grey-2"
          />

          <q-avatar>
            <q-icon name="photo" />
          </q-avatar>

          <div class="ellipsis relative-position">
            {{ file.name }}
          </div>

          <q-tooltip>
            {{ file.name }}
          </q-tooltip>
        </q-chip>
      </template>
      </q-file>
      </div>

      <!-- IMG -->
      <div class="row q-col-gutter-xs">
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3" v-for="(file, index) in attachments" v-bind:key="index">
          <q-img :src="file.url" spinner-color="black" style="height: 100%; width:100% " fit="contain">
            <q-icon class="absolute all-pointer-events" size="sm" name="delete" color="blue-grey-5"
              style="top: 8px; right: 8px" @click="delete_file(file.uuid)">
              <q-tooltip>Tooltip</q-tooltip>
            </q-icon>
          </q-img>
        </div>
      </div>

      <!-- MODE -->
      <div v-if="mode == 'anonymous_with_mail'">
        <q-input outlined v-model="email" :disable="isLoading" :error="!!errors.email" :error-message="errors.email"
          :label="$t('E-mail')">
        </q-input>

        <p>Twój mail nie będzie nigdzie widoczny. Jego podanie jest konieczne żeby zweryfikować że jesteś
          pracownikiem firmy. Zgłoszenia z prywanych skrzynek (interia.pl, gmail.com, wp.pl) nie są przyjmowane</p>

        <p>Posiadasz konto? Możesz się
          <router-link to="/login">zalogować i dokonać zgłoszenia jako
            zarejestrowany użytkownik
          </router-link>
        </p>
      </div>

      <div class="row">
        <q-btn type="submit" color="red-12" @click="cancelButtonHandle">{{ $t("Cancel") }}</q-btn>
        <q-space />
        <q-btn type="submit" color="primary" @click="submit" :loading="isLoading">{{ $t(buttonText) }}</q-btn>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import Tiptap from 'src/components/editor/TipTap.vue'
import { useField, useForm } from "vee-validate";
import * as yup from 'yup';
import { api, authApi } from "boot/axios";
import { useUserStore } from "stores/user";
import Compressor from 'compressorjs';
import { useSpeechRecognition } from 'src/composables/useSpeechRecognition.js'

const { isListening, isSupported, stop, result, raw, start, error } = useSpeechRecognition({
  lang: 'pl-PL',
  continuous: false,
  interimResults: false,
})

const UserStore = useUserStore();

const props = defineProps({
  idea: {
    type: Object,
    // Object or array defaults must be returned from
    // a factory function
    default() {
      return {
        title: '',
        description: '',
        color: 'red',
        user: null,
        file: [],

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
  mode: {
    type: String,
    default: 'anonymous',
  },
  mail: {
    type: String,
    default: 'twojafirma.pl',
  },
  buttonText: {
    type: String,
    default: 'Save',
  },
})

const emit = defineEmits(['ideaFormBtnClick'])

let isError = ref(false);
let isLoading = ref(false);
let attachments = ref(props.idea.file);

let jsonTxt = null;
let htmlTxt = null;
const files = ref(null);

function logText(json, html) 
{
  jsonTxt = json
  htmlTxt = html
}

// --------------- UPLOADER ---------------


function delete_file(uuid) {
  api
    .delete(process.env.VUE_APP_URL + "/files/" + uuid, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + token,
        'tenant': tenant_id
      }
    })
    .then((res) => {
      attachments.value = attachments.value.filter(item => item.uuid !== uuid)
      //   listFiles()
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("General Error");
      }
    });
}

//voice recognition
watch(result, (newValue, oldValue) => {

  ideaDescription.value = ideaDescription.value + ' ' + newValue

})


// --------------- Form --------------

const { handleReset } = useForm();

const validationSchema = yup.object({
  ideaColor: yup.string().required(),
  ideaTitle: yup.string(),//.required(),
  ideaDescription: yup.string(), //.required('A cool description is required').min(3),
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


const { handleSubmit, errors } = useForm({
  validationSchema
})

const { value: ideaTitle } = useField('ideaTitle', undefined, { initialValue: props.idea.title })
const { value: ideaDescription } = useField('ideaDescription', undefined, { initialValue: props.idea.description })
const { value: ideaColor } = useField('ideaColor', undefined, { initialValue: props.idea.color })
const { value: email } = useField('email')


const submit = handleSubmit(values => {
  // isLoading.value = true;

  let data = {
    "color": ideaColor.value,
    "title": "ideaTitle.value",
    "description": "ideaDescription.value",
    "body_json": jsonTxt,
    "body_html": htmlTxt,
    "files": attachments.value.map(a => a.uuid)
  }

  emit('ideaFormBtnClick', data)
  handleReset();
})

// --------------- Form --------------

function cancelButtonHandle() {
  console.log('cancelBtnClick')
  emit('cancelBtnClick')
}


// ---------------- FILE UPLOAD ----------------

const isUploading = ref(false);
const uploadProgress = ref(0.1)
const uploadProgressColor = "warning"

const qFileError = ref(null)

function cancelFile() {
  return new Promise((resolve) => {
    // simulating a delay of 2 seconds
    setTimeout(() => {
      resolve(
        files.value = null
      )
    }, 1500)
  })

  
      }
  
  function onRejected() {
    qFileError.value = "incorrect file, upload something else"
    return new Promise((resolve) => {
    // simulating a delay of 2 seconds
    setTimeout(() => {
      resolve(
        qFileError.value = null
      )
    }, 2500)
  })

      }

let progress = ref(60);
const compressor = ref(null);
let compressObj = reactive({
      size: 0,
      file: "",
      name:"",
    });


const compressorFn = () => {
      qFileError.value = null
      uploadProgress.value = 0
      let file = files.value;
      console.log(files.value);
      if (!file) {
        return;
      }
      compressor.value = new Compressor(file, {
        quality: 0.6,
        maxWidth: 1600,
        mimeType: 'image/jpeg',
        success(result) {
          compressObj.file = result;
          compressObj.name = result.name
          // compressObj.size = Math.round((result.size / 1024) * 100) / 100;
          // fileToBase64(result, (data) => {
          //   compressObj.url = data;
          // });
          
          uploadProgress.value = 0.5

          // size check
          let img = new Image();
          let objectURL = URL.createObjectURL(result);
          img.onload = function () {
            console.log(img.width, img.height)
          }
          img.src = objectURL

          console.log(result.size, result.type, result.name, result.lastModified)
          // console.log(token)

          uploadFile();
          
          uploadProgress.value = 0
        },
        error(err) {
          console.log(err.message);
        },
      });
    };

    // watch(compressorFn, (newV, oldV) => {
    //   console.log("watch: " + newV +' / ' + oldV)
    //   // compressorFn();
    // });

function  uploadFile(file) {
  let token = props.token
  if (props.token == null)
    token = UserStore.getToken

  let tenant_id = props.tenant_id
  if (props.tenant_id == null)
    tenant_id = UserStore.getTenant

    const formData = new FormData();
    formData.append('file', compressObj.file, compressObj.name); // The third parameter is required for server

    isLoading.value = true;
      // api
      //   .post(process.env.VUE_APP_URL + "/files/", formData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //       'Authorization': 'Bearer ' + token,
      //       'tenant': tenant_id
      //     }
      //   })
      //   .then((res) => {
      //     attachments.value.push(res.data)
      //     console.log(res.data)
      //     console.log(attachments.value)
      //     uploader.value.reset()
      //     isLoading.value = false;
      //   })
      //   .catch((err) => {
      //     if (err.response) {
      //       console.log(err.response);
      //     } else if (err.request) {
      //       console.log(err.request);
      //     } else {
      //       console.log("General Error");
      //     }
      //     isLoading.value = false;
      //   });  

         api
        .get('/fake_groups')
        .then((res) => {

          console.log(res.data)
          uploadProgress.value = 1.0

          isLoading.value = false;
          cancelFile();
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response);
          } else if (err.request) {
            console.log(err.request);
          } else {
            console.log("General Error");
          }
          isLoading.value = false;
        });  

}
// https://github.com/sjq4499/vite-vue3/blob/8ffaf0cda0cf6d15e30242d97d6d2eaa824f1eb6/src/views/tool/compressImages.vue
// https://github.com/H37kouya/miya-meshi/blob/736598180c428465628c14ca165831c04961d12f/admin/components/organisms/file/UploadImageFile.vue
</script>


<style lang="scss" scoped>

</style>
