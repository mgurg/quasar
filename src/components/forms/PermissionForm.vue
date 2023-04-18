<template>
  <div class="row">
  </div>
  <q-form
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    class="q-gutter-md"
    spellcheck="false"
    @submit.prevent
  >
    <q-input
      v-model="roleName"
      :disable="isLoading"
      :error="!!errors.roleName"
      :error-message="errors.roleName"
      :label="$t('Name')"
      :readonly="!allowEdit"
      outlined
    />
    <q-input
      v-model="roleDescription"
      :disable="isLoading"
      :error="!!errors.roleDescription"
      :error-message="errors.roleDescription"
      :label="$t('Description')"
      :readonly="!allowEdit"
      outlined
    />

    <permission-list :can-edit="allowEdit" :selected-items="selectedPermissions" @change-selection="updateSelection"/>

    <div class="row">
      <q-space/>
      <q-btn
        :label="$t('Cancel')"
        class="q-mr-lg"
        color="red-12"
        flat
        icon="cancel"
        type="submit"
        @click="cancelButtonHandle"
      />
      <q-btn
        v-if="allowEdit"
        :label="$t('Save')"
        class="q-mr-xs"
        color="primary"
        icon="done"
        type="submit"
        @click="submit"
      />
    </div>

  </q-form>
</template>


<script setup>
import {onBeforeMount, ref, watch} from "vue";
import {authApi} from "boot/axios";
import {useRouter} from "vue-router";

import PermissionList from "components/lists/PermissionList.vue";


import {useField, useForm} from "vee-validate";
import * as yup from 'yup';

const props = defineProps({
  role: {
    type: Object,
    default() {
      return {
        role_name: null,
        role_description: null,
        permission: []
      }
    }
  },
  groupUuid: {
    type: String,
    default: null,
  },
  buttonText: {
    type: String,
    default: 'Save',
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['groupFormBtnClick', 'cancelBtnClick'])

const router = useRouter();

let isLoading = ref(false);

let roleDetails = ref(null);
let selectedPermissions = ref([])

let allPermissions = ref(null);

let usersPermissions = ref(null);
let issuesPermissions = ref(null);
let itemsPermissions = ref(null);
let tagsPermissions = ref(null);
let sectionsPermissions = ref(null);


let allowEdit = ref(props.canEdit)

function enableEditMode() {
  allowEdit.value = true
}


watch(() => props.canEdit, (newValue, oldValue) => {
  allowEdit.value = newValue
  // console.log(newValue, oldValue)
});

if (props.role.permission != null && props.role.permission != 'undefined') {
  console.log(props.role.permission )
  selectedPermissions.value = props.role.permission.map(value => value.uuid);
}




function updateSelection(data){
  console.log(data)
  selectedPermissions.value=data;
}

function addNewPermission(data) {
  isLoading.value = true;
  // console.log('adding permissions');
  authApi
    .post("/permissions/", data)
    .then((res) => {
      // permissions.value = res.data
      // pagination.total = res.data.total

      isLoading.value = false;
      router.push("/settings/permissions");
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

function editExistingGroup(data, uuid) {
  isLoading.value = true;
  authApi
    .patch("/permissions/" + uuid, data)
    .then((res) => {
      isLoading.value = false;
      router.push("/settings/permissions");
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

// --------------- Form --------------
const {resetForm} = useForm();

const validationSchema = yup.object({
  roleName: yup.string().required(),
  roleDescription: yup.string().required(),
})


const {handleSubmit, errors} = useForm({
  validationSchema
})

const {value: roleName} = useField('roleName', undefined, {initialValue: props.role.role_name})
const {value: roleDescription} = useField('roleDescription', undefined, {initialValue: props.role.role_description})

const submit = handleSubmit(values => {


  let data = {
    "title": roleName.value,
    "description": roleDescription.value,
    "permissions": JSON.parse(JSON.stringify(selectedPermissions.value))
  }


  if (!!props.groupUuid) {
    //   emit('groupFormBtnClick', {data : data, uuid: props.groupUuid})
    editExistingGroup(data, props.groupUuid)
  } else {
    addNewPermission(data);
    // emit('groupFormBtnClick', {data : data, uuid: null})
  }

})

function cancelButtonHandle() {
  router.push("/settings/permissions");
  // console.log('cancelBtnClick')
  // emit('cancelBtnClick')
}

// --------------- Form --------------


</script>
