<template>
    <div class="row justify-center text-blue-grey-10">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
            <div class="q-pa-md q-gutter-sm">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" to="/home" />
                    <q-breadcrumbs-el label="Users" icon="people" to="/users" />
                    <q-breadcrumbs-el label="Add" icon="add" />
                </q-breadcrumbs>
            </div>
            <user-form
                button-text="Add"
                @userFormBtnClick="addUserButtonPressed"
                @cancelBtnClick="cancelButtonPressed"
            ></user-form>

            <!-- <task-form
                button-text="Add"
                :tasks="{ 'color': 'teal', 'title': 'hi', 'desc': 'hi', 'user': '265c8d5e-2921-4f05-b8f3-91a4512902ed', 'priority': 'low', 'mode': 'task' }"
                :usersList="[{
                    label: 'usr1', value: '767a600e-8549-4c27-a4dc-656ed3a9af7d'
                }, { label: 'usr2', value: '265c8d5e-2921-4f05-b8f3-91a4512902ed' }]"
                @taskFormBtnClick="addUserButtonPressed"
            ></task-form>-->
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
        .post("/user/", body)
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

// function getUsers() {
//     authApi
//         .get("user")
//         .then((res) => {
//             console.log(res.data)

//             usersList.value = res.data.map((opt) => ({
//                 label: opt.first_name + ' ' + opt.last_name,
//                 value: opt.uuid,
//             }));
//             console.log("usersList.value");
//             console.log(usersList.value);
//             isSuccess.value = true
//         })
//         .catch((err) => {
//             if (err.response) {
//                 console.log(err.response);
//             } else if (err.request) {
//                 console.log(err.request);
//             } else {
//                 console.log("General Error");
//             }
//         });
// }



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