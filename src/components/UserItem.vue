<template>
    <div @click="handleSelect(user.uuid)">
        <q-item :class="{ 'done bg-blue-1': user.uuid == selected }">
            <q-item-section avatar cursor-pointer ripple @click="viewUser(user.uuid)">
                <q-avatar rounded color="red" text-color="white">{{ initials }}</q-avatar>
                <!-- <q-avatar rounded>
                    <img src="~assets/stecker.jpg" />
                    <q-badge floating rounded color="green" />
                </q-avatar> -->
            </q-item-section>

            <q-item-section>
                <q-item-label lines="1" class="text-body1">{{ user.first_name }} {{ user.last_name }} </q-item-label>
                <!-- <q-item-label caption lines="2">{{ user.uuid }}</q-item-label> -->
                <q-item-label lines="1">
                    <q-chip square size="sm" color="blue" text-color="white" v-if="user.uuid == currentUserUuid">me</q-chip>

                </q-item-label>
            </q-item-section>

            <q-item-section side v-if="user.uuid === selected">
                <div class="text-grey-8 q-gutter-xs">
                    <q-btn size="12px" flat dense round icon="edit" @click="editUser(user.uuid)" />
                    <q-btn size="12px" flat dense round icon="delete" @click="deleteUser(user.uuid)" v-if="(user.uuid != currentUserUuid) &&  hasPermission('USERS_ADD')" />
                    <q-btn size="12px" flat dense round icon="info" @click="viewUser(user.uuid)" />
                </div>
            </q-item-section>
            <!-- <q-item-section side v-else>
                <q-item-label caption>sdf</q-item-label>
                <q-icon name="priority_high" color="red" />
            </q-item-section> -->
        </q-item>

        <q-separator />
    </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from "vue-router";
import { authApi } from "boot/axios";
import { DateTime } from 'luxon';
import { useUserStore } from "stores/user";
import { computed } from 'vue';

const $q = useQuasar()
const router = useRouter();

const UserStore = useUserStore();
const currentUserUuid = UserStore.getCurrentUserId
const permissions = computed(() => UserStore.getPermissions );

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
    },
    selected: {
        type: String,
        default: '1'
    }
})

const emit = defineEmits(['selectedItem', 'refreshList', , "forceRefresh"])
const handleSelect = (uuid) => {
    emit('selectedItem', uuid)
}

const handleRefresh = () => {
    emit('refreshList')
}

const initials = computed(() => (props.user.first_name[0] + props.user.last_name[0]).toUpperCase())

const units = [
    'year',
    'month',
    'week',
    'day',
    'hour',
    'minute',
    'second',
];

function deleteUser(uuid) {
    $q.dialog({
        title: "Confirm",
        message: "Really delete?",
        cancel: true,
        persistent: true,
    }).onOk(() => {
        authApi
            .delete("/user/" + uuid)
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

function editUser(uuid) {
    router.push("/users/edit/" + uuid);
}

function viewUser(uuid) {
    router.push("/ideas/user/" + uuid);
}

</script>