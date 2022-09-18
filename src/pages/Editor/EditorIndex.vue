<template>
        <div class="row justify-center text-blue-grey-10">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
        <div style="border: 1px solid rgb(38, 50, 56); border-radius: 5px; padding-left: 5px;">
 
            <tiptap @editorContent="logText"  />
        </div>
        
        <q-btn @click="saveText">Save</q-btn>
        
    </q-page>
    </div>
</template>

<script setup>
import { onActivated, reactive, ref } from "vue";
import Tiptap from 'src/components/editor/TipTap.vue'
import { api } from "boot/axios";

let txt = null;

function logText(text) {
  txt = text
  console.log("LOG: ")
  console.log(text)

}

function saveText() {
  console.log("SAVE: ")
  console.log(txt)
}


</script>

<style lang="scss">

</style>