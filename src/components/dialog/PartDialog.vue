<template>
  <q-card :style="$q.platform.is.mobile ? 'width: 350px': 'width: 850px'">
    <q-card-section>
      <div class="text-h6">Dodaj część</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-form>
        <div class="row sm-gutter">
          <div class="q-pa-xs col-xs-12 col-sm-6">
            <q-input
              v-model="partName"
              :error="!!errors.partName"
              :error-message="errors.partName"
              label="nazwa"
              clearable
              debounce="300"
              outlined
            />
          </div>
          <div class="q-pa-xs col-xs-12 col-sm-6">
            <q-input
              v-model="partDescription"
              :error="!!errors.partDescription"
              :error-message="errors.partDescription"
              label="opis"
              clearable
              debounce="300"
              outlined
            />
          </div>

        </div>
        <div class="row sm-gutter">
          <div class="q-pa-xs col-xs-6 col-sm-3">
            <q-input
              v-model="partPrice"
              :error="!!errors.partPrice"
              :error-message="errors.partPrice"
              type="number"
              @update:model-value="recalculate()"
              outlined
              label="cena"
            />
          </div>
          <div class="q-pa-xs col-xs-6 col-sm-3">
            <q-input
              v-model="partQuantity"
              :error="!!errors.partQuantity"
              :error-message="errors.partQuantity"
              @update:model-value="recalculate()"
              type="number"
              outlined
              label="ilość"
            />
          </div>
          <div class="q-pa-xs col-xs-6 col-sm-3">

            <q-select
              v-model="partUnit"
              :error="!!errors.partUnit"
              :error-message="errors.partUnit"
              display-value="szt"
              :options="options"
              label="jednostka"
              outlined/>
          </div>
          <div class="q-pa-xs col-xs-6 col-sm-3">
            <q-input
              v-model="partValue"
              :error="!!errors.partValue"
              :error-message="errors.partValue"
              type="number"
              outlined
              label="wartość"
            />
          </div>
        </div>
        <div class="row q-pa-sm">
          <q-space/>
          <q-btn v-close-popup class="q-mr-lg" color="red-12" flat icon="cancel">
            {{ $t("Cancel") }}
          </q-btn>

          <q-btn color="primary" icon="done" type="submit" @click="submit">{{ $t("Save") }}</q-btn>
        </div>

      </q-form>
    </q-card-section>
  </q-card>

</template>

<script setup>
import {ref} from "vue";
import {useField, useForm} from "vee-validate";
import {object, string} from "yup";
import {errorHandler} from "components/api/errorHandler";
import {createUsedPartsRequest} from "components/api/PartApiClient";

const props = defineProps({
  issueUuid: {
    type: String,
    default: null,
  },
  // partPropName: {
  //   type: String,
  //   default: null,
  // },
  // partData: {
  //   type: Object,
  //   default() {
  //     return {
  //       "name": null,
  //       "description": null,
  //       "price": null,
  //       "quantity": null,
  //       "unit": null,
  //       "value": null
  //     };
  //   },
  // },
})

const issueUuid = ref(props.issueUuid)

const options = ref(['szt', 'l',])
const emit = defineEmits(['partFormBtnClick', 'cancelBtnClick'])


// -------------- VeeValidate --------------
const validationSchema = object({
  partName: string().nullable().required(),
  partDescription: string(),
  partPrice: string().required(),
  partQuantity: string().required(),
  partUnit: string().required(),
  partValue: string().required(),
});

const {handleSubmit, errors} = useForm({
  validationSchema,
});

const {value: partName} = useField("partName");
const {value: partDescription} = useField("partDescription");
const {value: partPrice} = useField("partPrice");
const {value: partUnit} = useField("partUnit", undefined, {initialValue: "szt"});
const {value: partQuantity} = useField("partQuantity", undefined, {initialValue: 1});
const {value: partValue} = useField("partValue");


function recalculate() {
  if (partPrice.value !== null && partQuantity.value !== null && partPrice.value !== 0 && partQuantity.value !== 0) {
    //
    partValue.value = (partPrice.value * partQuantity.value).toString()
    partValue.value = parseFloat(partValue.value).toFixed(2);

  }
}

const isLoading = ref(false);
const isError = ref(false);

const submit = handleSubmit(values => {

  console.log('submit');

  let data = {
    "issue_uuid": issueUuid.value,
    "name": partName.value,
    "description": partDescription.value,
    "price": partPrice.value,
    "quantity": partQuantity.value,
    "unit": partUnit.value,
    "value": partValue.value,
  };

  console.log(data)
  isLoading.value = true;
  createUsedPartsRequest(data).then(function (response) {
    console.log(response)
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
  });
  emit('partFormBtnClick')
  console.log('data')

});

// --------------- VeeValidate --------------

// function savePart() {
//   console.log('submit');
//   handleSubmit((values) => {
//
//     console.log('submit');
//
//     let data = {
//       "issue_uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//       "name": partName.value,
//       "description": partDescription.value,
//       "price": partPrice.value,
//       "quantity": partQuantity.value,
//       "unit": partUnit.value,
//       "value": partValue.value,
//     };
//
//     console.log(data)
//
//
//   });
// }

</script>
