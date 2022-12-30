<template>
<!--  <div class="cursor-pointer">-->
    <q-item clickable v-ripple class="q-pa-xs"  @click="viewIssue(issue.uuid)">
      <q-item-section class="q-pr-xs" avatar  @click="viewIssue(issue.uuid)">
        <q-avatar rounded color="red" text-color="white" icon="article"/>
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1" class="text-body1">
          {{ issue.name }}

          <q-chip
            v-if="$q.screen.gt.xs ===true"
            clickable
            class="q-ma-xs"
            color="teal"
            text-color="white"
            :label="issue.item.name"
            size="md"
            @click="viewItem(issue.item.uuid)"
          />
          <q-chip
            v-if="$q.screen.gt.xs ===true && issue.users_issue.lenght > 0"
            icon="person"
            class="q-ma-xs"
            size="md"
          />
        </q-item-label>
        <q-item-label caption lines="2">{{ issue.text }}</q-item-label>
        <q-item-label caption v-if="$q.screen.lt.sm ===true">
          <q-chip
            v-if="issue.users_issue.lenght > 0"
            icon="person"
            class="q-ma-xs"
            size="sm"
          />
          <q-chip
            clickable
            class="q-ma-xs"
            color="teal"
            text-color="white"
            :label="issue.item.name"
            size="sm"
            @click="viewItem(issue.item.uuid)"
          />
          {{ timeAgo(issue.created_at) }}



        </q-item-label>
      </q-item-section>
      <q-item-section side v-if="$q.screen.gt.xs ===true">
        <q-item-label caption>{{ timeAgo(issue.created_at) }}</q-item-label>
        <!-- <q-icon name="priority_high" color="red-12" /> -->
      </q-item-section>
    </q-item>

    <q-separator/>
<!--  </div>-->
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
</script>
