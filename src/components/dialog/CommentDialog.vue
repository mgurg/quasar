<template>
  <q-card style="width: 350px">
    <q-card-section>
      <div class="text-h6">Podaj powód</div>
    </q-card-section>

    <q-card-section>
      <q-input
        v-model="comment"
        outlined
        type="textarea"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn v-close-popup color="primary" flat label="Cancel"/>
      <q-btn v-close-popup color="primary" flat label="OK" @click="addComment()"/>
    </q-card-actions>
  </q-card>
</template>
<script setup>

import {ref} from "vue";

const props = defineProps({
  status: {
    type: String,
    default: null,
  },
})

const status = props.status;
const comment = ref(null)

const emit = defineEmits(['addCommentBtnClick', 'cancelBtnClick'])


function addComment(){
  emit('addCommentBtnClick', status, comment)
}
</script>
