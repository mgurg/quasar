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
    <template v-slot:file="{ file }">
      <q-chip
        :removable="isUploading"
        class="full-width q-my-xs"
        square
        @remove="cancelFile()"
      >
        <q-linear-progress
          :value="uploadProgress"
          class="absolute-full full-height"
          color="green-2"
          stripe
          track-color="grey-2"
        />

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

  <div class="row q-col-gutter-xs">
    <div
      v-for="(file, index) in attachments"
      :key="index"
      class="col-xs-6 col-sm-6 col-md-3 col-lg-3"
    >
      <q-img
        :src="file.url"
        fit="cover"
        spinner-color="black"
        class="image-preview"
      >
        <q-icon
          class="absolute all-pointer-events"
          color="blue-grey-5"
          name="delete"
          size="sm"
          style="top: 8px; right: 8px"
          @click="deleteFile(file.uuid)"
        >
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
  <q-separator></q-separator>
</template>

<script setup>
import {ref} from "vue";
import {api} from "boot/axios";
import {useUserStore} from "stores/user";
import Compressor from "compressorjs";
import {useQuasar} from "quasar";
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {useNoAuthAPI} from "src/composables/useNoAuthAPI.js";
import {deleteFileRequest} from "components/api/FilesApiClient";

const props = defineProps({
  fileList: {
    type: Array,
    default: () => [],
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

const emit = defineEmits(["uploadedPhotos"]);

const $q = useQuasar();
const {t} = useI18n();
const UserStore = useUserStore();
const noAuthAPI = useNoAuthAPI();

const attachments = ref(props.fileList ? props.fileList.filter((item) => item.mimetype.match("image.*")) : []);
emit("uploadedPhotos", attachments.value);

const files = ref(null);
const isUploading = ref(false);
const uploadProgress = ref(0);
const qFileError = ref(null);
const newAttachments = ref([]);

function cancelFile() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve((files.value = null));
    }, 1500);
  });
}

function onRejected() {
  qFileError.value = t("incorrect file, upload something else");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve((qFileError.value = null));
    }, 2500);
  });
}

const compressorFn = () => {
  qFileError.value = null;
  uploadProgress.value = 0;
  if (!files.value) return;

  new Compressor(files.value, {
    quality: 0.6,
    maxWidth: 1600,
    mimeType: "image/jpeg",
    success(result) {
      const objectURL = URL.createObjectURL(result);
      uploadProgress.value = 0.5;
      uploadFile(result, objectURL);
    },
    error(err) {
      console.error(err.message);
    },
  });
};

function uploadFile(file, objectURL) {
  const token = props.token || UserStore.getToken;
  const tenant_id = props.tenant_id || UserStore.getTenant;

  const formData = new FormData();
  formData.append("file", file, file.name);

  isUploading.value = true;
  api
    .post(`${process.env.VUE_APP_URL}/files/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        tenant: tenant_id,
      },
      onUploadProgress,
    })
    .then((res) => {
      attachments.value.push(res.data);
      newAttachments.value.push(res.data.uuid);
      emit("uploadedPhotos", attachments.value);
      isUploading.value = false;
      files.value = null;
    })
    .catch(handleUploadError);
}

function handleUploadError(err) {
  console.error(err.response || err.request || `General Error: ${err}`);
  isUploading.value = false;
}

function onUploadProgress(progressEvent) {
  const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
  uploadProgress.value = percentCompleted < 100 ? percentCompleted / 100 : 1;
}

function deleteFile(uuid) {
  if (newAttachments.value.includes(uuid)) {
    const token = props.token || UserStore.getToken;
    const tenant_id = props.tenant_id || UserStore.getTenant;

    isUploading.value = true;


    deleteFileRequest(uuid, token, tenant_id).then(function (response) {
      console.log("Deleted from Uploader")
      isLoading.value = false;

    }).catch((err) => {
      console.log("error")
    });

  }

  attachments.value = attachments.value.filter((item) => item.uuid !== uuid);
  emit("uploadedPhotos", attachments.value);
  isUploading.value = false;
}

</script>

<style scoped>
.image-preview {
  height: 300px;
  width: 100%;
  border: 1px solid gray;
}
</style>
