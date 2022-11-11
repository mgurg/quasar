<template>
  <div @click="viewIdea(idea.uuid)">
    <q-item :class="{ 'bg-blue-grey-6': (idea.uuid == selected && $q.dark.isActive), 'bg-blue-grey-3': (idea.uuid == selected && !$q.dark.isActive) }">
      <q-item-section avatar cursor-pointer ripple @click="viewIdea(idea.uuid)">
        <q-avatar rounded color="red" text-color="white" icon="article">

          </q-avatar
        >
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1" class="text-body1">{{ idea.title }}</q-item-label>
        <q-item-label caption lines="2">{{ idea.description }}</q-item-label>
      </q-item-section>


      <q-item-section side>
        <q-item-label caption><q-icon name="star" color="warning" size="2rem" ></q-icon></q-item-label>
        <!-- <q-icon name="priority_high" color="red-12" /> -->
      </q-item-section>
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
  idea: {
    type: Object,
    default() {
      return {
        uuid: null,
        title: "Tile",
        description: "Desc",
        upvotes: 0,
        downvotes: 0,
        created_at: "2022-03-09T11:02:38.822164+00:00",
      };
    },
  },
  selected: {
    type: String,
  },
});

const counter = computed(() => (props.idea.upvotes - props.idea.downvotes))

const emit = defineEmits(["selectedItem", "forceRefresh"]);
const handleSelect = (uuid) => {
  emit("selectedItem", uuid);
};

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

function deleteIdea(uuid) {
  $q.dialog({
    title: "Confirm",
    message: "Really delete?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    authApi
      .delete("/ideas/" + uuid)
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

function editIdea(uuid) {
  router.push("/ideas/edit/" + uuid);
}

function viewIdea(uuid) {
  router.push("/ideas/" + uuid);
}
</script>
