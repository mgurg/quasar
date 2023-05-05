<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs active-color="grey" class="q-ma-sm text-grey">
        <template v-slot:separator>
          <q-icon
            color="grey"
            name="chevron_right"
            size="1.5em"
          />
        </template>
        <q-breadcrumbs-el icon="home" to="/"/>
        <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings"/>
        <q-breadcrumbs-el :label="$t('Ideas')" icon="info"/>
      </q-breadcrumbs>

      <q-banner class="text-brown-10 bg-yellow-14 q-mt-md" inline-actions rounded>
        <template v-slot:avatar>
          <q-icon color="warning" name="warning"/>
        </template>
        Powiadomienia nie są jeszcze włączone, prace w trakcie.
        <br>
        Pomysły/sugestie? <a class="text-weight-bold text-black"
                             href="mailto:wsparcie@malgori.pl?subject=Aplikacja do zgłaszania awarii">Napisz do
        mnie ➡️</a>
      </q-banner>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-list>
          <q-item class="q-px-sm">
            <q-item-section avatar>
              <q-btn icon="arrow_back_ios" color="grey" dense no-caps flat @click="router.back()">{{
                  $t("Return")
                }}
              </q-btn>
            </q-item-section>
            <q-item-section></q-item-section>
          </q-item>
        </q-list>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5">Powiadomienia</q-item-label>
                <!--                 <q-item-label caption>{{ itemDetails.summary }}</q-item-label>-->
                <!--                <q-item-label caption>{{permissionDetails.role_description}}</q-item-label>-->
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card bordered class="my-card no-shadow q-my-sm">
        <q-card-section>
          <q-form
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            class="q-gutter-md"
            spellcheck="false"
            @submit.prevent
          >
            <p class="text-h6"> Email </p>
            <p>Informuj mnie o:</p>
            <q-list>
              <q-item tag="label">
                <q-item-section avatar>
                  <q-radio v-model="emailNotificationsLevel" val="all"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Każdym problemie</q-item-label>
                  <q-item-label caption>Wszystkie maszyny, dowolny priorytet</q-item-label>
                </q-item-section>
              </q-item>
              <!--              <q-item tag="label">-->
              <!--                <q-item-section avatar>-->
              <!--                  <q-radio v-model="emailNotificationsLevel" val="favourites_and_unassigned"/>-->
              <!--                </q-item-section>-->
              <!--                <q-item-section>-->
              <!--                  <q-item-label>Obserwowane maszyny oraz nieprzypisane</q-item-label>-->
              <!--                  <q-item-label caption>Maszyny oznaczone symbolem serca oraz zgłoszenie nieprzypisane do żadnego urządzenia</q-item-label>-->
              <!--                </q-item-section>-->
              <!--              </q-item>-->
              <!--              <q-item tag="label">-->
              <!--                <q-item-section avatar>-->
              <!--                  <q-radio v-model="emailNotificationsLevel" val="favourites_only"/>-->
              <!--                </q-item-section>-->
              <!--                <q-item-section>-->
              <!--                  <q-item-label>Tylko obserwowane maszyny</q-item-label>-->
              <!--                  <q-item-label caption>Wszystkie maszyny, oznaczone symbolem serca</q-item-label>-->
              <!--                </q-item-section>-->
              <!--              </q-item>-->
              <q-item tag="label">
                <q-item-section avatar>
                  <q-radio v-model="emailNotificationsLevel" val="assigned_to_me"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Tylko zgłoszenia przypisane do mnie</q-item-label>
                  <q-item-label caption>Dotyczy dowolnej maszyny, zadanie przypisane przez innego użytkownika niż Ty.
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item tag="label">
                <q-item-section avatar>
                  <q-radio v-model="emailNotificationsLevel" val="none"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Brak</q-item-label>
                  <q-item-label caption>Nie powiadamiaj mnie o żadnym nowym zgłoszeniu</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <p class="text-h6"> SMS </p>
            <p>[Niedostępne] Informuj mnie o:</p>
            <q-list>
              <q-item tag="label">
                <q-item-section avatar>
                  <q-radio v-model="smsNotificationsLevel" val="all" disable />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Każdym problemie</q-item-label>
                  <q-item-label caption>Wszystkie maszyny, dowolny priorytet</q-item-label>
                </q-item-section>
              </q-item>
              <q-item tag="label">
                <q-item-section avatar>
                  <q-radio v-model="smsNotificationsLevel" val="assigned_to_me" disable />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Tylko zgłoszenia przypisane do mnie</q-item-label>
                  <q-item-label caption>Dotyczy dowolnej maszyny, zadanie przypisane przez innego użytkownika niż Ty.
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item tag="label">
                <q-item-section avatar>
                  <q-radio v-model="smsNotificationsLevel" val="none" disable />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Brak</q-item-label>
                  <q-item-label caption>Nie powiadamiaj mnie o żadnym nowym zgłoszeniu</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>



            <div class="row">
              <q-space/>
              <q-btn :disable="isLoading" :loading="isLoading" color="primary" type="submit" @click="save">Save</q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {getNotificationSettingsRequest, setNotificationSettingsRequest} from "components/api/SettingsApiClient";
import {errorHandler} from "components/api/errorHandler";
import {useRouter} from "vue-router";

const router = useRouter();

const smsNotificationsLevel = ref('none');
const emailNotificationsLevel = ref('none');

const isLoading = ref(false);
const isError = ref(false);

function getNotificationSettings() {
  getNotificationSettingsRequest().then(function (response) {
    smsNotificationsLevel.value = response.data.sms_notification_level
    emailNotificationsLevel.value = response.data.email_notification_level
    isLoading.value = false;
  }).catch((err) => {
    if (err.response != 200) {
      setNotificationSettings()
    }
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function setNotificationSettings() {
  let data = {
    "sms_notification_level": smsNotificationsLevel.value,
    "email_notification_level": emailNotificationsLevel.value
  }
  setNotificationSettingsRequest(data).then(function (response) {
    console.log(response.data)
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);

    if (err.response != 200) {
      console.log("ERROR")
    }
    isError.value = true;
  });
}

function save() {
  setNotificationSettings()
}

onBeforeMount(() => {
  isLoading.value = true;
  getNotificationSettings();
});
</script>
