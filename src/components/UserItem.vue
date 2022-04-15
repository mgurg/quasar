<template>
    <div @click="handleSelect(user.uuid)">
        <q-item :class="{ 'done bg-blue-1': user.uuid == selected }">
            <q-item-section avatar cursor-pointer ripple @click="viewUser(user.uuid)">
                <q-avatar rounded color="red" text-color="white" icon="question_mark" />
                <!-- <q-avatar rounded>
                    <img src="~assets/stecker.jpg" />
                    <q-badge floating rounded color="green" />
                </q-avatar> -->
            </q-item-section>

            <q-item-section>
                <q-item-label lines="1">{{ user.first_name }} {{ user.last_name }}</q-item-label>
                <q-item-label caption lines="2">{{ user.uuid }}</q-item-label>
                <q-item-label lines="1">
                    <q-chip square size="sm" color="blue" text-color="white">#111</q-chip>

                </q-item-label>
            </q-item-section>

            <q-item-section side v-if="user.uuid === selected">
                <div class="text-grey-8 q-gutter-xs">
                    <q-btn size="12px" flat dense round icon="edit" @click="editUser(user.uuid)" />
                    <q-btn size="12px" flat dense round icon="delete" @click="deleteUser(user.uuid)" />
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
import { api } from "boot/axios";
import { DateTime } from 'luxon';

const $q = useQuasar()
const router = useRouter();

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

const emit = defineEmits(['selectedItem'])
const handleSelect = (uuid) => {
    emit('selectedItem', uuid)
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

const timeAgo = (date) => {
    let dateTime = DateTime.fromISO(date) // TODO: FIX created_at
    // let dateTime = DateTime.fromSQL("2017-05-15 09:24:15");
    const diff = dateTime.diffNow().shiftTo(...units);
    const unit = units.find((unit) => diff.get(unit) !== 0) || 'second';

    const relativeFormatter = new Intl.RelativeTimeFormat('en', {
        localeMatcher: "best fit", // other values: "lookup"
        numeric: "always", // other values: "auto"
        style: "narrow", // "long", "short" or "narrow"
    });
    return relativeFormatter.format(Math.trunc(diff.as(unit)), unit);
};

function deleteUser(uuid) {
    $q.dialog({
        title: "Confirm",
        message: "Really delete?",
        cancel: true,
        persistent: true,
    }).onOk(() => {
        api
            .delete("/tasks/" + uuid)
            .then((res) => {
                console.log(res.data);
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

function editUser(uuid) {
    console.log(uuid);
    router.push("/users/edit/" + uuid);
}

function viewUser(uuid) {
    router.push("/users/" + uuid);
}

</script>