<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">
        {{ $t("Tasks") }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <q-btn size="xs" @click="fetchTasks"></q-btn>
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
        <q-input filled v-model="date" label="Pocczątek">
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
          @filter-abort="abortFilterFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No results</q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- Files -->
        <div class="q-pa-md" style="max-width: 300px">
          <q-uploader url="http://localhost:4444/upload" label="Files" multiple>
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
        </div>

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
import { defineComponent, onActivated, ref } from "vue";
import { useField, useForm } from "vee-validate";
import { DateTime } from 'luxon';
import { object, string } from 'yup'
import { api } from "boot/axios";

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);

const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]

export default defineComponent({
  name: "PageTodo",
  setup() {
    const options = ref(stringOptions)
    const $q = useQuasar()

    const tasks = ref(null);
    let selected = ref(null);

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
      // isLoading.value = true;
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




    return {
      date: ref('2019-02-01 12:44'),
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
      tasks,
      selected,
      timeAgo,
      submit,
    };
  },
});
</script>
