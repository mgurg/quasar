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
        <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">{{ $t("Employees") }}</h5>

            </div>
            <q-input
                outlined
                v-model="userFirstName"
                :disable="isLoading"
                :error="!!errors.userFirstName"
                :error-message="errors.userFirstName"
                :label="$t('First name')"
            />
            <q-input
                outlined
                v-model="userLastName"
                :disable="isLoading"
                :error="!!errors.userLastName"
                :error-message="errors.userLastName"
                :label="$t('Last name')"
            />
            <q-input
                outlined
                v-model="userEmail"
                :disable="isLoading"
                :error="!!errors.userEmail"
                :error-message="errors.userEmail"
                :label="$t('E-mail')"
            />
            <q-input
                outlined
                v-model="userPhone"
                :disable="isLoading"
                :error="!!errors.userPhone"
                :error-message="errors.userPhone"
                :label="$t('Phone')"
            />


            <div class="row">
                <q-btn type="submit" color="red-12" @click="cancelButtonHandle">{{ $t("Cancel") }}</q-btn>
                <q-space />
                <q-btn type="submit" color="primary" @click="submit">{{ $t(buttonText) }}</q-btn>
            </div>
        </q-form>
    </div>
</template>


// https://github.com/guoqunbo8899/vue3_cms/blob/2ecaf7fcae4d548de6582e49efb7998bbca79681/src/components/page-search/src/page-search.vue
// https://www.youtube.com/watch?v=9whgkjxoCME


<script setup>
import { ref } from "vue";
import { useField, useForm } from "vee-validate";
import { DateTime } from 'luxon';
import * as yup from 'yup';
import { api } from "boot/axios";

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

            }
        }
    },
    // usersList: {
    //     type: Object,
    //     default() {
    //         return {
    //             label: null,
    //             value: null,
    //         }
    //     }
    // },

    buttonText: {
        type: String,
        default: 'Save',
    },
})
// emits: ['taskFormBtnClick'],
const emit = defineEmits(['userFormBtnClick', 'cancelBtnClick'])

let isError = ref(false);
let isLoading = ref(false);





// --------------- Form --------------

const { resetForm } = useForm();

const validationSchema = yup.object({
    userFirstName: yup.string().required(),
    userLastName: yup.string().required(),
    userEmail: yup.string().required(),
    userPhone: yup.string().nullable(),
})


const { handleSubmit, errors } = useForm({
    validationSchema
})

const { value: userFirstName } = useField('userFirstName', undefined, { initialValue: props.user.first_name })
const { value: userLastName } = useField('userLastName', undefined, { initialValue: props.user.last_name })
const { value: userEmail } = useField('userEmail', undefined, { initialValue: props.user.email })
const { value: userPhone } = useField('userPhone', undefined, { initialValue: props.user.phone })

const submit = handleSubmit(values => {



    let data = {
        "first_name": userFirstName.value,
        "last_name": userLastName.value,
        "email": userEmail.value,
        "phone": userPhone.value,
        // "user": taskAssignee.value,
    }


    console.log('submit');
    console.log(data)
    emit('userFormBtnClick', data)
})

// --------------- Form --------------

function  cancelButtonHandle()
{
    console.log('cancelBtnClick')
    emit('cancelBtnClick')
}

</script>


<style lang="scss"  scoped>
input[type="checkbox"] {
    display: none;
}

input[type="checkbox"] {
    display: none;
}

input[type="checkbox"] + label {
    color: #ccc;
    cursor: pointer;
}

input[type="checkbox"]:checked + label {
    color: #333;
    font-weight: bold;
}
</style>