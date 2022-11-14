<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el :label="$t('Guides')" icon="tips_and_updates" to="/guides" />
          <q-breadcrumbs-el :label="$t('View')" icon="info" />
        </q-breadcrumbs>
      </div>

    </q-page>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import Tiptap from 'src/components/editor/TipTap.vue'
import { useUserStore } from 'stores/user'
import { useRoute } from "vue-router";
import { authApi } from "boot/axios";
import TaskViewSkeleton from "components/skeletons/tasks/TaskViewSkeleton";

const UserStore = useUserStore();

const json = ref(null);
let isLoading = ref(false);
let dialog = ref(false);

const counter = computed(() => ideaDetails.value.upvotes - ideaDetails.value.downvotes);
const permissions = computed(() => UserStore.getPermissions );

function hasPermission(permission) {
  return Boolean(permissions.value.includes(permission));
}


const route = useRoute();
let ideaDetails = ref(null);

function convertTime(datetime) {
  let timeZone = "America/Los_Angeles";
  const dateObject = new Date(datetime).toLocaleString("en-US", {
    timeZone,
  });

  return dateObject;
}

function getDetails(uuid) {
  authApi
    .get("/guides/" + uuid)
    .then((res) => {
      console.log(uuid);
      console.log(res.data);
      // ideaDetails.value = res.data;
      // json.value = res.data.body_json;
      isLoading.value = false;
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
}


onBeforeMount(() => {
  isLoading.value = true;
  getDetails(route.params.uuid);
});

</script>

<style lang="scss" scoped>
img.img-responsive {
  display: block;
  max-width: 90%;
  height: auto;
}
</style>
