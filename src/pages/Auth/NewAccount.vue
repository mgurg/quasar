<template>
  <!-- https://github.com/Joabsonlg/quasar-authentication -->
  <!-- https://github.com/patrickmonteiro/quasar-warren -->
  <div class="row justify-center" style="height: 100vh">
    <div class="col-xs-12 col-sm-6 flex container-logo bg-blue-grey-7" v-if="fade">
      <div class="column self-center q-mx-auto">
        <div class="q-ma-lg text-left text-white power-text">
          <h1 class="text-h3">Intio</h1>
          <p class="text-h4 text-weight-light">Empowering life safety with technology</p>
          <p class="text-h6" v-if="$q.screen.gt.sm">
            With over 40-years of experience in life-safety systems, we are
            revolutionizing industries that protect us most.
          </p>
        </div>
        <!-- </div> -->
      </div>
    </div>

    <div class="column q-gutter-y-lg q-pa-md self-center q-mx-auto">

    <div class="text-h5 text-weight-bold q-pb-md">{{ $t("Congratulations") }}! 🎉</div>
    <p>{{ $t("Almost done! Let's confirm your email") }} ✅</p>

    {{path}}

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
import { ref,computed } from "vue";
import { useRoute } from 'vue-router'

const route = useRoute()
const path = computed(() =>route.path)



let fade = ref(true);


</script>

<style>
.divider {
  border-top: 2px solid #ebecf3;
}
</style>
