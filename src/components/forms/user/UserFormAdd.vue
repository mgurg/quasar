<template>
  <div>
    <q-form autocapitalize="off" autocorrect="off" class="q-gutter-md" spellcheck="false"
            @submit.prevent>
      <div class="row sm-gutter">
        <div class="q-pa-xs col-xs-6 col-sm-6">
          <q-input
            v-model="userFirstName"
            :disable="isLoading"
            :error="!!errors.userFirstName"
            :error-message="errors.userFirstName"
            :label="$t('First name')"
            autocomplete="given-name"
            outlined
            maxlength="100"
          />
        </div>
        <div class="q-pa-xs col-xs-6 col-sm-6">
          <q-input
            v-model="userLastName"
            :disable="isLoading"
            :error="!!errors.userLastName"
            :error-message="errors.userLastName"
            :label="$t('Last name')"
            autocomplete="family-name"
            outlined
            maxlength="100"
          />
        </div>
      </div>
      <div class="row sm-gutter">
        <div class="q-pa-xs col-xs-12 col-sm-6">
          <q-input
            :disable="isLoading"
            :error="!!errors.userEmail"
            :error-message="errors.userEmail"
            :label="$t('E-mail')"
            outlined
            :model-value="userEmail"
            @change="emailChange"
            maxlength="256"
          >
            <template v-slot:prepend>
              <q-icon name="alternate_email"/>
            </template>
            <template v-slot:hint>
              Nie wysyłam żadnego maila, konto aktywne od razu po dodaniu
            </template>
          </q-input>
        </div>
        <div class="q-pa-xs col-xs-12 col-sm-6">
          <q-input
            v-model="userPassword"
            :disable="isLoading"
            :error="!!errors.userPassword"
            :error-message="errors.userPassword"
            :label="$t('Password')"
            :type="isPwd ? 'password' : 'text'"
            autocomplete="new-password"
            outlined
            maxlength="256"
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
            :disable="isLoading"
            :error="!!errors.userPhone"
            :error-message="errors.userPhone"
            :label="$t('Phone')"
            outlined
            :model-value="userPhone"
            @change="phoneChange"
            maxlength="16"
          >
            <template v-slot:prepend>
              <q-icon name="phone"/>
            </template>
          </q-input>
        </div>
        <div class="q-pa-xs col-xs-12 col-sm-6">
          <q-select
            v-model="userRole"
            :error="!!errors.userRole"
            :error-message="errors.userRole"
            :option-disable="opt => Object(opt) === opt ? opt.inactive === true : true"
            :option-label="opt => Object(opt) === opt && 'role_title' in opt ? opt.role_title : '----'" :option-value="opt => Object(opt) === opt && 'uuid' in opt ? opt.uuid : null"
            :options="role"
            emit-value
            label="Rola"
            map-options
            outlined
          >
            <template v-slot:hint>
              <q-btn flat dense  no-caps icon="add" to="/settings/permissions">Zdefiniuj nową rolę</q-btn>
            </template>
          </q-select>
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
        <q-space/>
        <q-btn class="q-mr-lg" color="red-12" flat icon="cancel" type="submit" @click="cancelButtonHandle">
          {{ $t("Cancel") }}
        </q-btn>

        <q-btn color="primary" icon="done" type="submit" @click="submit">{{ $t(buttonText) }}</q-btn>
      </div>
    </q-form>
  </div>
</template>


// https://github.com/guoqunbo8899/vue3_cms/blob/2ecaf7fcae4d548de6582e49efb7998bbca79681/src/components/page-search/src/page-search.vue
// https://www.youtube.com/watch?v=9whgkjxoCME


<script setup>
import {onBeforeMount, ref} from "vue";
import {useField, useForm} from "vee-validate";
import * as yup from 'yup';
import {getRolesRequest} from "components/api/PermissionApiClient";
import {errorHandler} from "components/api/errorHandler";

const props = defineProps({
  user: {
    type: Object,
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
const emit = defineEmits(['userFormBtnClick', 'cancelBtnClick'])

let isError = ref(false);
let isLoading = ref(false);
let role = ref(null)
const isPwd = ref('password')

let model = ref(null);


function getRoles() {
  getRolesRequest({'all':false}).then(function (response) {
    role.value = response.data.items;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


// --------------- Form --------------

const {resetForm} = useForm();

const validationSchema = yup.object({
  userFirstName: yup.string().max(100).required(),
  userLastName: yup.string().max(100).required(),
  userPassword: yup.string().required(),
  userEmail: yup.string().max(256).email().required(),
  userPhone: yup.string().length(9).min(9).max(9).nullable(true),
  userRole: yup.string().required().nullable(true),
})

// const validationEditSchema = yup.object({
//   userFirstName: yup.string().required(),
//   userLastName: yup.string().required(),
//   userPassword: yup.string().nullable(),
//   userEmail: yup.string().email().required(),
//   userPhone: yup.string().nullable(true),
//   userRole: yup.string().required().nullable(true),
// })

const {handleSubmit, errors} = useForm({
  validationSchema
})

const {value: userFirstName} = useField('userFirstName', undefined, {initialValue: props.user.first_name})
const {value: userLastName} = useField('userLastName', undefined, {initialValue: props.user.last_name})
const {value: userPassword} = useField('userPassword', undefined, {initialValue: ''})
const {value: userEmail, handleChange: emailChange} = useField('userEmail', undefined, {initialValue: props.user.email})
const {value: userPhone, handleChange: phoneChange} = useField('userPhone', undefined, {initialValue: props.user.phone})
const {value: userRole} = useField('userRole', undefined, {initialValue: props.user.role_FK.uuid})

const submit = handleSubmit(values => {

  let data = {
    "first_name": userFirstName.value,
    "last_name": userLastName.value,
    "email": userEmail.value,
    "phone": userPhone.value,

    "is_verified": true,
    "user_role_uuid": userRole.value,
  }

  if (userPassword.value !== null && userPassword.value !== "") {
    data["password"] = userPassword.value
    data["password_confirmation"] = userPassword.value
  }

  emit('userFormBtnClick', data)
})

// --------------- Form --------------

function cancelButtonHandle() {
  emit('cancelBtnClick')
}

onBeforeMount(() => {
  getRoles();
});

</script>


<style lang="scss" scoped>
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
