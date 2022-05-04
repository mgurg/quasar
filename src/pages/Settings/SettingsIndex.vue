<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">Settings</h5>
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
              <q-radio v-model="color" val="teal" color="teal" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Anonimowo</q-item-label>
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section avatar>
              <q-radio v-model="color" val="orange" color="orange" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Anonimowo po podaniu maila w domenie:
                <q-input outlined dense placeholder="twojafirma.pl"></q-input>
              </q-item-label>
              <q-item-label caption>Przyśpiesz zakładanie konta</q-item-label>
            </q-item-section>
          </q-item>

          <q-item tag="label">
            <q-item-section avatar top>
              <q-radio v-model="color" val="cyan" color="cyan" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Po zalogowaniu</q-item-label>
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

import { ref } from "vue";
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
  },
})

let color = ref('cyan')
// --------------- Form --------------

const { resetForm } = useForm();

const validationSchema = yup.object({
  ActionUrl: yup.string().required(),
  userLastName: yup.string().required(),
  userEmail: yup.string().required(),
  userPhone: yup.string().required(),
})


const { handleSubmit, errors } = useForm({
  validationSchema
})

const { value: ActionUrl } = useField('ActionUrl', undefined, { initialValue: props.user.first_name })
const { value: userLastName } = useField('userLastName', undefined, { initialValue: props.user.last_name })
const { value: userEmail } = useField('userEmail', undefined, { initialValue: props.user.email })
const { value: userPhone } = useField('userPhone', undefined, { initialValue: props.user.phone })

const submit = handleSubmit(values => {



  let data = {
    "first_name": ActionUrl.value,
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

</script>
