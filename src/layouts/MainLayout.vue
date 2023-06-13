<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn aria-label="Menu" dense flat icon="menu" round @click="toggleLeftDrawer"/>

        <q-toolbar-title>
          <!-- Quasar App -->
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <!--        <q-btn flat round dense icon="notifications" class="q-mr-xs" @click="notify"></q-btn>-->
        <q-btn :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'" flat round @click="$q.dark.toggle()"/>
        <q-btn class="q-mr-xs" dense flat icon="language" round>
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item v-close-popup clickable>
                <q-item-section @click="setLocale('pl')">Polish (Polski)</q-item-section>
              </q-item>
              <q-item v-close-popup clickable>
                <q-item-section @click="setLocale('de')">German (Deutsch)</q-item-section>
              </q-item>
              <q-item v-close-popup clickable>
                <q-item-section @click="setLocale('en-US')">English (English)</q-item-section>
              </q-item>
              <q-separator/>
              <q-item v-close-popup clickable href="https://www.malgori.pl/usage/00_usage/" target="_blank" type="a">
                <q-item-section>{{ $t("I need help") }}</q-item-section>
                <q-item-section avatar>
                  <q-icon color="primary" name="help_outline"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn class="q-mr-xs" dense flat icon="logout" round @click="logout"/>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered show-if-above>
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">

        <q-list padding>
          <!--Dashboard-->
          <!-- <q-item to="/tasks" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>

            <q-item-section>{{ $t("Dashboard") }}</q-item-section>
        </q-item>-->

          <!--Home Index-->
          <q-item v-ripple clickable exact to="/home">
            <q-item-section avatar>
              <q-icon name="dashboard" size="md"/>
            </q-item-section>

            <q-item-section>Podsumowanie</q-item-section>
          </q-item>

          <!--          &lt;!&ndash;Reports Index&ndash;&gt;-->
          <!--          <q-item to="/reports" exact clickable v-ripple>-->
          <!--            <q-item-section avatar>-->
          <!--              <q-icon size="md" name="insights" />-->
          <!--            </q-item-section>-->

          <!--            <q-item-section>Raporty</q-item-section>-->
          <!--          </q-item>-->


          <!--Issues Index-->
          <q-item v-if="hasPermission('ISSUE_VIEW')" v-ripple clickable exact to="/issues">
            <q-item-section avatar>
              <div class="relative-position">
                <q-icon name="bug_report" size="md">
                </q-icon>
                <!--                <q-badge color="orange" floating>1</q-badge>-->
              </div>

            </q-item-section>

            <q-item-section>{{ $t("Issues") }}</q-item-section>
          </q-item>

          <!--Items Index-->
          <q-item v-if="hasPermission('ITEM_VIEW')" v-ripple clickable exact to="/items">
            <q-item-section avatar>
              <q-icon name="apps" size="md"/>
            </q-item-section>

            <q-item-section>{{ $t("Items") }}</q-item-section>
          </q-item>

          <!--Guides Index-->
          <!--          <q-item to="/guides" exact clickable v-ripple>-->
          <!--            &lt;!&ndash; v-if="hasPermission('SETTINGS_VIEW')" &ndash;&gt;-->
          <!--            <q-item-section avatar>-->
          <!--              <q-icon size="md" name="construction" />-->
          <!--            </q-item-section>-->

          <!--            <q-item-section>{{ $t("Guides") }}</q-item-section>-->
          <!--          </q-item>-->

          <!--Users Index-->
          <q-item v-if="hasPermission('USER_VIEW')" v-ripple clickable exact to="/users">
            <q-item-section avatar>
              <div class="relative-position">
                <q-icon name="people" size="md"></q-icon>
                <!-- <q-badge color="orange" floating>2</q-badge> -->
              </div>
            </q-item-section>

            <q-item-section>{{ $t("Employees") }}</q-item-section>
          </q-item>

          <!--Ideas Index-->
          <!--          <q-item to="/ideas" exact clickable v-ripple>-->
          <!--            <q-item-section avatar>-->
          <!--              <div class="relative-position">-->
          <!--                <q-icon size="md" name="tips_and_updates">-->
          <!--                </q-icon>-->
          <!--                <q-badge color="orange" floating>1</q-badge>-->
          <!--              </div>-->

          <!--            </q-item-section>-->

          <!--            <q-item-section>{{ $t("Ideas") }}</q-item-section>-->
          <!--          </q-item>-->

          <!--Settings Index-->
          <q-item v-ripple clickable exact to="/settings">
            <!-- v-if="hasPermission('SETTINGS_VIEW')" -->
            <q-item-section avatar>
              <q-icon name="settings" size="md"/>
            </q-item-section>

            <q-item-section>{{ $t("Settings") }}</q-item-section>
          </q-item>


          <!-- Tasks Index -->
          <!-- <q-item to="/tasks" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="add_task" />
          </q-item-section>

          <q-item-section>TODO List</q-item-section>
        </q-item> -->

          <!--Maps Index-->
          <!-- <q-item to="/layout" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="place" />
          </q-item-section>

          <q-item-section>Items</q-item-section>
        </q-item> -->

          <!--Files Index-->
          <!-- <q-item to="/files" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>

          <q-item-section>Files</q-item-section>
        </q-item> -->

          <!--Editor Index-->
          <!-- <q-item to="/editor" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="post_add" />
          </q-item-section>

          <q-item-section>Editor</q-item-section>
        </q-item> -->

          <!--Calendar Index-->
          <!-- <q-item to="/calendar" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="calendar_month" />
          </q-item-section>

          <q-item-section>Calendar</q-item-section>
        </q-item> -->
        </q-list>
        <q-list class="absolute-bottom q-py-lg" padding>
          <q-item v-ripple clickable exact href="https://www.malgori.pl/usage/00_usage/" target="_blank" type="a">
            <q-item-section avatar>
              <q-icon color="primary" name="help_outline" size="md"/>
            </q-item-section>
            <q-item-section>{{ $t("I need help") }}</q-item-section>

          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="pattern_4.svg" style="height: 150px">
        <!-- https://more.graphics/bauhaus -->
        <div class="absolute-bottom bg-transparent">
          <!-- <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar> -->
          <div class="text-weight-bold">{{ fullName }}</div>
          <!-- <div>@adam</div> -->
        </div>
      </q-img>
    </q-drawer>

    <q-footer elevated>
      <q-banner v-if="showAppInstallBanner"
                class="bg-primary text-white"
                dense
                inline-actions
      >
        <template v-slot:avatar>
          <q-avatar
            color="white"
            font-size="22px"
            icon="tips_and_updates"
            text-color="grey-10"
          />
        </template>

        <b>Zainstalować aplikację?</b>

        <template v-slot:action>
          <q-btn
            class="q-px-sm"
            dense
            flat
            label="Tak"
            @click="installApp"
          />
          <q-btn
            class="q-px-sm"
            dense
            flat
            label="Póżniej"
            @click="showAppInstallBanner = false"
          />
          <q-btn
            class="q-px-sm"
            dense
            flat
            label="Nigdy"
            @click="neverShowAppInstallBanner"
          />
        </template>
      </q-banner>
    </q-footer>

    <q-page-container>


      <router-view v-slot="{ Component }">
        <transition
          :duration="400"
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut">
          <component :is="Component"/>
        </transition>
      </router-view>


    </q-page-container>
  </q-layout>
</template>

<script setup>

import {onBeforeMount, onMounted, ref, watch, computed} from "vue";
import {useQuasar} from "quasar";
import {useI18n} from "vue-i18n";
import {useUserStore} from 'stores/user'
import {useRouter} from "vue-router";
import {getVerifyTokenRequest} from "components/api/AuthApiClient";
import {errorHandler} from "components/api/errorHandler";
import {setUserLangSettingsRequest} from "components/api/SettingsApiClient";

// let deferredPrompt;
const deferredPrompt = ref(null);
const showAppInstallBanner = ref(false)

const $q = useQuasar();

const router = useRouter();
const UserStore = useUserStore();

let isLoading = ref(false);
let isError = ref(false);

const {locale} = useI18n({useScope: "global"});
const lang = ref(locale); // $q.lang.isoName

const fullName = ref(UserStore.getFullName)

watch(lang, (val) => {
  // dynamic import, so loading on demand only
  import(
    /* webpackInclude: /(pl|de|en-US)\.js$/ */
  "quasar/lang/" + val
    ).then((lang) => {
    $q.lang.set(lang.default);
  });
});

function getLocale() {
  const userLocale =
    localStorage.getItem("lang") ||
    sessionStorage.getItem("lang") ||
    navigator.language.split("-")[0] ||
    "en-US";

  // if detectedLocale is 'en' or 'es' return
  if (["de", "en-US", "fr", "pl"].indexOf(userLocale) >= 0) {
    return userLocale;
  }
  // else return default value
  return "en-US";
}

function setLocale(lang) {
  locale.value = lang;

  isLoading.value = true;

  setUserLangSettingsRequest({"code": lang}).then(function (response) {
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });

}


const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function notify() {
  $q.notify({
    message: 'Danger, Will Robinson! Danger!',
    position: 'top-right',
    progress: true,
  })
}

const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return permissions.value === null ? false : Boolean(permissions.value.includes(permission));
}


// function hasPermission(permission) {
//   return true;
// }

function logout() {
  UserStore.logoutUser()
  router.push("/login");
}


function verifyToken() {
  const token = UserStore.getToken
  isLoading.value = true;
  const startTime = new Date().getTime();  // start the timer
  getVerifyTokenRequest(token).then(function (response) {
    // UserStore.fillStore()
    isLoading.value = false;
    const endTime = new Date().getTime();  // stop the timer
    const time = endTime - startTime;  // calculate the time it took to get the response
    console.log(`getVerifyTokenRequest: ${time} ms`);
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    logout();
    isError.value = true;
  });
}

function installApp() {
  // Hide the app provided install promotion
  showAppInstallBanner.value = false
  // Show the install prompt
  deferredPrompt.value.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.value.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      neverShowAppInstallBanner()
    } else {
      console.log('User dismissed the install prompt');
    }
  });
}

function neverShowAppInstallBanner() {
  showAppInstallBanner.value = false
  localStorage.setItem('neverShowAppInstallBanner', true)
}

onBeforeMount(() => {
  verifyToken();
  console.log(getLocale())
  //localStorage.setItem("lang", 'pl')
  // setLocale(setLocale())
  setLocale(getLocale())
});

onMounted(() => {
  let neverShowAppInstallBanner = localStorage.getItem('neverShowAppInstallBanner')

  console.log("never:" + neverShowAppInstallBanner)
  if (!neverShowAppInstallBanner) {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt.value = e;
      showAppInstallBanner.value = true
    });
  }

})

</script>

<style>
/* body.body--dark {
  background: #000
} */
body.body--light {
  background: #eceff1
}
</style>
