<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs active-color="grey" class="q-ma-sm text-grey">
        <template v-slot:separator>
          <q-icon
            color="grey"
            name="chevron_right"
            size="1.5em"
          />
        </template>
        <q-breadcrumbs-el icon="home" to="/home"/>
        <q-breadcrumbs-el :label="$t('Employees')" icon="people" to="/users"/>
        <q-breadcrumbs-el :label="$t('Add')" icon="add"/>
      </q-breadcrumbs>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">

              <q-item-section>
                <q-item-label v-if="userDetails != null" class="text-h5 text-weight-medium">
                  {{ $t('Edit') }}: {{ userDetails.first_name }} {{ userDetails.last_name }}
                </q-item-label>
                <!-- <q-item-label caption>Nowy pracownik będzie musiał potwierdzić hasło. Więcej użytkowników? Pamiętaj o opcji importu!</q-item-label> -->
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <div>&nbsp;</div>
      <q-card bordered class="my-card no-shadow q-my-sm q-mx-none q-pa-none">
        <q-card-section>
          <user-form-edit v-if="userDetails != null"
                     :key="userDetails.uuid"
                     :user="userDetails"
                     button-text="Save"
                     @cancelBtnClick="cancelButtonPressed"
                     @userFormBtnClick="signUpButtonPressed"
          />
          <user-edit-skeleton v-else/>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>


<script setup>
import {useQuasar} from 'quasar'
import {onBeforeMount, ref} from "vue";
import UserEditSkeleton from 'components/skeletons/users/UserEditSkeleton.vue'
import UserFormEdit from 'components/forms/UserFormAdd.vue'
import {useRoute, useRouter} from "vue-router";
import {getUserRequest, getUsersRequest, updateUserRequest} from "components/api/UserApiClient";
import {errorHandler} from "components/api/errorHandler";

const $q = useQuasar()
const route = useRoute();
const router = useRouter();
let userUuid = ref(route.params.uuid);
let userDetails = ref(null);
let usersList = ref(null);

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);


function updateUser(uuid, data) {
  isLoading.value = true;
  updateUserRequest(uuid, data).then(function (response) {
    router.push("/users");
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function getUserDetails(uuid) {
  isLoading.value = true;
  getUserRequest(uuid).then(function (response) {
    userDetails.value = response.data
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function getUsers() {
  isLoading.value = true;
  getUsersRequest().then(function (response) {
    usersList.value = response.data.map((opt) => ({
      label: opt.first_name + ' ' + opt.last_name,
      value: opt.uuid,
    }));
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function signUpButtonPressed(formData) {
  updateUser(userUuid.value, formData)
}


function cancelButtonPressed() {
  router.push("/users");
}

onBeforeMount(() => {
  isLoading.value = true;
  if (route.params.uuid != null)
    getUserDetails(route.params.uuid)
  isLoading.value = false;
});

</script>

