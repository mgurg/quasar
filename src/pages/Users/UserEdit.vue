<template>
    <div class="row justify-center text-blue-grey-10">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
            <div class="q-pa-md q-gutter-sm">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" to="/" />
                    <q-breadcrumbs-el label="Employees" icon="people" to="/users" />
                    <q-breadcrumbs-el label="Edit" icon="edit" />
                </q-breadcrumbs>
            </div>
            <user-form v-if="userDetails != null"
                :user="userDetails"
                button-text="Edit"
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
            console.log(res.data);
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

