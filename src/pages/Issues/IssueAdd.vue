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
                <q-item-label class="text-h5 text-weight-medium">{{ $t("New issue") }}</q-item-label>

                <q-item-label v-if="itemUuid===null" caption>
                  Tworzysz zgłoszenie <span class="text-weight-bold">nieprzypisane do żadnego urządzenia</span>.
                </q-item-label>
                <!--                <q-btn flat no-caps>Idę do listy urządzeń</q-btn>-->
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <q-card bordered class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section :class="$q.screen.gt.xs ? 'q-px-md':'q-px-xs'">
          <issue-form v-if="showForm === true"
            :item-name="itemName"
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
import {getOneItemRequest} from "components/api/ItemApiClient";

const route = useRoute()
const router = useRouter();

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let showForm = ref(false);
const itemUuid = ref(null);
const itemName = ref(null);

function createIssue(formData) {
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

function getItemDetails(uuid) {
  isLoading.value = true;

  getOneItemRequest(uuid).then(function (response) {
    console.log(response.data.name);
    itemName.value = response.data.name
    showForm.value = true;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage);
  });

}

function addButtonPressed(issueForm) {
  createIssue(issueForm)
}


function cancelButtonPressed() {
  router.push("/issues");
}

onBeforeMount(() => {
  isLoading.value=true
  if ((route.query.item !== undefined) && (route.query.item !== null) && (route.query.item !== "")) {
    itemUuid.value = route.query.item
    getItemDetails(route.query.item);
  } else {
    showForm.value = true;
  }
  isLoading.value=false
});
</script>

