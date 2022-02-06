<template>
  <div class="row justify-center text-blue-grey-10">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card class="my-card">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>BMW X5 e70 3.0d 2013r.</q-item-label>
            <q-item-label caption>Subhead</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />
        <!-- IMG -->
        <q-carousel
          swipeable
          animated
          arrows
          v-model="slide"
          v-model:fullscreen="fullscreen"
          infinite
          height="200px"
        >
          <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
          <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
          <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
          <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg" />

          <template v-slot:control>
            <q-carousel-control position="bottom-right" :offset="[18, 18]">
              <q-btn
                push
                round
                dense
                color="white"
                text-color="primary"
                :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="fullscreen = !fullscreen"
              />
            </q-carousel-control>
            <q-carousel-control position="top-right" :offset="[18, 18]">
              <q-btn push round dense color="white" text-color="primary" icon="download" />
            </q-carousel-control>
          </template>
        </q-carousel>

        <q-card-actions align="right">
          <q-btn flat round color="red" icon="lock_open">Start</q-btn>
          <q-btn flat round color="teal" icon="pause_circle_outline">Hold</q-btn>
          <q-btn flat round color="primary" icon="done">Done</q-btn>
        </q-card-actions>

        <q-card-section class="q-pt-none">
          Podczas jazdy 100-140 km/h występuje drżenie kierownicy oraz całego nadwozia co widać na poniższym filmie.
          Brak luzów na zawieszeniu, problem występuje na oponach letnich jak i zimowych. Może ktoś ma jakiś pomysł
          czym moze to być spowodowane i od czego zacząć diagnozę?
          Brak innych objawów dotyczących tej awarii. Samochód posiadam od nowości i wcześniej nic nie wskazywało na
          zużycie jakieś części która mogłaby prowadzić do tej awarii.
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat round icon="event" />
          <q-btn flat color="primary">Reserve</q-btn>
        </q-card-actions>
      </q-card>
    </q-page>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { api } from "boot/axios";

export default defineComponent({
  name: "PageIndex",
  setup() {
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

    return {
      slide: ref(1),
      fullscreen: ref(false)
    };
  },
});
</script>
