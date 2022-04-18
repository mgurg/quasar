<template>
    <div>
        <q-form
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
            class="q-gutter-md"
            @submit.prevent
        >
        <div class="row justify-between items-center">
        <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">{{ $t("Tasks") }}</h5>
            <div class="q-gutter-sm">
                <!-- <span>Color:</span> -->
                <span><q-radio keep-color v-model="taskColor" val="teal" color="teal" /></span>
                <span><q-radio keep-color v-model="taskColor" val="orange" color="orange" /></span>              
                <span><q-radio keep-color v-model="taskColor" val="red" color="red" /></span>
                <span><q-radio keep-color v-model="taskColor" val="cyan" color="cyan" /></span>
            </div>
            </div>
            <q-input
                outlined
                v-model="taskTitle"
                :disable="isLoading"
                :error="!!errors.taskTitle"
                :error-message="errors.taskTitle"
                :label="$t('Task name')"
            />
            <q-input
                outlined
                type="textarea"
                rows="5"
                v-model="taskDescription"
                :disable="isLoading"
                :error="!!errors.taskDescription"
                :error-message="errors.taskDescription"
                :label="$t('Task description')"
            />

            <!-- UPLOADER -->
            <q-uploader
                :url="uploadUrl"
                @uploaded="uploaded"
                @finish="finished"
                ref="uploader"
                :headers="[{ name: 'X-Custom-Timestamp', value: 1550240306080 }]"
                field-name="file"
                label="No thumbnails"
                color="amber"
                accept=".jpg, image/*"
                auto-upload
                flat
                bordered
                text-color="black"
                no-thumbnails
                style="width: auto;"
                v-if="attachments.length <= 4"
            />
            <!-- IMG -->
            <div class="row q-col-gutter-xs">
                <div
                    class="col-xs-6 col-sm-6 col-md-3 col-lg-3"
                    v-for="(file, index) in attachments"
                    v-bind:key="index"
                >
                    <q-img
                        :src="download_file(file.uuid)"
                        spinner-color="black"
                        style="height: 100%; width:100% "
                        fit="contain"
                    >
                        <q-icon
                            class="absolute all-pointer-events"
                            size="sm"
                            name="delete"
                            color="blue-grey-5"
                            style="top: 8px; right: 8px"
                            @click="delete_file(file.uuid)"
                        >
                            <q-tooltip>Tooltip</q-tooltip>
                        </q-icon>
                    </q-img>
                </div>
            </div>
         
            <div class="row">
                <q-btn type="submit" color="red">Cancel</q-btn>
                <q-space />
                <q-btn type="submit" color="primary" @click="submit">{{ $t(buttonText) }}</q-btn>
            </div>
        </q-form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useField, useForm } from "vee-validate";
import { DateTime } from 'luxon';
import * as yup from 'yup';
import { api } from "boot/axios";

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

    buttonText: {
        type: String,
        default: 'Save',
    },
})

const emit = defineEmits(['taskFormBtnClick'])

let isError = ref(false);
let isLoading = ref(false);


// --------------- UPLOADER ---------------
console.log("props file: ", props.tasks.file)
let attachments = ref(props.tasks.file);
let uploader = ref("");

function download_file(uuid) {

    return process.env.VUE_APP_URL + "/files/download/" + uuid
}

function uploadUrl() {
    console.log(process.env.VUE_APP_URL + "/files/")
    return process.env.VUE_APP_URL + "/files/"
}

function uploaded({ files, xhr }) {
    // alert('uploaded')
    let response = JSON.parse(xhr.response)
    attachments.value.push(response);
    console.log("attachments response", response)
    console.log("attachments", attachments.value)
    //   listFiles()
}

function finished() {
    return new Promise((resolve) => {
        // simulating a delay of 2 seconds
        setTimeout(() => {
            resolve(
                uploader.value.reset()
            )
        }, 1000)
    })
}

function delete_file(uuid) {
    api
        .delete(process.env.VUE_APP_URL + "/files/" + uuid)
        .then((res) => {
            console.log(res.data);
            attachments.value = attachments.value.filter(item => item.uuid !== uuid)
            console.log("after delete: ", attachments.value);
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

// --------------- Form --------------

const { resetForm } = useForm();

const validationSchema = yup.object({
    taskColor: yup.string().required(),
    taskTitle: yup.string().required(),
    taskDescription: yup.string().required('A cool description is required').min(3),
})


const { handleSubmit, errors } = useForm({
    validationSchema
})

const { value: taskTitle } = useField('taskTitle', undefined, { initialValue: props.tasks.title })
const { value: taskDescription } = useField('taskDescription', undefined, { initialValue: props.tasks.description })
const { value: taskColor } = useField('taskColor', undefined, { initialValue: props.tasks.color })



const submit = handleSubmit(values => {
    // isLoading.value = true;

    let data = {
        "author_id": 0,
        "color": taskColor.value,
        "title": taskTitle.value,
        "description": taskDescription.value,
        "files": attachments.value.map(a => a.uuid)
    }

    console.log('submit');
    console.log(data)
    // createTasks(data);
    emit('taskFormBtnClick', data)
})

// --------------- Form --------------

</script>


<style lang="scss"  scoped>

</style>