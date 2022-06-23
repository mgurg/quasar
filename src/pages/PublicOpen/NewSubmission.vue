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

    <div class="column q-gutter-y-lg q-pa-md self-center q-mx-auto">

    <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Congratulations") }}! 🎉</div>
    <p>{{ $t("Your submission landed in our system") }} 🚀<br> {{ $t("Would you like to improve something more?") }}</p>



      <div class="row divider q-pb-lg">
        <div class="col-12">
          <p class="text-body2 q-pa-xs">
            <span><router-link to="/login">{{ $t("Login") }} </router-link></span>
            <!-- <span> · {{ $t("I need help") }}</span> -->
          </p>
        </div>
      </div>

    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

let fade = ref(true);

</script>

<style>
.divider {
  border-top: 2px solid #ebecf3;
}
</style>
