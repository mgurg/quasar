<template>
  <!-- https://github.com/Joabsonlg/quasar-authentication -->
  <!-- https://github.com/patrickmonteiro/quasar-warren -->
  <div class="row justify-center" style="height: 100vh">
    <div v-if="fade" class="col-xs-12 col-sm-6 flex container-logo bg-blue-grey-7">
      <div class="column self-center q-mx-auto">
        <div class="q-ma-lg text-left text-white power-text">
          <h1 class="text-h3">AnyName</h1>
<!--          <p v-if="$q.screen.gt.md" class="text-h4 text-weight-light">Dowiedz się, co (naprawdę) myśli Twój zespół</p>-->
          <p v-if="$q.screen.gt.md" class="text-h4 text-weight-light">
            Uprość codzienne zadania związane z konserwacją. Spędzaj mniej czasu na papierowej robocie, a więcej na załatwianiu spraw.
          </p>
          <p v-if="$q.screen.gt.sm" class="text-h6 text-weight-regular">
            🎯 Zbieraj szczere pomysły od pracowników <br>
            🚀 Nie zgaduj, wdrażaj to co przyniesie efekty<br> <br>
            Proste.
          </p>
        </div>
        <!-- </div> -->
      </div>
    </div>

    <div class="column q-gutter-y-lg q-pa-md self-center q-mx-auto">

      <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Congratulations") }}! 🎉</div>
      <p>{{ $t("Almost done! Remember to confirm your email!") }} ✅</p>
      <!-- TODO: Redirect to most common emails with search feature -->


      <div class="row divider q-pb-lg">
        <div class="col-12">
          <p class="text-body2 q-pa-xs">
            <!--            <span><router-link to="/login">{{ $t("Login") }} </router-link></span>-->
            <!-- <span> · {{ $t("I need help") }}</span> -->
          </p>
        </div>
      </div>

    </div>
  </div>
</template>
<script setup>
import {ref} from "vue";

let fade = ref(true);

</script>

<style>
.divider {
  border-top: 2px solid #ebecf3;
}
</style>
