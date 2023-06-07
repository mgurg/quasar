<template>
  <!-- <div class="cursor-pointer" @click="viewItem(item.uuid)"> -->
  <q-item>
    <q-item-section avatar cursor-pointer ripple>
      <q-avatar rounded color="cyan-14" text-color="white" icon="hardware" class="cursor-pointer"
                @click="viewItem(item.uuid)"/>
    </q-item-section>

    <q-item-section class="cursor-pointer" @click="viewItem(item.uuid)">
      <q-item-label lines="1" class="text-body1">{{ item.name }}</q-item-label>
      <q-item-label caption lines="2">{{ item.text }}</q-item-label>
    </q-item-section>


    <q-item-section side>
      <q-btn outline @click="reportFailure(item.uuid)">Zgłoś</q-btn>
      <!-- <q-item-label caption><q-icon name="star" color="warning" size="2rem" ></q-icon></q-item-label> -->
      <!-- <q-icon name="priority_high" color="red-12" /> -->
    </q-item-section>
  </q-item>

  <q-separator/>
  <!-- </div> -->
</template>

<script setup>
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";

const {locale} = useI18n({useScope: "global"});

const $q = useQuasar();
const router = useRouter();

const props = defineProps({
  item: {
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


function truncate(value, length) {
  if (value.length > length) {
    return value.substring(0, length) + "...";
  }

  return value;

}

function viewItem(uuid) {
  router.push("/items/" + uuid);
}


function reportFailure(uuid) {
  console.log("New failure!" + uuid)
  router.push("/failure/" + uuid);
}
</script>
