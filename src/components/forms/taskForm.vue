<template>
    <div>
        <!-- https://github.com/einnar82/ionic-vue-composition/blob/f7d0dab39d803bb5fe801af3b4696f3fcbd0af73/src/components/memories/MemoryForm.vue -->
        <!-- https://www.thisdot.co/blog/vue-3-2-using-composition-api-with-script-setup -->
        <!-- https://github.com/tuchongyang/evue-schema-form/blob/1a024ff4c9fbb34596277bd02902052aaecfa577/src/components/SchemaForm/components/schema-form-input.vue -->
        <!-- form emit defineComponent -->
        <h5 class="q-mb-sm q-mt-sm q-mb-sm q-ml-md">{{ $t("Tasks") }}</h5>
        <q-form
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
            class="q-gutter-md"
            @submit.prevent
        >
            <div class="q-gutter-sm">
                <span>Color:</span>
                <span>
                    <q-radio keep-color v-model="taskColor" val="teal" color="teal" />
                </span>
                <span>
                    <q-radio keep-color v-model="taskColor" val="orange" color="orange" />
                </span>
                <span>
                    <q-radio keep-color v-model="taskColor" val="red" color="red" />
                </span>
                <span>
                    <q-radio keep-color v-model="taskColor" val="cyan" color="cyan" />
                </span>
            </div>
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
                v-model="taskAssignee"
                use-input
                use-chips
                label="Użytkownik"
                :error="!!errors.taskAssignee"
                :error-message="errors.taskAssignee"
                :options="users"
                emit-value
                map-options
            />

            <!-- Planned / Priority -->
            <div class="row sm-gutter">
                <div class="q-pa-xs col-xs-12 col-sm-6">
                    Priorytet:
                    <q-btn-toggle
                        v-model="taskPriority"
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
                        v-model="taskMode"
                        class="my-custom-toggle"
                        no-caps
                        unelevated
                        toggle-color="primary"
                        color="white"
                        text-color="primary"
                        :options="[
                            { label: 'Zwykłe', value: 'task', disabled: false },
                            { label: 'Planowane', value: 'planned', disabled: false },
                            { label: 'Cykliczne', value: 'cyclic', disabled: taskAllDay }
                        ]"
                    />
                </div>
            </div>

            <!-- TimeFrom - TimeTo -->

            <div class="row sm-gutter" v-if="taskMode != 'task'">
                <div class="q-pa-xs col-xs-12 col-sm-6">
                    <!-- From -->
                    <q-input
                        outlined
                        v-model="taskDateFrom"
                        :error="!!errors.taskDateFrom"
                        :error-message="errors.taskDateFrom"
                        label="Początek"
                        v-if="taskMode != 'task'"
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
                                            <q-btn label="Cancel" color="red" flat v-close-popup />
                                            <q-btn v-close-popup label="Select" color="green" flat />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>

                        <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer" v-if="!taskAllDay">
                                <q-popup-proxy
                                    cover
                                    transition-show="scale"
                                    transition-hide="scale"
                                >
                                    <q-time v-model="taskDateFrom" :mask="qDtFormat" format24h>
                                        <div class="row items-center justify-end">
                                            <q-btn label="Cancel" color="black" flat v-close-popup />
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
                        v-if="taskMode != 'task'"
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
                            <q-icon name="access_time" class="cursor-pointer" v-if="!taskAllDay">
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
                    <q-checkbox v-model="taskAllDay" @click="allDaySwitch" label="Cały dzień" />
                </div>

                <!-- 
                        <div class="q-pa-xs col-xs-12 col-sm-6">
         
                        </div>
                        <div class="q-pa-xs col-xs-12 col-sm-6">
         
                        </div>
                -->

                <!-- Repeat at -->
                <div class="q-pa-md" v-if="taskMode == 'cyclic' && taskAllDay != true">
                    <q-btn-toggle
                        v-model="taskFreq"
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
                            v-model.number="taskInterval"
                            dense
                            type="number"
                            label="Interval "
                            outlined
                        />
                    </div>
                    <!-- days -->

                    <div class="q-gutter-sm" v-if="taskFreq == 'weekly'">
                        <input type="checkbox" id="mo" v-model="taskWeekDays" value="Mo" />&nbsp;&nbsp;
                        <label for="mo">Pon</label>
                        <input type="checkbox" id="tu" v-model="taskWeekDays" value="Tu" />&nbsp;&nbsp;
                        <label for="tu">Wt</label>
                        <input type="checkbox" id="we" v-model="taskWeekDays" value="We" />&nbsp;&nbsp;
                        <label for="we">Śr</label>
                        <input type="checkbox" id="th" v-model="taskWeekDays" value="Th" />&nbsp;&nbsp;
                        <label for="th">Cz</label>
                        <input type="checkbox" id="fr" v-model="taskWeekDays" value="Fr" />&nbsp;&nbsp;
                        <label for="fr">Pt</label>
                        <input type="checkbox" id="sa" v-model="taskWeekDays" value="Sa" />&nbsp;&nbsp;
                        <label for="sa">So</label>
                        <input type="checkbox" id="su" v-model="taskWeekDays" value="Su" />&nbsp;&nbsp;
                        <label for="su">Ni</label>
                    </div>
                </div>
            </div>

            <q-btn type="submit" color="primary" @click="submit">{{ $t(buttonText) }}</q-btn>
            <!-- <q-btn :label="buttonText" type="submit" color="primary" @click="signUpButtonPressed" /> -->
        </q-form>
    </div>
</template>


// https://github.com/guoqunbo8899/vue3_cms/blob/2ecaf7fcae4d548de6582e49efb7998bbca79681/src/components/page-search/src/page-search.vue
// https://www.youtube.com/watch?v=9whgkjxoCME


<script>
import { defineComponent, reactive, ref } from "vue";
import { useField, useForm } from "vee-validate";
import { DateTime } from 'luxon';
import * as yup from 'yup';

export default defineComponent({
    name: "TaskForm",
    props: {
        tasks: {
            type: Object,
            // Object or array defaults must be returned from
            // a factory function
            default() {
                return {
                    title: '',
                    desc: '',
                    color: 'red',
                    user: null,
                    priority: '',
                    mode: 'task',
                    dtFormat: 'yyyy-MM-dd HH:mm',
                    dateFrom: DateTime.now().setZone('Europe/Warsaw').plus({ minutes: 15 }).toFormat('yyyy-MM-dd HH:mm'),
                    dateTo: DateTime.now().setZone('Europe/Warsaw').plus({ minutes: 60 }).toFormat('yyyy-MM-dd HH:mm'),
                    allDay: true,
                    interval: 1,
                    freq: "weekly",
                    weekDays: null,

                }
            }
        },
        usersList: {
            type: Object,
            default() {
                return {
                    label: null,
                    value: null,
                }
            }
        },

        buttonText: {
            type: String,
            default: 'Save',
        },
    },

    emits: ['taskFormBtnClick'],



    setup(props, { emit }) {
        let isError = ref(false);
        let isLoading = ref(false);
        let users = ref(props.usersList);
        let dtFormat = ref('yyyy-MM-dd HH:mm')
        let qDtFormat = ref('YYYY-MM-DD HH:mm')
        let initDateFrom = ref(DateTime.now().setZone('Europe/Warsaw').plus({ minutes: 15 }).toFormat(dtFormat.value));
        let initDateTo = ref(DateTime.now().setZone('Europe/Warsaw').plus({ minutes: 60 }).toFormat(dtFormat.value));

        function getUsers() {
            api
                .get("user/index")
                .then((res) => {
                    console.log(res.data)

                    return res.data.map((opt) => ({
                        label: opt.first_name + ' ' + opt.last_name,
                        value: opt.uuid,
                    }));

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

        const { resetForm } = useForm();

        const validationSchema = yup.object({
            taskColor: yup.string().required(),
            taskTitle: yup.string().required(),
            taskDescription: yup.string().required('A cool description is required').min(3),
            taskAssignee: yup.string().nullable(),
            taskPriority: yup.string().nullable(),
            taskMode: yup.string().nullable(),
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
            taskAllDay: yup.bool().required(),
            taskInterval: yup.number().nullable(),
            taskFreq: yup.string().nullable(),
            taskWeekDays: yup.array().nullable(),
        })


        const { handleSubmit, errors } = useForm({
            validationSchema
        })

        const { value: taskTitle } = useField('taskTitle', undefined, { initialValue: props.tasks.title })
        const { value: taskDescription } = useField('taskDescription', undefined, { initialValue: props.tasks.desc })
        const { value: taskColor } = useField('taskColor', undefined, { initialValue: props.tasks.color })
        const { value: taskAssignee } = useField('taskAssignee', undefined, { initialValue: props.tasks.user })
        const { value: taskPriority } = useField('taskPriority', undefined, { initialValue: props.tasks.priority })
        const { value: taskMode } = useField('taskMode', undefined, { initialValue: props.tasks.mode })
        const { value: taskDateFrom } = useField('taskDateFrom', undefined, { initialValue: initDateFrom.value })
        const { value: taskDateTo } = useField('taskDateTo', undefined, { initialValue: initDateTo.value })
        const { value: taskAllDay } = useField('taskAllDay', undefined, { initialValue: props.tasks.allDay })
        const { value: taskInterval } = useField('taskInterval', undefined, { initialValue: props.tasks.interval })
        const { value: taskFreq } = useField('taskFreq', undefined, { initialValue: props.tasks.freq })
        const { value: taskWeekDays } = useField('taskWeekDays', undefined, { initialValue: props.tasks.weekDays })
        // taskTitle.value = props.invoice.scheduledAt;
        // taskDescription.value = props.invoice.isPaid;
        // taskColor.value = props.invoice.isReceived;

        const submit = handleSubmit(values => {
            // isLoading.value = true;


            // let userName = null;

            // if (typeof (taskAssignee.value) != 'undefined' || taskAssignee.value != null) {
            //     userName = taskAssignee.value;
            // }


            let data = {
                "author_id": 0,
                "color": taskColor.value,
                "title": taskTitle.value,
                "description": taskDescription.value,
                "user": taskAssignee.value,
                "priority": taskPriority.value,
                "mode": taskMode.value,
                "recurring": (taskMode.value == 'cyclic')
            }

            if (taskMode.value == 'planned' || taskMode.value == 'cyclic') {
                data.date_from = DateTime.fromFormat(taskDateFrom.value, dtFormat.value, 'Europe/Warsaw').toISO();
                data.date_to = DateTime.fromFormat(taskDateTo.value, dtFormat.value, 'Europe/Warsaw').toISO();
                data.all_day = taskAllDay.value;
            }

            if (taskMode.value == 'cyclic') {
                data.reccuring = true
                data.interval = taskInterval.value
                data.freq = taskFreq.value
                data.at_Mo = taskWeekDays.value.includes('Mo')
                data.at_Tu = taskWeekDays.value.includes('Tu')
                data.at_We = taskWeekDays.value.includes('We')
                data.at_Th = taskWeekDays.value.includes('Th')
                data.at_Fr = taskWeekDays.value.includes('Fr')
                data.at_Sa = taskWeekDays.value.includes('Sa')
                data.at_Su = taskWeekDays.value.includes('Su')
            }

            console.log('submit');
            console.log(data)
            // createTasks(data);
            emit('taskFormBtnClick', data)
        })

        // --------------- Form --------------

        function allDaySwitch(inputDate) {
            taskMode.value = 'planned';
            if (taskAllDay.value == true) {
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

        const signUpButtonPressed = () => {

            emit('taskFormBtnClick', task)
            // console.log(task);
        };


        return {

            errors,
            isError,
            isLoading,
            taskColor,
            taskTitle,
            taskDescription,
            taskAssignee,
            users,
            taskPriority,
            taskMode,
            taskDateFrom,
            taskDateTo,
            taskAllDay,
            taskInterval,
            taskFreq,
            taskWeekDays,
            signUpButtonPressed,
            submit,
            allDaySwitch
        };
    }

});
</script>