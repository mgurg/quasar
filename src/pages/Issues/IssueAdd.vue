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
                <q-item-label class="text-h5 text-weight-medium">{{ $t("Issue") }}</q-item-label>

                <q-item-label caption v-if="itemUuid===null">
                  Tworzysz zgłoszenie <span class="text-weight-bold">nieprzypisane do żadnego urządzenia</span>
                  Jeżeli chcesz zgłosić awarię dla istniejącej maszyny wybierz ją z <router-link to="/items">listy urządzeń</router-link> i naciśnij przycisk zgłoś.
                </q-item-label>
<!--                <q-btn flat no-caps>Idę do listy urządzeń</q-btn>-->
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
import {onBeforeMount, ref} from "vue";
import IssueForm from 'src/components/forms/IssueForm.vue'
import {useRoute, useRouter} from "vue-router";
import {addIssueRequest} from "components/api/IssueApiClient";
import {errorHandler} from "components/api/errorHandler";

const route = useRoute()
const router = useRouter();


let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
const itemUuid = ref(null);

function createIssue(formData) {
  formData['description'] = "some description"
  formData['item_uuid'] = itemUuid.value
  isLoading.value = true;
  addIssueRequest(formData).then(function (response) {
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

onBeforeMount(() => {
  if ((route.query.item !== undefined) && (route.query.item !== null) && (route.query.item !== "")) {
    console.log("Query: " + route.query.item);
    itemUuid.value = route.query.item
  }
});
</script>

