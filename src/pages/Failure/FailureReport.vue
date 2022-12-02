<template>


  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-medium">{{ $t("Guides") }}</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn outline class="float-right q-mr-xs no-shadow" icon="add" to="/guides/add" color="primary"
                    no-caps :label="$q.screen.gt.xs ? $t('New guide') : ''" />
                </div>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <div class="q-pt-md">

        <q-stepper v-model="step" ref="stepper" color="primary" animated>
          <q-step :name="1" title="Rozwiązania" icon="lightbulb_circle" :done="step > 1"
            style="min-height: 100px;" >

            <div v-for="(guide, index) in itemDetails.item_guides" v-bind:key="index" v-if="itemDetails!= null">
              <guide-item :guide="guide" v-if="!isLoading"></guide-item>
              <!-- {{guide.name}} <br>
              <q-btn flat @click="goToSolution(guide.uuid)" no-caps>zobacz rozwiązanie</q-btn> -->
            </div>

          </q-step>

          <q-step :name="2" title="Zgłos problem" icon="create_new_folder" :done="step > 2"
            style="min-height: 100px;">
            <idea-form button-text="Save" ></idea-form>
          </q-step>



          <template v-slot:navigation>
            <q-stepper-navigation >
              <q-btn v-if="step == 1" @click="$refs.stepper.next()" color="primary" label="Continue" />

              <!-- <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 2 ? 'Finish' : 'Continue'" />
              <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back"
                class="q-ml-sm" /> -->
            </q-stepper-navigation>
          </template>

          <template v-slot:message>
            <q-banner v-if="step === 1" class="bg-blue-8 text-white q-px-md">
              Przed wysłaniem zgłoszenia sprawdź czy problemu nie można rozwiązać korzystając z zapisanych rozwiań.
            </q-banner>
            <!-- <q-banner v-else-if="step === 2" class="bg-orange-8 text-white q-px-lg">
              The ad group helps you to...
            </q-banner> -->
            <!-- <q-banner v-else class="bg-blue-8 text-white q-px-lg">
              The final step is creating the ad...
            </q-banner> -->
          </template>
        </q-stepper>

      </div>
    </q-page>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import GuideItem from "components/listRow/GuideListRow.vue";
import IdeaForm from 'src/components/forms/IdeaForm.vue'
import { getItemUuidRequest } from 'src/components/api/ItemApiClient.js'
import { errorHandler } from 'src/components/api/errorHandler.js'


const route = useRoute();
const router = useRouter();

const step = ref(1);
const itemDetails = ref(null)
let isLoading = ref(false);


function getDetails(uuid) {
  isLoading.value = true;

  getItemUuidRequest(uuid).then(function (response) {
    console.log(response.data);
    itemDetails.value = response.data;
    // json.value = res.data.body_json;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage);
  });

}

function goToSolution(uuid){
  console.log(uuid)
  router.push("/guides/" + uuid);
}

onBeforeMount(() => {
  isLoading.value = true;
  getDetails(route.params.uuid);
});

</script>

<style lang="scss" scoped>

:deep(.q-stepper__step-inner) {
  padding: 0 !important;
}
</style>
