<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section class="row q-pa-md">
          <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings" />
          <q-breadcrumbs-el :label="$t('Permissions')" icon="info" to="/settings/permissions"  />
          <q-breadcrumbs-el :label="$t('View')" icon="info" />
        </q-breadcrumbs>
        <div class="col-12 text-h6 q-mt-sm">
        <span class="text-h6" v-if="permissionDetails">{{permissionDetails.role_name}}</span> 
      </div>
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <div class="col-12 text-h6 q-mt-xs">
            
            <span>
            <q-btn 
            outline 
            color="primary" 
            no-caps icon="edit" 
            class="float-right " 
            :label = "$q.screen.gt.xs ?  $t('Edit') : ''"
            @click="toggleEdit()"  />
            <q-btn 
            outline  
            color="red" 
            icon="delete" 
            class="float-right q-mr-sm" 
            no-caps 
            :label = "$q.screen.gt.xs ?  $t('Delete') : ''"
            @click="deleteGroup(permissionDetails.uuid)"
             />
          </span>
          </div>
      </q-card-actions>
      </q-card>

      <permission-form
        v-if="!isLoading && isFetched"
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
let isFetched = ref(false);

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
    isFetched.value=true;
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
      isFetched.value=true;
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

function toggleEdit(){
  canEdit.value = !canEdit.value
}


</script>
