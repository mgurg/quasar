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
            v-model="groupName"
            :disable="isLoading"
            :readonly="!allowEdit"
            :error="!!errors.groupName"
            :error-message="errors.groupName"
            :label="$t('Name')"
        />
        <q-input
            outlined
            v-model="groupDescription"
            :disable="isLoading"
            :readonly="!allowEdit"
            :error="!!errors.groupDescription"
            :error-message="errors.groupDescription"
            :label="$t('Description')"
        />
    <q-list>
      <div v-for="(user, index) in allUsers" v-bind:key="index">
        <q-item tag="label" v-ripple>
          <q-item-section avatar top>
            <q-checkbox v-model="color" :val="user.uuid" :disable="!allowEdit" color="cyan" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{user.first_name}} {{user.last_name}}</q-item-label>
            <q-item-label caption>
              {{user.description}}
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
    group: {
        type: Object,
        default() {
            return {
              name: '',
              description: '',
              users: []

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
let color = ref([])
let allUsers = ref(null);
let allowEdit = props.canEdit

function getAllUsers() {
  authApi
    .get("/users/")
    .then((res) => {
      console.log(res.data);
      allUsers.value = res.data.items;
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

function addNewGroup(data){
  isLoading.value = true;
  console.log('adding Group');
  authApi
    .post("/groups/", data)
    .then((res) => {
      console.log(res.data);
      isLoading.value = false;
      router.push("/settings/groups");
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
  console.log('editing Group');
  authApi
    .patch("/groups/" + uuid, data)
    .then((res) => {
      console.log(res.data);
      isLoading.value = false;
      router.push("/settings/groups");
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
    groupName: yup.string().required(),
    groupDescription: yup.string().required(),
})


const { handleSubmit, errors } = useForm({
    validationSchema
})

const { value: groupName } = useField('groupName', undefined, { initialValue: props.group.name })
const { value: groupDescription } = useField('groupDescription', undefined, { initialValue: props.group.description })

const submit = handleSubmit(values => {
    let data = {
        "name": groupName.value,
        "description": groupDescription.value,
        "users": JSON.parse(JSON.stringify(color.value))
    }
   
 
    if (!!props.groupUuid){
    //   emit('groupFormBtnClick', {data : data, uuid: props.groupUuid})
      editExistingGroup(data, props.groupUuid)
    } else{
    addNewGroup(data);
    // emit('groupFormBtnClick', {data : data, uuid: null})
    }

})

function  cancelButtonHandle()
{
    router.push("/settings/groups");
    // console.log('cancelBtnClick')
    // emit('cancelBtnClick')
}
// --------------- Form --------------

onBeforeMount(() => {
    getAllUsers();
    // getRoles();
});

</script>