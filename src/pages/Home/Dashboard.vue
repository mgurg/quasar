<template>
    <div class="row justify-center text-blue-grey-10">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
            <!-- S -->
            <div class="bg-transparent no-shadow no-border q-ma-sm q-mt-md q-card">
                <div class="q-pa-none q-card__section q-card__section--vert">
                    <div class="row q-col-gutter-sm">
                        <div class="col-md-3 col-sm-6 col-xs-6">
                            <q-item class="bg-red q-pa-none q-ml-xs">
                                <q-item-section avatar>
                                    <q-icon color="primary" name="bluetooth" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>Content filtering</q-item-label>
                                    <q-item-label caption>
                                        Set the content filtering level to restrict
                                        apps that can be downloaded
                                    </q-item-label>
                                </q-item-section>
                            </q-item>

                            <!-- <div
                                class="q-item q-item-type row no-wrap q-pa-none q-ml-xs pointer q-item--dense"
                                style="background-color: rgb(244, 67, 54);"
                            >
                                <div
                                    class="q-item__section column q-pa-lg q-mr-none text-white q-item__section--side justify-center"
                                >
                                    <q-icon name="notifications" color="white" size="32px" />
                                </div>
                                <div
                                    class="q-item__section column q-pa-md q-ml-none text-white q-item__section--main justify-center"
                                >
                                    <div
                                        class="q-item__label text-white text-h6 text-weight-bolder"
                                    >0</div>
                                    <div class="q-item__label text-bold ellipsis">Alarm</div>
                                    <div
                                        class="q-item__label ellipsis"
                                    >Base on active records in event log</div>
                                </div>
                            </div>-->
                        </div>
                        <div class="col-md-3 col-sm-6 col-xs-6">
                            <div
                                class="q-item q-item-type row no-wrap q-pa-none q-ml-xs pointer q-item--dense"
                                style="background-color: rgb(255, 152, 0);"
                            >
                                <div
                                    class="q-item__section column q-pa-lg q-mr-none text-white q-item__section--side justify-center"
                                >
                                    <i
                                        aria-hidden="true"
                                        role="presentation"
                                        class="mdi mdi-alert-circle-outline q-icon notranslate text-white"
                                        style="font-size: 35px;"
                                    ></i>
                                </div>
                                <div
                                    class="q-item__section column q-pa-md q-ml-none text-white q-item__section--main justify-center"
                                >
                                    <div
                                        class="q-item__label text-white text-h6 text-weight-bolder"
                                    >0</div>
                                    <div class="q-item__label text-bold ellipsis">Trouble</div>
                                    <div
                                        class="q-item__label ellipsis"
                                    >Base on active records in event log</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6 col-xs-6">
                            <div
                                class="q-item q-item-type row no-wrap q-pa-none q-ml-xs pointer q-item--dense"
                                style="background-color: rgb(255, 235, 59);"
                            >
                                <div
                                    class="q-item__section column q-pa-lg q-mr-none text-white q-item__section--side justify-center"
                                >
                                    <i
                                        aria-hidden="true"
                                        role="presentation"
                                        class="mdi mdi-account-supervisor-circle q-icon notranslate text-white"
                                        style="font-size: 35px;"
                                    ></i>
                                </div>
                                <div
                                    class="q-item__section column q-pa-md q-ml-none text-white q-item__section--main justify-center"
                                >
                                    <div
                                        class="q-item__label text-white text-h6 text-weight-bolder"
                                    >0</div>
                                    <div class="q-item__label text-bold ellipsis">Supervisory</div>
                                    <div
                                        class="q-item__label ellipsis"
                                    >Base on active records in event log</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-sm-6 col-xs-6">
                            <div
                                class="q-item q-item-type row no-wrap q-pa-none q-ml-xs pointer q-item--dense"
                                style="background-color: rgb(50, 104, 168);"
                            >
                                <div
                                    class="q-item__section column q-pa-lg q-mr-none text-white q-item__section--side justify-center"
                                >
                                    <i
                                        aria-hidden="true"
                                        role="presentation"
                                        class="mdi mdi-phone-outgoing q-icon notranslate text-white"
                                        style="font-size: 35px;"
                                    ></i>
                                </div>
                                <div
                                    class="q-item__section column q-pa-md q-ml-none text-white q-item__section--main justify-center"
                                >
                                    <div
                                        class="q-item__label text-white text-h6 text-weight-bolder"
                                    >0</div>
                                    <div class="q-item__label text-bold ellipsis">Follow Up Tickets</div>
                                    <div
                                        class="q-item__label ellipsis"
                                    >Base on follow up recommendations</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- E -->
        </q-page>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import { api } from "boot/axios";

export default defineComponent({
    name: "PageIndex",
    setup() {
        function ping() {
            api
                .get("/")
                .then((res) => {
                    console.log(res.data);
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

        return {
            ping
        };
    },
});
</script>
