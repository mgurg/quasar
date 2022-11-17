<template>
    <div @click="viewGroup(group.uuid)">
        <q-item :class="{ 'bg-blue-grey-6': (group.uuid == selected && $q.dark.isActive), 'bg-blue-grey-11': (group.uuid == selected && !$q.dark.isActive) }">
            <q-item-section avatar cursor-pointer ripple @click="viewGroup(group.uuid)">
                <q-avatar rounded :color="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-11'"> {{nativeEmoji(group.symbol)}}
                    <q-badge v-if="group.is_verified === false" floating color="deep-orange-11">{{ $t("New") }}</q-badge>
                </q-avatar>
            </q-item-section>

            <q-item-section>
                <q-item-label lines="1" class="text-body1">{{ group.name }}  </q-item-label>
                <!-- <q-item-label caption lines="2">{{ group.uuid }}</q-item-label> -->
                <q-item-label lines="1"> {{ group.description }}
                    <q-chip square size="sm" color="blue-12" icon="star" text-color="white" v-if="group.is_custom == false"></q-chip>

                </q-item-label>
            </q-item-section>

            <q-item-section side v-if="group.uuid === selected">
                <div class="text-grey-8 q-gutter-xs">
                    <q-btn size="12px" flat dense round icon="edit" @click="editGroup(group.uuid)" />
                    <!-- v-if="(group.is_custom == true) && hasPermission('USERS_ADD')" -->
                    <q-btn size="12px" flat dense round icon="delete" @click="deleteGroup(group.uuid)"  />
                    <q-btn size="12px" flat dense round icon="info" @click="viewGroup(group.uuid)" />
                </div>
            </q-item-section>
        </q-item>

        <q-separator />
    </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from "vue-router";
import { authApi } from "boot/axios";
import { useUserStore } from "stores/user";
import { computed } from 'vue';
import { EmojiIndex } from "emoji-mart-vue-fast/src";
import data from "emoji-mart-vue-fast/data/twitter.json";


const $q = useQuasar()
const router = useRouter();

const UserStore = useUserStore();
const currentUserUuid = UserStore.getCurrentUserId
const permissions = computed(() => UserStore.getPermissions );

function nativeEmoji(symbol) {
  let emojiIndex = new EmojiIndex(data);
  let emoji = emojiIndex.findEmoji(symbol)

  return emoji.native
}

function hasPermission(group) {
  return Boolean(permissions.value.includes(group));
}

const props = defineProps({
    group: {
        type: Object,
        default() {
            return {
                uuid: '1',
                name: 'Jan',
                description: 'Kowalski',
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

function deleteGroup(uuid) {
    $q.dialog({
        title: "Confirm",
        message: "Really delete?",
        cancel: true,
        persistent: true,
    }).onOk(() => {
        authApi
            .delete("/groups/" + uuid)
            .then((res) => {
                emit("refreshList")
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
        $q.notify("Group deleted");

        handleRefresh()
        // fetchTasks()
    });
}

function editGroup(uuid) {
    router.push("/settings/groups/edit/" + uuid);
}

function viewGroup(uuid) {
    router.push("/settings/groups/view/" + uuid);
}

</script>

<style lang="scss" scoped>

:deep(.q-field__marginal) {
  color: inherit !important;
}
</style>