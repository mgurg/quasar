<template>
  <div>
    <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Last step") }}</div>
    <p>{{ $t("Say something about yourself.") }}</p>
    <q-form @submit="submit">
      <q-input
                v-model="firstName"
                :disable="isLoading"
                :error="!!errors.firstName"
                :error-message="errors.firstName"
                class="q-mb-md"
                :label="$t('First Name')"
                outlined
                type="text"
            />
      <q-input
        v-model="lastName"
        :disable="isLoading"
        :error="!!errors.lastName"
        :error-message="errors.lastName"
        class="q-mb-md"
        :label="$t('Last Name')"
        outlined
        type="text"
      />
      <q-input
        v-model="nip"
        :disable="isLoading"
        :error="!!errors.nip"
        :error-message="errors.nip"
        type="text"
        :label="$t('NIP')"
        outlined
      >
      </q-input>

      <div class="row">
        <q-space />
        <q-btn
          :disable="isLoading"
          :label="$t('Lets start')+'! 🚀'"
          :loading="isLoading"
          color="red"
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

const props = defineProps({
    activationId: {
        type: String,
        default: null,
    },
})

let isLoading = ref(false);


const router = useRouter();
const UserStore = useUserStore();

// -------------- VeeValidate --------------
const validationSchema = object({
  firstName: string().required().min(2),
  lastName: string().required().min(2),
  nip: string().required(),
});

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: firstName } = useField("firstName");
const { value: lastName } = useField("lastName");
const { value: nip } = useField("nip", undefined, { initialValue: "123-456-32-18" });

const submit = handleSubmit((values) => {
  console.log("submit", values);

  let data = {
    first_name: firstName.value,
    last_name: lastName.value,
    nip: nip.value,
    token: props.activationId,

  };
  console.log(data);

  firstRun(data);
});
// --------------- VeeValidate --------------

async function firstRun(data) {
  isLoading.value = true;
  api
    .post("auth/first_run", data)
    .then((res) => {
      console.log(res.data);
      isLoading.value = false;
      sessionStorage.setItem("klucz", res.data.token);
      router.push({ path: "/login" });
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
