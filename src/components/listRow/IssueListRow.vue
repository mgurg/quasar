<template>
  <!--  <div class="cursor-pointer">-->
  <q-item v-ripple :class="$q.screen.lt.sm ? 'q-pa-xs':''" clickable @click="viewIssue(issue.uuid)">
    <q-item-section :class="$q.screen.lt.sm ? 'q-pr-xs':''" avatar @click="viewIssue(issue.uuid)">
      <q-avatar :icon="getIcon(issue.status)" color="blue-grey-1" rounded text-color="blue-grey-6">
        <q-badge v-if="issue.priority ==30" color="red" floating></q-badge>
        <q-badge v-if="issue.priority ==20" color="orange" floating></q-badge>
        <q-badge v-if="issue.priority ==10" color="primary" floating></q-badge>
      </q-avatar>
      <!--      <q-icon :name="getIcon(issue.status)" :color="getIconColor(issue.priority)" size="lg">-->
      <!--        -->
      <!--      </q-icon>-->
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-body1" lines="1">
        {{ issue.name }}

        <span v-if="issue.item !==null">
          <q-chip
            v-if="$q.screen.gt.xs ===true"
            :label="issue.item.name"
            class="q-ma-xs truncate-chip-labels"
            clickable
            color="grey"
            size="md"
            style="z-index:1000"
            text-color="white"
            @click="viewItem(issue.item.uuid)"

          />
          <q-chip
            v-if="$q.screen.gt.xs ===true && issue.users_issue.length > 0"
            class="q-ma-xs"
            icon="how_to_reg"
            size="md"
          />
        </span>
      </q-item-label>
      <q-item-label caption lines="2">{{ issue.text }}</q-item-label>
      <q-item-label v-if="$q.screen.lt.sm ===true" caption>
        <span v-if="issue.item !==null" class="truncate-chip-labels">
        <q-chip
          v-if="issue.users_issue.length > 0"
          class="q-ma-xs"
          icon="person"
          size="sm"
        />
        <q-chip
          :label="issue.item.name"
          class="q-ma-xs"
          clickable
          color="grey"
          size="sm"
          style="max-width: 150px; z-index:1000"
          text-color="white"
          @click="viewItem(issue.item.uuid)"
        />
<!--          {{ timeAgo(issue.created_at) }}-->
        </span>
        <!--  Anonymous  -->
        {{ timeAgo(issue.created_at) }}

      </q-item-label>
    </q-item-section>
    <q-item-section v-if="$q.screen.gt.xs ===true" side>
      <q-item-label caption>{{ timeAgo(issue.created_at) }}</q-item-label>
      <q-tooltip>
        {{ formatTime(issue.created_at) }}
      </q-tooltip>
      <!-- <q-icon name="priority_high" color="red-12" /> -->
    </q-item-section>
  </q-item>

  <q-separator/>
  <!--  </div>-->
</template>

<script setup>
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";
import {authApi} from "boot/axios";
import {DateTime} from "luxon";
import {useI18n} from "vue-i18n";

const {locale} = useI18n({useScope: "global"});

const $q = useQuasar();
const router = useRouter();

const props = defineProps({
  issue: {
    type: Object,
    default() {
      return {
        uuid: null,
        name: null,
        text: null,
        text_json: null,
        item: null,
        status: null,
        priority: null,
        color: null,
        user_issue: null,
        created_at: null
      };
    },
  },
});
const emit = defineEmits(["forceRefresh"])
// const counter = computed(() => (props.issue.upvotes - props.issue.downvotes))

const units = ["year", "month", "week", "day", "hour", "minute", "second"];

const timeAgo = (date) => {
  let dateTime = DateTime.fromISO(date); // TODO: FIX created_at
  // let dateTime = DateTime.fromSQL("2017-05-15 09:24:15");
  const diff = dateTime.diffNow().shiftTo(...units);
  const unit = units.find((unit) => diff.get(unit) !== 0) || "second";

  const relativeFormatter = new Intl.RelativeTimeFormat(locale.value, {
    localeMatcher: "best fit", // other values: "lookup"
    numeric: "always", // other values: "auto"
    style: "narrow", // "long", "short" or "narrow"
  });
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit);
};

function formatTime(date) {
  return DateTime.fromISO(date).toFormat('yyyy-MM-dd')
}

function deleteIssue(uuid) {
  $q.dialog({
    title: "Confirm",
    message: "Really delete?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    authApi
      .delete("/issues/" + uuid)
      .then((res) => {
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
    $q.notify("Issue deleted");
    // fetchTasks()
  });
}

function editIssue(uuid) {
  router.push("/issues/edit/" + uuid);
}

function viewIssue(uuid) {
  router.push("/issues/" + uuid);
}

function viewItem(uuid) {
  router.push("/items/" + uuid);
}

function getIcon(status) {
  switch (status) {
    case 'new':
      return 'auto_awesome'
      break;
    case 'accepted':
      return 'playlist_add_check_circle'
      break;
    case 'rejected':
      return 'delete_forever'
      break;
    case 'in_progress':
      return 'build_circle'
      break;
    case 'paused':
      return 'pause_circle'
      break;
    case 'done':
      return 'check_circle'
      break;
    default:
      return 'offline_bolt'
  }
}

</script>

<style>
</style>
