<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs class="q-ma-sm text-grey" active-color="grey">
        <template v-slot:separator>
          <q-icon
            size="1.5em"
            name="chevron_right"
            color="grey"
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
                <q-item-label v-if="issueDetails != null" class="text-h6">{{ $t('Edit') }}: {{ issueDetails.title }}
                </q-item-label>
                <!-- <q-item-label caption>Nowy pracownik będzie musiał potwierdzić hasło. Więcej użytkowników? Pamiętaj o opcji importu!</q-item-label> -->
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <q-card class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section>
          <issue-form
            v-if="issueDetails != null"
            :issue="issueDetails"
            button-text="Save"
            @cancelBtnClick="cancelButtonPressed"
            @issueFormBtnClick="editButtonPressed"
          />
        </q-card-section>
      </q-card>
    </q-page>
  </div>

</template>


<script setup>
import {computed, onBeforeMount, ref} from "vue";
import {useUserStore} from "stores/user";
import {useRoute, useRouter} from "vue-router";
import IssueForm from 'src/components/forms/IssueForm.vue'
import {errorHandler} from "components/api/errorHandler";
import {editIssueRequest, getOneIssueRequest} from "components/api/IssueApiClient";
import {deleteFileRequest} from "components/api/FilesApiClient";


const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();

const permissions = computed(() => UserStore.getPermissions);
function hasPermission(permission) {
  return permissions.value === null ? false : Boolean(permissions.value.includes(permission));
}



let issueUuid = ref(route.params.uuid);
let issueDetails = ref(null);
let dbImagesUuidList = ref(null);
let filesFormUuidList = ref(null);


let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let isRemoving = ref(false);

function updateIssue(uuid, formData) {



  const arr1 = dbImagesUuidList.value;
  const arr2 = formData.files;

  let removedItems = arr1.filter(x => !arr2.includes(x));
  let withoutChanges = arr1.filter(x => arr2.includes(x));
  let newItems = arr2.filter(x => !arr1.includes(x));

  console.log("Removed:")
  console.log(removedItems);

  console.log("Added:");
  console.log(newItems);

  console.log("To save:");

  let fileList = [...withoutChanges, ...newItems];

  formData.files = fileList;
  console.log(formData);

  isRemoving.value = true;
  removedItems.forEach(function (item, index) {
    deleteUnusedIssueImages(item);
  });
  isRemoving.value = false;

  isLoading.value = true;
  editIssueRequest(uuid, formData).then(function (response) {
    isLoading.value = false;
    if (isRemoving.value === false) {
      router.push("/issues");
    }

  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function deleteUnusedIssueImages(uuid) {

  console.log("Deleting...: " + uuid);

  let token = UserStore.getToken;
  let tenant_id = UserStore.getTenant;

  isLoading.value = true;
  deleteFileRequest(uuid, token, tenant_id).then(function (response) {

    isLoading.value = false;

  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

//       usersList.value = res.data.map((opt) => ({
//         label: opt.first_name + ' ' + opt.last_name,
//         value: opt.uuid,
//       }));


function editButtonPressed(formData) {

  if (!hasPermission("ISSUE_EDIT")){
    return;
  }
  updateIssue(issueUuid.value, formData);
}


function cancelButtonPressed() {
  router.push("/issues");
}


function getIssueDetails(uuid) {
  isLoading.value = true;
  getOneIssueRequest(uuid).then(function (response) {

    console.log(response.data)
    issueDetails.value = response.data
    dbImagesUuidList.value = response.data.files_issue.map(a => a.uuid)

    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

onBeforeMount(() => {
  if (route.params.uuid != null)
    getIssueDetails(route.params.uuid)
  // getUsers();
  isLoading.value = false;
});


</script>

