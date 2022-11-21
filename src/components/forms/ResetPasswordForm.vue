<template>
    <div>
        <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Reset password") }}</div>

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
            />

            <div class="row">
                <q-space />
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
import { ref } from "vue";
import { api } from "boot/axios";
import { useField, useForm } from "vee-validate";
import { object, string, bool } from "yup";
import { useRouter } from "vue-router";

let isLoading = ref(false);

const router = useRouter();

// -------------- VeeValidate --------------
const validationSchema = object({
    email: string().required("Provide an valid email").email(),
});

const { handleSubmit, errors } = useForm({
    validationSchema,
});
const { value: email, handleChange } = useField("email");

const submit = handleSubmit((values) => {
    console.log("submit", values);

    resetPassword(email.value);
});
// --------------- VeeValidate --------------

function resetPassword(email) {
    isLoading.value = true;
    api.get("/auth/remind-password/" + email)
        .then((res) => {
            
            isLoading.value = false;
            router.push("/tasks");
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