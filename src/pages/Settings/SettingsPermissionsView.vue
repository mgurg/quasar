<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings" />
          <q-breadcrumbs-el :label="$t('Permissions')" icon="info" to="/settings/permissions"  />
          <q-breadcrumbs-el :label="$t('View')" icon="info" />
        </q-breadcrumbs>
      </div>

      <permission-form
        v-if="!isLoading"
        :role="permissionDetails || undefined"
        :groupUuid="permisionUuid"
        :canEdit="canEdit"
        @groupFormBtnClick="signUpButtonPressed"
        @cancelBtnClick="cancelButtonPressed"
        :key="permisionUuid"
      />
      <group-edit-skeleton v-else />

    </q-page>
  </div>
</template>

<script setup>
import { ref,onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { authApi } from "boot/axios";
import PermissionForm from 'src/components/forms/PermissionForm.vue'
import GroupEditSkeleton from 'components/skeletons/groups/GroupEditSkeleton'


const router = useRouter();
const route = useRoute();
let permisionUuid = ref(route.params.uuid)
let canEdit = ref(route.params.mode == 'edit')

let isLoading = ref(false);

function signUpButtonPressed(options){
  
  console.log('SEND')
  console.log(options.data)
  console.log(options.uuid)
}

function cancelButtonPressed(){
  console.log('CANCEL')
}

let permissionDetails = ref(null);
let allPermissions = ref(null);
let allowEdit = ref("false")

let permissionUsersList = ref([])

function getPermissionDetails(uuid) {
  if (uuid ==null || uuid == 'undefined' ){
    console.log('uF')
    return;
  }
  
  authApi
    .get("/permissions/" + uuid)
    .then((res) => {
      console.log(res.data)
      permissionUsersList.value = res.data.permission.map(value => value.uuid)
      permissionDetails.value = res.data;
      allowEdit.value = res.data.is_custom
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




function editUser(uuid) {
  router.push("/users/edit/" + uuid);
}

onBeforeMount(() => {
  isLoading.value = true;
  //getAllPermissions();
  getPermissionDetails(route.params.uuid);
});


function  cancelButtonHandle()
{
    console.log('cancelBtnClick')
    emit('cancelBtnClick')
}


</script>
