<template>
    <div @click="handleSelect(task.uuid)">
        <q-item :class="{ 'done bg-blue-1': task.uuid == selected }">
            <q-item-section avatar cursor-pointer ripple @click="viewTask(task.uuid)">
            <q-avatar rounded color="red-12" text-color="white" icon="question_mark" />
                <!-- <q-avatar rounded>
                    <img src="~assets/stecker.jpg" />
                    <q-badge floating rounded color="green" />
                </q-avatar> -->
            </q-item-section>

            <q-item-section>
                <q-item-label lines="1">{{ task.title }}</q-item-label>
                <q-item-label caption lines="2">{{ task.description }}</q-item-label>
                <q-item-label lines="1">
                    <q-chip square size="sm" color="blue-12" text-color="white">#111</q-chip>
                    <q-chip
                        square
                        size="sm"
                        color="blue-12"
                        text-color="white"
                        icon="account_circle"
                        v-if="task.assignee != null"
                    >{{ task.assignee.first_name + ' ' + task.assignee.last_name }}</q-chip>
                </q-item-label>
            </q-item-section>

            <q-item-section side v-if="task.uuid === selected">
                <div class="text-grey-8 q-gutter-xs">
                    <q-btn size="12px" flat dense round icon="edit" @click="editTask(task.uuid)" />
                    <q-btn
                        size="12px"
                        flat
                        dense
                        round
                        icon="delete"
                        @click="deleteTask(task.uuid)"
                    />
                    <q-btn size="12px" flat dense round icon="info" @click="viewTask(task.uuid)" />
                </div>
            </q-item-section>
            <q-item-section side v-else>
                <q-item-label caption>{{ timeAgo(task.created_at) }}</q-item-label>
                <q-icon name="priority_high" color="red-12" />
            </q-item-section>
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
    task: {
        type: Object,
        default() {
            return {
                uuid: '1',
                title: 'Tile',
                description: 'Desc',
                assignee: {
                    first_name: 'Jan',
                    last_name: 'Kowalski'
                },
                created_at: "2022-03-09T11:02:38.822164+00:00"

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

function deleteTask(uuid) {
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

function editTask(uuid) {
    router.push("/tasks/edit/" + uuid);
}

function viewTask(uuid) {
    router.push("/tasks/" + uuid);
}

</script>