<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings" />
          <q-breadcrumbs-el :label="$t('Groups')" icon="info" to="/settings/groups" />
          <q-breadcrumbs-el :label="$t('View')" icon="info" />
        </q-breadcrumbs>
      </div>

      <group-form v-if="!isLoading"
        :group="roleDetails || undefined"
        :groupUuid="groupUuid"
        :canEdit="canEdit"
        @groupFormBtnClick="signUpButtonPressed"
        @cancelBtnClick="cancelButtonPressed"
        :key="groupUuid"
      />
      <group-edit-skeleton v-else/>

    </q-page>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { authApi } from "boot/axios";
import GroupForm from 'src/components/forms/GroupForm.vue'
import GroupEditSkeleton from 'components/skeletons/groups/GroupEditSkeleton'

const router = useRouter();
const route = useRoute();
let groupUuid = ref(route.params.uuid)
let canEdit = ref(route.params.mode == 'edit')

let isLoading = ref(false);


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
    // roleDetails.value = 'undefined';
    return;
  }

  authApi
    .get("/groups/" + uuid)
    .then((res) => {
      groupUsersList.value = res.data.users.map(value => value.uuid)
      roleDetails.value = res.data;
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
  // getAllUsers();
  getGroupDetails(route.params.uuid);

});


function cancelButtonHandle() {
  console.log('cancelBtnClick')
  emit('cancelBtnClick')
}


</script>
