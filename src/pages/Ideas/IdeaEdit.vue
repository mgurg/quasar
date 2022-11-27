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
                <q-item-label class="text-h6" v-if="ideaDetails != null">{{ $t('Edit') }}: {{ideaDetails.title}} </q-item-label>
                <!-- <q-item-label caption>Nowy pracownik będzie musiał potwierdzić hasło. Wiecej użytkowników? Pamiętaj o opcji importu!</q-item-label> -->
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
    </q-card>

    <div>&nbsp;</div>
        <q-card class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section>
            <idea-form v-if="ideaDetails != null" :idea="ideaDetails" button-text="Edit" />
        </q-card-section>
    </q-card>
        </q-page>
    </div>

</template>


<script setup>
import { ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import IdeaForm from 'src/components/forms/IdeaForm.vue'
import { authApi } from "boot/axios";


const route = useRoute();
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

let ideaDetails = ref(null);

function getDetails(uuid) {
    authApi
        .get("/ideas/" + uuid)
        .then((res) => {
            console.log(res.data);
            
            ideaDetails.value = res.data

            // if (res.data.date_from == null) {
            //     ideaDetails.value.mode = 'task'
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

onBeforeMount(() => {
    if (route.params.uuid != null)
        getDetails(route.params.uuid)
    // getUsers();
    isLoading.value = false;
});


</script>

<style lang="scss"  scoped>
</style>