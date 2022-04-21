<template>
<q-layout>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md">
            {{activationId }}
            <idea-form
                button-text="Add"
                @ideaFormBtnClick="signUpButtonPressed"
            ></idea-form>

        </div>
        </q-page>
    </div>
    </q-layout>
</template>

<script setup>
import IdeaForm from 'src/components/forms/IdeaForm.vue'
import { ref,computed } from "vue";
import { useRoute } from 'vue-router'

const route = useRoute()
const path = computed(() =>route.path)
const activationId = ref(route.params.id)


</script>