<template>
  <div>
    <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Reset password") }}</div>
    <p>Podaj nowe hasło.</p>
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
import {api} from "boot/axios";
import {useField, useForm} from "vee-validate";
import {object, string} from "yup";
import {useRouter} from "vue-router";


const props = defineProps({
  resetToken: {
    type: String,
    default: null,
  },
})


const resetToken = ref(props.resetToken)


let isLoading = ref(false);
let isPwd = ref(true)

const router = useRouter();

// -------------- VeeValidate --------------
const validationSchema = object({
  password: string().required("Provide an valid password"),
});

const {handleSubmit, errors} = useForm({
  validationSchema,
});
const {value: password, handleChange} = useField("password");

const submit = handleSubmit((values) => {
  console.log("submit", values);

  resetPassword(password.value);
});

// --------------- VeeValidate --------------

function resetPassword(password) {
  isLoading.value = true;
  api.post("/auth/reset-password/" + resetToken.value, {"password": password})
    .then((res) => {

      isLoading.value = false;
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
