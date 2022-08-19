<template>
  <div>
    <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Register") }}</div>

    <q-linear-progress stripe size="10px" :value="0.8" class="q-mb-md"/>
    <p class="text">⏰ Dostępnych kont: {{ availableAccounts }}, zarezerwuj dostęp teraz ⬇️</p>
    {{ errors }}
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
          :name="1"
          title="1"
          icon="settings"
          no-header-navigation
          :done="step > 1"
        >
          <q-input
            :model-value="email"
            @change="handleChange"
            :disable="isLoading"
            :error="!!errors.email"
            :error-message="errors.email"
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

          <q-input
            v-model="firstName"
            :disable="isLoading"
            :error="!!errors.firstName"
            :error-message="errors.firstName"
            :label="$t('First Name')" outlined type="text"
          />
          <q-input
            v-model="lastName"
            :disable="isLoading"
            :error="!!errors.lastName"
            :error-message="errors.lastName"
            :label="$t('Last Name')" outlined type="text"
          />

          <q-input
            v-model="nip"
            :disable="isLoading"
            :error="!!errors.nip"
            :error-message="errors.nip" type="text"
            :label="$t('NIP')" outlined>
          </q-input>

          <q-checkbox v-model="acceptTOS"
                      keep-color
                      :color="errors.acceptTOS ? 'red': 'primary'"
                      :style="errors.acceptTOS ? 'color:red' : 'color:black'">{{
              $t("I accept the terms and conditions")
            }}
          </q-checkbox>
        </q-step>

        <q-step
          :name="2"
          title="1"
          icon="create_new_folder"
          :done="step > 2"
        >
          <q-input
            v-model="companyName"
            :disable="isLoading"
            :error="!!errors.companyName"
            label="Company name"
            outlined
            type="text"
            dense
          />
          <q-input
            v-model="companyAddress"
            :disable="isLoading"
            :error="!!errors.companyAddress"
            label="Company Street"
            outlined
            type="text"
            dense
          />

          <div class="row sm-gutter">
            <div class="q-pa-xs col-xs-12 col-sm-6">
              <q-input
                v-model="companyPostCode"
                :disable="isLoading"
                :error="!!errors.companyPostCode"
                label="Postcode"
                outlined
                type="text"
                dense
              />
            </div>
            <div class="q-pa-xs col-xs-12 col-sm-6">
              <q-input
                v-model="companyCity"
                :disable="isLoading"
                :error="!!errors.companyCity"
                label="companyCity"
                outlined
                type="text"
                dense
              />
            </div>
          </div>


          <!-- <div class="row">
            <q-space/>
            <q-btn
              :disable="isLoading"
              :label="$t('Register')"
              :loading="isLoading"
              color="primary"
              type="submit"
            />
          </div> -->

        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              v-if="step!==2"
              @click="go_next()"
              color="primary"
              label="Continue"
              :disable="isLoading"
              :loading="isLoading"
            />
            <q-btn
              :disable="isLoading"
              :label="$t('Register')"
              :loading="isLoading"
              color="primary"
              type="submit"
            />
            <q-btn v-if="step > 1" flat color="primary" @click="go_back()" label="Back" class="q-ml-sm"/>
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-form>


    <!-- <q-input
              v-model="firstName"
              :disable="isLoading"
              :error="!!errors.firstName"
              :error-message="errors.firstName"
              class="q-mb-md"
              :label="$t('E-mail')"
              outlined
              type="text"
          /> -->


  </div>
</template>

<script setup>
import {ref, watch} from "vue";
import {api} from "boot/axios";
import {useField, useForm} from "vee-validate";
import {object, string, bool} from "yup";
import {useRouter} from "vue-router";
import {useUserStore} from "stores/user";
import {accountLimit} from 'src/composables/api/accountLimit.js'
import {companyInfo} from 'src/composables/api/companyInfo.js'


const {availableAccounts} = accountLimit()


let isPwd = ref(true);
let isLoading = ref(false);
let errorMsg = ref(null);
let step = ref(1)
const router = useRouter();
const UserStore = useUserStore();

// -------------- VeeValidate --------------
const validationSchema = object({
  // firstName: string().required(),
  email: string().required("Provide an valid email").email(),
  password: string().required(),
  firstName: string().required(),
  acceptTOS: bool().required().oneOf([true], "!"),
});

const {handleSubmit, errors} = useForm({
  validationSchema,
});

watch(errors, (newValue, oldValue) => {

  console.log("CHANGE", errors.value)

})


// const { value: firstName } = useField("firstName");
const {value: email, handleChange} = useField("email");
const {value: password} = useField("password");
const {value: nip} = useField("nip", undefined, {initialValue: "9542752600"});
const {value: acceptTOS} = useField("acceptTOS", undefined, {initialValue: false});
const {value: firstName} = useField("firstName");
const {value: lastName} = useField("lastName");
const {value: companyName} = useField("companyName");
const {value: companyAddress} = useField("companyAddress");
const {value: companyPostCode} = useField("companyPostCode");
const {value: companyCity} = useField("companyCity");


const submit = handleSubmit((values) => {
  console.log("submit", values);

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
    // name: email.value,
    email: email.value,
    password: password.value,
    password_confirmation: password.value,
    tos: acceptTOS.value,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Warsaw",
    lang: getLocale(),
  };
  console.log(data);

  registerAdmin(data);
});

// --------------- VeeValidate --------------

async function registerAdmin(data) {
  isLoading.value = true;
  api
    .post("auth/register", data)
    .then((res) => {
      console.log(res.data);
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

function go_next() {
  let isLoading = ref(true);

  if (step.value == 2) {
    console.log("DONE")
    return;
  }


  api.post("auth/company_info", {"country": "pl", "company_national_id": "9542752600"})
    .then((res) => {
      console.log(res.data);
      isLoading.value = false;
      companyName.value = res.data.short_name
      companyAddress.value = res.data.street
      companyPostCode.value = res.data.postcode
      companyCity.value = res.data.city
      step.value += 1
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

  // const {name, short_name, street, postcode, city, country_code} = companyInfo({
  //   country: 'pl',
  //   id: nip.value
  // })


}

function go_back() {
  // $refs.stepper.next()
  step.value -= 1
}
</script>


