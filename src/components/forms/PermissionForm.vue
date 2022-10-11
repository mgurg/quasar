<template>
    <q-form 
        autocorrect="off" 
        autocapitalize="off" 
        autocomplete="off" 
        spellcheck="false" 
        class="q-gutter-md" 
        @submit.prevent
    >
    <q-input
            outlined
            v-model="roleName"
            :disable="isLoading"
            :readonly="!allowEdit"
            :error="!!errors.roleName"
            :error-message="errors.roleName"
            :label="$t('Name')"
        />
        <q-input
            outlined
            v-model="roleDescription"
            :disable="isLoading"
            :readonly="!allowEdit"
            :error="!!errors.roleDescription"
            :error-message="errors.roleDescription"
            :label="$t('Description')"
        />
    <q-list>
      <div v-for="(permission, index) in allPermissions" v-bind:key="index">
        <q-item tag="label" v-ripple>
          <q-item-section avatar top>
            <q-checkbox v-model="groupUsers" :val="permission.uuid" :disable="!allowEdit" color="cyan" />
          </q-item-section>
          <q-item-section>
                <q-item-label>{{permission.title}}</q-item-label>
                <q-item-label caption>
                  {{permission.description}}
                </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-list>
    <div class="row">
            <q-btn type="submit" color="red-12" @click="cancelButtonHandle">{{ $t("Cancel") }}</q-btn>
            <q-space />
            <q-btn v-if="allowEdit" type="submit" color="primary" @click="submit">{{ $t(buttonText) }}</q-btn>
        </div>

    </q-form>
</template>


<script setup>
import { ref, onBeforeMount } from "vue";
import { authApi } from "boot/axios";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";


import { useField, useForm } from "vee-validate";
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
let groupUsers = ref([])

let allPermissions = ref(null);
let allowEdit = props.canEdit

console.log(props.permission)
// function getAllUsers() {
//   authApi
//     .get("/users/")
//     .then((res) => {
//       allPermissions.value = res.data.items;
//       groupUsers.value = props.role.users.map(value => value.uuid);
//       isLoading.value = false;
//     })
//     .catch((err) => {
//       if (err.response) {
//         console.log(err.response);
//       } else if (err.request) {
//         console.log(err.request);
//       } else {
//         console.log("General Error");
//       }
//     });
// }

function getAllPermissions() {
  authApi
    .get("/permissions/all")
    .then((res) => {
      console.log(res.data);
      allPermissions.value = res.data;
      groupUsers.value = props.role.permission.map(value => value.uuid);
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

function addNewPermission(data){
  isLoading.value = true;
  console.log('adding permissions');
  authApi
    .post("/permissions/", data)
    .then((res) => {
      // permissions.value = res.data
      // pagination.total = res.data.total
      console.log(res.data);
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

function editExistingGroup(data, uuid){
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
const { resetForm } = useForm();

const validationSchema = yup.object({
    roleName: yup.string().required(),
    roleDescription: yup.string().required(),
})


const { handleSubmit, errors } = useForm({
    validationSchema
})

const { value: roleName } = useField('roleName', undefined, { initialValue: props.role.role_name })
const { value: roleDescription } = useField('roleDescription', undefined, { initialValue: props.role.role_description })

const submit = handleSubmit(values => {

  
    let data = {
        "name": roleName.value,
        "description": roleDescription.value,
        "users": JSON.parse(JSON.stringify(groupUsers.value))
    }


    if (!!props.groupUuid){
    //   emit('groupFormBtnClick', {data : data, uuid: props.groupUuid})
      editExistingGroup(data, props.groupUuid)
    } else{
      addNewPermission(data);
    // emit('groupFormBtnClick', {data : data, uuid: null})
    }

})

function  cancelButtonHandle()
{
    router.push("/settings/permissions");
    // console.log('cancelBtnClick')
    // emit('cancelBtnClick')
}
// --------------- Form --------------

onBeforeMount(() => {
    getAllPermissions();
    // getRoles();
});

</script>