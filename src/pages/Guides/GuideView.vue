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

        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">Naprawa CNC</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn outline color="primary" no-caps icon="edit" class="float-right q-mr-sm"
                    :label="$q.screen.gt.xs ? $t('Edit') : ''" @click="editUser(userDetails.uuid)" />
                  <q-btn flat color="red" icon="delete" class="float-right q-mr-sm" no-caps
                    :label="$q.screen.gt.xs ? $t('Delete') : ''" @click="deleteUser(userDetails.uuid)" />

                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card class="my-card no-shadow q-my-sm" bordered>
        <!-- <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h5">Opis</div>
            <q-space></q-space>
            <q-btn color="grey" round flat dense icon="keyboard_arrow_down"
              @click="expandedDetails = !expandedDetails" />
          </div>
        </q-card-section> -->
        <q-card-section>
          <div style="border: 1px solid #c2c2c2; border-radius: 5px; padding-left: 5px;">
            <tip-tap-guide :readonly="true" />
          </div>
        </q-card-section>

        <q-card-section>
          <q-img src="https://placeimg.com/500/300/nature?t=1" class="q-ma-xs" style="height: 140px; max-width: 150px"
            native-context-menu />
          <q-img src="https://placeimg.com/500/300/nature?t=2" class="q-ma-xs" style="height: 140px; max-width: 150px"
            draggable />
          <q-img src="https://placeimg.com/500/300/nature?t=3" class="q-ma-xs"
            style="height: 140px; max-width: 150px" />
          <q-img src="https://placeimg.com/500/300/nature?t=4" class="q-ma-xs"
            style="height: 140px; max-width: 150px" />
        </q-card-section>
        <q-card-section>
          <q-btn label="Alert" color="primary" @click="dialog = true" />
        </q-card-section>

      </q-card>

      <q-dialog v-model="dialog">
      <q-card>
        <q-card-section class="q-pt-none">
          <img src="http://placeimg.com/1000/1000/arch?t=5" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>




    <q-dialog
      v-model="dialog"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-primary text-white">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <img src="http://placeimg.com/1000/1000/arch?t=5" />
        </q-card-section>
      </q-card>
    </q-dialog>

    </q-page>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import TipTapGuide from 'src/components/editor/TipTapGuide.vue'
import { useUserStore } from 'stores/user'
import { useRoute } from "vue-router";
import { authApi } from "boot/axios";
import TaskViewSkeleton from "components/skeletons/tasks/TaskViewSkeleton";

const UserStore = useUserStore();

const json = ref(null);
let isLoading = ref(false);
let dialog = ref(false);



const counter = computed(() => ideaDetails.value.upvotes - ideaDetails.value.downvotes);
const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return Boolean(permissions.value.includes(permission));
}


const route = useRoute();
let ideaDetails = ref(null);

function convertTime(datetime) {
  let timeZone = "America/Los_Angeles";
  const dateObject = new Date(datetime).toLocaleString("en-US", {
    timeZone,
  });

  return dateObject;
}

function getDetails(uuid) {
  authApi
    .get("/guides/" + uuid)
    .then((res) => {
      console.log(uuid);
      console.log(res.data);
      // ideaDetails.value = res.data;
      // json.value = res.data.body_json;
      isLoading.value = false;
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
  isLoading.value = true;
  getDetails(route.params.uuid);
});

</script>

<style lang="scss" scoped>
img.img-responsive {
  display: block;
  max-width: 90%;
  height: auto;
}
</style>
