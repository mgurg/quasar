<template>
  <div class="row justify-center">
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
                <q-item-label class="text-h5 text-weight-medium">{{ $t('New employee') }}</q-item-label>
                <q-item-label caption>
                  Nowy pracownik będzie musiał potwierdzić hasło. Więcej użytkowników? Pamiętaj o
                  opcji importu!
                </q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <div>&nbsp;</div>
      <q-card bordered class="my-card no-shadow q-my-sm q-mx-none q-pa-none">
        <q-card-section>
          <user-form
            button-text="Add"
            @cancelBtnClick="cancelButtonPressed"
            @userFormBtnClick="addUserButtonPressed"
          ></user-form>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>


<script setup>
import {ref} from "vue";
import UserForm from 'src/components/forms/UserForm.vue'
import {useQuasar} from 'quasar'
import {useRouter} from "vue-router";
import {createUserRequest,} from 'src/components/api/UserApiClient.js'
import {errorHandler} from 'src/components/api/errorHandler.js'

const $q = useQuasar()
const router = useRouter();

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);


function createUser(data) {
  isLoading.value = true;
  createUserRequest(data).then(function (response) {
    router.push("/users");
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    $q.notify({
      type: 'warning',
      message: errorMessage.data.detail,
    });
    // console.log(errorMessage.data.detail)
    isError.value = true;
  });
}

function addUserButtonPressed(formData) {
  createUser(formData)
}

function cancelButtonPressed() {
  router.push("/users");
}

</script>

