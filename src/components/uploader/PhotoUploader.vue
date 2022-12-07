<template>
  <q-file
    v-if="attachments.length < 4"
    v-model="files"
    :clearable="!isUploading"
    :error="!!qFileError"
    :error-message="qFileError"
    :label="$t('Pick Photo to upload')"
    accept=".jpg, image/*"
    outlined
    @rejected="onRejected"
    @update:model-value="compressorFn"
  >
    <template v-slot:prepend>
      <q-icon name="photo"/>
    </template>
    <template v-slot:file="{ index, file }">
      <q-chip
        :removable="isUploading" class="full-width q-my-xs" square @remove="cancelFile()">
        <q-linear-progress :value="uploadProgress" class="absolute-full full-height" color="green-2" stripe
                           track-color="grey-2"/>

        <q-avatar>
          <q-icon name="photo"/>
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

  <!-- IMG -->
  <div class="row q-col-gutter-xs">
    <div v-for="(file, index) in attachments" v-bind:key="index" class="col-xs-6 col-sm-6 col-md-3 col-lg-3">
      <q-img
        :src="file.url"
        fit="cover"
        spinner-color="black"
        style="height: 300px; width: 100%; border: 1px solid gray;"
      >
        <q-icon class="absolute all-pointer-events" color="blue-grey-5" name="delete" size="sm"
                style="top: 8px; right: 8px" @click="delete_file(file.uuid)">
          <q-tooltip>Remove image</q-tooltip>
        </q-icon>
        <template v-slot:error>
        <div class="absolute-full flex flex-center bg-negative text-white">
          Cannot load image
        </div>
      </template>
      </q-img>
    </div>
  </div>
</template>

<script setup>
import {computed, reactive, ref} from "vue";
import {api} from "boot/axios";
import {useUserStore} from "stores/user";
import Compressor from "compressorjs";
import {errorHandler} from "components/api/errorHandler";
import {deleteFileRequest} from "components/api/FilesApiClient";
import {useI18n} from "vue-i18n";
import {useQuasar} from "quasar";

// https://github.com/sjq4499/vite-vue3/blob/8ffaf0cda0cf6d15e30242d97d6d2eaa824f1eb6/src/views/tool/compressImages.vue
// https://github.com/H37kouya/miya-meshi/blob/736598180c428465628c14ca165831c04961d12f/admin/components/organisms/file/UploadImageFile.vue

const props = defineProps({
  fileList: {
    type: Object,
    default() {
      return {
        uuid: null,
        file_name: null,
        extension: null,
        mimetype : null,
        size: null,
        url: null,
      };
    },
  },
});

// const $q = useQuasar()
// const {t} = useI18n({ useScope: "global" });
// const confirmDeleteMessage = computed(() => t("Delete:"));
// const successfulDeleteMessage = computed(() => t("Deleted:"));

let attachments = ref([]);
let newAttachments = ref([]);
if (props.fileList !== null) {
  attachments.value = props.fileList
  emit('uploadedPhotos', attachments.value)
}

const emit = defineEmits(["uploadedPhotos"]);

const UserStore = useUserStore();

const files = ref(null);
const isUploading = ref(false);
const uploadProgress = ref(0.1);
const uploadProgressColor = "warning";
let isLoading = ref(false);

const qFileError = ref(null);

function cancelFile() {
  return new Promise((resolve) => {
    // simulating a delay of 2 seconds
    setTimeout(() => {
      resolve((files.value = null));
    }, 1500);
  });
}

function onRejected() {
  qFileError.value = "incorrect file, upload something else";
  return new Promise((resolve) => {
    // simulating a delay of 2 seconds
    setTimeout(() => {
      resolve((qFileError.value = null));
    }, 2500);
  });
}

let progress = ref(60);
const compressor = ref(null);
let compressObj = reactive({
  size: 0,
  file: "",
  name: "",
});

const compressorFn = () => {
  qFileError.value = null;
  uploadProgress.value = 0;
  let file = files.value;
  if (!file) {
    return;
  }
  compressor.value = new Compressor(file, {
    quality: 0.6,
    maxWidth: 1600,
    mimeType: "image/jpeg",
    success(result) {
      compressObj.file = result;
      compressObj.name = result.name;
      // compressObj.size = Math.round((result.size / 1024) * 100) / 100;
      // fileToBase64(result, (data) => {
      //   compressObj.url = data;
      // });

      uploadProgress.value = 0.5;

      // size check
      let img = new Image();
      let objectURL = URL.createObjectURL(result);
      img.onload = function () {
        console.log(img.width, img.height);
      };
      img.src = objectURL;

      console.log(result.size, result.type, result.name, result.lastModified);
      // console.log(token)

      uploadFile();

      uploadProgress.value = 0;
    },
    error(err) {
      console.log(err.message);
    },
  });
};


const onUploadProgress = (progressEvent) => {
  const {loaded, total} = progressEvent;
  let percent = Math.floor((loaded * 100) / total);
  if (percent < 100) {
    console.log(`${loaded} bytes of ${total} bytes. ${percent}%`);
  }
};

function uploadFile(file) {
  let token = props.token;
  if (props.token == null) token = UserStore.getToken;

  let tenant_id = props.tenant_id;
  if (props.tenant_id == null) tenant_id = UserStore.getTenant;

  const formData = new FormData();
  formData.append("file", compressObj.file, compressObj.name); // The third parameter is required for server

  isLoading.value = true;
  api
    .post(process.env.VUE_APP_URL + "/files/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
        tenant: tenant_id,
      },
      onUploadProgress,
    })
    .then((res) => {
      attachments.value.push(res.data);
      newAttachments.value.push(res.data.uuid)

      console.log(newAttachments.value);
      console.log(attachments.value);
      // uploader.value.reset()
      emit('uploadedPhotos', attachments.value)
      isLoading.value = false;
      files.value = null;
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("General Error " + err);
      }
      isLoading.value = false;
    });
}

function delete_file(uuid) {
  if (newAttachments.value.includes(uuid)){
        let token = props.token;
    if (props.token == null) token = UserStore.getToken;

    let tenant_id = props.tenant_id;
    if (props.tenant_id == null) tenant_id = UserStore.getTenant;

    isLoading.value = true;
    deleteFileRequest(uuid, token, tenant_id).then(function (response) {
      console.log("Deleted from Uploader")
      isLoading.value = false;

    }).catch((err) => {
      const errorMessage = errorHandler(err);
      isError.value = true;
    });
  }

  attachments.value = attachments.value.filter((item) => item.uuid !== uuid);
  emit('uploadedPhotos', attachments.value)


}
</script>
