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
          />
        </div>
      </div>
      <div class="row sm-gutter">
        <div class="q-pa-xs col-xs-12 col-sm-6">
          <q-input
            v-model="userEmail"
            :disable="isLoading"
            :error="!!errors.userEmail"
            :error-message="errors.userEmail"
            :label="$t('E-mail')"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="alternate_email"/>
            </template>
          </q-input>
        </div>
        <div class="q-pa-xs col-xs-12 col-sm-6">
          <q-input
            v-model="userPhone"
            :disable="isLoading"
            :error="!!errors.userPhone"
            :error-message="errors.userPhone"
            :label="$t('Phone')"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="phone"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row sm-gutter">
        <div class="q-pa-xs col-xs-12 col-sm-6">
          <q-select
            v-model="userRole"
            :disable="currentUserUuid === props.user.uuid"
            :error="!!errors.userRole"
            :error-message="errors.userRole"
            :option-disable="opt => Object(opt) === opt ? opt.inactive === true : true"
            :option-label="opt => Object(opt) === opt && 'role_title' in opt ? opt.role_title : '----'"
            :option-value="opt => Object(opt) === opt && 'uuid' in opt ? opt.uuid : null"
            :options="role"
            emit-value
            label="Rola"
            map-options
            outlined
          />
        </div>
        <div class="q-pa-xs col-xs-12 col-sm-6">
          <!-- <q-checkbox
            v-model="userAccept"
            label="Zezwól na logowanie i korzystanie z aplikacji"
          /> -->
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


<script setup>
import {onBeforeMount, ref} from "vue";
import {useField, useForm} from "vee-validate";
import * as yup from 'yup';
import {getRolesRequest} from "components/api/PermissionApiClient";
import {errorHandler} from "components/api/errorHandler";
import {useUserStore} from "stores/user";

const props = defineProps({
  user: {
    type: Object,
    default() {
      return {
        first_name: '',
        last_name: '',
        email: '',
        phone: null,
        role_FK: {uuid: null},
        uuid: null
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

console.log(props.user)

const UserStore = useUserStore();
const currentUserUuid = UserStore.getCurrentUserId

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

// const validationAddSchema = yup.object({
//   userFirstName: yup.string().required(),
//   userLastName: yup.string().required(),
//   userAccept: yup.string().required(),
//   userEmail: yup.string().email().required(),
//   userPhone: yup.string().length(9).min(9).max(9).nullable(true),
//   userRole: yup.string().required().nullable(true),
// })

const validationSchema = yup.object({
  userFirstName: yup.string().required(),
  userLastName: yup.string().required(),
  userAccept: yup.string().nullable(),
  userEmail: yup.string().email().required(),
  userPhone: yup.string().nullable(true),
  userRole: yup.string().required().nullable(true),
})

const {handleSubmit, errors} = useForm({
  validationSchema
})

const {value: userFirstName} = useField('userFirstName', undefined, {initialValue: props.user.first_name})
const {value: userLastName} = useField('userLastName', undefined, {initialValue: props.user.last_name})
const {value: userAccept} = useField('userAccept', undefined, {initialValue: false})
const {value: userEmail} = useField('userEmail', undefined, {initialValue: props.user.email})
const {value: userPhone} = useField('userPhone', undefined, {initialValue: props.user.phone ? props.user.phone.slice(3): ""})
const {value: userRole} = useField('userRole', undefined, {initialValue: props.user.role_FK.uuid})

const submit = handleSubmit(values => {

  let data = {
    "first_name": userFirstName.value,
    "last_name": userLastName.value,
    "email": userEmail.value,
    "phone" : "",
    // "is_verified": userAccept.value,
    "user_role_uuid": userRole.value,
  }

  if (userPhone.value !== "") {
    console.log(userPhone.value)
    data['phone'] = "+48" + userPhone.value; //E164
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
