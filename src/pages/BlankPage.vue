<template>
  <div class="column q-gutter-y-lg q-pa-md self-center q-mx-auto">

    <login-form v-if="path==='/login'" :key="path"/>
    <!--    <register-form v-if="path==='/register'" :key="path"/>-->
    <reset-password-form v-if="path==='/reset_password'" :key="path"/>
    <!--      <set-password-form v-if="path.startsWith('/set_password')" :key="path" :reset-token="activationId"/>-->


    <div class="row divider q-pb-lg">
      <div class="col-12">
        <br>
        <span v-if="path !=='/register'"><q-btn :label="$t('Register')" color="secondary" flat no-caps
                                                @click="redirectTo('/register')"/> </span>
        <span v-if="path !=='/login'"><q-btn :label="$t('Login')" color="secondary" flat no-caps
                                             @click="redirectTo('/login')"/> </span>
        <span><q-btn :label="$t('Reset password')" color="secondary" flat no-caps
                     @click="redirectTo('/reset_password')"/></span>

        <!--          <p class="text-body2 q-pa-xs">-->
        <!--            <span v-if="path !=='/register'"><router-link to="/register">{{ $t("Register") }}</router-link> · </span>-->
        <!--            <span v-if="path !=='/login'"><router-link to="/login">{{ $t("Login") }} </router-link>  · </span>-->
        <!--            <span><router-link to="reset_password">{{ $t("Reset password") }} </router-link></span>-->
        <!--            &lt;!&ndash; <span> · {{ $t("I need help") }}</span> &ndash;&gt;-->
        <!--          </p>-->
      </div>
    </div>
  </div>

</template>
<script setup>

import {computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "stores/user.js";
import LoginForm from "components/forms/auth/LoginForm.vue";
import ResetPasswordForm from "components/forms/auth/ResetPasswordForm.vue";

const router = useRouter();
const route = useRoute();
const UserStore = useUserStore();

const path = computed(() => route.path)

function redirectTo(page) {
  router.push(page)
}
</script>

<style scoped>

</style>
