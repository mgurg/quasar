<template>
        <div class="row justify-center text-blue-grey-10">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
        <div style="border: 3px solid black; border-radius: 5px; padding-left: 5px;">
 
            <tiptap @editorContent="logText"  />
        </div>
        
        <q-btn @click="ping">Save</q-btn>
        
    </q-page>
    </div>
</template>

<script setup>
import { defineComponent } from "vue";
import Tiptap from 'src/components/editor/TipTap.vue'
import { api } from "boot/axios";


function ping() {
    api
        .get("/")
        .then((res) => {
            console.log(res.data);
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

function logText(text) {
  console.log("LOG: ")
  console.log(text)
}

</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
}
</style>