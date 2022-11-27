<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-py-xs">
      <q-breadcrumbs class="row q-pa-sm">
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el :label="$t('Employees')" icon="people" to="/users" />
            <q-breadcrumbs-el :label="$t('View')" icon="info" />
          </q-breadcrumbs>
      <q-card v-if="userDetails && !isLoading" bordered class="my-card no-shadow q-mt-sm">
        <!-- <q-card-section class="row q-pa-sm">


        </q-card-section>

        <q-separator /> -->
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">

              <q-item-section>
                <q-item-label class="text-h6">{{ userDetails.first_name }} {{ userDetails.last_name }}</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side >
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



        <!-- <div v-if="$q.screen.lt.md">
          <q-separator />
          <q-card-actions>
            <div class="col-12 text-h6 q-mt-none">
              <q-btn outline color="red" icon="delete" class="float-right q-mr-sm" no-caps
                :label="$q.screen.gt.xs ? $t('Delete') : ''" @click="deleteUser(userDetails.uuid)" />
              <q-btn outline color="primary" no-caps icon="edit" class="float-right q-mr-sm"
                :label="$q.screen.gt.xs ? $t('Edit') : ''" @click="editUser(userDetails.uuid)" />
            </div>
          </q-card-actions>
        </div> -->

      </q-card>


      <q-card class="my-card no-shadow q-my-sm" bordered v-if="userDetails && !isLoading">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h5">{{$t('Details')}}</div>
            <q-space></q-space>
            <q-btn 
              color="grey"
              round
              flat
              dense
              :icon="expandedDetails ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="expandedDetails = !expandedDetails"
            />
          </div>
        </q-card-section>

        <q-slide-transition>
        <div v-show="expandedDetails">
          <q-separator />
          <q-card-section class="text-subitle2">
            <p>{{$t('E-mail')}}:  <a :href="`mailto:${userDetails.email}`">{{ userDetails.email }}</a></p>
            <p>{{$t('Phone')}}: <a :href="`tel:${userDetails.phone}`">{{ userDetails.phone }}</a></p>
            <p>{{$t('Role')}}: <strong>{{ userDetails.role_FK.role_title }}</strong></p>
          </q-card-section>
        </div>
      </q-slide-transition>
      </q-card>


      <q-card class="my-card no-shadow q-my-sm" bordered v-if="userDetails && !isLoading">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h5">{{$t('Ideas')}}</div>
            <q-space></q-space>
            <q-btn 
              color="grey"
              round
              flat
              dense
              :icon="expandedIdeas ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="expandedIdeas = !expandedIdeas"
            />
          </div>
        </q-card-section>

        <q-slide-transition>
        <div v-show="expandedIdeas">
          <q-separator />
          <q-card-section>
            <div v-for="(idea, index) in ideas" v-bind:key="index" v-if="ideas != null">
            <idea-item :idea="idea" v-if="!isLoading"></idea-item>
          </div>
          <task-index-skeleton v-else />
          </q-card-section>
        </div>
      </q-slide-transition>



      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import { ref,computed, onActivated, onBeforeMount } from "vue";
import { useQuasar } from 'quasar'
import { DateTime } from "luxon";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { authApi } from "boot/axios";
import TaskViewSkeleton from 'components/skeletons/tasks/TaskViewSkeleton'

import TaskIndexSkeleton from "components/skeletons/tasks/TaskIndexSkeleton.vue";
import IdeaItem from "components/IdeaItem.vue";

const router = useRouter();
const $q = useQuasar()


let expandedDetails = ref(true)
let expandedIdeas = ref(true)

let isLoading = ref(false);
let slide = ref(1);
let expanded = ref(false);

const route = useRoute();
let userUuid = ref(route.params.uuid)
let userDetails = ref(null);
let ideas = ref(null);

const initials =ref("")

function getDetails(uuid) {
  authApi
    .get("/users/" + uuid)
    .then((res) => {
      userDetails.value = res.data;
      initials.value = (res.data.first_name[0] + res.data.last_name[0]).toUpperCase()
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

function activateUser() {
  authApi
    .patch("users/" + userDetails.value.uuid, { "is_verified": true })
    .then((res) => {

      userDetails.value.is_verified = true

      // getDetails(taskDetails.value.uuid);
      // taskDetails.value = res.data;
      // isLoading.value = false;
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

function getUserIdeas() {
  authApi
    .get("ideas/user/" + userUuid.value)
    .then((res) => {
      console.log(res.data.items);
      ideas.value = res.data.items

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

getUserIdeas()

function editUser(uuid) {
  router.push("/users/edit/" + uuid);
}

function deleteUser(uuid) {
    $q.dialog({
        title: "Confirm",
        message: "Really delete?",
        cancel: true,
        persistent: true,
    }).onOk(() => {
        authApi
            .delete("/users/" + uuid)
            .then((res) => {
              $q.notify("User deleted");
              router.push("/users/edit/" + uuid);
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
        // $q.notify("User deleted");

        // handleRefresh()
        // fetchTasks()
    });
}

onBeforeMount(() => {
  isLoading.value = true;
  getDetails(route.params.uuid);
});


</script>

<style>
.q-breadcrumbs{
  opacity: 0.7;
}
</style>
