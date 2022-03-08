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
                <q-radio keep-color v-model="taskColor" val="teal" color="teal" />
                <q-radio keep-color v-model="taskColor" val="orange" color="orange" />
                <q-radio keep-color v-model="taskColor" val="red" color="red" />
                <q-radio keep-color v-model="taskColor" val="cyan" color="cyan" />
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
            <q-btn :label="buttonText" type="submit" color="primary" @click="submit" />
            <!-- <q-btn :label="buttonText" type="submit" color="primary" @click="signUpButtonPressed" /> -->
        </q-form>
    </div>
</template>


// https://github.com/guoqunbo8899/vue3_cms/blob/2ecaf7fcae4d548de6582e49efb7998bbca79681/src/components/page-search/src/page-search.vue
// https://www.youtube.com/watch?v=9whgkjxoCME


<script>
import { defineComponent, reactive, ref } from "vue";
import { useField, useForm } from "vee-validate";
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
                    color: 'red'
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
        let task = reactive({
            color: "",
            name: "AAA",
            email: "",
            phone: "",
            password: "",
        });


        // -------------- Form --------------

        const { resetForm } = useForm();

        const validationSchema = yup.object({
            taskTitle: yup.string().required(),
            taskDescription: yup.string().required('A cool description is required').min(3),
            taskColor: yup.string().required(),
            // taskOwner: yup.string().nullable(),
            // taskDateFrom: yup.string().test(
            //     "check-startdate",
            //     "Start Date should not be later than current date",
            //     function (value) {
            //         if (DateTime.now().toFormat(dtFormat.value) >= DateTime.fromFormat(value, dtFormat.value)) {
            //             return false;
            //         } else {
            //             return true;
            //         }
            //     }
            // ),
            // // yup.date().transform(parseDateString).typeError('Start field must be later than now').min(DateTime.now()), // yup.string()
            // taskDateTo: yup.string().test(
            //     "check-startdate",
            //     "Start Date should not be later than current date",
            //     function (value) {
            //         if (DateTime.now().toFormat(dtFormat.value) >= DateTime.fromFormat(value, dtFormat.value)) {
            //             return false;
            //         } else {
            //             return true;
            //         }
            //     }
            // ),
        })


        const { handleSubmit, errors } = useForm({
            validationSchema
        })

        const { value: taskTitle } = useField('taskTitle', undefined, { initialValue: props.tasks.title })
        const { value: taskDescription } = useField('taskDescription', undefined, { initialValue: props.tasks.desc })
        const { value: taskColor } = useField('taskColor', undefined, { initialValue: props.tasks.color })
        // const { value: taskOwner } = useField('taskOwner')
        // const { value: taskDateFrom } = useField('taskDateFrom', undefined, { initialValue: initDateFrom.value })
        // const { value: taskDateTo } = useField('taskDateTo', undefined, { initialValue: initDateTo.value })

        // taskTitle.value = props.invoice.scheduledAt;
        // taskDescription.value = props.invoice.isPaid;
        // taskColor.value = props.invoice.isReceived;

        const submit = handleSubmit(values => {
            // isLoading.value = true;


            // let userName = null;

            // if (typeof (taskOwner.value) != 'undefined' || taskOwner.value != null) {
            //     userName = taskOwner.value;
            // }


            let data = {
                "author_id": 0,
                "title": taskTitle.value,
                "description": taskDescription.value,
                "color": taskColor.value,
                // "priority": "string",
                // "type": "string",
                // "user": userName,
                // "all_day": allDay.value,
                // "recurring": (mode.value == 'cyclic')
            }

            // if (mode.value == 'planned' || mode.value == 'cyclic') {
            //     data.date_from = DateTime.fromFormat(taskDateFrom.value, dtFormat.value, 'Europe/Warsaw').toISO();
            //     data.date_to = DateTime.fromFormat(taskDateTo.value, dtFormat.value, 'Europe/Warsaw').toISO();
            //     data.all_day = allDay.value
            // }

            // if (mode.value == 'cyclic') {
            //     data.reccuring = true
            //     data.interval = interval.value
            //     data.freq = freq.value
            //     data.at_Mo = weekDays.value.includes('Mo')
            //     data.at_Tu = weekDays.value.includes('Tu')
            //     data.at_We = weekDays.value.includes('We')
            //     data.at_Th = weekDays.value.includes('Th')
            //     data.at_Fr = weekDays.value.includes('Fr')
            //     data.at_Sa = weekDays.value.includes('Sa')
            //     data.at_Su = weekDays.value.includes('Su')
            // }

            console.log('submit');
            console.log(data)
            // createTasks(data);
            emit('taskFormBtnClick', data)
        })

        // --------------- Form --------------


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
            task,
            signUpButtonPressed,
            submit
        };
    }

});
</script>