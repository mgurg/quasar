<template>
    <div>
        <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" class="q-gutter-md"
            @submit.prevent>
            <div class="row justify-between items-center">
                <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">{{ $t("Idea") }}</h5>
                <div class="q-gutter-sm">
                    <!-- <span>Color:</span> -->
                    <span>
                        <q-radio keep-color v-model="ideaColor" val="teal" color="teal" />
                    </span>
                    <span>
                        <q-radio keep-color v-model="ideaColor" val="orange" color="orange" />
                    </span>
                    <span>
                        <q-radio keep-color v-model="ideaColor" val="red" color="red" />
                    </span>
                    <span>
                        <q-radio keep-color v-model="ideaColor" val="cyan" color="cyan" />
                    </span>
                </div>
            </div>
            <q-input outlined v-model="ideaTitle" :disable="isLoading" :error="!!errors.ideaTitle"
                :error-message="errors.ideaTitle" :label="$t('Idea title')">
                <template v-slot:append>
                    <q-btn round dense flat icon="add" />
                </template>
            </q-input>
            <q-input outlined type="textarea" rows="5" v-model="ideaDescription" :disable="isLoading"
                :error="!!errors.ideaDescription" :error-message="errors.ideaDescription"
                :label="$t('Idea description')">
                <template v-slot:append>
                    <q-btn round dense flat icon="add" />
                </template>
            </q-input>

            <!-- UPLOADER -->
            <q-uploader @added="uploadFile" @finish="uploadFinished" ref="uploader" field-name="file"
                label="No thumbnails" color="amber" accept=".jpg, image/*" flat bordered text-color="black"
                no-thumbnails style="width: auto;" v-if="attachments.length < 4" />

            <!-- IMG -->
            <div class="row q-col-gutter-xs">
                <div class="col-xs-6 col-sm-6 col-md-3 col-lg-3" v-for="(file, index) in attachments"
                    v-bind:key="index">
                    <q-img :src="download_file(file.uuid)" spinner-color="black" style="height: 100%; width:100% "
                        fit="contain">
                        <q-icon class="absolute all-pointer-events" size="sm" name="delete" color="blue-grey-5"
                            style="top: 8px; right: 8px" @click="delete_file(file.uuid)">
                            <q-tooltip>Tooltip</q-tooltip>
                        </q-icon>
                    </q-img>
                </div>
            </div>

            <!-- MODE -->
            <div v-if="mode != 'anonymous'">
                <q-input outlined v-model="email" :disable="isLoading" :error="!!errors.email"
                    :error-message="errors.email" :label="$t('E-mail')">
                </q-input>

                <p>Twój mail nie będzie nigdzie widoczny. Jego podanie jest konieczne żeby zweryfikować że jesteś
                    pracownikiem firmy. Pamiętaj że musi kończyć się w domenie <b>@twojafima.pl</b>.</p>
                <p>Zgłoszenia z prywanych skrzynek (interia.pl, gmail.com, wp.pl nie są przyjmowane)</p>

                <p>Posiadasz konto? Możesz się <router-link to="/login">zalogować i dokonać zgłoszenia jako
                        zarejestrowany użytkownik</router-link>
                </p>
            </div>

            <div class="row">
                <q-btn type="submit" color="red" @click="handleReset">Cancel</q-btn>
                <q-space />
                <q-btn type="submit" color="primary" @click="submit" :loading="isLoading">{{ $t(buttonText) }}</q-btn>
            </div>
        </q-form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useField, useForm } from "vee-validate";
import { DateTime } from 'luxon';
import * as yup from 'yup';
import { api, authApi } from "boot/axios";
import { useUserStore } from "stores/user";
import Compressor from 'compressorjs';

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
    mode: {
        type: String,
        default: 'anonymous',
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


// --------------- UPLOADER ---------------

function uploadFile(file) {

    let token = props.token
    if (props.token == null)
        token = UserStore.getToken


    new Compressor(file[0], {
        quality: 0.6,
        maxWidth: 1600,
        mimeType: 'image/jpeg',
        success(result) {
            const formData = new FormData();

            // The third parameter is required for server
            formData.append('file', result, result.name);

            // size check
            let img = new Image();
            let objectURL = URL.createObjectURL(result);
            img.onload = function () { console.log(img.width, img.height) }
            img.src = objectURL

            console.log(result.size, result.type, result.name, result.lastModified)
            console.log(token)

            isLoading.value = true;
            api
                .post(process.env.VUE_APP_URL + "/files/", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + token
                    }
                })
                .then((res) => {
                    attachments.value.push(res.data)
                    uploader.value.reset()
                    isLoading.value = false;
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


        },
        error(err) {
            console.log(err.message);
        },
    });

}


let uploader = ref("");

function download_file(uuid) {

    return process.env.VUE_APP_URL + "/files/download/" + uuid
}

function uploadUrl() {
    return process.env.VUE_APP_URL + "/files/"
}

function uploadFinished() {
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
    authApi
        .delete(process.env.VUE_APP_URL + "/files/" + uuid)
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

// --------------- Form --------------

const { handleReset } = useForm();

const validationSchema = yup.object({
    ideaColor: yup.string().required(),
    ideaTitle: yup.string().required(),
    ideaDescription: yup.string().required('A cool description is required').min(3),
    email: yup.string().nullable(),
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
        "title": ideaTitle.value,
        "description": ideaDescription.value,
        "files": attachments.value.map(a => a.uuid)
    }

    emit('ideaFormBtnClick', data)
    handleReset();
})

// --------------- Form --------------

</script>


<style lang="scss"  scoped>
</style>