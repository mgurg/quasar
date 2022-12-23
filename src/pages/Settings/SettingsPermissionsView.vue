<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <!--          <q-breadcrumbs>-->
      <!--            <q-breadcrumbs-el icon="home" to="/"/>-->
      <!--            <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings"/>-->
      <!--            <q-breadcrumbs-el :label="$t('Permissions')" icon="info" to="/settings/permissions"/>-->
      <!--            <q-breadcrumbs-el :label="$t('View')"/>-->
      <!--          </q-breadcrumbs>-->
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-list>
          <q-item class="q-px-sm">
            <q-item-section avatar>
              <q-btn icon="arrow_back_ios" color="grey" dense no-caps flat @click="router.back()">{{
                  $t("Return")
                }}
              </q-btn>
            </q-item-section>
            <q-item-section></q-item-section>
            <q-item-section side>
              <div class="col-12 text-h6 q-mt-none">
<!--                <q-btn-->
<!--                  :label="$q.screen.gt.xs ? $t('Edit') : ''"-->
<!--                  class="float-right q-mr-sm" color="primary" flat-->
<!--                  icon="edit" no-caps-->
<!--                  outline @click="editGuide(guideDetails.uuid)"-->
<!--                />-->
<!--                <q-btn-->
<!--                  :label="$q.screen.gt.xs ? $t('Delete') : ''"-->
<!--                  class="float-right q-mr-sm" color="red" flat-->
<!--                  icon="delete"-->
<!--                  no-caps @click="deleteGuide(guideDetails.uuid)"-->
<!--                />-->
                <q-btn
                  :label="$q.screen.gt.xs ?  $t('Edit') : ''"
                  class="float-right "
                  color="primary" icon="edit"
                  no-caps
                  flat
                  @click="toggleEdit()"/>
                <q-btn
                  :label="$q.screen.gt.xs ?  $t('Delete') : ''"
                  class="float-right q-mr-sm"
                  color="red"
                  icon="delete"
                  no-caps
                  flat
                  @click="deleteGroup(permissionDetails.uuid)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5" v-if="permissionDetails">{{ permissionDetails.role_name }}</q-item-label>
                <!--                 <q-item-label caption>{{ itemDetails.summary }}</q-item-label>-->
                <q-item-label caption>Krótki publicznie dostępny opis</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <div>&nbsp;</div>
      <q-card class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section>
          <permission-form
            v-if="!isLoading && isFetched"
            :role="permissionDetails || undefined"
            :groupUuid="permisionUuid"
            :canEdit="canEdit"
            @groupFormBtnClick="signUpButtonPressed"
            @cancelBtnClick="cancelButtonPressed"
            :key="permisionUuid"
          />
          <group-edit-skeleton v-else/>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {authApi} from "boot/axios";
import PermissionForm from 'src/components/forms/PermissionForm.vue'
import GroupEditSkeleton from 'components/skeletons/groups/GroupEditSkeleton'


const router = useRouter();
const route = useRoute();
let permisionUuid = ref(route.params.uuid)
let canEdit = ref(route.params.mode == 'edit')

let isLoading = ref(false);
let isFetched = ref(false);

function signUpButtonPressed(options) {

  console.log('SEND')
  console.log(options.data)
  console.log(options.uuid)
}

function cancelButtonPressed() {
  console.log('CANCEL')
}

let permissionDetails = ref(null);
let allPermissions = ref(null);
let allowEdit = ref("false")

let permissionUsersList = ref([])

function getPermissionDetails(uuid) {
  if (uuid == null || uuid == 'undefined') {
    console.log('uF')
    isFetched.value = true;
    return;
  }

  authApi
    .get("/permissions/" + uuid)
    .then((res) => {

      permissionUsersList.value = res.data.permission.map(value => value.uuid)
      permissionDetails.value = res.data;
      allowEdit.value = res.data.is_custom
      isLoading.value = false;
      isFetched.value = true;
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


function cancelButtonHandle() {
  console.log('cancelBtnClick')
  emit('cancelBtnClick')
}

function toggleEdit() {
  canEdit.value = !canEdit.value
}


</script>
