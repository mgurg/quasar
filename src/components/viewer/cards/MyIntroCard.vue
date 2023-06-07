<template>
  <!--  INTRO -->
  <q-card v-if="itemsData" bordered class="my-card no-shadow q-mt-sm">
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
          <!-- <div class="row">
            <q-linear-progress size="10px" stripe :value="0.2"/>
          </div> -->

          <q-list class="q-pt-lg" separator>
            <q-item v-ripple clickable to="/items/add">
              <q-item-section v-if="itemsData.items.total === 0" avatar>
                <q-icon color="primary" name="settings_suggest"/>
              </q-item-section>
              <q-item-section v-else side>
                <q-checkbox v-model="itemAdded" disable/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Masz obecnie {{ itemsData.items.total }} dodanych urządzeń.</q-item-label>
                <q-item-label v-if="itemsData.items.me === 0" caption>Dodaj pierwsze żeby monitorować jego stan
                </q-item-label>
                <q-item-label v-if="itemsData.items.me > 0" caption>Dodałeś już {{ itemsData.items.me }} urządzeń!
                  Świetny start!
                </q-item-label>
              </q-item-section>


            </q-item>
            <q-item v-ripple clickable to="/items">
              <q-item-section v-if="itemsData.issues_active.total === 0" avatar>
                <q-icon color="primary" name="medical_services"/>
              </q-item-section>
              <q-item-section v-else side>
                <q-checkbox v-model="itemAdded" disable/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Awaria na produkcji?</q-item-label>
                <q-item-label v-if="itemsData.issues_active.total + itemsData.issues_active.me > 0"
                              caption
                >Masz zgłoszonych {{ itemsData.issues_active.total + itemsData.issues_active.me }} aktywnych problemów
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-ripple clickable to="/users/add">
              <q-item-section v-if="itemsData.users === 0" avatar>
                <q-icon color="primary" name="group_add"/>
              </q-item-section>
              <q-item-section v-else side>
                <q-checkbox v-model="itemAdded" disable/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Masz zapisanych {{ itemsData.users }} pracowników oprócz siebie</q-item-label>
                <q-item-label v-if="itemsData.users === 0" caption>Dodaj nowego użytkownika lub wykonaj pracę
                  samodzielnie
                </q-item-label>
                <q-item-label v-else caption>Nie jesteś tu sam :) Rozwiążcie problem razem lub oddeleguj pracę
                </q-item-label>
              </q-item-section>
            </q-item>


            <q-item v-ripple clickable to="/issues">
              <q-item-section v-if="itemsData.issues_active.me > 0 && itemsData.issues_inactive.me < 1 " avatar>
                <q-checkbox v-model="itemAdded" disable/>
              </q-item-section>
              <q-item-section v-else side>
                <q-icon color="primary" name="home_repair_service"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Twoje zgłoszenie oczekuje na reakcję</q-item-label>
                <q-item-label caption>Przypisz do niego użytkownika i rozpocznij naprawę {{
                    itemsData.issues_active.me
                  }} {{ itemsData.issues_inactive.me }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-ripple clickable>
              <q-item-section v-if="itemsData.issues_inactive.me === 0 && itemsData.favourites === 0 " avatar>
                <q-icon color="primary" name="favorite"/>
              </q-item-section>
              <q-item-section v-if="itemsData.issues_inactive.me > 0 && itemsData.favourites < 1" avatar>
                <q-icon color="primary" name="favorite"/>
              </q-item-section>
              <q-item-section v-if="itemsData.issues_inactive.me > 0 && itemsData.favourites > 0" side>
                <q-checkbox v-model="itemAdded" disable/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Będzie więcej pracy z tą maszyną?</q-item-label>
                <q-item-label caption>Dodaj maszynę do ulubionych jeżeli pracujesz z nią regularnie lub przewidujesz
                  kolejne problemy w
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
                <q-item-label caption>Dodaj przewodnik (ze zdjęciami i wideo) żeby ułatwić pracę w przyszłości sobie lub
                  <b>nowym pracownikom</b>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-ripple clickable>
              <q-item-section avatar>
                <q-icon color="primary" name="insights"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>Monitoruj sytuację</q-item-label>
                <q-item-label caption>Zajrzyj do raportów żeby dowiedzieć się co najczyściej się psuje i ile trwa
                  naprawa.
                  Może pora na wymianę lub zmianę procedur?
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="row">
            <q-space/>
            <q-btn class="q-mt-lg" flat icon="visibility_off" no-caps @click="hide">&nbsp; Ukryj "Pierwsze kroki" na
              stałe
            </q-btn>
          </div>

        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {errorHandler} from 'src/components/api/errorHandler.js'
import {getFirstStepsRequest} from "components/api/StatisticsApiClient";
import {setUserSettingsRequest} from "components/api/SettingsApiClient"

const props = defineProps({
  expandedMyIntro: {
    type: Boolean,
    default: false,
  }
})

const expandedMyIntro = ref(props.expandedMyIntro)

const itemsData = ref(null)
const itemAdded = ref(true);

const isLoading = ref(false)
const isError = ref(false)

function getIntroData() {
  getFirstStepsRequest().then(function (response) {
    // progressData.value = response.data;
    itemsData.value = response.data
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function hide() {
  isLoading.value = true;
  let data = {
    "name": "dashboard_show_intro",
    "value": "false",
    "type": "bool"
  }

  setUserSettingsRequest(data).then(function (response) {
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);

    if (err.response !== 200) {
      console.log("ERROR")
    }
    isError.value = true;
  });
  itemsData.value = false
}

onBeforeMount(() => {
  getIntroData();
});

</script>
