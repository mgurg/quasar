<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs class="q-ma-sm text-grey" active-color="grey">
        <template v-slot:separator>
          <q-icon
            size="1.5em"
            name="chevron_right"
            color="grey"
          />
        </template>
        <q-breadcrumbs-el icon="home" to="/"/>
        <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings"/>
        <q-breadcrumbs-el :label="$t('Groups')" icon="ballot" to="/settings/groups"/>
        <q-breadcrumbs-el :label="$t('View')"/>
      </q-breadcrumbs>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <div class="col-12 text-h6 q-mt-xs">
            <span class="text-h6" v-if="roleDetails">{{ roleDetails.name }}</span>
            <span>
            <q-btn
              outline
              color="primary"
              no-caps icon="edit"
              class="float-right "
              :label="$q.screen.gt.xs ?  $t('Edit') : ''"
              @click="toggleEdit()"/>
            <q-btn
              outline
              color="red"
              icon="delete"
              class="float-right q-mr-sm"
              no-caps
              :label="$q.screen.gt.xs ?  $t('Delete') : ''"
              @click="deleteGroup(roleDetails.uuid)"
            />
          </span>
          </div>
        </q-card-section>
      </q-card>


      <q-card bordered class="my-card no-shadow q-my-sm">
        <q-card-section>
          <group-form v-if="!isLoading && isFetched" :group="roleDetails || undefined" :groupUuid="groupUuid"
                      :canEdit="canEdit"
                      @groupFormBtnClick="signUpButtonPressed" @cancelBtnClick="cancelButtonPressed" :key="groupUuid"/>
          <group-edit-skeleton v-if="isLoading"/>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import {onBeforeMount, ref, watch} from "vue";
import {useQuasar} from "quasar";
import {useRoute, useRouter} from "vue-router";
import {authApi} from "boot/axios";
import GroupForm from 'src/components/forms/GroupForm.vue'
import GroupEditSkeleton from 'components/skeletons/groups/GroupEditSkeleton'
import {deleteUsersGroupRequest, getUsersGroupRequest, getUsersGroupsRequest} from "components/api/UserGroupsApiClient";
import {errorHandler} from "components/api/errorHandler";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
let groupUuid = ref(route.params.uuid)
let canEdit = ref(route.params.mode == 'edit')

let isLoading = ref(true);
let isFetched = ref(false)

watch(isLoading, (newValue, oldValue) => {
  console.log("isLoading", oldValue, newValue)
});


function signUpButtonPressed(options) {

  console.log('SEND')
  console.log(options.data)
  console.log(options.uuid)
}

function cancelButtonPressed() {
  console.log('CANCEL')
}


let roleDetails = ref(null);
let allUsers = ref(null);
let allowEdit = ref("false")

let groupUsersList = ref([])

function getGroupDetails(uuid) {

  if (uuid == null || uuid == 'undefined') {
    console.log('uF')
    isFetched.value = true
    // roleDetails.value = 'undefined';
    return;
  }

  getUsersGroupRequest(uuid).then(function (response) {
        groupUsersList.value = response.data.users.map(value => value.uuid)
        roleDetails.value = response.data;
        isLoading.value = false;
        isFetched.value = true;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });

}

onBeforeMount(() => {
  isLoading.value = true;
  // getAllUsers();
  getGroupDetails(route.params.uuid);
  isLoading.value = false;

});


function deleteGroup(uuid) {
  $q.dialog({
    title: "Confirm",
    message: "Really delete?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteUsersGroupRequest(uuid).then(function (response) {
      router.push("/settings/groups");
    }).catch((err) => {
      const errorMessage = errorHandler(err);
      isError.value = true;
    });

    $q.notify("Group deleted");
    // fetchTasks()
  });
}

function cancelButtonHandle() {
  console.log('cancelBtnClick')
  emit('cancelBtnClick')
}

function toggleEdit() {
  canEdit.value = !canEdit.value
}

</script>
