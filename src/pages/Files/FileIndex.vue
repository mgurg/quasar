<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <div class="q-pa-md q-gutter-sm">
        <div v-for="task in urls" v-bind:key="task.id">
          <q-img :src="task.img" spinner-color="white" style="height: 140px; max-width: 150px" />
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
    const urls = ref('[{"id" :1 , "img": "https://placeimg.com/500/300/nature?t=1"}, {"id" :2 , "img": "https://placeimg.com/500/300/nature?t=2"}]')
    function randImg(no) {
      return String('https://placeimg.com/500/300/nature?t=' + no);
    }


    return {
      urls,
      randImg,
      refresh() {
        url.value = 'https://placeimg.com/500/300/nature?t=' + Math.random()
      }
    };
  },
});
</script>
