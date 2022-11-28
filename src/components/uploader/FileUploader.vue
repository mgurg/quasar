<template>
    <q-file 
        outlined 
        v-model="files" 
        @update:model-value="compressorFn" 
        :label="$t('Pick Photo to upload')"
        :error="!!qFileError" 
        :error-message="qFileError" 
        :clearable="!isUploading" 
        @rejected="onRejected" 
        v-if="imagesList.length < 4"
    >
        <template v-slot:prepend>
            <q-icon name="upload_file" />
        </template>
        <template v-slot:file="{ index, file }">
            <q-chip class="full-width q-my-xs" :removable="isUploading" @remove="cancelFile()" square>
                <q-linear-progress class="absolute-full full-height" :value="uploadProgress" stripe color="green-2"
                    track-color="grey-2" />

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

    <!-- IMG -->
    <div class="row q-col-gutter-xs">
        <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3" v-for="(image, index) in imagesList" v-bind:key="index">
            <q-img 
                :src="image.url" 
                spinner-color="black" 
                style="height: 300px; width: 100%; border: 1px solid gray;" 
                fit="cover"
                >
                <q-icon class="absolute all-pointer-events" size="sm" name="delete" color="blue-grey-5"
                    style="top: 8px; right: 8px" @click="delete_file(image.uuid)">
                    <q-tooltip>Remove image</q-tooltip>
                </q-icon>
            </q-img>
        </div>
    </div>

    <!-- FILES -->
    <div v-for="(file, index) in filesList" v-bind:key="index">
          <q-btn @click="delete_file(file.uuid)">{{file.file_name}}</q-btn>
        </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { api, authApi } from "boot/axios";
import { useUserStore } from "stores/user";
import Compressor from "compressorjs";

// https://github.com/sjq4499/vite-vue3/blob/8ffaf0cda0cf6d15e30242d97d6d2eaa824f1eb6/src/views/tool/compressImages.vue
// https://github.com/H37kouya/miya-meshi/blob/736598180c428465628c14ca165831c04961d12f/admin/components/organisms/file/UploadImageFile.vue

const props = defineProps({
    fileList: {
        type: Object,
        default() {
            return {
                url: null,
            };
        },
    },
});

let imagesList = ref([]);
let filesList = ref([]);

if (props.fileList !==null){
    imagesList.value = props.fileList
    emit('uploadedPhotos', imagesList.value)
}

const emit = defineEmits(["uploadedPhotos", 'uploadedFiles']);

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

    if (!file.type.match('image.*')){
        console.log("Not an image");
        // console.log(file.type)
        uploadFile(file);
        return;
    }else{
        console.log("Definatelly a image");
        console.log(files.value)
        
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

            uploadImage();

            uploadProgress.value = 0;
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

const onUploadProgress = (progressEvent) => {
  const { loaded, total } = progressEvent;
  let percent = Math.floor((loaded * 100) / total);
  if (percent < 100) {
    console.log(`${loaded} bytes of ${total} bytes. ${percent}%`);
  }
};

function uploadImage(file) {
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
            imagesList.value.push(res.data);
            
            console.log(imagesList.value);
            // uploader.value.reset()
            emit('uploadedPhotos', imagesList.value)
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


function uploadFile(file) {
    console.log('uploadingFile')
    console.log(file);

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
            filesList.value.push(res.data);
            
            console.log(filesList.value);
            // uploader.value.reset()
            emit('uploadedFiles', filesList.value)
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
            imagesList.value = imagesList.value.filter(
                (item) => item.uuid !== uuid
            );
            emit('uploadedPhotos', imagesList.value)
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
