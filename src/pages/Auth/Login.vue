<template>
    <!-- https://github.com/patrickmonteiro/quasar-warren -->
    <div class="row justify-center" style="height: 100vh">
        <div class="col-xs-12 col-sm-6 flex container-logo bg-blue-grey-7" v-if="fade">
            <div class="column self-center q-mx-auto">
                <!-- <img
                    class="q-mx-auto"
                    src="~assets/quasar-logo-vertical.svg"
                    :width="$q.screen.gt.sm ? 'auto' : '50'"
                />-->
                <!-- <div
                    :class="
                        $q.screen.gt.sm
                            ? 'text-center text-h2 text-weight-bolder text-white'
                            : 'text-center text-h5 text-weight-bolder text-white'
                    "
                >-->
                <!-- Intio -->
                <div class="q-ma-lg text-left text-white power-text">
                    <h1 class="text-h3">Intio</h1>
                    <p class="text-h4 text-weight-light">Empowering life safety with technology</p>
                    <p
                        class="text-h6"
                    >With over 40-years of experience in life-safety systems, we are revolutionizing industries that protect us most.</p>
                </div>
                <!-- </div> -->
            </div>
        </div>
        <!--  -->
        <div class="column q-gutter-y-lg q-pa-md self-center q-mx-auto">
            <div
                :class="
                    $q.screen.gt.sm
                        ? 'text-h5 text-weight-bold'
                        : 'text-h6 text-weight-bold'
                "
            >Zaloguj się</div>

            <q-form @submit="submit">
                <q-input
                    v-model="email"
                    :disable="isLoading"
                    :error="!!errors.email"
                    :error-message="errors.email"
                    class="q-mb-md"
                    :label="$t('Email')"
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

            <!-- <label v-if="!login">E-mail</label>
            <q-input required v-if="!login" filled bottom-slots v-model="email">
                <template v-slot:prepend>
                    <q-icon name="email" />
                </template>
            </q-input>
            <label v-if="login">Senha para {{ email }}</label>
            <q-input v-if="login" filled bottom-slots v-model="password">
                <template v-slot:prepend>
                    <q-icon name="lock" />
                </template>
            </q-input>
            <q-btn
                id="btn-login"
                rounded
                color="positive"
                size="xl"
                label="Continuar"
                :loading="loading1"
                @click="simulateProgress(1)"
            >
                <template v-slot:loading>
                    <q-spinner-gears />
                </template>
            </q-btn>-->
            <div class="divider q-mt-lg q-mb-sm"></div>
            <div class="row">
                <div class="col-12">
                    <p class="text-body2 q-pa-xs">
                        <a href="#">{{ $t('Register') }}</a> ·
                        <a href="#">{{ $t('Register') }}</a> ·
                        <router-link to="reset_password">{{ $t('Reset password') }}</router-link>
                        · {{ $t('I need help') }}
                    </p>
                </div>
            </div>

            <!-- <div class="row">
                <div class="col-12">
                    <div class="row justify-center q-gutter-lg">
                        <div class="col-5">
                            <q-btn
                                v-show="!login"
                                class="float-right"
                                size="18.7px"
                                round
                                color="blue-10"
                                icon="fab fa-facebook-f"
                            />
                        </div>
                        <div class="col-5">
                            <q-btn
                                v-show="!login"
                                class
                                size="18.7px"
                                round
                                color="black"
                                icon="fab fa-apple"
                            />
                        </div>
                        <div class="col-12 q-mt-xl">
                            <div
                                v-if="!login"
                                class="text-weight-bold text-uppercase text-center cursor-pointer"
                            >Ainda não sou cliente</div>
                            <div
                                v-else
                                class="text-weight-bold text-uppercase text-center cursor-pointer"
                            >Esqueci minha senha</div>
                        </div>
                    </div>
                </div>
            </div>-->
        </div>
    </div>
</template>
<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref } from "vue";
import { useField, useForm } from "vee-validate";
import { object, string, bool } from 'yup'


let isLoading = ref(false);
let isError = ref(false);
let errorMsg = ref(null);
let loading1 = ref(false);
let login = ref(false);
let fade = ref(true);

export default {
    props: { tab: { type: String } },
    setup() {
        const router = useRouter();

        const authStore = useStore();

        // -------------- VeeValidate --------------

        const validationSchema = object({
            email: string().required('Provide an valid email').email(),
            password: string().required(),
            rememberUser: bool().required()

        })

        const { handleSubmit, errors } = useForm({
            validationSchema
        })

        const { value: email, handleChange } = useField('email')
        const { value: password } = useField('password')
        const { value: rememberUser } = useField('rememberUser', undefined, { initialValue: false })


        const submit = handleSubmit(values => {
            console.log('submit', values);

            let data = {
                "email": email.value,
                "password": password.value,
                "permanent": rememberUser.value
            }
            LoginUser(data);
        })

        // --------------- VeeValidate --------------

        async function LoginUser(data) {
            isLoading.value = true;
            try {
                await authStore.dispatch("authModule/loginUser", data).then(() => {
                    console.log('OK')
                    router.replace("/");
                }).catch((error) => {
                    errorMsg.value = error
                });

            } catch (err) {
                console.log("Err: " + err);
            }

            isLoading.value = false;
        }

        return {
            loading1,
            login,
            fade,
            email,
            password,
            rememberUser,
            errors,
            isLoading,
            isError,
            errorMsg,
            isPwd: ref(true),
            submit
        };
    },
};
</script>

<style>
.divider {
    border-top: 1px solid #ebecf3;
}
</style>
