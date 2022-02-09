<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs>
          <q-breadcrumbs-el icon="home" to="/" />
          <q-breadcrumbs-el label="Tasks" icon="add_task" to="/tasks" />
          <q-breadcrumbs-el label="Add" icon="add" />
        </q-breadcrumbs>
      </div>

      <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">
        {{ $t("Tasks") }}
        <q-toggle size="xs" v-model="dense" />
      </h5>

      <!-- QFORM -->

      <q-form
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        class="q-gutter-md"
        @submit="submit"
      >
        <q-input
          outlined
          :dense="dense"
          v-model="taskTitle"
          :disable="isLoading"
          :label="$t('Task name')"
        />
        <q-input
          outlined
          :dense="dense"
          type="textarea"
          v-model="taskDescription"
          :disable="isLoading"
          :label="$t('Task description')"
        />

        <!-- From -->
        <q-input filled v-model="date" label="Początek">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- To -->
        <q-input filled v-model="date" label="Zakończenie">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- Priority -->
        <!-- <p>Priorytet</p>
        <div class="q-gutter-sm">
          <q-radio v-model="shape" val="line" label="Niski" />
          <q-radio v-model="shape" val="rectangle" label="Średni" />
          <q-radio v-model="shape" val="ellipse" label="Wysoki" />
        </div>-->

        <!-- User -->
        <q-select
          filled
          v-model="model"
          use-input
          use-chips
          input-debounce="0"
          label="Użytkownik"
          :options="options"
          @filter="filterFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No results</q-item-section>
            </q-item>
          </template>
        </q-select>

        <div>
          <q-btn
            label="Submit"
            type="submit"
            color="primary"
            :loading="isLoading"
            :disable="isLoading"
          />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </q-page>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { defineComponent, onActivated, ref } from "vue";
import { useField, useForm } from "vee-validate";
import { DateTime } from 'luxon';
import { useRoute } from "vue-router";
import { object, string } from 'yup'
import { api } from "boot/axios";

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);
let date = ref('2019-02-01 12:44');

const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]

export default defineComponent({
  name: "PageTodo",
  setup() {
    const options = ref(stringOptions)
    const $q = useQuasar()

    const tasks = ref(null);
    const route = useRoute();
    let taskUuid = ref(route.params.uuid);
    let taskDetails = ref(null);

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

    // -------------- Form --------------

    const { resetForm } = useForm();

    const validationSchema = object({
      taskTitle: string().required(),
      taskDescription: string().required('A cool description is required').min(3),
    })


    const { handleSubmit, errors } = useForm({
      validationSchema
    })

    const { value: taskTitle } = useField('taskTitle')
    const { value: taskDescription } = useField('taskDescription')


    const submit = handleSubmit(values => {
      isLoading.value = true;
      console.log('submit', values);

      let data = {
        "author_id": 0,
        "title": taskTitle.value,
        "description": taskDescription.value,
        "date_from": new Date().toISOString(),
        "date_to": "2022-02-02T20:21:01.967Z",
        "priority": "string",
        "type": "string",
        "connected_tasks": 0
      }

      console.log(data)
      createTasks(data);
    })

    // --------------- Form --------------

    function createTasks(body) {
      isLoading.value = true;
      api
        .post("/tasks/add", body)
        .then((res) => {
          console.log(res.data);
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

    function getDetails(uuid) {
      api
        .get("/tasks/" + uuid)
        .then((res) => {
          console.log(uuid);
          console.log(res.data);
          taskDetails.value = res.data
          taskTitle.value = res.data.title
          taskDescription.value = res.data.description
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

    onActivated(() => {
      taskDetails.value = null; // Why? if not present data is fetched only once
      if (route.params.uuid != null)
        getDetails(route.params.uuid)
    });


    return {
      date,
      model: ref(null),
      options,

      filterFn(val, update, abort) {
        // call abort() at any time if you can't retrieve data somehow

        setTimeout(() => {
          update(() => {
            if (val === '') {
              options.value = stringOptions
            }
            else {
              const needle = val.toLowerCase()
              options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
            }
          })
        }, 500)
      },

      errors,
      isLoading,
      isSuccess,
      errorMsg,
      dense: ref(false),
      taskTitle,
      taskDescription,
      timeAgo,
      submit,
    };
  },
});
</script>
