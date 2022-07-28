<template>
  <div>
    <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Register") }}</div>

    <q-form @submit="submit">
      <!-- <q-input
                v-model="firstName"
                :disable="isLoading"
                :error="!!errors.firstName"
                :error-message="errors.firstName"
                class="q-mb-md"
                :label="$t('E-mail')"
                outlined
                type="text"
            /> -->
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
      />
      <q-input
        v-model="password"
        :disable="isLoading"
        :error="!!errors.password"
        :error-message="errors.password"
        :type="isPwd ? 'password' : 'text'"
        :label="$t('Password')"
        outlined
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <q-checkbox v-model="acceptTOS" 
      keep-color 
      :color="errors.acceptTOS ? 'red': 'primary'" 
      :style="errors.acceptTOS ? 'color:red' : 'color:black'">{{
        $t("I accept the terms and conditions")
      }}</q-checkbox>

      <div class="row">
        <q-space />
        <q-btn
          :disable="isLoading"
          :label="$t('Register')"
          :loading="isLoading"
          color="primary"
          type="submit"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { api } from "boot/axios";
import { useField, useForm } from "vee-validate";
import { object, string, bool } from "yup";
import { useRouter } from "vue-router";
import { useUserStore } from "stores/user";

let isPwd = ref(true);
let isLoading = ref(false);
let errorMsg = ref(null);

const router = useRouter();
const UserStore = useUserStore();

// -------------- VeeValidate --------------
const validationSchema = object({
  // firstName: string().required(),
  email: string().required("Provide an valid email").email(),
  password: string().required(),
  acceptTOS: bool().required().oneOf([true], "!"),
});

const { handleSubmit, errors } = useForm({
  validationSchema,
});

// const { value: firstName } = useField("firstName");
const { value: email, handleChange } = useField("email");
const { value: password } = useField("password");
const { value: acceptTOS } = useField("acceptTOS", undefined, { initialValue: false });

const submit = handleSubmit((values) => {
  console.log("submit", values);

  function getLocale() {
    const userLocale =
      localStorage.getItem("lang") ||
      sessionStorage.getItem("lang") ||
      navigator.language.split("-")[0] ||
      "en-US";

    // if detectedLocale is 'en' or 'es' return
    if (["de", "en-US", "fr", "pl"].indexOf(userLocale) >= 0) {
      return userLocale;
    }
    // else return default value
    return "en-US";
  }

  let data = {
    // name: email.value,
    email: email.value,
    password: password.value,
    password_confirmation: password.value,
    tos: acceptTOS.value,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Warsaw",
    lang: getLocale(),
  };
  console.log(data);

  registerAdmin(data);
});
// --------------- VeeValidate --------------

async function registerAdmin(data) {
  isLoading.value = true;
  api
    .post("auth/register", data)
    .then((res) => {
      console.log(res.data);
      isLoading.value = false;
      router.push("/new_account");
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
  isLoading.value = false;
}
</script>
