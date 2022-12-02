<template>
  <div class="cursor-pointer" @click="viewGuide(guide.uuid)">
    <q-item>
      <q-item-section avatar cursor-pointer ripple @click="viewGuide(guide.uuid)">
        <q-avatar rounded color="red" text-color="white" icon="article" />
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1" class="text-body1">{{ guide.name }}</q-item-label>
        <q-item-label caption lines="2">{{ guide.name }}</q-item-label>
      </q-item-section>


<!--      <q-item-section side>-->
<!--        <q-item-label caption><q-icon name="star" color="warning" size="2rem" ></q-icon></q-item-label>-->
<!--         <q-icon name="priority_high" color="red-12" /> -->
<!--      </q-item-section>-->
    </q-item>

    <q-separator />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { authApi } from "boot/axios";
import { DateTime } from "luxon";
import { useI18n } from "vue-i18n";

const { locale } = useI18n({ useScope: "global" });

const $q = useQuasar();
const router = useRouter();

const props = defineProps({
  guide: {
    type: Object,
    default() {
      return {
        uuid: null,
        name: "Name",
        // description: "Desc",
        // upvotes: 0,
        // downvotes: 0,
        // created_at: "2022-03-09T11:02:38.822164+00:00",
      };
    },
  }
});

const counter = computed(() => (props.guide.upvotes - props.guide.downvotes))

const emit = defineEmits(["forceRefresh"]);

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

function deleteGuide(uuid) {
  $q.dialog({
    title: "Confirm",
    message: "Really delete?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    authApi
      .delete("/guides/" + uuid)
      .then((res) => {
        emit("forceRefresh")
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
    $q.notify("Task deleted");
    // fetchTasks()
  });
}

function editGuide(uuid) {
  router.push("/guides/edit/" + uuid);
}

function viewGuide(uuid) {
  router.push("/guides/" + uuid);
}
</script>
