<template>
  <div class="cursor-pointer" @click="viewPermission(permission.uuid)">
    <q-item
      :class="{ 'bg-blue-grey-6': (permission.uuid === selected && $q.dark.isActive), 'bg-blue-grey-11': (permission.uuid === selected && !$q.dark.isActive) }">
      <q-item-section avatar cursor-pointer ripple @click="viewPermission(permission.uuid)">
        <q-avatar rounded color="red-12" text-color="white">{{ permission.count - permission.uncounted}}
          <q-badge v-if="permission.is_verified === false" floating color="deep-orange-11">{{ $t("New") }}</q-badge>
        </q-avatar>
        <!-- <q-avatar rounded>
            <img src="~assets/stecker.jpg" />
            <q-badge floating rounded color="green" />
        </q-avatar> -->
      </q-item-section>

      <q-item-section>
        <q-item-label lines="1" class="text-body1">{{ permission.role_title }}</q-item-label>
        <!-- <q-item-label caption lines="2">{{ permission.uuid }}</q-item-label> -->
        <q-item-label lines="1" caption> {{ permission.role_description }}
          <q-chip square size="sm" color="blue-12" icon="star" text-color="white"
                  v-if="permission.is_custom === false"></q-chip>
        </q-item-label>
      </q-item-section>

      <q-item-section side v-if="permission.uuid === selected">
        <div class="text-grey-8 q-gutter-xs">
          <q-btn size="12px" flat dense round icon="edit" @click="editPermission(permission.uuid)"
                 v-if="(permission.is_custom === true)"/>
          <q-btn size="12px" flat dense round icon="delete" @click="deletePermission(permission.uuid)"
                 v-if="(permission.is_custom === true) && hasPermission('USERS_ADD')"/>
          <q-btn size="12px" flat dense round icon="info" @click="viewPermission(permission.uuid)"/>
        </div>
      </q-item-section>
      <!-- <q-item-section side v-else>
          <q-item-label caption>sdf</q-item-label>
          <q-icon name="priority_high" color="red-12" />
      </q-item-section> -->
    </q-item>

    <q-separator/>
  </div>
</template>

<script setup>
import {useQuasar} from 'quasar'
import {useRouter} from "vue-router";
import {authApi} from "boot/axios";
import {useUserStore} from "stores/user";
import {computed} from 'vue';

const $q = useQuasar()
const router = useRouter();

const UserStore = useUserStore();
const currentUserUuid = UserStore.getCurrentUserId
const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return permissions.value === null ? false : Boolean(permissions.value.includes(permission));
}

const props = defineProps({
  permission: {
    type: Object,
    default() {
      return {
        uuid: '1',
        role_title: 'Jan',
        role_description: 'Kowalski',
        is_custom: false,
        count: 0,
        uncounted: 0
      }
    }
  },
  selected: {
    type: String,
    default: '1'
  }
})

const emit = defineEmits(['selectedItem', 'refreshList', "forceRefresh"])
const handleSelect = (uuid) => {
  emit('selectedItem', uuid)
}

const handleRefresh = () => {
  emit('refreshList')
}


const units = [
  'year',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
];

function deletePermission(uuid) {
  $q.dialog({
    title: "Confirm",
    message: "Really delete?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    authApi
      .delete("/settings/permissions/" + uuid)
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
    $q.notify("User deleted");

    handleRefresh()
    // fetchTasks()
  });
}

function editPermission(uuid) {
  router.push("/settings/permissions/edit/" + uuid);
}

function viewPermission(uuid) {
  router.push("/settings/permissions/view/" + uuid);
}

</script>
