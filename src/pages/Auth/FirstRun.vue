<template>
  <div class="column q-gutter-y-lg q-pa-md self-center q-mx-auto" style="min-width: 320px;">
    <!-- <first-run-form :activationId="activationId"></first-run-form> -->
    <p class="text-h5">Starting app... 🚀</p>
  </div>

</template>
<script setup>
import {computed, ref} from "vue";
import {useRoute, useRouter} from 'vue-router'
import {useUserStore} from "stores/user";
import {useQuasar} from "quasar";
import {useI18n} from "vue-i18n";
import {useNoAuthAPI} from "src/composables/useNoAuthAPI.js";

const $q = useQuasar()
const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();
const noAuthAPI = useNoAuthAPI();

const path = computed(() => route.path)
const activationId = ref(route.params.id)
let isLoading = ref(false);

async function firstRun(activationId) {
  isLoading.value = true;
  const { error} = await noAuthAPI.post("/auth/first_run", {"token": activationId});
  if (error !== null) {
    isLoading.value = false;
    $q.notify("⚠️ Błąd aktywacji konta - konto aktywne, lub link nieprawidłowy");
    router.push("/login");
    return;
  }

  isLoading.value = false;
  $q.notify("OK 👌");
  router.push("/login");
}

firstRun(activationId.value);

</script>
