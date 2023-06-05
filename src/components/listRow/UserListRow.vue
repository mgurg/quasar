<template>
  <div class="cursor-pointer" @click="viewUser(user.uuid)">
    <q-item>
      <q-item-section avatar cursor-pointer ripple @click="viewUser(user.uuid)">
        <q-avatar color="red-12" rounded text-color="white">{{ initials }}
          <q-badge v-if="user.is_verified === false" color="deep-orange-11" floating>{{ $t("New") }}</q-badge>
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label
          :class="user.uuid === currentUserUuid ? 'text-weight-bold' : 'text-weight-regular'"
          class="text-body1"
          lines="1">
          {{ user.first_name }} {{ user.last_name }}
        </q-item-label>
        <q-item-label caption lines="1">{{ user.role_FK.role_title }}</q-item-label>
      </q-item-section>

    </q-item>

    <q-separator/>
  </div>
</template>

<script setup>
import {useQuasar} from 'quasar'
import {useRouter} from "vue-router";
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
  user: {
    type: Object,
    default() {
      return {
        uuid: '1',
        first_name: 'Jan',
        last_name: 'Kowalski'
      }
    }
  }
})

const initials = computed(() => (props.user.first_name[0] + props.user.last_name[0]).toUpperCase())


function viewUser(uuid) {
  router.push("/users/" + uuid);
}

</script>
