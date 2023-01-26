<template>
  <!--  QR CODE -->
  <q-card bordered class="my-card no-shadow q-mt-sm">
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedMyIntro = !expandedMyIntro">
          Pierwsze kroki
          <!--              <q-badge floating align="top">{{ documentFiles.length }}</q-badge>-->
        </div>
        <q-space></q-space>
        <q-btn
          :icon="expandedMyIntro ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          color="grey"
          dense
          flat
          round
          @click="expandedMyIntro = !expandedMyIntro"
        />
      </div>
    </q-card-section>


    <q-separator v-if="expandedMyIntro"/>
    <q-slide-transition>
      <div v-show="expandedMyIntro">
        <q-card-section>

          Witaj w aplikacji do zgłaszania awarii. Wykonaj poniższe kroki żeby wykorzystać ją w pełni:
          <br>
          <div class="row">
            <q-linear-progress size="10px" stripe value="0.2"/>
          </div>

          <q-list class="q-pt-lg" separator>
            <q-item v-ripple clickable to="/items/add">
              <q-item-section avatar>
                <q-icon color="primary" name="settings_suggest"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Masz obecnie 0 dodanych urządzeń.</q-item-label>
                <q-item-label caption>Dodaj pierwsze żeby monitorować jego stan</q-item-label>


              </q-item-section>


            </q-item>
            <q-item v-ripple clickable to="/items">
              <q-item-section avatar>
                <q-icon color="primary" name="medical_services"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Awaria na produkcji?</q-item-label>
                <q-item-label caption>Zapisz zdarzenie żeby zgłosić je do odpowiedniej osoby</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-ripple clickable to="/users/add">
              <q-item-section avatar>
                <q-icon color="primary" name="group_add"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Masz zapisanych 0 pracowników oprócz siebie</q-item-label>
                <q-item-label caption>Dodaj nowego użytkownika lub wykonaj pracę samodzielnie</q-item-label>
              </q-item-section>
            </q-item>


            <q-item v-ripple clickable to="/issues">
              <q-item-section avatar>
                <q-icon color="primary" name="home_repair_service"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Twoje pierwsze zgłoszenie oczekuje na reakcję</q-item-label>
                <q-item-label caption>Przypisz do niego użytkownika i rozpocznij naprawę</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-ripple clickable>
              <q-item-section avatar>
                <q-icon color="primary" name="favorite"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Szybko poszło!</q-item-label>
                <q-item-label caption>Dodaj maszynę do ulubionych jeżeli pracujesz z nią regularnie lub przewidujesz kolejne problemy w
                  najbliższym czasie.
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-ripple clickable>
              <q-item-section avatar>
                <q-icon color="primary" name="edit_note"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Wnioski na przyszłość?</q-item-label>
                <q-item-label caption>Dodaj przewodnik (ze zdjęciami i wideo) żeby ułatwić pracę w przyszłości sobie lub <b>nowym pracownikom</b>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-ripple clickable>
              <q-item-section avatar>
                <q-icon color="primary" name="insights"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Monitoruj sytuację</q-item-label>
                <q-item-label caption>Zajrzyj do raportów żeby dowiedzieć się co najczyściej się psuje i ile trwa naprawa.
                  Może pora na wymianę lub zmianę procedur?
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps({
  expandedMyIntro: {
    type: Boolean,
    default: false,
  }
})

const expandedMyIntro = ref(props.expandedMyIntro)
</script>
