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
                <q-btn
                  v-if="hasPermission('ISSUE_EDIT')"
                  :disable="issueStatus === 'done'"
                  :label="$q.screen.gt.xs ? $t('Edit') : ''"
                  class="float-right q-mr-sm" color="primary"
                  icon="edit"
                  no-caps
                  outline
                  @click="editIssue(issueDetails.uuid)"

                />
                <q-btn
                  v-if="hasPermission('ISSUE_DELETE')"
                  :disable="issueStatus === 'done'"
                  :label="$q.screen.gt.xs ? $t('Delete') : ''"
                  class="float-right q-mr-sm"
                  color="red"
                  flat
                  icon="delete"
                  no-caps
                  @click="deleteIssue(issueDetails.uuid, issueDetails.name)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <q-card-section v-if="issueDetails && !isLoading" class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-card-section avatar class="q-pa-sm">
                <q-avatar :icon="getIcon(issueDetails.status)" color="blue-grey-1" rounded text-color="blue-grey-6">
                  <q-badge v-if="issueDetails.priority ===30" color="red" floating></q-badge>
                  <q-badge v-if="issueDetails.priority ===20" color="orange" floating></q-badge>
                  <q-badge v-if="issueDetails.priority ===10" color="primary" floating></q-badge>
                </q-avatar>
              </q-card-section>

              <q-item-section>
                <q-item-label class="text-h5">{{ issueDetails.name }}</q-item-label>
                <!--                 <q-item-label caption>{{ itemDetails.summary }}</q-item-label>-->
                <!--                <q-item-label caption>Krótki, publicznie dostępny opis</q-item-label>-->
              </q-item-section>
            </q-item>
          </q-list>

          <div class="q-pb-sm">
          <span v-for="(tag, index) in tagList" v-if="tagList != null" v-bind:key="index" class="q-gutter-sm">
            <q-chip color="primary" text-color="white">
              {{ tag.name }}
            </q-chip>
          </span>
          </div>

          <div class="q-gutter-xs">
            <!-- {{usersList}}-->
            <span v-if="usersList.length === 0 && issueStatus==='new'"
                  class="text-grey">Zaakceptuj lub odrzuć zgłoszenie</span>
            <span v-if="usersList.length === 0 && issueStatus==='accepted'" class="text-grey">Przypisz wykonawcę żeby rozpocząć naprawę</span>
            <q-chip
              v-for="(user, index) in usersList" v-if="usersList!= null" v-bind:key="index"
              :disable="issueStatus==='done'"
              :removable="issueStatus!=='done'"
              color="primary"
              icon="person"
              text-color="white"
              @remove="unassignUser(user.uuid)"
            >
              {{ user.first_name }} {{ user.last_name }}
            </q-chip>
          </div>
        </q-card-section>
        <q-separator/>

        <q-card-actions v-if="issueStatus !== 'rejected' && hasPermission('ISSUE_MANAGE')" align="right">
          <q-btn
            v-if="issueStatus === 'new'"
            :label="$q.screen.gt.xs ? 'Akceptuj' : ''"
            class="q-px-xs"
            color="primary"
            flat
            icon="check_circle"
            no-caps
            @click="setIssueStatus('issue_accept')"
          />
          <q-btn
            v-if="issueStatus === 'new'"
            :label="$q.screen.gt.xs ? 'Odrzuć' : ''"
            class="q-px-xs"
            color="primary"
            flat
            icon="cancel"
            no-caps
            @click="setCommentDialog('issue_reject')"
          />
          <q-btn
            v-if="issueStatus!=='new'"
            :disable="issueStatus === 'done'"
            :label="$q.screen.gt.xs ? 'Przypisz użytkownika' : ''"
            class="q-px-xs"
            color="primary"
            flat
            icon="person_add"
            no-caps
            @click="showUserDialog = true"
          />
          <q-btn
            v-if="(issueStatus!=='new' || issueStatus === 'accepted') && issueStatus!=='paused'"
            :disable="issueStatus === 'in_progress'||  issueStatus === 'done'"
            :label="$q.screen.gt.xs ? 'Rozpocznij' : ''"
            class="q-px-xs"
            color="primary"
            flat
            icon="play_arrow"
            no-caps
            @click="setIssueStatus('issue_start_progress')"
          />
          <q-btn
            v-if="issueStatus==='paused'"
            :disable="issueStatus === 'in_progress'||  issueStatus === 'done'"
            :label="$q.screen.gt.xs ? 'Wznów' : ''"
            class="q-px-xs"
            color="primary"
            flat
            icon="play_arrow"
            no-caps
            @click="setIssueStatus('issue_resume')"
          />
          <q-btn
            v-if="issueStatus!=='new'"
            :disable="issueStatus === 'accepted'|| issueStatus === 'paused' ||  issueStatus === 'done'"
            :label="$q.screen.gt.xs ? 'Wstrzymaj' : ''"
            class="q-px-xs"
            color="primary"
            flat
            icon="pause"
            no-caps
            @click="setCommentDialog('issue_pause')"
          />
          <q-btn
            v-if="issueStatus!=='new'"
            :disable="issueStatus === 'accepted'||  issueStatus === 'done'"
            :label="$q.screen.gt.xs ? 'Zakończ' : ''"
            class="q-px-xs"
            color="primary"
            flat
            icon="stop"
            no-caps
            @click="setCommentDialog('issue_done')"
          />
          <!--          <q-btn-->
          <!--            v-if="issueStatus !== null"-->
          <!--            :disable="issueStatus === 'accepted'"-->
          <!--            :label="$q.screen.gt.xs ? 'Restart' : ''"-->
          <!--            class="q-px-xs"-->
          <!--            color="primary"-->
          <!--            flat-->
          <!--            icon="restart_alt"-->
          <!--            no-caps-->
          <!--            @click="setIssueStatus('done')"-->
          <!--          />-->
        </q-card-actions>
        <q-card v-if="issueStatus === 'rejected'" align="right" class="q-pt-md q-px-md">
          <p class="text-weight-bold text-red-5">
            <q-icon name="delete_forever" size="sm"/>
            Zgłoszenie odrzucone
          </p>
        </q-card>
      </q-card>

      <issue-summary-card v-if="issueDetails!==null && issueDetails.status==='done'" :issue-uuid="issueDetails.uuid"/>
      <description-card v-if="issueDetails!==null" :expanded-description="true" :textJson="issueDetails.text_json"/>
      <photo-card v-if="photoFiles!==null" :expanded-photos="false" :photo-files="photoFiles"/>

      <part-card v-if="issueStatus!=='new' && issueDetails" :issue-uuid="issueUuid"></part-card>
      <timeline-issue-card v-if="issueDetails!==null" :issue-uuid="issueDetails.uuid"/>

      <q-dialog v-model="showUserDialog" :position=" $q.platform.is.mobile ? 'top': 'standard'">
        <user-assign-dialog @assign-user-btn-click="updateUsers"/>
      </q-dialog>

      <q-dialog v-model="showCommentDialog" :position=" $q.platform.is.mobile ? 'top': 'standard'">
        <comment-dialog :status="newStatus" @addCommentBtnClick="setIssueCommentStatus"/>
      </q-dialog>


    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, ref, unref} from "vue";
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

import IssueSummaryCard from "components/viewer/cards/IssueSummaryCard.vue";
import DescriptionCard from "components/viewer/cards/DescriptionCard.vue";
import TimelineIssueCard from "components/viewer/cards/TimelineIssueCard.vue";
import PhotoCard from "components/viewer/cards/PhotoCard.vue";
import UserAssignDialog from "components/dialog/UserAssignDialog.vue";
import CommentDialog from "components/dialog/CommentDialog.vue";
import PartCard from "components/viewer/cards/PartCard.vue";

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
  return permissions.value === null ? false : Boolean(permissions.value.includes(permission));
}

let issueDetails = ref(null);
let issueItemUuid = ref(null);
let photoFiles = ref(null);
let usersList = ref(null);
let tagList = ref(null);
let issueUuid = ref(null);
let issueStatus = ref(null);
const showUserDialog = ref(false);
const showCommentDialog = ref(false);
const newStatus = ref(null);

function convertTime(datetime, timeZone = "America/Los_Angeles") {
  return new Date(datetime).toLocaleString("en-US", {timeZone});
}

function getIssueDetails(uuid) {
  isLoading.value = true;

  getOneIssueRequest(uuid).then(function (response) {
    issueDetails.value = response.data;
    photoFiles.value = response.data.files_issue.filter((item) => item.mimetype.match('image.*'));
    usersList.value = response.data.users_issue;
    tagList.value = response.data.tags_issue;
    issueStatus.value = response.data.status;
    if (response.data.item) {
      issueItemUuid.value = response.data.item.uuid;
    }

    // console.log(response.data)
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage)
    isError.value = true;
  });
}

function setCommentDialog(status) {
  newStatus.value = status
  showCommentDialog.value = true
}

function setIssueCommentStatus(status, comment) {
  // console.log('Status: ' + status);
  // console.log('Comment: ' + unref(comment));
  setIssueStatus(status, unref(comment), null,)
}


function setIssueStatus(action, description = null, value = null) {

  if (usersList.value.length === 0) {
    if (!['issue_add_person', 'issue_reject', 'issue_accept'].includes(action)) {
      // console.log(action)
      $q.notify({
        message: 'No user assigned to Issue',
        type: 'warning',
        icon: 'announcement'
      })
      return;
    }

  }

  let eventName = null;
  let eventDescription = null;
  let eventValue = null;
  let internal_value = null;

  switch (action) {
    case 'issue_add':
      eventName = "Issue added"
      eventDescription = issueDetails.value.name
      eventValue = issueDetails.value.text
      break;
    case 'issue_accept':
      eventName = "Issue accepted"
      // eventDescription = issueDetails.value.name
      // eventValue = issueDetails.value.text
      break;
    case 'issue_reject':
      eventName = "Issue rejected"
      eventDescription = description
      // eventValue = issueDetails.value.text
      break;
    case 'issue_add_person':
      eventName = "Assign new person"
      eventDescription = description
      internal_value = value
      break;
    case 'issue_remove_person':
      eventName = "Remove assigned person"
      eventDescription = description
      internal_value = value
      break;
    case 'issue_start_progress':
      eventName = "Issue started"
      // eventDescription = issueDetails.value.name
      // eventValue = issueDetails.value.text
      break;
    case 'issue_pause':
      eventName = "Issue paused"
      eventDescription = description
      // eventValue = issueDetails.value.text
      break;
    case 'issue_resume':
      eventName = "Issue resumed"
      // eventDescription = description
      // eventValue = issueDetails.value.text
      break;
    case 'issue_done':
      eventName = "Issue done"
      eventDescription = description
      // eventValue = issueDetails.value.text
      break;
    default:
      console.log(`Sorry, we are out of ${action}.`);
  }


  // issue_add | Issue added | issueDetails.name | None
  // issue_accept | Issue accepted | user | None
  // issue_reject | Issue rejected | reason | None
  // change_assigned_person | Changed assigned person | added | user
  // change_assigned_person | Changed assigned person | removed | user
  // start_progress | Issue started | None | None
  // issue_pause | Issue paused | reason | None
  // issue_resume | Issue resumed | None | None
  // issue_resolve | Issue done | reason | None


  let data = {
    "status": action,
    "name": eventName,
    "description": eventDescription,
    "value": eventValue,
    'uuid': issueUuid.value,
    internal_value: internal_value
  }

  changeIssueStatusRequest(issueUuid.value, data).then(function (response) {
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
    isLoading.value = true;
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


  if (removedItems.length > 0) {
    removedItems.forEach(element => {
      console.log("Removed: " + element)
      setIssueStatus('issue_remove_person', 'removed', element)
    });
  }

  if (newItems.length > 0) {
    newItems.forEach(element => {
      console.log("Added: " + element)
      setIssueStatus('issue_add_person', 'added', element)
    });
  }

}

function getIcon(status) {
  switch (status) {
    case 'new':
      return 'auto_awesome'
    case 'accepted':
      return 'playlist_add_check_circle'
    case 'rejected':
      return 'delete_forever'
    case 'in_progress':
      return 'build_circle'
    case 'paused':
      return 'pause_circle'
    case 'done':
      return 'check_circle'
    default:
      return 'offline_bolt'
  }
}

onBeforeMount(() => {
  isLoading.value = true;
  issueUuid.value = route.params.uuid
  getIssueDetails(route.params.uuid);
});

</script>

<style lang="scss" scoped>
//img.img-responsive {
//  display: block;
//  max-width: 90%;
//  height: auto;
//}
</style>
