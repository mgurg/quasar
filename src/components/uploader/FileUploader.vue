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

  <!-- FILES -->

  <q-list v-for="(file, index) in attachments" v-if="attachments != null" v-bind:key="index" bordered class="rounded-borders" >
    <q-item>
      <q-item-section avatar>
        <q-avatar color="green" rounded text-color="white" icon="attach_file" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ file.file_name }}</q-item-label>
<!--        <q-item-label caption>Dodaj</q-item-label>-->
      </q-item-section>

      <q-item-section side>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn
            v-ripple
            class="gt-xs"
            clickable
            dense flat
            icon="delete"
            round
            size="12px"
            @click="delete_file(file.uuid)"
          />
        </div>
      </q-item-section>

    </q-item>
  </q-list>
</template>

<script setup>
import {ref} from "vue";
import {api} from "boot/axios";
import {useUserStore} from "stores/user";

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
        mimetype: null,
        size: null,
        url: null,
      };
    },
  },
});

const emit = defineEmits(['uploadedFiles']);


let attachments = ref([]);
let newAttachments = ref([]);

if (props.fileList !== null) {
  attachments.value = props.fileList
  attachments.value = attachments.value.filter((item) => !item.mimetype.match('image.*'))
  emit('uploadedFiles', attachments.value)
}

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


const compressorFn = () => {
  qFileError.value = null;
  uploadProgress.value = 0;
  let file = files.value;
  if (!file) {
    return;
  }

  if (!file.type.match('image.*')) {
    console.log("Not an image");
    // console.log(file.type)
    uploadFile(file);

  } else {
    console.log("Definitely a image");
    console.log(files.value)

  }

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
  formData.append("file", file, file.name); // The third parameter is required for server

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
      emit('uploadedFiles', attachments.value)
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
  let token = props.token;
  if (props.token == null) token = UserStore.getToken;

  let tenant_id = props.tenant_id;
  if (props.tenant_id == null) tenant_id = UserStore.getTenant;
  api
    .delete(process.env.VUE_APP_URL + "/files/" + uuid, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
        tenant: tenant_id,
      },
    })
    .then((res) => {
      attachments.value = attachments.value.filter(
        (item) => item.uuid !== uuid
      );
      emit('uploadedFiles', attachments.value)
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
</script>
