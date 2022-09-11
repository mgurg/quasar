<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">

      <div class="row justify-around q-mt-sm">
        <div class="col-6"><p class="text-h4">{{ $t("Settings") }}</p></div>
        <div class="col-6"></div>
      </div>

      <div class="bg-transparent no-shadow no-border q-ma-sm q-mt-md q-card">
                <div class="q-pa-none q-card__section q-card__section--vert">
                    <div class="row q-col-gutter-sm">
                      <router-link to="/settings/ideas" class="col-md-4 col-sm-6 col-xs-12" >
                        <div >
                            <q-item class="bg-pink-6 q-pa-md q-ml-xs">
                                <q-item-section avatar>
                                    <q-icon color="white" name="lightbulb" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label class="text-white text-h4">Ideas</q-item-label>
                                    <q-item-label class="text-white text-weight-bold"></q-item-label>
                                </q-item-section>
                            </q-item>
                        </div>
                      </router-link>
                      <router-link to="/settings/permissions" class="col-md-4 col-sm-6 col-xs-12">
                        <div >
                            <q-item class="bg-amber-7 q-pa-md q-ml-xs">
                                <q-item-section avatar>
                                    <q-icon color="white" name="ballot" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label class="text-white text-h4">Permissions</q-item-label>
                                    <q-item-label class="text-white text-weight-bold"></q-item-label>
                                </q-item-section>
                            </q-item>
                        </div>
                      </router-link>
                      <router-link to="/settings/groups" class="col-md-4 col-sm-6 col-xs-12">
                        <div >
                            <q-item class="bg-teal-6 q-pa-md q-ml-xs">
                                <q-item-section avatar>
                                    <q-icon color="white" name="groups" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label class="text-white text-h4">Groups</q-item-label>
                                    <q-item-label class="text-white text-weight-bold"></q-item-label>
                                </q-item-section>
                            </q-item>
                        </div>
                      </router-link>
                        <q-space/>
                          <!-- <div class="col-md-4 col-sm-6 col-xs-12">
                            <q-item class="bg-blue-grey-8 q-pa-md q-ml-xs">
                                <q-item-section avatar>
                                    <q-icon color="white" name="delete_forever" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label class="text-white text-h4"> 2</q-item-label>
                                    <q-item-label class="text-white text-weight-bold">Rejected</q-item-label>
                                </q-item-section>
                            </q-item>
                        </div> -->
                        <p class="q-pt-md text-body1">Zbieraj prawdziwe i <b>szczere sugestie</b> od każdego. 
                           Rozpocznij błyskawicznie zbieranie informacji od pracowników korzystając z anonimowej skrzynki sugestii online.</p>
                    </div>
                </div>
            </div>

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

