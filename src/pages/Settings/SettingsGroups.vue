<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings" />
          <q-breadcrumbs-el :label="$t('Ideas')" icon="info" />
        </q-breadcrumbs>
      </div>
      <!-- <div class="row justify-around q-mt-sm">
        <div class="col-6"><p class="text-h4">{{ $t("Settings") }}</p></div>
        <div class="col-6"></div>
      </div> -->


    </q-page>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useQuasar } from 'quasar'

const $q = useQuasar()

// -----------------------------


onBeforeMount(() => {
  console.log('b')
});






</script>

<style lang="scss"  scoped>
a {
  text-decoration: none;
}
</style>

