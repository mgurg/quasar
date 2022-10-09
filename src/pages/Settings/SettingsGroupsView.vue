<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings" />
          <q-breadcrumbs-el :label="$t('Groups')" icon="info" to="/settings/groups"  />
          <q-breadcrumbs-el :label="$t('View')" icon="info" />
        </q-breadcrumbs>
      </div>

      <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" class="q-gutter-md"
        @submit.prevent>
        <div class="row justify-between items-center">
        </div>

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
                <q-btn type="submit" color="primary" @click="submit">{{ $t(buttonText) }}</q-btn>
            </div>

      </q-form>

    </q-page>
  </div>
</template>

<script setup>
import { ref, onActivated, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { authApi } from "boot/axios";
import { useField, useForm } from "vee-validate";
import * as yup from 'yup';
import TaskViewSkeleton from 'components/skeletons/tasks/TaskViewSkeleton'


const props = defineProps({
    role: {
        type: Object,
        default() {
            return {
              role_name: '',
              role_description: '',
            }
        }
    },
    buttonText: {
        type: String,
        default: 'Save',
    },
})


const emit = defineEmits(['userFormBtnClick', 'cancelBtnClick'])

const router = useRouter();

let isLoading = ref(false);
let slide = ref(1);




const route = useRoute();
let groupUuid = ref(route.params.uuid)

if (!!groupUuid.value){
  // props.buttonText = "Edit";
  
  console.log("EDIT!");
}
let roleDetails = ref(null);
let allUsers = ref(null);
let allowEdit = ref("false")

let color = ref([])

function getRoleDetails(uuid) {

  if (uuid ==null || uuid == 'undefined' ){
    console.log('uF')
    return;
  }

  authApi
    .get("/groups/" + uuid)
    .then((res) => {
      console.log(uuid);
      console.log(res.data);
      color.value = res.data.users.map(value => value.uuid)
      console.log(color.value);
      roleDetails.value = res.data;
      groupName.value = res.data.name
      groupDescription.value = res.data.description
      // allowEdit.value = res.data.is_custom
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

function editUser(uuid) {
  router.push("/users/edit/" + uuid);
}

onBeforeMount(() => {
  isLoading.value = true;
  getAllUsers();
  getRoleDetails(route.params.uuid);

  
});

// --------------------------------

const { resetForm } = useForm();

const validationSchema = yup.object({
    groupName: yup.string().required(),
    groupDescription: yup.string().required(),
})


const { handleSubmit, errors } = useForm({
    validationSchema
})

const { value: groupName } = useField('groupName', undefined, { initialValue: props.role.role_name })
const { value: groupDescription } = useField('groupDescription', undefined, { initialValue: props.role.role_description })

const submit = handleSubmit(values => {
    let data = {
        "name": groupName.value,
        "description": groupDescription.value,
        "users": JSON.parse(JSON.stringify(color.value))
    }

    

    if (!!groupUuid.value){
      console.log('submit PATCH');
      console.log(groupUuid.value);
      editExistingGroup(data, groupUuid.value)
    } else{
    addNewGroup(data);
    console.log('submit POST');
    console.log(data)
    emit('userFormBtnClick', data)
    }

})

function  cancelButtonHandle()
{
    console.log('cancelBtnClick')
    emit('cancelBtnClick')
}


</script>
