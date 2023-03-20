<template>
  <div class="row">
    &nbsp;

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

    <q-list>
      <!-- USERS-->
      <q-item-section>
        <q-item-label class="text-blue-grey-10 text-h5 q-pt-md">Użytkownicy</q-item-label>
        <q-item-label caption class="q-pb-sm">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
      </q-item-section>
      <div v-for="(permission, index) in usersPermissions" v-bind:key="index" v-if="usersPermissions !== null">
        <q-item v-ripple tag="label">
          <q-item-section avatar top>
            <q-checkbox v-model="selectedPermissions" :disable="!allowEdit" :val="permission.uuid" color="cyan"/>
          </q-item-section>
          <q-item-section>
            <q-item-label> {{$t(permission.title)}} </q-item-label>
            <q-item-label caption>
              {{$t(permission.description)}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <!-- ISSUES -->
      <q-item-section>
        <q-item-label class="text-blue-grey-10 text-h5 q-pt-md">Zgłoszenia</q-item-label>
        <q-item-label caption class="q-pb-sm">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
      </q-item-section>
      <div v-for="(permission, index) in issuesPermissions" v-bind:key="index" v-if="issuesPermissions !== null">
        <q-item v-ripple tag="label">
          <q-item-section avatar top>
            <q-checkbox v-model="selectedPermissions" :disable="!allowEdit" :val="permission.uuid" color="cyan"/>
          </q-item-section>
          <q-item-section>
            <q-item-label> {{$t(permission.title)}} </q-item-label>
            <q-item-label caption>
              {{$t(permission.description)}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>


      <!-- ITEMS -->
      <q-item-section>
        <q-item-label class="text-blue-grey-10 text-h5 q-pt-md">Przedmioty</q-item-label>
        <q-item-label caption class="q-pb-xs">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
      </q-item-section>
      <div v-for="(permission, index) in itemsPermissions" v-bind:key="index" v-if="itemsPermissions !== null">
        <q-item v-ripple tag="label">
          <q-item-section avatar top>
            <q-checkbox v-model="selectedPermissions" :disable="!allowEdit" :val="permission.uuid" color="cyan"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ permission.title }}</q-item-label>
            <q-item-label caption>
              {{ permission.description }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>


      <!-- TAGS -->
      <q-item-section>
        <q-item-label class="text-blue-grey-10 text-h5 q-pt-md">Tagi</q-item-label>
        <q-item-label caption class="q-pb-xs">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
      </q-item-section>
      <div v-for="(permission, index) in tagsPermissions" v-bind:key="index" v-if="tagsPermissions !== null">
        <q-item v-ripple tag="label">
          <q-item-section avatar top>
            <q-checkbox v-model="selectedPermissions" :disable="!allowEdit" :val="permission.uuid" color="cyan"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ permission.title }}</q-item-label>
            <q-item-label caption>
              {{ permission.description }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <!-- SECTIONS -->
      <q-item-section>
        <q-item-label class="text-blue-grey-10 text-h5 q-pt-md">Ustawienia</q-item-label>
        <q-item-label caption class="q-pb-xs">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
      </q-item-section>
      <div v-for="(permission, index) in sectionsPermissions" v-bind:key="index" v-if="sectionsPermissions !== null">
        <q-item v-ripple tag="label">
          <q-item-section avatar top>
            <q-checkbox v-model="selectedPermissions" :disable="!allowEdit" :val="permission.uuid" color="cyan"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ permission.title }}</q-item-label>
            <q-item-label caption>
              {{ permission.description }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>

<!--      <div v-for="(permission, index) in allPermissions" v-bind:key="index">-->
<!--        <q-item v-ripple tag="label">-->
<!--          <q-item-section avatar top>-->
<!--            <q-checkbox v-model="selectedPermissions" :disable="!allowEdit" :val="permission.uuid" color="cyan"/>-->
<!--          </q-item-section>-->
<!--          <q-item-section>-->
<!--            <q-item-label>{{ permission.title }}</q-item-label>-->
<!--            <q-item-label caption>-->
<!--              {{ permission.description }}-->
<!--            </q-item-label>-->
<!--          </q-item-section>-->
<!--        </q-item>-->
<!--      </div>-->
    </q-list>
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
  console.log(newValue, oldValue)
});

function getAllPermissions() {
  authApi
    .get("/permissions/all")
    .then((res) => {

      allPermissions.value = res.data;

      usersPermissions.value = res.data.filter(obj => obj.group === 'users')
      issuesPermissions.value = res.data.filter(obj => obj.group === 'issues')
      itemsPermissions.value = res.data.filter(obj => obj.group === 'items')
      tagsPermissions.value = res.data.filter(obj => obj.group === 'tags')
      sectionsPermissions.value = res.data.filter(obj => obj.group === 'settings')

      if (props.role.permission != null && props.role.permission != 'undefined') {
        selectedPermissions.value = props.role.permission.map(value => value.uuid);
      }

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

function addNewPermission(data) {
  isLoading.value = true;
  console.log('adding permissions');
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

onBeforeMount(() => {
  getAllPermissions();
  // getRoles();
});

</script>
