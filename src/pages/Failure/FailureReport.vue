<template>


  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-medium" v-if="itemDetails!= null">{{ $t("Issue") }}:
                  {{ itemDetails.name }}
                </q-item-label>
                <q-item-label caption>
                  Poniżej jest lista znanych problemów, czynności serwisowych.
                  Sprawdź czy nie znajdziesz tam rozwiązania swojego problemu.
                </q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>


      <q-card bordered class="my-card no-shadow q-mt-sm">
        <div v-for="(guide, index) in itemDetails.item_guides" v-if="itemDetails!= null" v-bind:key="index">
          <guide-item v-if="!isLoading" :guide="guide"></guide-item>
          <!-- {{guide.name}} <br>
          <q-btn flat @click="goToSolution(guide.uuid)" no-caps>zobacz rozwiązanie</q-btn> -->
        </div>
      </q-card>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          Mój problem jest inny, chcę zgłosić nowy problem.

        </q-card-section>
        <q-card-actions>
          <q-btn color="primary" icon="bug_report" no-caps outline @click="reportProblem()">&nbsp; Zgłaszam nowy
            problem
          </q-btn>
        </q-card-actions>
      </q-card>

    </q-page>
  </div>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import GuideItem from "components/listRow/GuideListRow.vue";
import {getOneItemRequest} from 'src/components/api/ItemApiClient.js'
import {errorHandler} from 'src/components/api/errorHandler.js'


const route = useRoute();
const router = useRouter();


const itemDetails = ref(null);
const itemUuid = ref(null);
let isLoading = ref(false);


function getDetails(uuid) {
  isLoading.value = true;

  getOneItemRequest(uuid).then(function (response) {
    console.log(response.data);
    itemDetails.value = response.data;
    // json.value = res.data.body_json;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage);
  });

}

function goToSolution(uuid) {
  console.log(uuid)
  router.push("/guides/" + uuid);
}

function reportProblem() {
  // router.push("/issues/add" + itemUuid.value);
  router.push({path: '/issues/add/', query: {item: itemUuid.value}})
}

onBeforeMount(() => {
  isLoading.value = true;
  itemUuid.value = route.params.uuid
  getDetails(route.params.uuid);
});

</script>

<style lang="scss" scoped>

:deep(.q-stepper__step-inner) {
  padding: 0 !important;
}
</style>
