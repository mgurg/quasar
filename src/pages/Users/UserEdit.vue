<template>
    <div class="row justify-center text-blue-grey-10">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
            <div class="q-pa-md q-gutter-sm">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" to="/" />
                    <q-breadcrumbs-el label="Tasks" icon="add_task" to="/tasks" />
                    <q-breadcrumbs-el label="Edit" icon="edit" />
                </q-breadcrumbs>
            </div>
            <task-form
                :tasks="taskDetails"
                button-text="Edit"
                :usersList="usersList"
                @taskFormBtnClick="signUpButtonPressed"
                v-if="taskDetails != null && usersList != null"
                :key="taskDetails.uuid"
            />
            <task-edit-skeleton v-else />
        </q-page>
    </div>
</template>




<script setup>
import { useQuasar } from 'quasar'
import { onActivated, ref } from "vue";
import TaskEditSkeleton from 'components/skeletons/TaskEditSkeleton'
import TaskForm from 'src/components/forms/TaskForm.vue'
import { useRoute, useRouter } from "vue-router";
import { authApi } from "boot/axios";

const $q = useQuasar()

const tasks = ref(null);
const route = useRoute();
const router = useRouter();
let taskUuid = ref(route.params.uuid);
let taskDetails = ref(null);
let usersList = ref(null);

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);
let errors = ref(null);





function updateTask(body) {
    // isLoading.value = true;
    authApi
        .patch("/tasks/" + taskUuid.value, body)
        .then((res) => {
            console.log(res.data);
            isLoading.value = false;
            router.push("/tasks");
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
        .get("/user/" + uuid)
        .then((res) => {
            console.log(uuid);
            console.log(res.data);
            taskDetails.value = res.data

            // if (res.data.date_from == null) {
            //     taskDetails.value.mode = 'task'
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
    updateTask(taskForm)
    console.log('Edit ok')
}

onActivated(() => {
    if (route.params.uuid != null)
        getDetails(route.params.uuid)
    getUsers();
    isLoading.value = false;
});
</script>

