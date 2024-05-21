<template>
  <div>
    <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Reset password") }}</div>
    <div style="max-width: 400px;">
      <p>Podaj nowe hasło.</p>
    </div>

    <q-form @submit="submit">
      <!--      <q-input-->
      <!--        :model-value="password"-->
      <!--        @change="handleChange"-->
      <!--        :disable="isLoading"-->
      <!--        :error="!!errors.password"-->
      <!--        :error-message="errors.password"-->
      <!--        class="q-mb-md"-->
      <!--        :label="$t('E-mail')"-->
      <!--        outlined-->
      <!--        type="password"-->
      <!--      />-->
      <q-input
        v-model="password"
        :disable="isLoading"
        :error="!!errors.password"
        :error-message="errors.password"
        :label="$t('Password')"
        :type="isPwd ? 'password' : 'text'"
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
import {useQuasar} from "quasar";
import {useI18n} from "vue-i18n";
import {useNoAuthAPI} from "src/composables/useNoAuthAPI.js";


const props = defineProps({
  resetToken: {
    type: String,
    default: null,
  },
})

const $q = useQuasar();
const {t} = useI18n();
const router = useRouter();
const noAuthAPI = useNoAuthAPI();

const resetToken = ref(props.resetToken)


let isLoading = ref(false);
const isError = ref(false);
let isPwd = ref(true)

// -------------- VeeValidate --------------
const validationSchema = object({
  password: string().required("Provide an valid password"),
});

const {handleSubmit, errors} = useForm({
  validationSchema,
});
const {value: password, handleChange} = useField("password");

const submit = handleSubmit(async (values) => {
  console.log("submit", values);

  isLoading.value = true;
  const {error} = await noAuthAPI.post(`/auth/reset-password/${resetToken.value}`, {"password": password.value})
  if (error !== null) {
    console.log('Nie udało się zmienić hasła')
    return;
  }
  isLoading.value = false;

  router.push("/login");

  // resetPassword(password.value);
});

// --------------- VeeValidate --------------

// function resetPassword(password) {
//   isLoading.value = true;
//   api.post("/auth/reset-password/" + resetToken.value, {"password": password})
//     .then((res) => {
//
//       isLoading.value = false;
//       router.push("/login");
//     })
//     .catch((err) => {
//       if (err.response) {
//         console.log(err.response);
//       } else if (err.request) {
//         console.log(err.request);
//       } else {
//         console.log("General Error");
//       }
//
//     });
// }
</script>
