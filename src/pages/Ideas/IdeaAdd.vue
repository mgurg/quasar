<template>
    <div class="row justify-center">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
        <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section class="row q-pa-sm">
            <q-breadcrumbs>
                    <q-breadcrumbs-el icon="home" to="/home" />
                    <q-breadcrumbs-el :label="$t('Ideas')" icon="tips_and_updates" to="/ideas" />
                    <q-breadcrumbs-el :label="$t('Add')" icon="add" />
                </q-breadcrumbs>

        </q-card-section>

        <q-separator />
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">

              <q-item-section>
                <q-item-label class="text-h6">{{ $t("Idea") }} </q-item-label>
                <!-- <q-item-label caption>Nowy pracownik będzie musiał potwierdzić hasło. Wiecej użytkowników? Pamiętaj o opcji importu!</q-item-label> -->
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
    </q-card>

    <div>&nbsp;</div>
    <div style="background-color: white;" class="q-pa-md rounded-borders">
            <idea-form
                button-text="Add"
                @ideaFormBtnClick="signUpButtonPressed"
                @cancelBtnClick="cancelButtonPressed"
            ></idea-form>
        </div>
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