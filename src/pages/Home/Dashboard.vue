<template>
    <div class="row justify-center text-blue-grey-10">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
            <!-- S -->
            <div class="bg-transparent no-shadow no-border q-ma-sm q-mt-md q-card">
                <div class="q-pa-none q-card__section q-card__section--vert">
                    <div class="row q-col-gutter-sm">
                        <div class="col-md-3 col-sm-6 col-xs-6">
                            <q-item class="bg-pink-6 q-pa-md q-ml-xs">
                                <q-item-section avatar>
                                    <q-icon color="white" name="auto_awesome" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label class="text-white text-h4">{{status.pending}}</q-item-label>
                                    <q-item-label class="text-white text-weight-bold">New</q-item-label>
                                </q-item-section>
                            </q-item>
                        </div>
                        <div class="col-md-3 col-sm-6 col-xs-6">
                            <q-item class="bg-amber-7 q-pa-md q-ml-xs">
                                <q-item-section avatar>
                                    <q-icon color="white" name="ballot" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label class="text-white text-h4"> {{status.accepted}}</q-item-label>
                                    <q-item-label class="text-white text-weight-bold">Voted</q-item-label>
                                </q-item-section>
                            </q-item>
                        </div>
                        <div class="col-md-3 col-sm-6 col-xs-6">
                            <q-item class="bg-teal-6 q-pa-md q-ml-xs">
                                <q-item-section avatar>
                                    <q-icon color="white" name="thumb_up_alt" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label class="text-white text-h4"> {{status.todo}}</q-item-label>
                                    <q-item-label class="text-white text-weight-bold">Accepted</q-item-label>
                                </q-item-section>
                            </q-item>
                        </div>
                        <div class="col-md-3 col-sm-6 col-xs-6">
                            <q-item class="bg-blue-grey-8 q-pa-md q-ml-xs">
                                <q-item-section avatar>
                                    <q-icon color="white" name="delete_forever" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label class="text-white text-h4"> {{status.rejected}}</q-item-label>
                                    <q-item-label class="text-white text-weight-bold">Rejected</q-item-label>
                                </q-item-section>
                            </q-item>
                        </div>
                        <q-space/>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vulputate metus ut enim
                            semper convallis.
                            Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                            Fusce tristique varius felis nec porta. Donec non mi ligula. Etiam tincidunt pretium tellus
                            quis scelerisque.
                            Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque vestibulum suscipit
                            urna eu scelerisque.
                            Proin congue sed tellus nec varius. Mauris et lorem eu elit sollicitudin sollicitudin. </p>
                    </div>
                </div>
            </div>
            <!-- E -->
        </q-page>
    </div>
</template>

<script setup>
import { onBeforeMount, reactive} from "vue";
import { api, authApi } from "boot/axios";

const status = reactive({'accepted': 0, 'todo': 0, 'pending': 0, 'rejected': 0});

function ping() {
    authApi
        .get("/stats/status")
        .then((res) => {
            // console.log(res.data);
            status.new = res.data.null
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
