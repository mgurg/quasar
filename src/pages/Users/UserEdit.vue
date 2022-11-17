<template>
    <div class="row justify-center text-blue-grey-10">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
        <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section class="row q-pa-sm">
            <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" to="/" />
                    <q-breadcrumbs-el :label="$t('Employee')" icon="people" to="/users" />
                    <q-breadcrumbs-el :label="$t('Edit')" icon="edit" />
                </q-breadcrumbs>

        </q-card-section>

        <q-separator />
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">

              <q-item-section>
                <q-item-label class="text-h6" v-if="userDetails != null">{{ $t('Edit') }}: {{userDetails.first_name}} {{userDetails.last_name}}</q-item-label>
                <!-- <q-item-label caption>Nowy pracownik będzie musiał potwierdzić hasło. Wiecej użytkowników? Pamiętaj o opcji importu!</q-item-label> -->
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
    </q-card>

    <div>&nbsp;</div>
            <user-form v-if="userDetails != null"
                :user="userDetails"
                button-text="Save"
                @userFormBtnClick="signUpButtonPressed"
                @cancelBtnClick="cancelButtonPressed"
                :key="userDetails.uuid"
            />
            <user-edit-skeleton v-else />
        </q-page>
    </div>
</template>


<script setup>
import { useQuasar } from 'quasar'
import { ref, onBeforeMount } from "vue";
import UserEditSkeleton from 'components/skeletons/users/UserEditSkeleton.vue'
import UserForm from 'src/components/forms/UserForm.vue'
import { useRoute, useRouter } from "vue-router";
import { authApi } from "boot/axios";

const $q = useQuasar()

const tasks = ref(null);
const route = useRoute();
const router = useRouter();
let userUuid = ref(route.params.uuid);
let userDetails = ref(null);
let usersList = ref(null);

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);
let errors = ref(null);




function updateUser(body) {
    // isLoading.value = true;
    authApi
        .patch("/users/" + userUuid.value, body)
        .then((res) => {
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

function getDetails(uuid) {
    authApi
        .get("/users/" + uuid)
        .then((res) => {
            console.log(uuid);
            console.log(res.data);
            userDetails.value = res.data

            // if (res.data.date_from == null) {
            //     userDetails.value.mode = 'task'
            // }
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

function getUsers() {
    authApi
        .get("user")
        .then((res) => {
            console.log(res.data)

            usersList.value = res.data.map((opt) => ({
                label: opt.first_name + ' ' + opt.last_name,
                value: opt.uuid,
            }));

            console.log(usersList.value);
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

function signUpButtonPressed(taskForm) {
    console.log('outside', taskForm)
    updateUser(taskForm)
    console.log('Edit ok')
}


function cancelButtonPressed() {
    console.log('cancelBtnClick')
    router.push("/users");
}

onBeforeMount(() => {
    if (route.params.uuid != null)
        getDetails(route.params.uuid)
    // getUsers();
    isLoading.value = false;
});

</script>

