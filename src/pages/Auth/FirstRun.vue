<template>
  <!-- https://github.com/Joabsonlg/quasar-authentication -->
  <!-- https://github.com/patrickmonteiro/quasar-warren -->
  <div class="row justify-center" style="height: 100vh">
    <div v-if="fade" class="col-xs-12 col-sm-6 flex container-logo bg-blue-grey-7">
      <div class="column self-center q-mx-auto">
        <div class="q-ma-lg text-left text-white power-text">
          <h1 class="text-h3">Malgori</h1>
          <!--          <p v-if="$q.screen.gt.md" class="text-h4 text-weight-light">Dowiedz się, co (naprawdę) myśli Twój zespół</p>-->
          <p v-if="$q.screen.gt.md" class="text-h4 text-weight-light">
            Uprość codzienne zadania związane z konserwacją. Spędzaj mniej czasu na papierowej robocie, a więcej na załatwianiu spraw.
          </p>
          <p v-if="$q.screen.gt.sm" class="text-h6 text-weight-regular">
            🎯 Aktualna lista zadań (bez ciągłych telefonów i odrywania od bieżącej pracy)<br>
            🚀 Raporty, bieżący status prac - nie zgaduj, skup się tylko na tym co ważne<br> <br>
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
import {computed, ref} from "vue";
import {useRoute, useRouter} from 'vue-router'
import {useUserStore} from "stores/user";
import {authFirstRunRequest} from "components/api/AuthApiClient";
import {errorHandler} from "components/api/errorHandler";

const route = useRoute()
const router = useRouter();
const UserStore = useUserStore();

const path = computed(() => route.path)
const activationId = ref(route.params.id)

let fade = ref(true);

let isLoading = ref(false);

function firstRun(activationId) {
  isLoading.value = true;
  // console.log("ID: ", activationId)

  authFirstRunRequest(activationId).then(function (response) {
    // localStorage.setItem("firstName", response.data.first_name);
    // localStorage.setItem("lastName", response.data.last_name);
    // localStorage.setItem("lang", response.data.lang);
    // localStorage.setItem("tz", response.data.tz);
    // localStorage.setItem("uuid", response.data.uuid);
    // localStorage.setItem("tenant", response.data.tenanat_id);
    // localStorage.setItem("token", response.data.token);
    //
    // UserStore.fillStore(
    //   response.data.token,
    //   response.data.tenanat_id,
    //   response.data.first_name,
    //   response.data.last_name,
    //   response.data.uuid,
    //   response.data.tz,
    //   response.data.lang
    // )
    isLoading.value = false;
    router.push("/login");
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

firstRun(activationId.value);

</script>
