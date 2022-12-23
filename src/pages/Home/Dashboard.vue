<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">

      <q-banner rounded inline-actions class="text-brown-10 bg-yellow-14 q-mt-md">
        <template v-slot:avatar>
          <q-icon name="warning" color="warning"/>
        </template>
        Ten projekt nie jest jeszcze wydany! Możesz stracić wszystkie swoje dane. Publiczna beta już wkrótce.
      </q-banner>

      <!-- <card-dashboard></card-dashboard> -->
      <q-card class="bg-transparent no-shadow no-border q-pt-md">
        <q-card-section class="q-pa-none">
          <div class="row q-col-gutter-sm ">
            <div class="col-md-3 col-sm-6 col-xs-6">
              <router-link to="/ideas">
                <q-item class="q-pa-none rounded-borders" style="background-color: #e91e63">
                  <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #d81b60">
                    <q-icon color="white" name="auto_awesome" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.pending }}
                    </q-item-label>
                    <q-item-label>New</q-item-label>
                  </q-item-section>
                </q-item>
              </router-link>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6">
              <router-link to="/ideas">
                <q-item class="q-pa-none rounded-borders" style="background-color: #ffb300">
                  <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #ffa000">
                    <q-icon color="white" name="ballot" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.accepted }}
                    </q-item-label>
                    <q-item-label>Voted</q-item-label>
                  </q-item-section>
                </q-item>
              </router-link>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6">
              <router-link to="/ideas">
                <q-item class="q-pa-none rounded-borders" style="background-color: #009688">
                  <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #00897b">
                    <q-icon color="white" name="thumb_up_alt" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.todo }}
                    </q-item-label>
                    <q-item-label>Accepted</q-item-label>
                  </q-item-section>
                </q-item>
              </router-link>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-6">
              <router-link to="/ideas">
                <q-item class="q-pa-none rounded-borders" style="background-color: #455a64">
                  <q-item-section class=" q-pa-lg q-mr-none text-white rounded-borders"
                                  side
                                  style="background-color: #37474f">
                    <q-icon color="white" name="auto_awesome" size="24px"></q-icon>
                  </q-item-section>
                  <q-item-section class=" q-pa-md q-ml-none  text-white">
                    <q-item-label class="text-white text-h5 text-weight-bolder">{{ status.rejected }}
                    </q-item-label>
                    <q-item-label>Rejected</q-item-label>
                  </q-item-section>
                </q-item>
              </router-link>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <p class="q-pt-xs text-body1">
            Zbieraj
            prawdziwe i <b>szczere sugestie</b> od każdego.
            Rozpocznij błyskawicznie zbieranie informacji od pracowników korzystając z anonimowej skrzynki sugestii
            online.
          </p>

        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import {onBeforeMount, reactive, ref} from "vue";
import {getIdeasStatsRequest} from 'src/components/api/IdeaApiClient'
import {errorHandler} from 'src/components/api/errorHandler.js'

const status = reactive({'accepted': 0, 'todo': 0, 'pending': 0, 'rejected': 0});

const isLoading = ref(false)
const isError = ref(false)

function ping() {
  isLoading.value = true;

  getIdeasStatsRequest().then(function (response) {
    status.pending = response.data.pending
    status.accepted = response.data.accepted
    status.todo = response.data.todo
    status.rejected = response.data.rejected
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });

}

onBeforeMount(() => {
  isLoading.value = true;
  ping()
});
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
