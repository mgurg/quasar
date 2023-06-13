<template>
  <div>
    <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Last step") }}</div>
    <p>{{ $t("Say something about yourself.") }}</p>
    <q-form @submit="submit">
      <q-input v-model="firstName" :disable="isLoading" :error="!!errors.firstName" :error-message="errors.firstName"
               class="q-mb-md" :label="$t('First Name')" outlined type="text"/>
      <q-input v-model="lastName" :disable="isLoading" :error="!!errors.lastName" :error-message="errors.lastName"
               class="q-mb-md" :label="$t('Last Name')" outlined type="text"/>
      <q-input v-model="nip" :disable="isLoading" :error="!!errors.nip" :error-message="errors.nip" type="text"
               :label="$t('NIP')" outlined>
      </q-input>
      <p style="max-width: 400px;">Pierwszy użytkownik w firmie jest jednocześnie administratorem systemu. <br>
        Jeżeli Twoja firma posiada już konto to zostanie utworzone dla ciebie użytkownik o standardowych uprawnieniach.
        <br>
        Będzie musiało być potwierdzone przez administratora.

      </p>

      <div class="row">
        <q-space/>
        <q-btn :disable="isLoading" :label="$t('Lets start') + '! 🚀'" :loading="isLoading" color="red-12"
               type="submit"/>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {api} from "boot/axios";
import {useField, useForm} from "vee-validate";
import {object, string} from "yup";
import {useRouter} from "vue-router";
import {useUserStore} from "stores/user";
import {validatePolish} from 'validate-polish';

const props = defineProps({
  activationId: {
    type: String,
    default: null,
  },
})

let isLoading = ref(false);
const isError = ref(false);


const router = useRouter();
const UserStore = useUserStore();

// -------------- VeeValidate --------------
const validationSchema = object({
  firstName: string().required().min(2).max(100),
  lastName: string().required().min(2).max(100),
  nip: string().required().max(16),
});

const {handleSubmit, errors} = useForm({
  validationSchema,
});

const {value: firstName} = useField("firstName");
const {value: lastName} = useField("lastName");
const {value: nip} = useField("nip", undefined, {initialValue: "123-456-32-18"});

const submit = handleSubmit((values) => {

  let nip_plain = nip.value.replace(/\D/g, "");

  let data = {
    first_name: firstName.value,
    last_name: lastName.value,
    nip: nip_plain,
    token: props.activationId,
  };

  if (!validatePolish.nip(nip_plain)) {
    alert(`Invalid nip.`); // TODO replace alert with notify

  } else {
    firstRun(data);
  }


});

// --------------- VeeValidate --------------

function firstRun(data) {
  isLoading.value = true;
  api
    .post("auth/first_run", data)
    .then((res) => {
      isLoading.value = false;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("tz", res.data.tz);
      localStorage.setItem("lang", res.data.lang);
      localStorage.setItem("firstName", res.data.first_name);
      localStorage.setItem("lastName", res.data.last_name);
      localStorage.setItem("uuid", res.data.uuid);
      localStorage.setItem("tenant", res.data.tenanat_id);

      UserStore.fillStore(
        res.data.token,
        res.data.tenanat_id,
        res.data.first_name,
        res.data.last_name,
        res.data.uuid,
        res.data.tz,
        res.data.lang
      )
      router.push("/login");
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
