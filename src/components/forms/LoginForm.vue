<template>
    <div>
        <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Login") }}</div>

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

            <q-checkbox v-model="rememberUser" :label="$t('Remember me for 30 days')" />
            {{ errorMsg }}
            <div class="row">
                <q-space />
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
import { useQuasar } from 'quasar'
import { ref, computed } from "vue";
import { useField, useForm } from "vee-validate";
import { object, string, bool } from "yup";
import { useRouter } from "vue-router";
import { useUserStore } from 'stores/user'
import { useI18n } from 'vue-i18n';
import { fr } from 'yup-locales';
import { setLocale } from 'yup';

setLocale(fr);

const { t } = useI18n();
const someProperty = computed(() => t("Error: Check username & password"));
const $q = useQuasar()

let isPwd = ref(true)
let isLoading = ref(false);
let errorMsg = ref(null);

const router = useRouter();
const UserStore = useUserStore();

// -------------- VeeValidate --------------
const validationSchema = object({
    email: string().required("Provide an valid email").email(),
    password: string().required(),
    rememberUser: bool().required(),
});
const { handleSubmit, errors } = useForm({
    validationSchema,
});
const { value: email, handleChange } = useField("email");
const { value: password } = useField("password");
const { value: rememberUser } = useField("rememberUser", undefined, { initialValue: false });
const submit = handleSubmit((values) => {
    console.log("submit", values);
    let data = {
        email: email.value,
        password: password.value,
        permanent: rememberUser.value,
    };
    LoginUser(data);
});
// --------------- VeeValidate --------------

async function LoginUser(data) {
    isLoading.value = true;
    try {
        await UserStore.loginUsers(data.email, data.password, data.permanent);
        router.push({ path: "/home" });
    }
    catch (err) {
        console.log(err);
        $q.notify({
            type: 'warning',
          message: someProperty,
    });
        // console.log(err.error_description || err.message)
        // console.log(err.data)
        // errorMsg.value = err
    }
    isLoading.value = false;
}
</script>