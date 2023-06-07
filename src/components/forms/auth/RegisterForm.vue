<template>
  <div>
    <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Register") }}</div>

    <q-linear-progress :value=ratio class="q-mb-md" size="10px" stripe/>
    <p class="text">⏰ Dostępnych kont: <strong>{{ availableAccounts }}</strong>, zarezerwuj dostęp teraz ⬇️</p>
    <div>
      📃 <a href="regulamin_2023_05_01.pdf" target="_blank">Regulamin </a>
    </div>
    <q-form @submit="submit">
      <q-stepper
        ref="stepper"
        v-model="step"
        animated
        color="primary"
        contracted
        flat
        no-header-navigation
        style="max-width: 320px;"
      >
        <q-step :done="step > 0" :name="0" icon="settings" no-header-navigation title="1">
          <q-input
            :dense="$q.screen.lt.sm"
            :disable="isLoading"
            :error="!!errors.email"
            :error-message="errors.email"
            :label="$t('E-mail')"
            :model-value="email"
            outlined
            type="email"
            @change="handleChange"
          />
          <q-input
            v-model="password"
            :dense="$q.screen.lt.sm"
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

          <q-input
            v-model="companyTaxId"
            :dense="$q.screen.lt.sm"
            :disable="isLoading"
            :error="!!errors.companyTaxId" :error-message="errors.companyTaxId"
            :label="$t('NIP')"
            outlined
            type="text"/>
          <q-input
            v-model="firstName"
            :dense="$q.screen.lt.sm"
            :disable="isLoading"
            :error="!!errors.firstName"
            :error-message="errors.firstName"
            :label="$t('First Name')"
            outlined
            type="text"
          />
          <q-input
            v-model="lastName"
            :dense="$q.screen.lt.sm"
            :disable="isLoading"
            :error="!!errors.lastName"
            :error-message="errors.lastName"
            :label="$t('Last Name')"
            outlined
            type="text"
          />




          <q-checkbox
            v-model="acceptTOS"
            :color="errors.acceptTOS ? 'red': 'primary'"
            :dense="$q.screen.lt.sm"
            :style="errors.acceptTOS ? 'color:red' : 'color:black'"
            keep-color>
            {{$t("I accept the terms and conditions")}}
          </q-checkbox>
        </q-step>

        <q-step :done="step > 1" :name="1" icon="create_new_folder" title="1">

          <!--
          Pobraliśmy dane firmy: RINGIER AXEL SPRINGER POLSKA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ.
          Fakturę wystawimy automatycznie po zakupie. Możesz zrewidować dane później
          -->

          <q-input
            v-model="companyName"
            :dense="$q.screen.lt.sm"
            :disable="isLoading"
            :error="!!errors.companyName"
            :label="$t('Company name')"
            outlined
            type="text"
          />
          <q-input
            v-model="companyAddress"
            :dense="$q.screen.lt.sm"
            :disable="isLoading"
            :error="!!errors.companyAddress"
            :label="$t('Street')"
            outlined
            type="text"
          />

          <div class="row sm-gutter">
            <div class="q-pa-xs col-xs-12 col-sm-6">
              <q-input
                v-model="companyPostCode"
                :dense="$q.screen.lt.sm"
                :disable="isLoading"
                :error="!!errors.companyPostCode"
                :label="$t('Postcode')"
                outlined
                type="text"
              />
            </div>
            <div class="q-pa-xs col-xs-12 col-sm-6">
              <q-input
                v-model="companyCity"
                :dense="$q.screen.lt.sm"
                :disable="isLoading"
                :error="!!errors.companyCity"
                :label="$t('City')"
                outlined
                type="text"
              />
            </div>
          </div>
        </q-step>
        <q-step :done="step > 2" :name="2" icon="create_new_folder" title="1">
          <div class="text-h5 q-py-sm">Nie można utworzyć konta</div>
          <q-separator/>
          <p class="q-py-sm">Żeby zacząć korzystać z aplikacji <span class="text-weight-bold">zgłoś się do osoby która korzysta</span>
            już z tego rozwiązania w firmie.</p>
          <p class="q-py-sm">Jeżeli ma odpowiednie uprawnienia, to utworzy Ci konto. </p>
        </q-step>
        >

        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              v-if="step===0"
              :disable="isLoading"
              :label="$t('Register')"
              :loading="isLoading"
              color="primary"
              type="submit"
            />
            <q-btn v-if="step > 0" class="q-ml-sm" color="primary" flat :label="$t('Back')" @click="go_back"/>
            <q-btn
              v-if="step===1"
              :disable="isLoading"
              :label="$t('Register')"
              :loading="isLoading"
              color="primary"
              flat
              type="submit"
            />

          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-form>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {api} from "boot/axios";
import {useField, useForm} from "vee-validate";
import {bool, object, setLocale, string} from "yup";
import {useRouter} from "vue-router";
import {useUserStore} from "stores/user";
import {validatePolish} from 'validate-polish';
import {accountLimit} from 'src/composables/api/accountLimit.js'
import {pl} from 'yup-locales';
import {errorHandler} from "components/api/errorHandler";
import {useQuasar} from "quasar";


const {availableAccounts, ratio} = accountLimit()

const $q = useQuasar()
setLocale(pl);


let isPwd = ref(true);
let isLoading = ref(false);
let errorMsg = ref(null);
let step = ref(0)
const router = useRouter();
const UserStore = useUserStore();

// "9542752600"
const nipList = ref([
  1010008104, 1070008183, 1070008467, 1070033270, 1080000355, 1130000660, 1130003463, 1130012083, 1130017229, 9970159059, 9970159438, 9970159763, 9970160223,
  1130017548, 1130043735, 1130103940, 1130121866, 1130124439, 1130206249, 1130240105, 1130240329, 1130508499, 1130584000, 1130775651, 1130866715, 9970162423,
  1131107638, 1131118300, 1131218036, 1131220671, 1131409960, 1131425901, 1131436135, 1131450827, 1131906049, 1132054039, 1132105920, 1132374399, 1132405680,
  1132450605, 1132485242, 1132586753, 1132598354, 1132602788, 1132715831, 1132715854, 1132735041, 1132763741, 1132850256, 1132852255, 1132884522, 1132915760,
  1133042742, 1133058743, 1180001638, 1180071998, 1180076375, 1180109850, 1180111108, 1180112214, 1180126883, 1180214446, 1180215658, 1180240030, 1180288976,
  1180369686, 1180476761, 1180565565, 1180692795, 1180717294, 1180745899, 1180747823, 1180795638, 1181379095, 1181458699, 1181742420, 1181775683, 1181970084,
  1182014154, 1230217867, 1231107282, 1231130186, 1231163725, 1231164423, 1231168622, 1231267028, 1231271834, 1231306633, 1231356275, 1231368568, 1231388944,
  1231419840, 1231443117, 1251249281, 1251396289, 1251687472, 1251721335, 2050001020, 2220792381, 4660393982, 4970084761, 4970088782, 4980246596, 5130181801,
  5130248267, 5170296723, 5170335452, 5170397909, 5210520205, 5212417635, 5213033983, 5213536709, 5213863704, 5223059501, 5223203547, 5252476609, 5342400923,
  5423276491, 5471423412, 5472223141, 5521681873, 5542834626, 5621782987, 5832786350, 6422154705, 6422997349, 6581991098, 6691992383, 6762201214, 6831984396,
  6941528050, 7010143779, 7123341742, 7251970056, 7252066580, 7262688260, 7392494962, 7642613280, 7681650078, 7773075239, 7773207304, 7773393028, 7821211612,
  7831742601, 7831786716, 7922213541, 8921481932, 9191719349, 9441995873, 9512425026, 9512481898, 9532431202, 9552036874, 9970017744, 9970021562, 9970038137,
  9970054509, 9970059139, 9970068368, 9970088589, 9970097915, 9970112678, 9970116848, 9970119404, 9970120413, 9970121938, 9970122820, 9970125215, 9970128633,
  9970130788, 9970132014, 9970143101, 9970152057, 9970152264, 9970154145, 9970154636, 9970155015, 9970157095, 1231482293, 1231498532, 1231502759, 1231513496,
  1231515503, 1231518861, 1231532335, 1250004867, 1250014481, 1250017255, 1250027443, 1250033343, 1250037200, 1250038820, 1250064421, 1250188991, 1250189424,
  1250240438, 1250292524, 1250336256, 1250442018, 1250519695, 1250522912, 1250570325, 1250747002, 1250836705, 1250914144, 1250915511, 1250957219, 1250984191,
  1251004912, 1251009387, 1251019581, 1251049205, 1251116522, 1251122095, 1251129513, 1251221242, 1251222773, 1251235244, 1251240274, 1251245716, 1251271300,
  1251271777, 1251286075, 1251309801, 1251315457, 1251316617, 1251319277
]);

function random_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}

// -------------- VeeValidate --------------

const validationSchema = object({
  email: string().required("Provide an valid email").email(),
  password: string().required(),
  companyTaxId: string().required().matches(/^[0-9]+$/, 'Must be numeric').test(
    "check-nip",
    "Provide valid NIP number",
    function (value) {
      return validatePolish.nip(value)
    }
  ),
  firstName: string().required().label("First name"),
  lastName: string().required().label("Last name"),
  acceptTOS: bool().required().oneOf([true], "!"),
});

const {handleSubmit, errors} = useForm({validationSchema: validationSchema});


// https://github.com/logaretm/vee-validate/releases/tag/v4.6.0 ->useFieldModel
const {value: email, handleChange} = useField("email");
const {value: password} = useField("password");
const {value: companyTaxId} = useField("companyTaxId", undefined, {initialValue: random_item(nipList.value)});
const {value: acceptTOS} = useField("acceptTOS", undefined, {initialValue: false});
const {value: firstName} = useField("firstName", undefined);
const {value: lastName} = useField("lastName", undefined);
const {value: companyName} = useField("companyName");
const {value: companyAddress} = useField("companyAddress");
const {value: companyPostCode} = useField("companyPostCode");
const {value: companyCity} = useField("companyCity");


const submit = handleSubmit((values) => {
  let isLoading = ref(true);

  if (step.value !== 1) {
    // const {name, short_name, street, postcode, city, country_code} = companyInfo({
    //   country: 'pl',
    //   id: nip.value
    // })
    api.post("auth/company_info", {"country": "pl", "company_tax_id": companyTaxId.value})
      .then((res) => {
        isLoading.value = false;
        companyName.value = res.data.short_name
        companyAddress.value = res.data.street
        companyPostCode.value = res.data.postcode
        companyCity.value = res.data.city
        step.value++
      })
      .catch((err) => {
        // Sentry.captureMessage("auth/company_info error: " + companyTaxId.value);
        const errorMessage = errorHandler(err);
        console.log(errorMessage.status)
        if (errorMessage.status === 404) {
          companyName.value = null
          companyAddress.value = null
          companyPostCode.value = null
          companyCity.value = null
          $q.notify("Nie znaleziono danych firmy, wprowadź ręcznie");
          step.value++
        } else{
          step.value = 2;
        }

        // if (err.response) {
        //   console.log(err.response);
        // } else if (err.request) {
        //   console.log(err.request);
        // } else {
        //   console.log("General Error");
        // }

      });

    return;
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


  let data = {
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    password: password.value,
    password_confirmation: password.value,
    country: "pl",
    company_tax_id: companyTaxId.value,
    company_name: companyName.value,
    company_street: companyAddress.value,
    company_city: companyCity.value,
    company_postcode: companyPostCode.value,
    company_info_changed: false,
    tos: acceptTOS.value,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Warsaw",
    lang: getLocale(),
  };


  registerAdmin(data);
});

// --------------- VeeValidate --------------

function registerAdmin(data) {
  isLoading.value = true;
  api
    .post("auth/register", data)
    .then((res) => {

      isLoading.value = false;
      router.push("/new_account");
    })
    .catch((err) => {
      const errorMessage = errorHandler(err);
      console.log(errorMessage.status)
      if (errorMessage.status === 403) {
        $q.notify("Tymczasowy email nie jest dozwolony");
        step.value--
      }
      if (errorMessage.status === 400) {
        $q.notify(errorMessage.data.detail);
      }
      // if (err.response) {
      //   console.log(err.response);
      // } else if (err.request) {
      //   console.log(err.request);
      // } else {
      //   console.log("General Error");
      // }
    });
  isLoading.value = false;
}

function go_back() {
  step.value--
}
</script>


<style lang="scss" scoped>

:deep(.q-stepper__header) {
  display: none !important;
}
</style>


