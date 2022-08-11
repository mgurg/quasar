<template>
    <div>
        <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" class="q-gutter-md"
            @submit.prevent>
            <div class="row justify-between items-center">
                <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">{{ $t("Idea") }}</h5>
                <div class="q-gutter-sm">
                    <!-- <span>Color:</span> -->
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
            <q-input outlined v-model="ideaTitle" :disable="isLoading" :error="!!errors.ideaTitle"
                :error-message="errors.ideaTitle" :label="$t('Idea title')">
            </q-input>
            <q-input outlined type="textarea" rows="5" v-model="ideaDescription" :disable="isLoading"
                :error="!!errors.ideaDescription" :error-message="errors.ideaDescription"
                :label="$t('Idea description')">
                <template v-if="isSupported" v-slot:append>
                  <q-btn round dense flat icon="mic" v-if="!isListening" @click="start" />
                  <q-btn round dense flat icon="mic_off" v-if="isListening" color="red-12" @click="stop" />
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
                    <q-img :src="file.url" spinner-color="black" style="height: 100%; width:100% "
                        fit="contain">
                        <q-icon class="absolute all-pointer-events" size="sm" name="delete" color="blue-grey-5"
                            style="top: 8px; right: 8px" @click="delete_file(file.uuid)">
                            <q-tooltip>Tooltip</q-tooltip>
                        </q-icon>
                    </q-img>
                </div>
            </div>

            <!-- MODE -->
            <div v-if="mode == 'anonymous_with_mail'">
                <q-input outlined v-model="email" :disable="isLoading" :error="!!errors.email"
                    :error-message="errors.email" :label="$t('E-mail')">
                </q-input>

                <p>Twój mail nie będzie nigdzie widoczny. Jego podanie jest konieczne żeby zweryfikować że jesteś
                    pracownikiem firmy. Zgłoszenia z prywanych skrzynek (interia.pl, gmail.com, wp.pl) nie są przyjmowane</p>

                <p>Posiadasz konto? Możesz się <router-link to="/login">zalogować i dokonać zgłoszenia jako
                        zarejestrowany użytkownik</router-link>
                </p>
            </div>

            <div class="row">
                <q-btn type="submit" color="red-12" @click="handleReset">Cancel</q-btn>
                <q-space />
                <q-btn type="submit" color="primary" @click="submit" :loading="isLoading">{{ $t(buttonText) }}</q-btn>
            </div>
        </q-form>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useField, useForm } from "vee-validate";
import { DateTime } from 'luxon';
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




// --------------- UPLOADER ---------------

function uploadFile(file) {

    let token = props.token
    if (props.token == null)
        token = UserStore.getToken

    let tenant_id = props.tenant_id
    if (props.tenant_id == null)
        tenant_id = UserStore.getTenant

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
                        'Authorization': 'Bearer ' + token,
                        'tenant' : tenant_id
                    }
                })
                .then((res) => {
                    attachments.value.push(res.data)
                    console.log(res.data)
                    console.log(attachments.value)
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

//voice recognition
watch(result, (newValue, oldValue) => {

    ideaDescription.value = ideaDescription.value + ' ' + newValue 

})


// --------------- Form --------------

const { handleReset } = useForm();

const validationSchema = yup.object({
    ideaColor: yup.string().required(),
    ideaTitle: yup.string().required(),
    ideaDescription: yup.string().required('A cool description is required').min(3),
    email: yup.string().nullable().test(
        "check-startdate",
        "Start Date should not be later than current date",
        function (value) {
            if (value =="1") {
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