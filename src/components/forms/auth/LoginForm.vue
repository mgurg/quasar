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
      {{ errorMsg }}
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

setLocale(pl);

const {t} = useI18n();
const loginErrorMessage = computed(() => t("Error: Check username & password"));
const $q = useQuasar()

let isPwd = ref(true)
let isLoading = ref(false);
const isError = ref(false);
let errorMsg = ref(null);

const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();

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

const submit = handleSubmit(() => {
  LoginUser({email: email.value, password: password.value, permanent: rememberUser.value,});
});

// --------------- VeeValidate --------------

async function LoginUser(data) {
  isLoading.value = true;
  try {
    await UserStore.loginUsers(data.email, data.password, data.permanent);
    // await router.push({path: "/home"});
    await router.push(route.query.redirect || '/home')
  } catch (err) {
    console.log(err);
    $q.notify({
      type: 'warning',
      message: loginErrorMessage,
    });
    // console.log(err.error_description || err.message)
    // console.log(err.data)
    // errorMsg.value = err
  }
  isLoading.value = false;
}
</script>
