<template>
  <!-- https://github.com/Joabsonlg/quasar-authentication -->
  <!-- https://github.com/patrickmonteiro/quasar-warren -->
  <div class="row justify-center" style="height: 100vh">
    <div v-if="fade" class="col-xs-12 col-sm-6 flex container-logo bg-blue-grey-7">
      <div class="column self-center q-mx-auto">
        <div class="q-ma-lg text-left text-white power-text">
          <h1 class="text-h3">AnyName</h1>
          <p v-if="$q.screen.gt.md" class="text-h4 text-weight-light">Dowiedz się, co (naprawdę) myśli Twój zespół</p>
          <p v-if="$q.screen.gt.sm" class="text-h6 text-weight-regular">
            🎯 Zbieraj szczere pomysły od pracowników <br>
            🚀 Nie zgaduj, wdrażaj to co przyniesie efekty<br> <br>
            Proste.
          </p>
        </div>
        <!-- </div> -->
      </div>
    </div>

    <div class="column q-gutter-y-lg q-pa-md self-center q-mx-auto" style="min-width: 320px;">

      <!-- <first-run-form :activationId="activationId"></first-run-form> -->
      <p>Starting app... 🚀</p>


    </div>
  </div>
</template>
<script setup>
// import FirstRunForm from 'src/components/forms/FirstRunForm.vue';
import {computed, ref} from "vue";
import {api} from "boot/axios";
import {useRoute, useRouter} from 'vue-router'
import {useUserStore} from "stores/user";

const route = useRoute()
const path = computed(() => route.path)
const activationId = ref(route.params.id)

let fade = ref(true);

let isLoading = ref(false);


const router = useRouter();
const UserStore = useUserStore();


function firstRun(activationId) {
  isLoading.value = true;
  console.log("ID: ", activationId)

  isLoading.value = false;
  api
    .post("auth/first_run", {"token": activationId})
    .then((res) => {
      isLoading.value = false;

      localStorage.setItem("firstName", res.data.first_name);
      localStorage.setItem("lastName", res.data.last_name);
      localStorage.setItem("lang", res.data.lang);
      localStorage.setItem("tz", res.data.tz);
      localStorage.setItem("uuid", res.data.uuid);
      localStorage.setItem("tenant", res.data.tenanat_id);
      localStorage.setItem("klucz", res.data.token);

      UserStore.fillStore(
        res.data.token,
        res.data.tenanat_id,
        res.data.first_name,
        res.data.last_name,
        res.data.uuid,
        res.data.tz,
        res.data.lang
      )
      router.push("/login");
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

firstRun(activationId.value);

</script>
