<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section class="row q-pa-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/home"/>
            <q-breadcrumbs-el :label="$t('Ideas')" icon="tips_and_updates" to="/ideas"/>
            <q-breadcrumbs-el :label="$t('Add')" icon="add"/>
          </q-breadcrumbs>

        </q-card-section>

        <q-separator/>
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">

              <q-item-section>
                <q-item-label class="text-h6">{{ $t("Idea") }}</q-item-label>
                <!--
<q-item-label caption>
    Nowy pracownik będzie musiał potwierdzić hasło. Więcej użytkowników? Pamiętaj o opcji importu!
</q-item-label>
-->
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <div>&nbsp;</div>
      <q-card class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section>
          <idea-form
            button-text="Save"
            @cancelBtnClick="cancelButtonPressed"
            @ideaFormBtnClick="addButtonPressed"
          />
        </q-card-section>
      </q-card>
    </q-page>
  </div>

</template>


<script setup>
import {ref} from "vue";
import IdeaForm from 'src/components/forms/IdeaForm.vue'
import {useRouter} from "vue-router";
import {createIdeaRequest} from "components/api/IdeaApiClient";
import {errorHandler} from "components/api/errorHandler";

const router = useRouter();


let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);


function createIdea(formData) {
  isLoading.value = true;
  createIdeaRequest(formData).then(function (response) {
    isLoading.value = false;
    router.push("/ideas");
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function addButtonPressed(ideaForm) {
  createIdea(ideaForm)
}


function cancelButtonPressed() {
  router.push("/ideas");
}
</script>

