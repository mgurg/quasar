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
        <q-breadcrumbs-el :label="$t('Issues')" icon="bug_report" to="/issues"/>
        <q-breadcrumbs-el :label="$t('Add')" icon="add"/>
      </q-breadcrumbs>
      <q-card bordered class="my-card no-shadow q-mt-sm q-mb-md">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">

              <q-item-section>
                <q-item-label class="text-h6">{{ $t("Issue") }}</q-item-label>
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

      <q-card bordered class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section :class="$q.screen.gt.xs ? 'q-px-md':'q-px-xs'">
          <issue-form
            @cancelBtnClick="cancelButtonPressed"
            @issueFormBtnClick="addButtonPressed"
          />
        </q-card-section>
      </q-card>
    </q-page>
  </div>

</template>


<script setup>
import {ref} from "vue";
import IssueForm from 'src/components/forms/IssueForm.vue'
import {useRouter} from "vue-router";
import {createIssueRequest} from "components/api/IssueApiClient";
import {errorHandler} from "components/api/errorHandler";

const router = useRouter();


let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);


function createIssue(formData) {
  isLoading.value = true;
  createIssueRequest(formData).then(function (response) {
    isLoading.value = false;
    router.push("/issues");
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function addButtonPressed(issueForm) {
  createIssue(issueForm)
}


function cancelButtonPressed() {
  router.push("/issues");
}
</script>

