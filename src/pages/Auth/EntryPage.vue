<template>
  <div class="column q-gutter-y-lg q-pa-md self-center q-mx-auto">

    <login-form v-if="path==='/login' || path==='/'" :key="path"/>
    <register-form v-if="path==='/register'" :key="path" :user-language="getUserLocale()"/>
    <reset-password-form v-if="path==='/reset_password'" :key="path"/>
    <set-password-form v-if="path.startsWith('/set_password')" :key="path" :reset-token="activationId"/>


    <div class="row divider q-pb-lg">
      <div class="col-12">
        <br>
        <span v-if="path !=='/register'"><q-btn :label="$t('Register')" color="secondary" flat no-caps
                                                @click="redirectTo('/register')"/> </span>
        <span v-if="path !=='/login'"><q-btn :label="$t('Login')" color="secondary" flat no-caps
                                             @click="redirectTo('/login')"/> </span>
        <span><q-btn :label="$t('Reset password')" color="secondary" flat no-caps
                     @click="redirectTo('/reset_password')"/></span>
        <q-btn class="q-mr-xs" dense flat icon="language" round>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item v-close-popup clickable>
                <q-item-section @click="setLocale('pl')">Polish (Polski)</q-item-section>
              </q-item>
              <q-item v-close-popup clickable>
                <q-item-section @click="setLocale('de')">German (Deutsch)</q-item-section>
              </q-item>
              <q-item v-close-popup clickable>
                <q-item-section @click="setLocale('en-US')">English (English)</q-item-section>
              </q-item>
              <q-separator/>
              <q-item v-close-popup clickable href="https://www.malgori.pl/usage/00_usage/" target="_blank" type="a">
                <q-item-section>{{ $t("I need help") }}</q-item-section>
                <q-item-section avatar>
                  <q-icon color="primary" name="help_outline"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

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

import {computed, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "stores/user.js";
import LoginForm from "components/forms/auth/LoginForm.vue";
import ResetPasswordForm from "components/forms/auth/ResetPasswordForm.vue";
import SetPasswordForm from "components/forms/auth/SetPasswordForm.vue";
import {useQuasar} from "quasar";
import {useI18n} from "vue-i18n";
import {useAuthAPI} from "src/composables/useAuthAPI.js";
import RegisterForm from "components/forms/auth/RegisterForm.vue";

const SUPPORTED_LOCALES = ["de", "en-US", "fr", "pl"];
const DEFAULT_LOCALE = "en-US";

const $q = useQuasar();
const {locale} = useI18n({useScope: "global"});
const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();
const authAPI = useAuthAPI()

const path = computed(() => route.path)
const activationId = ref(route.params.id)

function getUserLocale() {
  const storedLocale =
    localStorage.getItem("lang") ||
    sessionStorage.getItem("lang") ||
    navigator.language.split("-")[0];

  return SUPPORTED_LOCALES.includes(storedLocale) ? storedLocale : DEFAULT_LOCALE;
}

async function setLocale(lang = null) {
  if (!lang) {
    lang = getUserLocale();
  }
  locale.value = lang;
}

function redirectTo(page) {
  router.push(page)
}
</script>

<style scoped>

</style>
