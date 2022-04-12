<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <q-btn flat round dense icon="notifications" class="q-mr-xs" @click="notify"></q-btn>
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
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section>Index</q-item-section>
        </q-item>

        <!--Users Index-->
        <q-item to="/users" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>

          <q-item-section>Users</q-item-section>
        </q-item>

        <!--Tasks Index-->
        <q-item to="/tasks" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="add_task" />
          </q-item-section>

          <q-item-section>TODO List</q-item-section>
        </q-item>

        <!--Maps Index-->
        <q-item to="/layout" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="place" />
          </q-item-section>

          <q-item-section>Items</q-item-section>
        </q-item>

        <!--Files Index-->
        <q-item to="/files" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>

          <q-item-section>Files</q-item-section>
        </q-item>

        <!--Editor Index-->
        <q-item to="/editor" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="post_add" />
          </q-item-section>

          <q-item-section>Editor</q-item-section>
        </q-item>

        <!--Calendar Index-->
        <q-item to="/calendar" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="calendar_month" />
          </q-item-section>

          <q-item-section>Calendar</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <!-- <router-view /> -->
      <!-- TODO: Looks like this is necessary to load onActivate -->
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from 'stores/user'
import { useRouter } from "vue-router";


export default defineComponent({
  name: "MainLayout",


  setup() {
    const $q = useQuasar();

    const router = useRouter();
    const UserStore = useUserStore();

    const { locale } = useI18n({ useScope: "global" });
    const lang = ref(locale); // $q.lang.isoName

    watch(lang, (val) => {
      // dynamic import, so loading on demand only
      import(
        /* webpackInclude: /(pl|de|en-US)\.js$/ */
        "quasar/lang/" + val
      ).then((lang) => {
        $q.lang.set(lang.default);
      });
    });

    function setLocale(lang) {
      locale.value = lang;
    }
    const leftDrawerOpen = ref(false);

    function notify() {
      $q.notify({
        message: 'Danger, Will Robinson! Danger!',
        position: 'top-right',
        progress: true,
      })
    }

    const envValue = process.env.S3_BUCKET;

    function logout() {
      UserStore.logoutUser()
      router.push("/login");
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      notify,
      setLocale,
      logout
    };
  },
});
</script>
