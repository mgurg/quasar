<!-- 
  TODO:
  - Wydzielić komunikację API jeszcze bardziej na zewnątrz (Zrobić generyczny GET/POST/PATCH/DELETE)? 
  - użyć isLoading
  - wyliczenie relatywnego czasu (+ odświeżanie co 1 min?)
  - strefy czasowe

 -->

<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-ml-md">
        {{ $t("Tasks") }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <q-btn @click="fetchTasks">fetch tasks</q-btn>
      </h5>

      <q-list bordered padding>
        <q-item-label header v-if="myTasks">{{ $t("Your tasks") }}</q-item-label>

        <div
          v-for="task in myTasks"
          v-bind:key="task.uuid"
          @click="selectTask(task.uuid)"
          :class="{ 'done bg-blue-1': task.uuid === selected }"
        >
          <q-item>
            <q-item-section avatar>
              <q-avatar rounded>
                <img src="~assets/stecker.jpg" />
                <q-badge floating rounded color="green" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ task.title }}</q-item-label>
              <q-item-label caption lines="2">{{ task.description }}</q-item-label>
              <q-item-label lines="1">
                <q-chip size="sm" color="red" text-color="white" icon="cake">Adam G</q-chip>
              </q-item-label>
            </q-item-section>

            <q-item-section side v-if="task.uuid === selected">
              <div class="text-grey-8 q-gutter-xs">
                <q-btn size="12px" flat dense round icon="edit" @click="editTask(task.uuid)" />
                <q-btn size="12px" flat dense round icon="delete" @click="deleteTask(task.uuid)" />
                <q-btn size="12px" flat dense round icon="info"  @click="viewTask(task.uuid)" />
              </div>
            </q-item-section>
            <q-item-section side v-else>
              <q-item-label caption>{{ timeAgo(task.date_from) }}</q-item-label>
              <q-icon name="priority_high" color="red" />
            </q-item-section>
          </q-item>

          <q-separator />
        </div>

        <!-- ALL TASKS -->
        <q-item-label header v-if="otherTasks">{{ $t("All tasks") }}</q-item-label>

        <div
          v-for="task in otherTasks"
          v-bind:key="task.uuid"
          @click="selectTask(task.uuid)"
          :class="{ 'done bg-blue-1': task.uuid === selected }"
        >
          <q-item>
            <q-item-section avatar>
              <q-avatar rounded>
                <img src="~assets/stecker.jpg" />
                <q-badge floating rounded color="green" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ task.title }}</q-item-label>
              <q-item-label caption lines="2">{{ task.description }}</q-item-label>
              <q-item-label lines="1">
                <q-chip size="sm" color="red" text-color="white" icon="cake">Adam G</q-chip>
              </q-item-label>
            </q-item-section>

            <q-item-section side v-if="task.uuid === selected">
              <div class="text-grey-8 q-gutter-xs">
                <q-btn size="12px" flat dense round icon="edit" @click="editUser(task.uuid)" />
                <q-btn size="12px" flat dense round icon="delete" @click="deleteUser(task.uuid)" />
                <q-btn size="12px" flat dense round icon="info" @click="viewTask(task.uuid)"  />
              </div>
            </q-item-section>
            <q-item-section side v-else>
              <q-item-label caption>{{ timeAgo(task.date_from) }}</q-item-label>
              <q-icon name="priority_high" color="red" />
            </q-item-section>
          </q-item>

          <q-separator />
        </div>
      </q-list>

      <q-space class="q-pa-sm" />
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" to="/task" color="accent" />
      </q-page-sticky>
    </q-page>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { defineComponent, onActivated, ref, computed } from "vue";
import { DateTime } from 'luxon';
import { useRouter } from "vue-router";
import { api } from "boot/axios";

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);

export default defineComponent({
  name: "PageTodo",
  setup() {
    const $q = useQuasar()
        const router = useRouter();

    const tasks = ref(null);
    let selected = ref(null);


    const myTasks = computed(() => {
      if (tasks.value != null) {
        return tasks.value.filter((task) => task.assignee_id === 0)
      } else {
        return null;
      }
    });

    const otherTasks = computed(() => {
      if (tasks.value != null) {
        return tasks.value.filter((task) => task.assignee_id !== 0)
      } else {
        return null;
      }
    });

    
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
      let dateTime = DateTime.fromISO(date)
      const diff = dateTime.diffNow().shiftTo(...units);
      const unit = units.find((unit) => diff.get(unit) !== 0) || 'second';

      const relativeFormatter = new Intl.RelativeTimeFormat('en', {
        localeMatcher: "best fit", // other values: "lookup"
        numeric: "always", // other values: "auto"
        style: "narrow", // "long", "short" or "narrow"
      });
      return relativeFormatter.format(Math.trunc(diff.as(unit)), unit);
    };


    function fetchTasks() {
      api
        .get("/tasks/index?offset=0&limit=20")
        .then((res) => {
          tasks.value = res.data
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
    }

    function createTasks(body) {
      api
        .post("/tasks/add", body)
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
    }

    function selectTask(uuid) {
      if (selected.value == null) {
        selected.value = uuid;
      } else if (selected.value !== uuid) {
        selected.value = uuid;
      } else {
        selected.value = null;
      }
    }

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
        fetchTasks()
      });
    }

    function editTask(uuid) {
      console.log(uuid);
    }

    function viewTask(uuid) {
      router.push("/tasks/" + uuid);
      console.log(uuid);
    }

    onActivated(() => {
      fetchTasks()
    });

    return {
      isLoading,
      isSuccess,
      errorMsg,
      myTasks,
      otherTasks,
      selected,
      timeAgo,
      fetchTasks,
      selectTask,
      editTask,
      deleteTask,
      viewTask
    };
  },
});
</script>
