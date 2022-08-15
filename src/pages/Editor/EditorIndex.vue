<template>
    <q-page class="flex flex-center">
        <div style="border: 3px solid black; border-radius: 25px; padding: 25px; width:95%;">
 
            <tiptap />
        </div>
        
        <!-- <q-btn @click="ping">ping</q-btn> -->
    </q-page>
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

</script>

<style lang="scss">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }
}
</style>