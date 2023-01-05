<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <!-- Quasar App -->
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
<!--        <q-btn flat round dense icon="notifications" class="q-mr-xs" @click="notify"></q-btn>-->
        <q-btn flat round @click="$q.dark.toggle()" :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'" />
        <q-btn flat round dense icon="language" class="q-mr-xs">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section @click="setLocale('pl')">Polish (Polski)</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="setLocale('de')">German (Deutsch)</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="setLocale('en-US')">English (English)</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Help &amp; Feedback</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn @click="logout" flat round dense icon="logout" class="q-mr-xs" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
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
          <q-item to="/home" exact clickable v-ripple>
            <q-item-section avatar>
              <q-icon size="md" name="dashboard" />
            </q-item-section>

            <q-item-section>Podsumowanie</q-item-section>
          </q-item>


          <!--Issues Index-->
          <q-item to="/issues" exact clickable v-ripple>
            <q-item-section avatar>
              <div class="relative-position">
                <q-icon size="md" name="bug_report">
                </q-icon>
<!--                <q-badge color="orange" floating>1</q-badge>-->
              </div>

            </q-item-section>

            <q-item-section>{{ $t("Issues") }}</q-item-section>
          </q-item>

          <!--Items Index-->
          <q-item to="/items" exact clickable v-ripple>
            <!-- v-if="hasPermission('SETTINGS_VIEW')" -->
            <q-item-section avatar>
              <q-icon size="md" name="apps" />
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
          <q-item to="/users" exact clickable v-ripple>
            <q-item-section avatar>
              <div class="relative-position">
                <q-icon size="md" name="people"></q-icon>
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
          <q-item to="/settings" exact clickable v-ripple>
            <!-- v-if="hasPermission('SETTINGS_VIEW')" -->
            <q-item-section avatar>
              <q-icon size="md" name="settings" />
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

    <q-page-container>


      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          :duration="400">
          <component :is="Component" />
        </transition>
      </router-view>


    </q-page-container>
  </q-layout>
</template>

<script setup>

import { ref, computed, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from 'stores/user'
import { useRouter } from "vue-router";
import { authApi } from "boot/axios";
import {getVerifyTokenRequest} from "components/api/AuthApiClient";
import {errorHandler} from "components/api/errorHandler";

const $q = useQuasar();

const router = useRouter();
const UserStore = useUserStore();

let isLoading = ref(false);
let isError = ref(false);

const { locale } = useI18n({ useScope: "global" });
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

function logout() {
  UserStore.logoutUser()
  router.push("/login");
}

const permissions = computed(() => UserStore.getPermissions);
function hasPermission(permission) {
  return Boolean(permissions.value.includes(permission));
}



function verifyToken(){
  const token = UserStore.getToken
  isLoading.value = true;
  getVerifyTokenRequest(token).then(function (response) {
      // UserStore.fillStore()
      isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    logout();
    isError.value = true;
  });
}

onBeforeMount(() => {
  verifyToken();
  console.log(getLocale())
  //localStorage.setItem("lang", 'pl')
  // setLocale(setLocale())
  setLocale(getLocale())
});

</script>

<style>
/* body.body--dark {
  background: #000
} */
body.body--light {
  background: #eceff1
}
</style>
