<template>
  <div>
    <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Login") }}</div>

    <q-form @submit="submit">
      <q-input
        :disable="isLoading"
        :error="!!errors.email"
        :error-message="errors.email"
        :label="$t('E-mail')"
        :model-value="email"
        class="q-mb-md"
        outlined
        type="email"
        @change="handleChange"
        maxlength="265"
      />
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

      <!--      <q-checkbox v-model="rememberUser" :label="$t('Remember me for 30 days')"/>-->

      <div class="row">
        <q-space/>
        <q-btn
          :disable="isLoading"
          :label="$t('Login')"
          :loading="isLoading"
          color="primary"
          type="submit"
        />
      </div>
    </q-form>
  </div>
</template>


<script setup>
import {computed, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useQuasar} from 'quasar'
import {useUserStore} from 'stores/user'
import {useField, useForm} from "vee-validate";
import {bool, object, setLocale, string} from "yup";
import {useI18n} from 'vue-i18n';
import {pl} from 'yup-locales';
import {useNoAuthAPI} from "src/composables/useNoAuthAPI.js";

setLocale(pl); // TODO: adjust to supported languages
const $q = useQuasar()
const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();
const noAuthAPI = useNoAuthAPI();

let isPwd = ref(true)
let isLoading = ref(false);

// -------------- VeeValidate --------------
const validationSchema = object({
  email: string().max(256).required("Provide an valid email").email(),
  password: string().required(),
  rememberUser: bool().required(),
});
const {handleSubmit, errors} = useForm({
  validationSchema,
});
const {value: email, handleChange} = useField("email");
const {value: password} = useField("password");
const {value: rememberUser} = useField("rememberUser", undefined, {initialValue: false});

const submit = handleSubmit(async () => {
  isLoading.value = true;
  const {data, error} = await noAuthAPI.post("/auth/login", {
    email: email.value,
    password: password.value,
    permanent: rememberUser.value
  })
  if (error !== null) //&& error.response.status === 404
  {
    $q.notify({type: 'warning', message:  t("LoginForm.checkUsernamePassword")});
  }
  isLoading.value = false;

  if (await UserStore.loginUsers(data) === true) {
    console.log("User logged in")
    await router.push(route.query.redirect.trim() || '/home')
  }
});
</script>
