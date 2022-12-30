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
        <q-breadcrumbs-el icon="home" to="/"/>
        <q-breadcrumbs-el :label="$t('Issues')" icon="bug_report" to="/issues"/>
        <q-breadcrumbs-el :label="$t('View')" icon="info"/>
      </q-breadcrumbs>
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-list>
          <q-item class="q-px-sm">
            <q-item-section avatar>
              <q-btn color="grey" dense flat icon="arrow_back_ios" no-caps @click="router.back()">
                {{ $t("Return") }}
              </q-btn>
            </q-item-section>
            <q-item-section></q-item-section>
            <q-item-section side>
              <div class="col-12 text-h6 q-mt-none">
                <q-btn :label="$q.screen.gt.xs ? $t('Edit') : ''" class="float-right q-mr-sm" color="primary"
                       icon="edit" no-caps
                       outline @click="editIssue(issueDetails.uuid)"/>
                <q-btn :label="$q.screen.gt.xs ? $t('Delete') : ''" class="float-right q-mr-sm" color="red" flat
                       icon="delete"
                       no-caps @click="deleteIssue(issueDetails.uuid, issueDetails.title)"/>
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <q-card-section v-if="issueDetails && !isLoading" class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-card-section avatar class="q-pa-sm">
<!--                <q-avatar :icon="getIcon('1')" size="lg"/>-->
                <q-icon color="grey" size="lg" :name="getIcon(issueDetails.status)" />
              </q-card-section>

              <q-item-section>
                <q-item-label class="text-h5">{{ issueDetails.name }}</q-item-label>
                <!--                 <q-item-label caption>{{ itemDetails.summary }}</q-item-label>-->
                <!--                <q-item-label caption>Krótki publicznie dostępny opis</q-item-label>-->
              </q-item-section>
            </q-item>
          </q-list>
          <div class="q-gutter-xs">
            <q-chip
              v-for="(user, index) in usersList" v-if="usersList!= null" v-bind:key="index"
              color="primary"
              icon="person"
              removable
              text-color="white"
              @remove="unassignUser(user.uuid)"
            >
              {{ user.first_name }} {{ user.last_name }}
            </q-chip>
          </div>
        </q-card-section>
        <q-separator/>

        <q-card-actions align="right">
          <q-btn
            :label="$q.screen.gt.xs ? 'Przypisz użytkownika' : ''"
            :disable="issueStatus === 'resolved_issue'"
            class="q-px-xs"
            color="primary"
            flat
            icon="person_add"
            no-caps
            @click="showUserDialog = true"
          />
          <!--          <q-btn :label="$q.screen.gt.xs ? 'Przypisz do Grupy' : ''" class="q-px-xs" color="primary" flat icon="group_add"-->
          <!--                 no-caps/>-->
          <q-btn
            v-if="issueStatus === null"
            :label="$q.screen.gt.xs ? 'Akceptuj' : ''"
            class="q-px-xs"
            color="primary"
            flat
            icon="check_circle"
            no-caps
            @click="setIssueStatus('accept_issue')"
          />
          <q-btn
            v-if="issueStatus === null"
            :label="$q.screen.gt.xs ? 'Odrzuć' : ''"
            class="q-px-xs"
            color="primary"
            flat
            icon="cancel"
            no-caps
            @click="setIssueStatus('reject_issue')"
          />
          <q-btn
            v-if="issueStatus !== null || issueStatus === 'accept_issue' || issueStatus === 'pause_issue'"
            :disable="issueStatus === 'in_progress_issue'||  issueStatus === 'resolved_issue'"
            :label="$q.screen.gt.xs ? 'Rozpocznij' : ''"
            class="q-px-xs"
            color="primary"
            flat
            icon="play_arrow"
            no-caps
            @click="setIssueStatus('in_progress_issue')"
          />
          <q-btn
            v-if="issueStatus !== null"
            :disable="issueStatus === 'accept_issue'|| issueStatus === 'pause_issue' ||  issueStatus === 'resolved_issue'"
            :label="$q.screen.gt.xs ? 'Wstrzymaj' : ''"
            class="q-px-xs"
            color="primary"
            flat
            icon="pause"
            no-caps
            @click="setIssueStatus('pause_issue')"
          />
          <q-btn
            v-if="issueStatus !== null"
            :disable="issueStatus === 'accept_issue'||  issueStatus === 'resolved_issue'"
            :label="$q.screen.gt.xs ? 'Zakończ' : ''"
            class="q-px-xs"
            color="primary"
            flat
            icon="stop"
            no-caps
            @click="setIssueStatus('resolved_issue')"
          />
          <q-btn
            v-if="issueStatus !== null"
            :disable="issueStatus === 'accept_issue'"
            :label="$q.screen.gt.xs ? 'Restart' : ''"
            class="q-px-xs"
            color="primary"
            flat
            icon="restart_alt"
            no-caps
            @click="setIssueStatus('resolved_issue')"
          />
        </q-card-actions>
      </q-card>
      <description-card v-if="issueDetails!==null" :expanded-description="true" :text="issueDetails.text_json"/>
      <photo-card v-if="photoFiles!==null" :expanded-photos="false" :photo-files="photoFiles"/>

      <q-dialog v-model="showUserDialog" :position=" $q.platform.is.mobile ? 'top': 'standard'">
        <user-assign-dialog @assign-user-btn-click="updateUsers"/>
      </q-dialog>

    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, ref} from "vue";
import {useQuasar} from "quasar";
import {useUserStore} from 'stores/user';
import {useRoute, useRouter} from "vue-router";

import {useI18n} from "vue-i18n";
import {
  changeIssueStatusRequest,
  deleteIssueRequest,
  editIssueRequest,
  getOneIssueRequest
} from "components/api/IssueApiClient";
import {errorHandler} from "components/api/errorHandler";

import DescriptionCard from "components/viewer/cards/DescriptionCard.vue";
import PhotoCard from "components/viewer/cards/PhotoCard.vue";
import UserAssignDialog from "components/dialog/UserAssignDialog.vue";


const $q = useQuasar();
const UserStore = useUserStore();
const route = useRoute();
const router = useRouter();

const {t} = useI18n({useScope: "global"});
const confirmDeleteMessage = computed(() => t("Delete:"));
const successfulDeleteMessage = computed(() => t("Deleted:"));

let isLoading = ref(false);
let isError = ref(false);
// let dialog = ref(false);

const counter = computed(() => issueDetails.value.upvotes - issueDetails.value.downvotes);
const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return Boolean(permissions.value.includes(permission));
}

let issueDetails = ref(null);
let photoFiles = ref(null);
let usersList = ref(null);
let issueUuid = ref(null);
let issueStatus = ref(null);
const showUserDialog = ref(false);

function convertTime(datetime, timeZone = "America/Los_Angeles") {
  return new Date(datetime).toLocaleString("en-US", {timeZone});
}

function getIssueDetails(uuid) {
  isLoading.value = true;

  getOneIssueRequest(uuid).then(function (response) {
    issueDetails.value = response.data;
    photoFiles.value = response.data.files_issue.filter((item) => item.mimetype.match('image.*'));
    usersList.value = response.data.users_issue;
    issueStatus.value = response.data.status;
    console.log(response.data)
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage)
    isError.value = true;
  });
}


function setIssueStatus(status) {

  changeIssueStatusRequest(issueUuid.value, {status: status}).then(function (response) {
    getIssueDetails(issueUuid.value)
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function editIssue(uuid) {
  router.push("/issues/edit/" + uuid);
}

function deleteIssue(uuid, issueName) {
  console.log(issueName);
  $q.dialog({
    title: "Confirm",
    message: confirmDeleteMessage.value + " '" + issueName + "' ?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    isLoading = true;
    deleteIssueRequest(uuid).then(function (response) {
      $q.notify({
        type: 'warning',
        message: successfulDeleteMessage.value + " " + issueName,
      });
      router.push("/issues/");
      isLoading.value = false;
    }).catch((err) => {
      const errorMessage = errorHandler(err);
      console.log(errorMessage)
      isError.value = true;
    });
  });
}

function updateUsers(usersList) {
  console.log("get emit" + usersList)
  // alert(JSON.stringify(usersList))
  unassignUser(usersList, true)

}

function unassignUser(uuid, isArray = false) {
  let arr1 = usersList.value.map(a => a.uuid) || [];

  let arr2 = []
  if (isArray === true) {
    arr2 = uuid.map(a => a.uuid);
    arr2 = [...arr1, ...arr2]

  }
  if (isArray === false) {
    // arr2.push(uuid)
    console.log(arr1)
    arr2 = arr1.filter(e => e !== uuid);
  }
  // const arr2 = arr1.filter(e => e !== uuid);

  // alert(JSON.stringify(arr2))

  console.log(arr2)


  let removedItems = arr1.filter(x => !arr2.includes(x));
  let withoutChanges = arr1.filter(x => arr2.includes(x));
  let newItems = arr2.filter(x => !arr1.includes(x));

  console.log("Removed:")
  console.log(removedItems);

  console.log("Added:");
  console.log(newItems);

  console.log("Without change:");
  console.log(withoutChanges);

  // let assignedUsers = []
  let assignedUsers = [...withoutChanges, ...newItems]
  // let assignedUsers = withoutChanges.concat(newItems)


  console.log("assignedUsers");
  console.log(assignedUsers)
  // console.log(assignedUsers.map(a => a.uuid));

  editIssueRequest(issueUuid.value, {'users': assignedUsers}).then(function (response) {
    getIssueDetails(issueUuid.value)
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage)
    isError.value = true;
  });
  // $q.dialog({
  //   title: "Confirm",
  //   message: "Really Delete?",
  //   cancel: true,
  //   persistent: true,
  // }).onOk(() => {
  //   isLoading = true;
  //
  //
  //
  // });
}

function getIcon(status){
  switch (status) {
    case null:
      return 'playlist_add_check_circle'
      break;
    case 'accept_issue':
      return 'playlist_add_check_circle'
      break;
    case 'reject_issue':
      return 'playlist_add_check_circle'
      break;
    case 'in_progress_issue':
      return 'build_circle'
      break;
    case 'pause_issue':
      return 'pause_circle'
      break;
    case 'resolved_issue':
      return 'check_circle'
      break;
    default:
      return 'playlist_add_check_circle'
  }

  return 'playlist_add_check_circle'
}
onBeforeMount(() => {
  isLoading.value = true;
  issueUuid.value = route.params.uuid
  getIssueDetails(route.params.uuid);
});

</script>

<style lang="scss" scoped>
img.img-responsive {
  display: block;
  max-width: 90%;
  height: auto;
}
</style>
