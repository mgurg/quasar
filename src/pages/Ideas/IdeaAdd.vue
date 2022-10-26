<template>
    <div class="row justify-center">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
            <div class="q-pa-md q-gutter-sm">
                <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" to="/home" />
                    <q-breadcrumbs-el label="Ideas" icon="tips_and_updates" to="/ideas" />
                    <q-breadcrumbs-el :label="$t('Add')" icon="add" />
                </q-breadcrumbs>
            </div>
            <idea-form
                button-text="Add"
                @ideaFormBtnClick="signUpButtonPressed"
                @cancelBtnClick="cancelButtonPressed"
            ></idea-form>
        </q-page>
    </div>
</template>


<script setup>
import { ref } from "vue";
import IdeaForm from 'src/components/forms/IdeaForm.vue'
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


function createIdea(body) {
    isLoading.value = true;
    authApi
        .post("/ideas/", body)
        .then((res) => {
            console.log(res.data);
            isLoading.value = false;
            router.push("/ideas");
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
        .get("/users/")
        .then((res) => {
            console.log(res.data)

            usersList.value = res.data.map((opt) => ({
                label: opt.first_name + ' ' + opt.last_name,
                value: opt.uuid,
            }));
            console.log("usersList.value");
            console.log(usersList.value);
            isSuccess.value = true
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


function signUpButtonPressed(ideaForm) {
    console.log('outside', ideaForm)
    createIdea(ideaForm)
    console.log('Add ok')
}


function cancelButtonPressed() {
    console.log('cancelBtnClick')
    router.push("/ideas");
}


</script>

<style lang="scss"  scoped>
</style>