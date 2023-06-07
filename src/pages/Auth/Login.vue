<template>
  <!-- https://github.com/Joabsonlg/quasar-authentication -->
  <!-- https://github.com/patrickmonteiro/quasar-warren -->
  <div class="row justify-center" style="height: 100vh">
    <div class="col-xs-12 col-sm-12 col-md-6 flex container-logo bg-blue-grey-7">
      <div class="column self-center q-mx-auto">
        <div class="q-ma-lg text-left text-white power-text">
          <h1 class="text-h3">Malgori</h1>
          <!--          <p v-if="$q.screen.gt.md" class="text-h4 text-weight-light">Dowiedz się, co (naprawdę) myśli Twój zespół</p>-->
          <p v-if="$q.screen.gt.md" class="text-h4 text-weight-light">
            Uprość codzienne zadania związane z konserwacją. Spędzaj mniej czasu na papierkowej robocie, a więcej na załatwianiu spraw.
          </p>
          <p v-if="$q.screen.gt.sm" class="text-h6 text-weight-regular">
            🎯 Aktualna lista zadań (bez ciągłych telefonów i odrywania od bieżącej pracy)<br>
            📋 Raporty, bieżący status prac<br>
            🚀 Nie zgaduj, skup się na tym co ważne<br> <br>
            Proste.</br>

            📰 <a href="https://malgori.pl">Blog - <b>dowiedz się więcej</b></a>
          </p>
        </div>
        <!-- </div> -->
      </div>
    </div>

    <div class="column q-gutter-y-lg q-pa-md self-center q-mx-auto" >

      <login-form v-if="path==='/login'" :key="path" />
      <register-form v-if="path==='/register'" :key="path" />
      <reset-password-form v-if="path==='/reset_password'" :key="path" />
      <set-password-form v-if="path.startsWith('/set_password')" :key="path"  :reset-token="activationId" />


      <div class="row divider q-pb-lg">
        <div class="col-12">
          <br>
          <span v-if="path !=='/register'"><q-btn flat no-caps color="secondary" @click="redirectTo('/register')"
                                                  :label="$t('Register')"/> </span>
          <span v-if="path !=='/login'"><q-btn flat no-caps color="secondary" @click="redirectTo('/login')"
                                               :label="$t('Login')"/> </span>
          <span><q-btn flat no-caps color="secondary" @click="redirectTo('/reset_password')"
                       :label="$t('Reset password')"/></span>

          <!--          <p class="text-body2 q-pa-xs">-->
          <!--            <span v-if="path !=='/register'"><router-link to="/register">{{ $t("Register") }}</router-link> · </span>-->
          <!--            <span v-if="path !=='/login'"><router-link to="/login">{{ $t("Login") }} </router-link>  · </span>-->
          <!--            <span><router-link to="reset_password">{{ $t("Reset password") }} </router-link></span>-->
          <!--            &lt;!&ndash; <span> · {{ $t("I need help") }}</span> &ndash;&gt;-->
          <!--          </p>-->
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import LoginForm from 'components/forms/auth/LoginForm.vue';
import RegisterForm from 'components/forms/auth/RegisterForm.vue';
import ResetPasswordForm from 'components/forms/auth/ResetPasswordForm.vue'
import {computed, onBeforeMount, ref, watch} from "vue";
import {useRoute, useRouter} from 'vue-router'
import {useUserStore} from 'stores/user'
import {useI18n} from "vue-i18n";
import {useQuasar} from "quasar";
import SetPasswordForm from "components/forms/auth/SetPasswordForm.vue";

const $q = useQuasar();
const {locale} = useI18n({useScope: "global"});
const lang = ref(locale);

const router = useRouter();
const route = useRoute();
const UserStore = useUserStore();

const activationId = ref(route.params.id)
const path = computed(() => route.path)

let fade = ref(true);
let step = ref(1)

// UserStore.autoLogin();

if (UserStore.isAuthenticated === true) {
  router.push({path: "/home"});
} else {
  console.log('Czeka na logowanie')
}

function redirectTo(page) {
  router.push(page)
}


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

function setLocale(lang) {
  locale.value = lang;
}

watch(lang, (val) => {
  // dynamic import, so loading on demand only
  import(
    /* webpackInclude: /(pl|de|en-US)\.js$/ */
  "quasar/lang/" + val
    ).then((lang) => {
    $q.lang.set(lang.default);
  });
});

onBeforeMount(() => {
  console.log(getLocale())
  //localStorage.setItem("lang", 'pl')
  // setLocale(setLocale())
  setLocale(getLocale())


});

</script>

<style>
.divider {
  border-top: 2px solid #ebecf3;
}
</style>
