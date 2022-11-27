<template>
    <div>
        <q-form autocorrect="off" autocapitalize="off" spellcheck="false" class="q-gutter-md"
            @submit.prevent>
            <!-- <div class="row justify-between items-center">
                <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">{{ $t("Employee") }}</h5>

            </div> -->
            <div class="row sm-gutter">
                <div class="q-pa-xs col-xs-6 col-sm-6">
                    <q-input 
                        outlined 
                        v-model="userFirstName" 
                        :disable="isLoading" 
                        :error="!!errors.userFirstName"
                        :error-message="errors.userFirstName" 
                        :label="$t('First name')" 
                        autocomplete="given-name"
                    />
                </div>
                <div class="q-pa-xs col-xs-6 col-sm-6">
                    <q-input 
                        outlined 
                        v-model="userLastName" 
                        :disable="isLoading" 
                        :error="!!errors.userLastName"
                        :error-message="errors.userLastName" 
                        :label="$t('Last name')"
                        autocomplete="family-name" 
                    />
                </div>
            </div>
            <div class="row sm-gutter">
                <div class="q-pa-xs col-xs-12 col-sm-6">
                    <q-input 
                        outlined 
                        v-model="userEmail" 
                        :disable="isLoading" 
                        :error="!!errors.userEmail"
                        :error-message="errors.userEmail" 
                        :label="$t('E-mail')" 
                    />
                </div>
                <div class="q-pa-xs col-xs-12 col-sm-6">
                    <q-input
                        outlined
                        v-model="userPassword"
                        :disable="isLoading"
                        :error="!!errors.userPassword"
                        :error-message="errors.userPassword"
                        :type="isPwd ? 'password' : 'text'"
                        :label="$t('Password')"
                        autocomplete="new-password" 
                    >
                    <template v-slot:append>
                        <q-icon
                            :name="isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="isPwd = !isPwd"
                        />
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="row sm-gutter">
                <div class="q-pa-xs col-xs-12 col-sm-6">
                    <q-input 
                        outlined 
                        v-model="userPhone" 
                        :disable="isLoading" 
                        :error="!!errors.userPhone"
                        :error-message="errors.userPhone" 
                        :label="$t('Phone')" 
                    />
                </div>
                <div class="q-pa-xs col-xs-12 col-sm-6">
                    <q-select 
                        outlined 
                        v-model="userRole" 
                        label="Rola" 
                        :error="!!errors.userRole"
                        :error-message="errors.userRole" :options="role"
                        :option-value="opt => Object(opt) === opt && 'uuid' in opt ? opt.uuid : null"
                        :option-label="opt => Object(opt) === opt && 'role_title' in opt ? opt.role_title : '----'"
                        :option-disable="opt => Object(opt) === opt ? opt.inactive === true : true" 
                        emit-value 
                        map-options 
                    />
                </div>
            </div>

            <div class="row sm-gutter">
                <div class="q-pa-xs col-xs-6 col-sm-6">

                </div>
                <div class="q-pa-xs col-xs-6 col-sm-6">
                    <!-- <q-select 
                        outlined
                        label="Grupa"  
                    /> -->
                </div>
            </div>

            <div class="row">
                <q-space />
                <q-btn flat type="submit" class="q-mr-lg"  color="red-12" icon="cancel" @click="cancelButtonHandle">{{ $t("Cancel") }}</q-btn>
                
                <q-btn type="submit" color="primary" icon="done" @click="submit">{{ $t(buttonText) }}</q-btn>
            </div>
        </q-form>
    </div>
</template>


// https://github.com/guoqunbo8899/vue3_cms/blob/2ecaf7fcae4d548de6582e49efb7998bbca79681/src/components/page-search/src/page-search.vue
// https://www.youtube.com/watch?v=9whgkjxoCME


<script setup>
import { ref, onBeforeMount } from "vue";
import { authApi } from "boot/axios";
import { useField, useForm } from "vee-validate";
import * as yup from 'yup';

const props = defineProps({
    user: {
        type: Object,
        // Object or array defaults must be returned from
        // a factory function
        default() {
            return {
                first_name: '',
                last_name: '',
                email: '',
                phone: null,
                role_FK: {uuid: null}

            }
        }
    },

    buttonText: {
        type: String,
        default: 'Save',
    },
})
// emits: ['taskFormBtnClick'],
const emit = defineEmits(['userFormBtnClick', 'cancelBtnClick'])

let isError = ref(false);
let isLoading = ref(false);
let role = ref(null)
const isPwd = ref('password')

let model = ref(null);


function getRoles(){
    authApi
    .get("/permissions/")
    .then((res) => {
      role.value = res.data.items;
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
    });
}



// --------------- Form --------------

const { resetForm } = useForm();

const validationSchema = yup.object({
    userFirstName: yup.string().required(),
    userLastName: yup.string().required(),
    userPassword: yup.string().required(),
    userEmail: yup.string().email().required(),
    userPhone: yup.string().nullable(),
    userRole: yup.string().required(),
})


const { handleSubmit, errors } = useForm({
    validationSchema
})

const { value: userFirstName } = useField('userFirstName', undefined, { initialValue: props.user.first_name })
const { value: userLastName } = useField('userLastName', undefined, { initialValue: props.user.last_name })
const { value: userPassword } = useField('userPassword', undefined, { initialValue: "" })
const { value: userEmail } = useField('userEmail', undefined, { initialValue: props.user.email })
const { value: userPhone } = useField('userPhone', undefined, { initialValue: props.user.phone })
const { value: userRole } = useField('userRole', undefined, { initialValue: props.user.role_FK.uuid })

const submit = handleSubmit(values => {

    let data = {
        "first_name": userFirstName.value,
        "last_name": userLastName.value,
        "email": userEmail.value,
        "phone": userPhone.value,
        "password": "string",
        "password_confirmation": "string",
        "is_verified": true,
        "user_role_uuid": userRole.value,
    }

    emit('userFormBtnClick', data)
})

// --------------- Form --------------

function cancelButtonHandle() {
    console.log('cancelBtnClick')
    emit('cancelBtnClick')
}

onBeforeMount(() => {
    getRoles();
});

</script>


<style lang="scss"  scoped>
input[type="checkbox"] {
    display: none;
}

input[type="checkbox"] {
    display: none;
}

input[type="checkbox"]+label {
    color: #ccc;
    cursor: pointer;
}

input[type="checkbox"]:checked+label {
    color: #333;
    font-weight: bold;
}
</style>