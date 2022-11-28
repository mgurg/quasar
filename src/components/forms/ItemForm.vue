<template>

<q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" class="q-gutter-md"
      @submit.prevent>

      <q-input 
        outlined 
        v-model="itemName" 
        :disable="isLoading" 
        :error="!!errors.itemName"
        :error-message="errors.itemName" :label="$t('Item title')" 
    />
        <q-input 
        outlined 
        v-model="itemDescription" 
        :disable="isLoading" 
        :error="!!errors.itemDescription"
        :error-message="errors.itemDescription" label="Opis" 
    />
    <file-uploader @uploaded-photos="listUploadedImgs" :file-list="props.item.files_item" />

    <div class="row">
        <q-space />
        <q-btn 
          flat 
          type="submit" 
          class="q-mr-lg" 
          color="red-12" 
          icon="cancel" 
          @click="cancelButtonHandle"
          :label="$t('Cancel')"
        />

        <q-btn 
          v-if="props.buttonText == 'Edit'"
          type="submit" 
          class="q-mr-xs" 
          icon="done" 
          color="primary"
          @click="edititem()"
          :label="$t('Edit')"
        />
        <q-btn 
          v-if="props.buttonText == 'Save'"
          type="submit" 
          class="q-mr-xs" 
          icon="done" 
          color="primary"
          @click="submit()"
          :label="$t('Save')"
        />

      </div>

</q-form>


</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useField, useForm } from "vee-validate";
import * as yup from 'yup';
import { authApi } from "boot/axios";
import { useRoute, useRouter } from "vue-router";
import FileUploader from 'src/components/uploader/FileUploader.vue'
import { getItemRequest, editItemRequest, addItemRequest, deleteItemRequest } from 'src/components/api/ItemApiClient'
import {errorHandler} from 'src/components/api/errorHandler.js'

const router = useRouter();

let isLoading = ref(false);


const props = defineProps({
  item: {
    type: Object,
    // Object or array defaults must be returned from
    // a factory function
    default() {
      return {
        uuid: null,
        title: '',
        description: '',
        color: 'red',
        user: null,
        body_json: null,
        files_item: null

      }
    }
  },
  buttonText: {
    type: String,
    default: 'Save',
  },
})

//IMG

const uploadedPhotos = ref([]);

function listUploadedImgs(images){
  console.log("UPLOADED IMAGES:")
  console.log(JSON.stringify(images))
  uploadedPhotos.value = images;
}



const { handleReset } = useForm();

const validationSchema = yup.object({
  itemColor: yup.string().required(),
  itemName: yup.string(),//.required(),
  itemDescription: yup.string(), //.required('A cool description is required').min(3),
  email: yup.string().nullable().test(
    "check-startdate",
    "Start Date should not be later than current date",
    function (value) {
      if (value == "1") {
        return false;
      } else {
        return true;
      }
    }
  )
})


const { handleSubmit, errors } = useForm({
  validationSchema
})

const { value: itemName } = useField('itemName', undefined, { initialValue: props.item.title })
const { value: itemDescription } = useField('itemDescription', undefined, { initialValue: props.item.description })
const { value: itemColor } = useField('itemColor', undefined, { initialValue: props.item.color })
const { value: email } = useField('email')

function cancelButtonHandle() {
  console.log('cancelBtnClick')
  emit('cancelBtnClick')
}

const submit = handleSubmit(values => {
  let data = {
    "name": itemName.value,
    "description": "Opis",
    "description_jsonb": {"a":"a"},
    "qr_code": "string",
    "files": uploadedPhotos.value.map(a => a.uuid)
  }

  console.log(data)

  isLoading.value = true;

  isLoading.value = false;
  router.push("/items");

  addItemRequest(data).then(function (response) {
    console.log(response)
    isLoading.value = false;
    router.push("/items");
  }).catch((err) => {
    const errorMessage = errorHandler(err);
  });

})

</script>