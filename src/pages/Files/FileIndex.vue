<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <div width="100%" v-for="img in imgs" v-bind:key="img.id">
          <q-img :src="img.img" spinner-color="black" style="height: 140px; max-width: 150px">
            <q-icon
              class="absolute all-pointer-events"
              size="sm"
              name="delete"
              color="white"
              style="top: 8px; right: 8px"
              @click="deleteFile(img.id)"
            >
              <q-tooltip>Tooltip</q-tooltip>
            </q-icon>
          </q-img>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { api } from "boot/axios";
import { ref, reactive } from 'vue'

export default defineComponent({
  name: "PageIndex",
  setup() {
    const imgs = ref([
      { "id": 1, "img": "https://placeimg.com/500/300/nature?t=1" },
      { "id": 2, "img": "https://placeimg.com/500/300/nature?t=2" },
      { "id": 3, "img": "https://placeimg.com/500/300/nature?t=3" },
      { "id": 4, "img": "https://placeimg.com/500/300/nature?t=4" },
    ])


    function deleteFile(id) {
      alert(id);
    }



    return {
      imgs,
      deleteFile
    };
  },
});
</script>
