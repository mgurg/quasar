<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">Settings</h5>
      <q-btn color="primary" type="submit" @click="load">Load</q-btn>
      <q-btn color="primary" type="submit" @click="save">Save</q-btn>
      <div class="q-pa-mt">&nbsp;</div>

      <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" class="q-gutter-md"
        @submit.prevent>
        <p class="text-h6">Kod QR:</p>
        <q-input outlined v-model="ActionUrl" :disable="isLoading" :error="!!errors.ActionUrl"
          :error-message="errors.ActionUrl" label="https://intio.es/new/8tl" />

        <p class="text-h6">Wysłanie zgłoszenia:</p>
        <q-list>
          <q-item tag="label">
            <q-item-section avatar>
              <q-radio v-model="registrationMode" val="anonymous" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Anonimowo</q-item-label>
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section avatar>
              <q-radio v-model="registrationMode" val="anonymous_with_mail" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Anonimowo po podaniu maila w domenie:
                <q-input outlined dense :placeholder="registrationMailDomain"></q-input>
              </q-item-label>
              <q-item-label caption>Przyśpiesz zakładanie konta</q-item-label>
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section avatar top>
              <q-radio v-model="registrationMode" val="logged_only" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Wyłącznie po zalogowaniu</q-item-label>
              <q-item-label caption>Wymagane jest posiadanie konta</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>


        <!-- <q-input
                outlined
                v-model="ActionUrl"
                :disable="isLoading"
                :error="!!errors.ActionUrl"
                :error-message="errors.ActionUrl"
                :label="$t('First name')"
            /> -->
      </q-form>

    </q-page>
  </div>
</template>

<script setup>

import { ref, onBeforeMount} from "vue";
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

      }
    }
  }
  })

// -----------------------------


onBeforeMount(() => {
  console.log('b')
//   isLoading.value = true;
  load()
});

function load() {
  isLoading.value = true;

  var arr = ["idea_registration_mode", "issue_registration_email"]
  var params = new URLSearchParams();
  arr.forEach(element => {
    params.append("setting_names", element);
  });

  authApi
    .get("/settings/", { params: params })
    .then((res) => {
      console.log(res.data);
      registrationMode.value = res.data.idea_registration_mode
      registrationMode.value = res.data.idea_registration_mode
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

function save() {
  console.log('save')
  isLoading.value = true;

  let data = [{
    "entity": "idea_registration_mode",
    "value": registrationMode.value,
    "value_type": "string"
  }]


  authApi
    .post("/settings/", data)
    .then((res) => {
      console.log(res.data);

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

let isLoading = ref(false);

let registrationMode = ref('anonymous')
let registrationMailDomain = ref('twojafirma.pl')
// --------------- Form --------------

const { resetForm } = useForm();

const validationSchema = yup.object({
  ActionUrl: yup.string().required(),
  userEmail: yup.string().required(),
})


const { handleSubmit, errors } = useForm({
  validationSchema
})

const { value: ActionUrl } = useField('ActionUrl', undefined, { initialValue: props.user.first_name })
const { value: userEmail } = useField('userEmail', undefined, { initialValue: props.user.email })

const submit = handleSubmit(values => {



  let data = {
    "first_name": ActionUrl.value,
    "email": userEmail.value,
  }


  console.log('submit');
  console.log(data)
  emit('userFormBtnClick', data)
})

// --------------- Form --------------

</script>
