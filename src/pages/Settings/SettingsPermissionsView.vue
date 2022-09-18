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

      <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" class="q-gutter-md"
        @submit.prevent>
        <div class="row justify-between items-center">
        </div>

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
                <q-checkbox v-model="color" :val="permission.uuid" :disable="!allowEdit" color="cyan" />
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
let permisionUuid = ref(route.params.uuid)
let roleDetails = ref(null);
let allPermissions = ref(null);
let allowEdit = ref("false")

let color = ref([])

function getRoleDetails(uuid) {
  authApi
    .get("/permissions/" + uuid)
    .then((res) => {
      console.log(uuid);
      console.log(res.data);
      color.value = res.data.permission.map(value => value.uuid)
      console.log(color.value);
      roleDetails.value = res.data;
      roleName.value = res.data.role_title
      roleDescription.value = res.data.role_description
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

function getAllPermissions() {
  authApi
    .get("/permissions/all")
    .then((res) => {
      console.log(res.data);
      allPermissions.value = res.data;
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

function AddNewPermission(data){
  isLoading.value = true;
  console.log('adding permissions');
  authApi
    .post("/permissions/", data)
    .then((res) => {
      // permissions.value = res.data
      // pagination.total = res.data.total
      console.log(res.data);
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
  getAllPermissions();
  getRoleDetails(route.params.uuid);
});

// --------------------------------

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
        "title": roleName.value,
        "description": roleDescription.value,
        "permissions": JSON.parse(JSON.stringify(color.value))
    }

    AddNewPermission(data);
    console.log('submit');
    console.log(data)
    emit('userFormBtnClick', data)
})

function  cancelButtonHandle()
{
    console.log('cancelBtnClick')
    emit('cancelBtnClick')
}


</script>
