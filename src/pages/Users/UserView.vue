<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-py-xs">
      <q-breadcrumbs class="row q-pa-sm">
        <q-breadcrumbs-el icon="home" to="/"/>
        <q-breadcrumbs-el :label="$t('Employees')" to="/users"/>
        <q-breadcrumbs-el :label="$t('View')"/>
      </q-breadcrumbs>
      <q-card v-if="userDetails && !isLoading" bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">

              <q-item-section>
                <q-item-label class="text-h6">{{ userDetails.first_name }} {{ userDetails.last_name }}</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn :label="$q.screen.gt.xs ? $t('Edit') : ''" class="float-right q-mr-sm" color="primary"
                         icon="edit" no-caps
                         outline @click="editUser(userDetails.uuid)"/>
                  <q-btn :label="$q.screen.gt.xs ? $t('Delete') : ''" class="float-right q-mr-sm" color="red" flat
                         icon="delete"
                         v-if="currentUserUuid != userDetails.uuid"
                         no-caps @click="deleteUser(userDetails.uuid)"/>

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


      <q-card v-if="userDetails && !isLoading" bordered class="my-card no-shadow q-my-sm">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h5">{{ $t('Details') }}</div>
            <q-space></q-space>
            <q-btn
              :icon="expandedDetails ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              color="grey"
              dense
              flat
              round
              @click="expandedDetails = !expandedDetails"
            />
          </div>
        </q-card-section>

        <q-slide-transition>
          <div v-show="expandedDetails">
            <q-separator/>
            <q-card-section class="text-subitle2">
              <p>{{ $t('E-mail') }}: <a :href="`mailto:${userDetails.email}`">{{ userDetails.email }}</a></p>
              <p>{{ $t('Phone') }}: <a :href="`tel:${userDetails.phone}`">{{ userDetails.phone }}</a></p>
              <p>{{ $t('Role') }}: <strong>{{ userDetails.role_FK.role_title }}</strong></p>
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>


      <q-card v-if="userDetails && !isLoading" bordered class="my-card no-shadow q-my-sm">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h5">{{ $t('Ideas') }}</div>
            <q-space></q-space>
            <q-btn
              :icon="expandedIdeas ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              color="grey"
              dense
              flat
              round
              @click="expandedIdeas = !expandedIdeas"
            />
          </div>
        </q-card-section>

        <q-slide-transition>
          <div v-show="expandedIdeas">
            <q-separator/>
            <q-card-section>
              <div v-for="(idea, index) in ideas" v-if="ideas != null" v-bind:key="index">
                <idea-item v-if="!isLoading && ideas!=null " :idea="idea"></idea-item>
              </div>
              <task-index-skeleton v-else/>
            </q-card-section>
          </div>
        </q-slide-transition>

      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";

import {useQuasar} from 'quasar'
import {useRoute, useRouter} from "vue-router";

import TaskIndexSkeleton from "components/skeletons/tasks/TaskIndexSkeleton.vue";
import IdeaItem from "components/listRow/IdeaListRow.vue";
import {getUserIdeasRequest} from "components/api/IdeaApiClient";
import {activateUserRequest, deleteUserRequest, getUserRequest} from 'src/components/api/UserApiClient.js'
import {errorHandler} from 'src/components/api/errorHandler.js'
import {useUserStore} from "stores/user";

const $q = useQuasar()
const router = useRouter();
const UserStore = useUserStore();
const currentUserUuid = UserStore.getCurrentUserId

let expandedDetails = ref(true)
let expandedIdeas = ref(true)

let isLoading = ref(false);


const route = useRoute();
// let userUuid = ref(route.params.uuid)
let userDetails = ref(null);
let ideas = ref(null);

const initials = ref("")

function getUserDetails(uuid) {
  isLoading.value = true;
  getUserRequest(uuid).then(function (response) {
    userDetails.value = response.data;
    initials.value = (response.data.first_name[0] + response.data.last_name[0]).toUpperCase()
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function activateUser(uuid) {
  // userDetails.value.uuid
  isLoading.value = true;
  activateUserRequest(uuid).then(function (response) {
    userDetails.value.is_verified = true
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function getUserIdeas(uuid) {
  // userUuid.value
  isLoading.value = true;
  getUserIdeasRequest(uuid).then(function (response) {
    ideas.value = response.data.items

    if (response.data.items.length  == 0){
      expandedIdeas.value = false;
    }
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function editUser(uuid) {
  router.push("/users/edit/" + uuid);
}

function deleteUser(uuid) {
  $q.dialog({title: "Confirm", message: "Really delete?", cancel: true, persistent: true,})
    .onOk(() => {
      isLoading.value = true;
      deleteUserRequest(uuid).then(function (response) {
        $q.notify("User deleted");
        router.push("/users/edit/" + uuid);
        isLoading.value = false;
      }).catch((err) => {
        const errorMessage = errorHandler(err);
        isError.value = true;
      });
    });
}

onBeforeMount(() => {
  isLoading.value = true;
  getUserDetails(route.params.uuid);
  getUserIdeas(route.params.uuid);

});


</script>

<style>
.q-breadcrumbs {
  opacity: 0.7;
}
</style>
