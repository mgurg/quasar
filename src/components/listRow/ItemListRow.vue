<template>
  <q-item>
    <q-item-section avatar cursor-pointer ripple>
      <q-avatar
        rounded
        color="cyan-14"
        text-color="white"
        icon="hardware"
        class="cursor-pointer"
        @click="viewItem(item.uuid)"
      />
    </q-item-section>

    <q-item-section class="cursor-pointer" @click="viewItem(item.uuid)">
      <q-item-label lines="1" class="text-body1">{{ item.name }}</q-item-label>
      <q-item-label caption lines="2">{{ item.text }}</q-item-label>
    </q-item-section>

    <q-item-section side v-if="!displayMode">
      <div class="text-grey-8 q-gutter-xs">
        <q-btn
          dense
          no-caps
          flat
          icon="post_add"
          color="blue-12"
          @click="addGuide(item.uuid)"
          :label="$q.screen.gt.xs ? 'Nowy poradnik' : ''"
        />
        <q-btn
          dense
          no-caps
          flat
          icon="bug_report"
          color="red-12"
          @click="reportFailure(item.uuid)"
          :label="$q.screen.gt.xs ? 'Awaria!' : ''"
        />
      </div>
    </q-item-section>
  </q-item>
  <q-separator/>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  item: {
    type: Object,
    default: () => ({
      uuid: null,
      name: "Name",
    }),
  },
  displayMode: {
    type: String,
    default: null,
  },
});

const router = useRouter();

function viewItem(uuid) {
  const path = displayModePath(props.displayMode, uuid);
  router.push(path);
}

function displayModePath(mode, uuid) {
  if (mode === "issue") return { path: '/issues/add/', query: { item: uuid } };
  if (mode === "guide") return { path: '/guides/add/', query: { item: uuid } };
  return `/items/${uuid}`;
}

function reportFailure(uuid) {
  router.push({ path: '/issues/add/', query: { item: uuid } });
}

function addGuide(uuid) {
  router.push({ path: '/guides/add/', query: { item: uuid } });
}
</script>
