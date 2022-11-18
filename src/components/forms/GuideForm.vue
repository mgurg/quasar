<template>
    <q-form autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" class="q-gutter-md"
        @submit.prevent>

        <q-input 
            outlined 
            v-model="guideName" 
            :disable="isLoading" 
            :error="!!errors.guideName"
            :error-message="errors.guideName" 
            :label="$t('Guide name')" 
        />

        <div class="tiptap">
            <tip-tap-guide :model-value="props.guide.text_jsonb" />
        </div>
        <div>
        <movie-uploader :video-id="props.guide.video_id" @uploaded-video-id="keepVideoId" />
      </div>
        <br />

        <div class="row">
            <q-space />
            <q-btn 
                flat 
                type="submit" 
                class="q-mr-lg" 
                icon="cancel" 
                color="red-12" 
                @click="cancelButtonHandle"
                :label="$t('Cancel')"
            />

            <q-btn 
                type="submit" 
                class="q-mr-xs" 
                icon="done" 
                color="primary"
                @click="createGuide()"
                :label="$t('Save')"
            />
        </div>
    </q-form>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, onBeforeMount } from "vue";
import { useUserStore } from "stores/user";
import { useField, useForm } from "vee-validate";
import * as yup from 'yup';

import TipTapGuide from 'src/components/editor/TipTapGuide.vue'
import MovieUploader from 'src/components/uploader/MovieUploader.vue'


const props = defineProps({
  guide: {
    type: Object,
    // Object or array defaults must be returned from
    // a factory function
    default() {
      return {
        name: '',
        text: '',
        text_jsonb: {},
        video_id: null

      }
    }
  },
  buttonText: {
    type: String,
    default: 'Save',
  },
})

let isLoading = ref(false);
const uploadedVideoId = ref(null)

// FORM


const { handleReset } = useForm();
const validationSchema = yup.object({
  guideName: yup.string().required(),

})

const { handleSubmit, errors } = useForm({
  validationSchema
})

const { value: guideName } = useField('guideName', undefined, { initialValue: props.guide.name })

// IMG
const files = ref(null)
let attachments = ref([]);


function cancelButtonHandle() {
  router.push("/guides");
}

// VIDEO

function keepVideoId(id){
  console.log("UPLOADED VIDEO_ID: " + id);
  uploadedVideoId.value = id;
}

</script>


<style lang="scss" scoped>
.tiptap {
    border: 1px solid #c2c2c2;
    border-radius: 5px;
    padding-left: 5px;
}

.tiptap:focus-within {
    transition: 0.3s;
    border: 2px solid #1976d2 !important;
}

// .tiptap:hover {
//   transition: 0.5s;
//   border: 1px solid #000000 !important;
// }
</style>