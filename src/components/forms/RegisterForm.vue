<template>
  <div>
    <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Register") }}</div>

    <q-linear-progress stripe size="10px" :value=ratio class="q-mb-md"/>
    <p class="text">⏰ Dostępnych kont: <strong>{{ availableAccounts }}</strong>, zarezerwuj dostęp teraz ⬇️</p>
    <q-form @submit="submit">
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
        contracted
        flat
        no-header-navigation
        style="max-width: 320px;"
      >
        <q-step
          :name="0"
          title="1"
          icon="settings"
          no-header-navigation
          :done="step > 0"
        >
          <q-input
            :model-value="email"
            @change="handleChange"
            :disable="isLoading"
            :error="!!errors.email"
            :error-message="errors.email"
            :label="$t('E-mail')"
            :dense="$q.screen.lt.sm"
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
            :dense="$q.screen.lt.sm"
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
            :disable="isLoading"
            :error="!!errors.companyTaxId"
            :error-message="errors.companyTaxId" type="text"
            :label="$t('NIP')"
            :dense="$q.screen.lt.sm"
            outlined />
          <q-input
            v-model="firstName"
            :disable="isLoading"
            :error="!!errors.firstName"
            :error-message="errors.firstName"
            :label="$t('First Name')"
            :dense="$q.screen.lt.sm"
            outlined
            type="text"
          />
          <q-input
            v-model="lastName"
            :disable="isLoading"
            :error="!!errors.lastName"
            :error-message="errors.lastName"
            :label="$t('Last Name')"
            :dense="$q.screen.lt.sm"
            outlined
            type="text"
          />


          <q-checkbox
            v-model="acceptTOS"
            keep-color
            :dense="$q.screen.lt.sm"
            :color="errors.acceptTOS ? 'red': 'primary'"
            :style="errors.acceptTOS ? 'color:red' : 'color:black'">{{
              $t("I accept the terms and conditions")
            }}

          </q-checkbox>
        </q-step>

        <q-step
          :name="1"
          title="1"
          icon="create_new_folder"
          :done="step > 1"
        >

        <!--
        Pobraliśmy dane firmy: RINGIER AXEL SPRINGER POLSKA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ.
        Fakturę wystawimy automatycznie po zakupie. Możesz zrewidować dane później
        -->

          <q-input
            v-model="companyName"
            :disable="isLoading"
            :error="!!errors.companyName"
            :label="$t('Company name')"
            outlined
            type="text"
            :dense="$q.screen.lt.sm"
          />
          <q-input
            v-model="companyAddress"
            :disable="isLoading"
            :error="!!errors.companyAddress"
            :label="$t('Street')"
            outlined
            type="text"
            :dense="$q.screen.lt.sm"
          />

          <div class="row sm-gutter">
            <div class="q-pa-xs col-xs-12 col-sm-6">
              <q-input
                v-model="companyPostCode"
                :disable="isLoading"
                :error="!!errors.companyPostCode"
                :label="$t('Postcode')"
                outlined
                type="text"
                :dense="$q.screen.lt.sm"
              />
            </div>
            <div class="q-pa-xs col-xs-12 col-sm-6">
              <q-input
                v-model="companyCity"
                :disable="isLoading"
                :error="!!errors.companyCity"
                :label="$t('City')"
                outlined
                type="text"
                :dense="$q.screen.lt.sm"
              />
            </div>
          </div>
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              v-if="step!==1"
              color="primary"
              label="Continue"
              :disable="isLoading"
              :loading="isLoading"
              type="submit"
            />
            <q-btn v-if="step > 0" flat color="primary" @click="go_back" label="Back" class="q-ml-sm"/>
            <q-btn
              v-if="step===1"
              flat
              :disable="isLoading"
              :label="$t('Register')"
              :loading="isLoading"
              color="primary"
              type="submit"
            />

          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-form>
  </div>
</template>

<script setup>
import {ref, watch, computed} from "vue";
import {api} from "boot/axios";
import {useField, useForm} from "vee-validate";
import {object, string, bool} from "yup";
import {useRouter} from "vue-router";
import {useUserStore} from "stores/user";
import { validatePolish } from 'validate-polish';
import {accountLimit} from 'src/composables/api/accountLimit.js'
import {companyInfo} from 'src/composables/api/companyInfo.js'

const {availableAccounts, ratio} = accountLimit()


let isPwd = ref(true);
let isLoading = ref(false);
let errorMsg = ref(null);
let step = ref(0)
const router = useRouter();
const UserStore = useUserStore();

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
  firstName: string().required(),
  lastName: string().required(),
  acceptTOS: bool().required().oneOf([true], "!"),
});

const {handleSubmit, errors} = useForm({ validationSchema:  validationSchema});


// https://github.com/logaretm/vee-validate/releases/tag/v4.6.0 ->useFieldModel
const {value: email, handleChange} = useField("email");
const {value: password} = useField("password");
const {value: companyTaxId} = useField("companyTaxId", undefined, {initialValue: "9542752600"});
const {value: acceptTOS} = useField("acceptTOS", undefined, {initialValue: false});
const {value: firstName} = useField("firstName", undefined);
const {value: lastName} = useField("lastName", undefined);
const {value: companyName} = useField("companyName");
const {value: companyAddress} = useField("companyAddress");
const {value: companyPostCode} = useField("companyPostCode");
const {value: companyCity} = useField("companyCity");


const submit = handleSubmit((values) => {
  let isLoading = ref(true);

  if (step.value !==1){
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
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("General Error");
      }

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
    company_name: companyName.value ,
    company_street: companyAddress.value,
    company_city: companyCity.value,
    company_postcode: companyPostCode.value ,
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
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("General Error");
      }
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


