<template>
    <div class="row justify-center">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
        <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section class="row q-pa-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el :label="$t('Employees')" icon="people" to="/users" />
            <q-breadcrumbs-el :label="$t('Add')" icon="add" />
          </q-breadcrumbs>

        </q-card-section>

        <q-separator />
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">

              <q-item-section>
                <q-item-label class="text-h5 text-weight-medium">{{ $t('New employee') }}</q-item-label>
                <q-item-label caption>Nowy pracownik będzie musiał potwierdzić hasło. Wiecej użytkowników? Pamiętaj o opcji importu!</q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
    </q-card>

    <div>&nbsp;</div>
    <q-card class="my-card no-shadow q-my-sm q-mx-none q-pa-none" >
        <q-card-section>
            <user-form
                button-text="Add"
                @userFormBtnClick="addUserButtonPressed"
                @cancelBtnClick="cancelButtonPressed"
            ></user-form>
        </q-card-section>
        </q-card>    
        </q-page>
    </div>
</template>


<script setup>
import { onActivated, reactive, ref } from "vue";
import UserForm from 'src/components/forms/UserForm.vue'
import { authApi } from "boot/axios";
import { useRouter } from "vue-router";

const router = useRouter();


let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);

let usersList = ref([]);
let usr = ref([{
    label: 'usr1', value: '767a600e-8549-4c27-a4dc-656ed3a9af7d'
}, { label: 'usr2', value: '265c8d5e-2921-4f05-b8f3-91a4512902ed' }]);



function createUser(body) {
    isLoading.value = true;
    authApi
        .post("/users/", body)
        .then((res) => {
            // 
            isLoading.value = false;
            router.push("/users");
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

function addUserButtonPressed(taskForm) {
    console.log('outside', taskForm)
    createUser(taskForm)
    console.log('Add ok')
    
}

function cancelButtonPressed() {
    console.log('cancelBtnClick')
    router.push("/users");
}

onActivated(() => {
    isLoading.value = true;
    // getUsers();
    isLoading.value = false;
});


</script>

<style lang="scss"  scoped>
</style>