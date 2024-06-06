<template>
  <q-file
    v-if="attachments.length < 4"
    v-model="files"
    :clearable="!isUploading"
    :error="!!qFileError"
    :error-message="qFileError"
    :label="$t('Pick File to upload')"
    outlined
    @rejected="onRejected"
    @update:model-value="compressorFn"
  >
    <template v-slot:prepend>
      <q-icon name="upload_file"/>
    </template>
    <template v-slot:file="{ file }">
      <q-chip
        :removable="isUploading"
        class="full-width q-my-xs"
        square
        @remove="cancelFile"
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

  <div v-if="attachments.length">
    <q-list v-for="(file, index) in attachments" :key="index" bordered class="rounded-borders">
      <q-item>
        <q-item-section avatar>
          <q-avatar color="green" rounded text-color="white" icon="attach_file"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ file.file_name }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn
              v-ripple
              class="gt-xs"
              clickable
              dense
              flat
              icon="delete"
              round
              size="12px"
              @click="deleteFile(file.uuid)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import {api} from 'boot/axios';
import {useUserStore} from 'stores/user';

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

const emit = defineEmits(['uploadedFiles']);

const UserStore = useUserStore();

const files = ref(null);
const isUploading = ref(false);
const uploadProgress = ref(0);
const qFileError = ref(null);
const attachments = ref([]);

// Update attachments based on props.fileList
watch(
  () => props.fileList,
  (newFileList) => {
    if (newFileList) {
      attachments.value = newFileList.filter((item) => !item.mimetype.match('image.*'));
      emit('uploadedFiles', attachments.value);
    }
  },
  {immediate: true}
);

const cancelFile = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      files.value = null;
      resolve();
    }, 1500);
  });
};

const onRejected = () => {
  qFileError.value = "Incorrect file, please upload something else.";
  return new Promise((resolve) => {
    setTimeout(() => {
      qFileError.value = null;
      resolve();
    }, 2500);
  });
};

const onUploadProgress = (progressEvent) => {
  const {loaded, total} = progressEvent;
  uploadProgress.value = Math.floor((loaded * 100) / total);
};

const compressorFn = () => {
  qFileError.value = null;
  uploadProgress.value = 0;
  const file = files.value;

  if (!file) return;

  if (!file.type.match('image.*')) {
    uploadFile(file);
  } else {
    console.log("Definitely an image");
  }
};

const uploadFile = async (file) => {
  const token = props.token || UserStore.getToken;
  const tenant_id = props.tenant_id || UserStore.getTenant;

  const formData = new FormData();
  formData.append("file", file, file.name);

  isUploading.value = true;
  try {
    const response = await api.post(`${process.env.VUE_APP_URL}/files/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        tenant: tenant_id,
      },
      onUploadProgress,
    });
    attachments.value.push(response.data);
    emit('uploadedFiles', attachments.value);
    files.value = null;
  } catch (error) {
    handleUploadError(error);
  } finally {
    isUploading.value = false;
  }
};

const deleteFile = async (uuid) => {
  const token = props.token || UserStore.getToken;
  const tenant_id = props.tenant_id || UserStore.getTenant;

  try {
    await api.delete(`${process.env.VUE_APP_URL}/files/${uuid}`, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
        tenant: tenant_id,
      },
    });
    attachments.value = attachments.value.filter((item) => item.uuid !== uuid);
    emit('uploadedFiles', attachments.value);
  } catch (error) {
    handleUploadError(error);
  }
};

const handleUploadError = (error) => {
  if (error.response) {
    console.error(error.response);
  } else if (error.request) {
    console.error(error.request);
  } else {
    console.error("General Error", error);
  }
};
</script>
