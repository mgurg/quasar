<template>
  <div class="cursor-pointer" @click="viewIssue(issue.uuid)">
    <q-item>
      <q-item-section avatar cursor-pointer ripple @click="viewIssue(issue.uuid)">
        <q-avatar rounded color="red" text-color="white" icon="article"/>
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1" class="text-body1">{{ issue.name }}</q-item-label>
        <q-item-label caption lines="2">{{ issue.text }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label caption>{{ timeAgo(issue.created_at) }}</q-item-label>
        <!-- <q-icon name="priority_high" color="red-12" /> -->
      </q-item-section>
    </q-item>

    <q-separator/>
  </div>
</template>

<script setup>
import {computed} from "vue";
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
        uuid:null,
        name: null,
        text: null,
        text_json: null,
        status:null,
        priority:null,
        color:null,
        created_at: null
      };
    },
  },
});

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
</script>
