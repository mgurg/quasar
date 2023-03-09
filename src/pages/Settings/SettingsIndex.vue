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
        <q-breadcrumbs-el :label="$t('Settings')" icon="apps" to="/settings"/>
      </q-breadcrumbs>

      <q-card bordered class="my-card no-shadow q-mt-sm q-mb-md">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-medium">{{ $t("Settings") }}</q-item-label>
                <q-item-label caption> Prace w trakcie :)
                </q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <card-settings :items="leftArray" />

    </q-page>
  </div>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import CardSettings from 'src/components/tiles/CardSettings.vue'



// -----------------------------

let leftArray = ref([
  {
    title: "Informacje o koncie (użytkownicy, pliki, wysłane powiadomienia)",
    icon: "account_circle",
    value: "Konto",
    color1: "#546bfa",
    color2: "#3e51b5",
    link: "/settings/account",
    permission: "SETTINGS_ACCOUNT"
  },
  {
    title: "Kategorie awarii, np: mechaniczna elektryczna ",
    icon: "label",
    value: "Tagi",
    color1: "#a270b1",
    color2: "#9f52b1",
    link: "/settings/tags",
    permission: "SETTINGS_TAGS"
  },
  {
    title: "Ustawienia powiadomień o awariach (sms, email)",
    icon: "notifications",
    value: "Powiadomienia",
    color1: "#5064b5",
    color2: "#3e51b5",
    link: "/settings/notifications",
    permission: null
  },
  {
    title: "Ustawienia Importu i Eksportu danych do pliku CSV",
    icon: "import_export",
    value: "Import/Export",
    color1: "#5064b5",
    color2: "#3e51b5",
    link: "/settings/import-export",
    permission: null
  },
  {
    title: "Kto ma jaki dostęp do funkcji w aplikacji",
    icon: "ballot",
    value: "Uprawnienia",
    color1: "#f37169",
    color2: "#f34636",
    link: "/settings/permissions",
    permission: "SETTINGS_PERMISSION"
  },
  // {
  //   title: "Zdefiniowane grupy ludzi, np: serwis, biuro",
  //   icon: "groups",
  //   value: "Grupy użytkowników",
  //   color1: "#ea6a7f",
  //   color2: "#ea4b64",
  //   link: "/settings/groups"
  // },
])


onBeforeMount(() => {

});


</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>

