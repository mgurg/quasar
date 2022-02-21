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

            <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">{{ $t("Tasks") }}</h5>

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
                    v-model="taskTitle"
                    :disable="isLoading"
                    :error="!!errors.taskTitle"
                    :error-message="errors.taskTitle"
                    :label="$t('Task name')"
                />
                <q-input
                    outlined
                    type="textarea"
                    v-model="taskDescription"
                    :disable="isLoading"
                    :error="!!errors.taskDescription"
                    :error-message="errors.taskDescription"
                    :label="$t('Task description')"
                />

                <!-- User -->
                <q-select
                    outlined
                    v-model="taskOwner"
                    use-input
                    use-chips
                    label="Użytkownik"
                    :error="!!errors.taskOwner"
                    :error-message="errors.taskOwner"
                    :options="usersList"
                    emit-value
                    map-options
                >
                    <!-- <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No results</q-item-section>
            </q-item>
                    </template>-->
                </q-select>

                <!-- Planned / Priority -->
                <div class="row justify-around">
                    <div class="col-8">
                        <q-toggle v-model="planned" icon="alarm">Zaplanuj</q-toggle>
                    </div>
                    <div class="auto"></div>
                    <div class="col-2">
                        <q-btn flat icon="priority_high" />
                    </div>
                </div>

                <!-- From -->
                <q-input
                    outlined
                    v-model="dateFrom"
                    :error="!!errors.dateFrom"
                    :error-message="errors.dateFrom"
                    label="Początek"
                    v-if="planned"
                >
                    <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="dateFrom" mask="YYYY-MM-DD HH:mm">
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
                                <q-time v-model="dateFrom" mask="YYYY-MM-DD HH:mm" format24h>
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                </q-time>
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>

                <!-- To -->
                <q-input outlined v-model="dateTo" label="Zakończenie" v-if="planned">
                    <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="dateTo" mask="YYYY-MM-DD HH:mm">
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
                                <q-time v-model="dateTo" mask="YYYY-MM-DD HH:mm" format24h>
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                </q-time>
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>

                <!-- Repeat -->
                <q-toggle v-model="cyclic" icon="alarm" v-if="planned">Cyklicznie</q-toggle>
                <div v-if="cyclic">
                <q-btn-group outline color="primary">
                    <q-btn outline label="daily" />
                    <q-btn outline label="weekly" />
                    <q-btn outline label="montly" />
                    <q-btn outline label="yearly" />
                </q-btn-group>

                <q-input type="number"  style="max-width: 200px" />

                <div class="q-pa-md">
                    <div class="q-gutter-sm">
                        <q-checkbox label="Pon" />
                        <q-checkbox label="Wt" />
                        <q-checkbox label="Śr" />
                        <q-checkbox label="Czw" />
                        <q-checkbox label="Pt" />
                        <q-checkbox label="So" />
                        <q-checkbox label="Nie" />
                    </div>
                </div>
</div>
                <div>
                    <q-btn
                        label="Submit"
                        type="submit"
                        color="primary"
                        @click="submit"
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
// import { object, string, date } from 'yup'
import * as yup from 'yup';
import { api } from "boot/axios";

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);
let planned = ref(false);
let cyclic = ref(false);

const now = new Date()
let dateFrom = ref(new Date(new Date().setHours(new Date().getHours() + 1)).toLocaleString());
let dateTo = ref(new Date(new Date().setHours(new Date().getHours() + 2)).toLocaleString());

export default defineComponent({
    name: "TaskAdd",
    setup() {
        const $q = useQuasar()

        const tasks = ref(null);
        let usersList = ref(null);

        // -------------- Form --------------

        const { resetForm } = useForm();

        const validationSchema = yup.object({
            taskTitle: yup.string().required(),
            taskDescription: yup.string().required('A cool description is required').min(3),
            taskOwner: yup.string().nullable(),
            taskDateFrom: yup.string(),//yup.date(),
            taskDateTo: yup.string(),//yup.date().min(yup.ref('taskDateFrom')),
        })


        const { handleSubmit, errors } = useForm({
            validationSchema
        })

        const { value: taskTitle } = useField('taskTitle')
        const { value: taskDescription } = useField('taskDescription')
        const { value: taskOwner } = useField('taskOwner')
        const { value: taskDateFrom } = useField('taskDateFrom', undefined, { initialValue: dateFrom.value })
        const { value: taskDateTo } = useField('taskDateTo', undefined, { initialValue: dateTo.value })


        const submit = handleSubmit(values => {
            isLoading.value = true;
            console.log('submit', values);

            let from = null;
            let to = null;
            let userName = null;
            if (planned.value == true) {
                from = dateFrom.value;
                to = dateTo.value;
            }

            if (typeof (taskOwner.value) != 'undefined' || taskOwner.value != null) {
                userName = taskOwner.value;
            }


            let data = {
                "author_id": 0,
                "title": taskTitle.value,
                "description": taskDescription.value,
                "date_from": from,
                "date_to": to,
                "priority": "string",
                "type": "string",
                "connected_tasks": 0,
                "user": userName
            }

            console.log(data)
            //   createTasks(data);
        })

        // --------------- Form --------------

        function createTasks(body) {
            // isLoading.value = true;
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

        function getUsers() {
            api
                .get("user/index")
                .then((res) => {
                    console.log(res.data)

                    usersList.value = res.data.map((opt) => ({
                        label: opt.first_name + ' ' + opt.last_name,
                        value: opt.uuid,
                    }));

                    console.log(usersList.value);
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
            isLoading.value = true;
            getUsers();
            isLoading.value = false;
        });


        return {
            dateFrom,
            dateTo,
            errors,
            isLoading,
            isSuccess,
            errorMsg,
            usersList,
            taskTitle,
            taskDescription,
            taskDateTo,
            taskDateFrom,
            planned,
            cyclic,
            taskOwner,
            submit,
        };
    },
});
</script>