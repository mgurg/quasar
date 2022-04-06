<template>
  <!-- https://github.com/Joabsonlg/quasar-authentication -->
  <!-- https://github.com/patrickmonteiro/quasar-warren -->
  <div class="row justify-center" style="height: 100vh">
    <div class="col-xs-12 col-sm-6 flex container-logo bg-blue-grey-7" v-if="fade">
      <div class="column self-center q-mx-auto">
        <div class="q-ma-lg text-left text-white power-text">
          <h1 class="text-h3">Intio</h1>
          <p class="text-h5 text-weight-light">Empowering life safety with technology</p>
          <p class="text-h6" v-if="$q.screen.gt.sm">
            With over 40-years of experience in life-safety systems, we are
            revolutionizing industries that protect us most.
          </p>
        </div>
        <!-- </div> -->
      </div>
    </div>

    <div class="column q-gutter-y-lg q-pa-md self-center q-mx-auto"  style="min-width: 320px;">

      <first-run-form :activationId="activationId"></first-run-form>



    </div>
  </div>
</template>
<script setup>
import FirstRunForm from 'src/components/forms/FirstRunForm.vue';
import { ref,computed } from "vue";
import { useRoute } from 'vue-router'

const route = useRoute()
const path = computed(() =>route.path)
const activationId = ref(route.params.id)

let fade = ref(true);


</script>

<style>
.divider {
  border-top: 2px solid #ebecf3;
}
</style>
