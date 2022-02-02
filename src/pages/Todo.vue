<!-- <template>
  <q-page class="flex flex-center">
    <q-btn @click="ping">Fetch tasks</q-btn>
  </q-page>
</template> -->

<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-ml-md">
        {{ $t("Tasks") }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <q-btn @click="fetchTasks">fetch tasks</q-btn>
        <q-btn @click="createTasks">Add task</q-btn>
      </h5>

      <q-list bordered padding>
        <q-item-label header>{{ $t("Your tasks") }}</q-item-label>

        <div
          v-for="task in tasks"
          v-bind:key="task.uuid"
          @click="selectUser(task.uuid)"
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
            </q-item-section>

            <q-item-section side v-if="task.uuid === selected">
              <div class="text-grey-8 q-gutter-xs">
                <q-btn size="12px" flat dense round icon="edit" @click="editUser(task.uuid)" />
                <q-btn size="12px" flat dense round icon="done" @click="deleteUser(task.uuid)" />
                <q-btn size="12px" flat dense round icon="info" />
              </div>
            </q-item-section>
            <q-item-section side v-else>
              <q-item-label caption>od 5m</q-item-label>
              <q-item-label caption>od 5m</q-item-label>
              <q-icon name="priority_high" color="red" />
            </q-item-section>
          </q-item>

          <q-separator />
        </div>

        <!-- <q-item>
          <q-item-section avatar>
            <q-avatar rounded>
              <img src="~assets/stecker.jpg" />
              <q-badge floating rounded color="red" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">Single line item 2</q-item-label>
            <q-item-label
              caption
              lines="2"
            >Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label caption>od 5m</q-item-label>
            <q-avatar rounded size="sm" color="warning">JS</q-avatar>
          </q-item-section>
        </q-item>

        <q-separator spaced />
        <q-item-label header>List Header</q-item-label>
        <q-item>
          <q-item-section avatar>
            <q-avatar rounded>
              <img src="~assets/stecker.jpg" />
              <q-badge floating rounded color="warning" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">High temperature in the main hall</q-item-label>
            <q-item-label
              caption
              lines="2"
            >Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit elit.</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn size="12px" flat dense round icon="edit" />
              <q-btn size="12px" flat dense round icon="done" />
              <q-btn size="12px" flat dense round icon="info" />
            </div>
          </q-item-section>
        </q-item>-->
      </q-list>

      <!-- HEADER SLOTS -->

      <q-space class="q-pa-sm" />

      <h5 class="q-mb-sm q-mt-sm q-ml-md">{{ $t("Tasks") }}</h5>

      <!-- QFORM -->

      <q-form
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        class="q-gutter-md"
      >
        <q-input
          outlined
          :dense="dense"
          v-model="name"
          :label="$t('Tasks')"
          hint="Name and surname"
          lazy-rules
          :rules="[val => val && val.length > 0 || 'Please type something']"
        />

        <q-input
          outlined
          :dense="dense"
          type="textarea"
          v-model="age"
          label="Your age *"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Please type your age',
            val => val > 0 && val < 100 || 'Please type a real age'
          ]"
        />

        <q-uploader
          url="http://localhost:4444/upload"
          style="width:95%"
          label="Custom list"
          multiple
        >
          <template v-slot:list="scope">
            <q-list separator>
              <q-item v-for="file in scope.files" :key="file.__key">
                <q-item-section>
                  <q-item-label class="full-width ellipsis">{{ file.name }}</q-item-label>

                  <q-item-label caption>Status: {{ file.__status }}</q-item-label>

                  <q-item-label caption>{{ file.__sizeLabel }} / {{ file.__progressLabel }}</q-item-label>
                </q-item-section>

                <q-item-section v-if="file.__img" thumbnail class="gt-xs">
                  <img :src="file.__img.src" />
                </q-item-section>

                <q-item-section top side>
                  <q-btn
                    class="gt-xs"
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                    @click="scope.removeFile(file)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </template>
        </q-uploader>

        <q-toggle v-model="dense" label="I accept the license and terms" />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </q-page>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { defineComponent, onActivated } from "vue";
import { ref } from 'vue'
import { api } from "boot/axios";

export default defineComponent({
  name: "PageIndex",
  setup() {
    const $q = useQuasar()

    const tasks = ref(null);
    let selected = ref(null);
    const name = ref(null)
    const age = ref(null)
    const accept = ref(false)

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

    function createTasks() {
      let body = {
        "author_id": 0,
        "title": "string",
        "description": "string",
        "date_from": "2022-02-02T20:21:01.967Z",
        "date_to": "2022-02-02T20:21:01.967Z",
        "priority": "string",
        "type": "string",
        "connected_tasks": 0
      }




      api
        .post("/tasks/add", body)
        .then((res) => {
          // tasks.value = res.data
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

    function selectUser(uuid) {
      if (selected.value == null) {
        selected.value = uuid;
      } else if (selected.value !== uuid) {
        selected.value = uuid;
      } else {
        selected.value = null;
      }
    }

    function deleteUser(uuid) {
      $q.dialog({
        title: "Confirm",
        message: "Really delete?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        $q.notify("User deleted");
        // store.dispatch("userModule/loadUsers");
      });
    }

    function editUser(uuid) {
      console.log(uuid);
    }

    onActivated(() => {
      fetchTasks
    });

    return {
      slide: ref(1),
      fullscreen: ref(false),
      dense: ref(false),
      name,
      age,
      tasks,
      selected,
      accept,
      fetchTasks,
      createTasks,
      selectUser,
      editUser,
      deleteUser



    };
  },
});
</script>
