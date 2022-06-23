<template>
  <!-- https://github.com/Joabsonlg/quasar-authentication -->
  <!-- https://github.com/patrickmonteiro/quasar-warren -->
  <div class="row justify-center" style="height: 100vh">
    <div class="col-xs-12 col-sm-6 flex container-logo bg-blue-grey-7" v-if="fade">
      <div class="column self-center q-mx-auto">
        <div class="q-ma-lg text-left text-white power-text">
          <h1 class="text-h3">AnyName</h1>
          <p class="text-h4 text-weight-light">Dowiedz się, co (naprawdę) myśli Twój zespół</p>
          <p class="text-h6" v-if="$q.screen.gt.sm">
            Zbieraj szczere pomysły od pracowników, wdrażaj je i wyrażaj uznanie tam, gdzie jest ono należne. Proste.
          </p>
        </div>
        <!-- </div> -->
      </div>
    </div>

    <div class="column q-gutter-y-lg q-pa-md self-center q-mx-auto" style="min-width: 320px;">

      <login-form v-if="path=='/login'" :key="path"></login-form>
      <register-form v-if="path=='/register'"  :key="path"></register-form>
      <reset-password-form v-if="path=='/reset_password'"  :key="path"></reset-password-form>

  

      <div class="row divider q-pb-lg">
        <div class="col-12">
          <p class="text-body2 q-pa-xs">
            <span v-if="path !='/register'"><router-link to="/register" >{{ $t("Register") }}</router-link> · </span>
            <span v-if="path !='/login'"><router-link to="/login">{{ $t("Login") }} </router-link>  · </span>
            <span><router-link to="reset_password">{{ $t("Reset password") }} </router-link></span>
            <!-- <span> · {{ $t("I need help") }}</span> -->
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import LoginForm from 'src/components/forms/LoginForm.vue';
import RegisterForm from 'src/components/forms/RegisterForm.vue';
import ResetPasswordForm from 'src/components/forms/ResetPasswordForm.vue'
import { ref,computed, onBeforeMount, watch } from "vue";
import { useRoute } from 'vue-router'
import { useRouter } from "vue-router";
import { useUserStore } from 'stores/user'
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";

const $q = useQuasar();
const { locale } = useI18n({ useScope: "global" });
const lang = ref(locale); 

const router = useRouter();
const route = useRoute();
const UserStore = useUserStore();

const path = computed(() =>route.path)

let fade = ref(true);

// UserStore.autoLogin();

if (UserStore.isAuthenticated == true) {
    console.log('Zalogowany')
    router.push({ path: "/home" });
} else {
    console.log('Czeka na logowanie')
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
