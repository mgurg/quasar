<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section class="row q-pa-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el :label="$t('Guides')" icon="tips_and_updates" to="/guides" />
            <q-breadcrumbs-el :label="$t('View')" icon="info" />
          </q-breadcrumbs>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="itemDetails && !isLoading">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">{{ itemDetails.name }}</q-item-label>
                <!-- <q-item-label caption>{{ itemDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn outline color="primary" no-caps icon="edit" class="float-right q-mr-sm"
                    :label="$q.screen.gt.xs ? $t('Edit') : ''" @click="editItem(itemDetails.uuid)" />
                  <q-btn flat color="red" icon="delete" class="float-right q-mr-sm" no-caps
                    :label="$q.screen.gt.xs ? $t('Delete') : ''" @click="deleteItem(itemDetails.uuid)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        </q-card>
        </q-page>
        </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";

import { getItemUuidRequest, editItemRequest, addItemRequest, deleteItemRequest } from 'src/components/api/ItemApiClient'
import {errorHandler} from 'src/components/api/errorHandler.js'

let itemDetails = ref(null);
let isLoading = ref(false);

const route = useRoute();
const router = useRouter();

function getDetails(uuid) {
  isLoading.value = true;

  getItemUuidRequest(uuid).then(function (response) {
    itemDetails.value = response.data;
    // json.value = res.data.body_json;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
  });

}

onBeforeMount(() => {
  isLoading.value = true;
  getDetails(route.params.uuid);
});

</script>
