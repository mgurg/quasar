<template>
  <div>
    <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Reset password") }}</div>
    <div style="max-width: 400px;">
      <p>Podaj email na który założyłeś konto.</p>
      <p>Jeżeli będzie poprawny to otrzymasz wiadomość z linkiem do formularza, gdzie wprowadzisz nowe hasło.</p>

    </div>
    <q-form @submit="submit">
      <q-input
        :model-value="email"
        @change="handleChange"
        :disable="isLoading"
        :error="!!errors.email"
        :error-message="errors.email"
        class="q-mb-md"
        :label="$t('E-mail')"
        outlined
        type="email"
        maxlength="256"
      />

      <div class="row">
        <q-space/>
        <q-btn
          :disable="isLoading"
          :label="$t('Reset password')"
          :loading="isLoading"
          color="primary"
          type="submit"
        />
      </div>
    </q-form>
  </div>
</template>


<script setup>
import {ref} from "vue";
import {useField, useForm} from "vee-validate";
import {object, string} from "yup";
import {useRouter} from "vue-router";
import {useNoAuthAPI} from "src/composables/useNoAuthAPI.js";

const router = useRouter();
const noAuthAPI = useNoAuthAPI();

let isLoading = ref(false);

// -------------- VeeValidate --------------
const validationSchema = object({
  email: string().max(256).required("Provide an valid email").email(),
});

const {handleSubmit, errors} = useForm({
  validationSchema,
});
const {value: email, handleChange} = useField("email");

const submit = handleSubmit(async (values) => {

  isLoading.value = true;
  await noAuthAPI.get(`/auth/reset-password/${email.value}`)


  isLoading.value = false;
  router.push("/login");
});

// --------------- VeeValidate --------------
</script>
