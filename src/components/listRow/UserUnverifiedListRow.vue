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
          class="text-body1"
          lines="1">
          {{ user.first_name }} {{ user.last_name }}
        </q-item-label>
        <q-item-label caption lines="1">{{ user.email }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn
            dense
            flat
            color="red"
            icon="delete"
            :label="$q.screen.gt.xs ? 'Delete' : ''"
            @click="deleteUser(user.uuid)"
          />
          <q-btn
            dense
            flat
            icon="done"
            :label="$q.screen.gt.xs ? 'Accept' : ''"
            @click="verifyUser(user.uuid)"
          />
        </div>
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
import {deleteUserRequest} from "components/api/UserApiClient";
import {errorHandler} from "components/api/errorHandler";

const $q = useQuasar()
const router = useRouter();

const UserStore = useUserStore();
const currentUserUuid = UserStore.getCurrentUserId
const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return Boolean(permissions.value.includes(permission));
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

function deleteUser(uuid) {
  $q.dialog({title: "Confirm", message: "Really delete?", cancel: true, persistent: true,})
    .onOk(() => {
      isLoading.value = true;
      deleteUserRequest(uuid).then(function (response) {
        $q.notify("User deleted");
        isLoading.value = false;
      }).catch((err) => {
        const errorMessage = errorHandler(err);
        isError.value = true;
      });
    });
}

function verifyUser(uuid) {
  router.push("/users/verify/" + uuid);
}

</script>
