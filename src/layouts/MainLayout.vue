<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>Quasar App</q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
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

        <!--Index-->
        <q-item to="/" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section>Index</q-item-section>
        </q-item>

        <!--Tasks Index-->
        <q-item to="/todo" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>

          <q-item-section>Home</q-item-section>
        </q-item>

        <!--Task Add-->
        <q-item to="/task" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="add_task" />
          </q-item-section>

          <q-item-section>Add Task</q-item-section>
        </q-item>

        <!--Task view-->
        <q-item to="/view" exact clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="task" />
          </q-item-section>

          <q-item-section>View Task</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { watch } from "vue";
import { useI18n } from "vue-i18n";


export default defineComponent({
  name: "MainLayout",


  setup() {
    const $q = useQuasar();

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

    const envValue = process.env.S3_BUCKET;

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      setLocale,
    };
  },
});
</script>
