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
            <!-- <v-swatches v-model="color" inline></v-swatches> -->
            <div class="q-gutter-sm">
                <q-radio keep-color v-model="color" val="teal" color="teal" />
                <q-radio keep-color v-model="color" val="orange" color="orange" />
                <q-radio keep-color v-model="color" val="red" color="red" />
                <q-radio keep-color v-model="color" val="cyan" color="cyan" />
            </div>
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
                <div class="row sm-gutter">
                    <div class="q-pa-xs col-xs-12 col-sm-6">
                        Priorytet:
                        <q-btn-toggle
                            v-model="priority"
                            class="my-custom-toggle"
                            no-caps
                            unelevated
                            toggle-color="primary"
                            color="white"
                            text-color="primary"
                            :options="[
                                { label: '', value: 'low', icon: 'info' },
                                { label: '', value: 'medium', icon: 'warning' },
                                { label: '', value: 'high', icon: 'error' }
                            ]"
                        />
                    </div>
                    <div class="q-pa-xs col-xs-12 col-sm-6">
                        Rodzaj
                        <q-btn-toggle
                            v-model="mode"
                            class="my-custom-toggle"
                            no-caps
                            unelevated
                            toggle-color="primary"
                            color="white"
                            text-color="primary"
                            :options="[
                                { label: 'Zwykłe', value: 'task', disabled: false },
                                { label: 'Planowane', value: 'planned', disabled: false },
                                { label: 'Cykliczne', value: 'cyclic', disabled: allDay }
                            ]"
                        />
                    </div>
                </div>

                <!--  -->

                <div class="row sm-gutter" v-if="mode != 'task'">
                    <div class="q-pa-xs col-xs-12 col-sm-6">
                        <!-- From -->
                        <q-input
                            outlined
                            v-model="taskDateFrom"
                            :error="!!errors.taskDateFrom"
                            :error-message="errors.taskDateFrom"
                            label="Początek"
                            v-if="mode != 'task'"
                        >
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy
                                        cover
                                        transition-show="scale"
                                        transition-hide="scale"
                                    >
                                        <q-date v-model="taskDateFrom" :mask="qDtFormat">
                                            <div class="row items-center justify-end">
                                                <q-btn
                                                    label="Cancel"
                                                    color="red"
                                                    flat
                                                    v-close-popup
                                                />
                                                <q-btn
                                                    v-close-popup
                                                    label="Select"
                                                    color="green"
                                                    flat
                                                />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>

                            <template v-slot:append>
                                <q-icon name="access_time" class="cursor-pointer" v-if="!allDay">
                                    <q-popup-proxy
                                        cover
                                        transition-show="scale"
                                        transition-hide="scale"
                                    >
                                        <q-time v-model="taskDateFrom" :mask="qDtFormat" format24h>
                                            <div class="row items-center justify-end">
                                                <q-btn
                                                    label="Cancel"
                                                    color="black"
                                                    flat
                                                    v-close-popup
                                                />
                                                <q-btn
                                                    v-close-popup
                                                    label="Close"
                                                    color="primary"
                                                    flat
                                                />
                                            </div>
                                        </q-time>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                    </div>
                    <div class="q-pa-xs col-xs-12 col-sm-6">
                        <!-- To -->
                        <q-input
                            outlined
                            v-model="taskDateTo"
                            :error="!!errors.taskDateTo"
                            :error-message="errors.taskDateTo"
                            label="Zakończenie"
                            v-if="mode != 'task'"
                        >
                            <!-- :rules="[value => value > dateFrom || 'Must be greather then date from']" -->
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                    <q-popup-proxy
                                        cover
                                        transition-show="scale"
                                        transition-hide="scale"
                                    >
                                        <q-date v-model="taskDateTo" :mask="qDtFormat">
                                            <div class="row items-center justify-end">
                                                <q-btn
                                                    v-close-popup
                                                    label="Close"
                                                    color="primary"
                                                    flat
                                                />
                                            </div>
                                        </q-date>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>

                            <template v-slot:append>
                                <q-icon name="access_time" class="cursor-pointer" v-if="!allDay">
                                    <q-popup-proxy
                                        cover
                                        transition-show="scale"
                                        transition-hide="scale"
                                    >
                                        <q-time v-model="taskDateTo" :mask="qDtFormat" format24h>
                                            <div class="row items-center justify-end">
                                                <q-btn
                                                    v-close-popup
                                                    label="Close"
                                                    color="primary"
                                                    flat
                                                />
                                            </div>
                                        </q-time>
                                    </q-popup-proxy>
                                </q-icon>
                            </template>
                        </q-input>
                    </div>
                    <div class="col-12">
                        <q-checkbox
                            v-model="allDay"
                            val="Tu"
                            @click="allDaySwitch"
                            label="Cały dzień"
                        />
                    </div>

                    <!-- 
                        <div class="q-pa-xs col-xs-12 col-sm-6">
         
                        </div>
                        <div class="q-pa-xs col-xs-12 col-sm-6">
         
                        </div>
                    -->

                    <!-- Repeat at -->
                    <div class="q-pa-md" v-if="mode == 'cyclic' && allDay != true">
                        <q-btn-toggle
                            v-model="freq"
                            class="my-custom-toggle"
                            no-caps
                            unelevated
                            toggle-color="primary"
                            color="white"
                            text-color="primary"
                            :options="[
                                { label: 'Daily', value: 'daily' },
                                { label: 'Weekly', value: 'weekly' },
                                { label: 'Monthly', value: 'monthly' },
                                { label: 'Yearly', value: 'yearly' }
                            ]"
                        />

                        <!-- interval -->
                        <div class="q-pa-md">
                            <q-input
                                v-model.number="interval"
                                dense
                                type="number"
                                label="Interval "
                                outlined
                            />
                        </div>
                        <!-- days -->

                        <div class="q-gutter-sm" v-if="freq == 'weekly'">
                            <input type="checkbox" id="mo" v-model="weekDays" value="Mo" />&nbsp;&nbsp;
                            <label for="mo">Pon</label>
                            <input type="checkbox" id="tu" v-model="weekDays" value="Tu" />&nbsp;&nbsp;
                            <label for="tu">Wt</label>
                            <input type="checkbox" id="we" v-model="weekDays" value="We" />&nbsp;&nbsp;
                            <label for="we">Śr</label>
                            <input type="checkbox" id="th" v-model="weekDays" value="Th" />&nbsp;&nbsp;
                            <label for="th">Cz</label>
                            <input type="checkbox" id="fr" v-model="weekDays" value="Fr" />&nbsp;&nbsp;
                            <label for="fr">Pt</label>
                            <input type="checkbox" id="sa" v-model="weekDays" value="Sa" />&nbsp;&nbsp;
                            <label for="sa">So</label>
                            <input type="checkbox" id="su" v-model="weekDays" value="Su" />&nbsp;&nbsp;
                            <label for="su">Ni</label>
                        </div>
                    </div>
                </div>

                <!--  -->

                <div>
                    <q-btn label="Submit" type="submit" color="primary" @click="submit" />
                    <!-- :loading="isLoading"
                    :disable="isLoading"-->
                    <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
            </q-form>
        </q-page>
    </div>
</template>


<script>
import { useQuasar } from 'quasar'
import { defineComponent, onActivated, ref } from "vue";
import { DateTime } from 'luxon';
import VSwatches from 'vue3-swatches'

import { useField, useForm } from "vee-validate";
// import { object, string, date } from 'yup'
import * as yup from 'yup';
import { api } from "boot/axios";

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let errorMsg = ref(null);
let planned = ref(false);
let mode = ref('task');
let priority = ref(null);
let allDay = ref(false);
let freq = ref('daily');
let interval = ref('1');
let weekDays = ref([]);
let dtFormat = ref('yyyy-MM-dd HH:mm')
let qDtFormat = ref('YYYY-MM-DD HH:mm')
let color = ref('teal')

let initDateFrom = ref(DateTime.now().setZone('Europe/Warsaw').plus({ minutes: 15 }).toFormat(dtFormat.value));
let initDateTo = ref(DateTime.now().setZone('Europe/Warsaw').plus({ minutes: 60 }).toFormat(dtFormat.value));

export default defineComponent({
    name: "TaskAdd",
    components: {
        // VSwatches,
    },
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
            taskDateFrom: yup.string().test(
                "check-startdate",
                "Start Date should not be later than current date",
                function (value) {
                    if (DateTime.now().toFormat(dtFormat.value) >= DateTime.fromFormat(value, dtFormat.value)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            ),
            // yup.date().transform(parseDateString).typeError('Start field must be later than now').min(DateTime.now()), // yup.string()
            taskDateTo: yup.string().test(
                "check-startdate",
                "Start Date should not be later than current date",
                function (value) {
                    if (DateTime.now().toFormat(dtFormat.value) >= DateTime.fromFormat(value, dtFormat.value)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            ),
        })


        const { handleSubmit, errors } = useForm({
            validationSchema
        })

        const { value: taskTitle } = useField('taskTitle')
        const { value: taskDescription } = useField('taskDescription')
        const { value: taskOwner } = useField('taskOwner')
        const { value: taskDateFrom } = useField('taskDateFrom', undefined, { initialValue: initDateFrom.value })
        const { value: taskDateTo } = useField('taskDateTo', undefined, { initialValue: initDateTo.value })


        const submit = handleSubmit(values => {
            isLoading.value = true;


            let userName = null;

            if (typeof (taskOwner.value) != 'undefined' || taskOwner.value != null) {
                userName = taskOwner.value;
            }


            let data = {
                "author_id": 0,
                "title": taskTitle.value,
                "description": taskDescription.value,
                "color": color.value,
                "priority": "string",
                "type": "string",
                "user": userName,
                "all_day": allDay.value,
                "recurring": (mode.value == 'cyclic')
            }

            if (mode.value == 'planned' || mode.value == 'cyclic') {
                data.date_from = DateTime.fromFormat(taskDateFrom.value, dtFormat.value, 'Europe/Warsaw').toISO();
                data.date_to = DateTime.fromFormat(taskDateTo.value, dtFormat.value, 'Europe/Warsaw').toISO();
                data.allDay = allDay.value
            }

            if (mode.value == 'cyclic') {
                data.reccuring = true
                data.interval = interval.value
                data.freq = freq.value
                data.at_Mo = weekDays.value.includes('Mo')
                data.at_Tu = weekDays.value.includes('Tu')
                data.at_We = weekDays.value.includes('We')
                data.at_Th = weekDays.value.includes('Th')
                data.at_Fr = weekDays.value.includes('Fr')
                data.at_Sa = weekDays.value.includes('Sa')
                data.at_Su = weekDays.value.includes('Su')
            }

            console.log('submit');
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

        function allDaySwitch(inputDate) {
            mode.value = 'planned';
            if (allDay.value == true) {
                dtFormat.value = 'yyyy-MM-dd'
                qDtFormat.value = 'YYYY-MM-DD'

                taskDateFrom.value = DateTime.fromFormat(taskDateFrom.value, 'yyyy-MM-dd HH:mm').toFormat(dtFormat.value)
                taskDateTo.value = DateTime.fromFormat(taskDateTo.value, 'yyyy-MM-dd HH:mm').toFormat(dtFormat.value)
            } else {
                qDtFormat.value = 'YYYY-MM-DD HH:mm'
                dtFormat.value = 'yyyy-MM-dd HH:mm'

                taskDateFrom.value = DateTime.fromFormat(taskDateFrom.value, 'yyyy-MM-dd').toFormat(dtFormat.value)
                taskDateTo.value = DateTime.fromFormat(taskDateTo.value, 'yyyy-MM-dd').toFormat(dtFormat.value)
            }
        }

        // function parseDateString() {
        //     console.log('compare');
        //     var d1 = DateTime.now();
        //     var d2 = DateTime.fromISO('2017-04-01');

        //     console.log(d2 < d1); //=> true
        //     console.log(d2 > d1); //=> false

        // }

        onActivated(() => {
            isLoading.value = true;
            getUsers();
            isLoading.value = false;
        });


        return {
            errors,
            isLoading,
            isSuccess,
            errorMsg,
            usersList,
            taskTitle,
            taskDescription,
            taskDateTo,
            taskDateFrom,
            color,
            planned,
            allDay,
            qDtFormat,
            // parseDateString,
            priority,
            mode,
            freq,
            interval,
            weekDays,
            taskOwner,
            allDaySwitch,
            submit,
        };
    },
});
</script>

<style lang="scss"  scoped>
input[type="checkbox"] {
    display: none;
}

input[type="checkbox"] + label {
    color: #ccc;
    cursor: pointer;
}

input[type="checkbox"]:checked + label {
    color: #333;
    font-weight: bold;
}

// .q-checkbox{
//   &::v-deep {
//     .q-checkbox__inner {
//       display: ntask;
//     }

//   }
// }
</style>