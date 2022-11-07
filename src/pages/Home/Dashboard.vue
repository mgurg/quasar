<template>
    <div class="row justify-center text-blue-grey-10">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
            <!-- <card-dashboard></card-dashboard> -->
            <q-card class="bg-transparent no-shadow no-border q-pt-md">
                <q-card-section class="q-pa-none">
                    <div class="row q-col-gutter-sm ">
                        <div class="col-md-3 col-sm-6 col-xs-6">
                            <router-link to="/ideas">
                                <q-item style="background-color: #e91e63" class="q-pa-none rounded-borders">
                                    <q-item-section  side
                                    style="background-color: #d81b60"
                                        class=" q-pa-lg q-mr-none text-white rounded-borders">
                                        <q-icon name="auto_awesome" color="white" size="24px"></q-icon>
                                    </q-item-section>
                                    <q-item-section class=" q-pa-md q-ml-none  text-white">
                                        <q-item-label class="text-white text-h5 text-weight-bolder">{{status.pending}}
                                        </q-item-label>
                                        <q-item-label>New</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </router-link>
                        </div>
                        <div class="col-md-3 col-sm-6 col-xs-6">
                            <router-link to="/ideas">
                                <q-item style="background-color: #ffb300" class="q-pa-none rounded-borders">
                                    <q-item-section  side
                                    style="background-color: #ffa000"
                                        class=" q-pa-lg q-mr-none text-white rounded-borders">
                                        <q-icon name="ballot" color="white" size="24px"></q-icon>
                                    </q-item-section>
                                    <q-item-section class=" q-pa-md q-ml-none  text-white">
                                        <q-item-label class="text-white text-h5 text-weight-bolder">{{status.accepted}}
                                        </q-item-label>
                                        <q-item-label>Voted</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </router-link>
                        </div>
                        <div class="col-md-3 col-sm-6 col-xs-6">
                            <router-link to="/ideas">
                                <q-item style="background-color: #009688" class="q-pa-none rounded-borders">
                                    <q-item-section  side
                                    style="background-color: #00897b"
                                        class=" q-pa-lg q-mr-none text-white rounded-borders">
                                        <q-icon name="thumb_up_alt" color="white" size="24px"></q-icon>
                                    </q-item-section>
                                    <q-item-section class=" q-pa-md q-ml-none  text-white">
                                        <q-item-label class="text-white text-h5 text-weight-bolder">{{status.todo}}
                                        </q-item-label>
                                        <q-item-label>Accepted</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </router-link>
                        </div>
                        <div class="col-md-3 col-sm-6 col-xs-6">
                            <router-link to="/ideas">
                                <q-item style="background-color: #455a64" class="q-pa-none rounded-borders">
                                    <q-item-section  side
                                    style="background-color: #37474f"
                                        class=" q-pa-lg q-mr-none text-white rounded-borders">
                                        <q-icon name="auto_awesome" color="white" size="24px"></q-icon>
                                    </q-item-section>
                                    <q-item-section class=" q-pa-md q-ml-none  text-white">
                                        <q-item-label class="text-white text-h5 text-weight-bolder">{{status.rejected}}
                                        </q-item-label>
                                        <q-item-label>Rejected</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </router-link>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
            <p class="q-pt-md text-body1" :class="$q.dark.isActive ? 'text-blue-grey-1' : 'text-blue-grey-10'">Zbieraj
                prawdziwe i <b>szczere sugestie</b> od każdego.
                Rozpocznij błyskawicznie zbieranie informacji od pracowników korzystając z anonimowej skrzynki sugestii
                online.</p>
        </q-page>
    </div>
</template>

<script setup>
import { onBeforeMount, reactive } from "vue";
import { api, authApi } from "boot/axios";
import CardDashboard from 'src/components/tiles/CardDashboard.vue'

const status = reactive({ 'accepted': 0, 'todo': 0, 'pending': 0, 'rejected': 0 });

function ping() {
    authApi
        .get("/ideas/stats")
        .then((res) => {
            // console.log(res.data);
            status.pending = res.data.pending
            status.accepted = res.data.accepted

            status.todo = res.data.todo
            status.rejected = res.data.rejected
            // console.log(status);
        })
        .catch((err) => {
            if (err.response) {
                console.log(err.response);
            } else if (err.request) {
                console.log(err.request);
            } else {
                console.log("General Error");
            }

        });
}

onBeforeMount(() => {
    ping()
});


</script>

<style lang="scss"  scoped>
a {
  text-decoration: none;
}
</style>
