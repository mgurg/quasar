<template>
  <q-card class="bg-transparent no-shadow no-border">
    <q-card-section class="q-pa-none" >
      <div class="row q-col-gutter-sm">
        <div v-for="(item, index) in items" :key="index" class="col-md-4 col-sm-6 col-xs-12">
          <router-link :to="item.link">
            <q-item :style="`background-color: ${item.color1}`" class="q-pa-none rounded-borders">
              <q-item-section v-if="icon_position === 'left'" side :style="`background-color: ${item.color2}`"
                              class=" q-pa-lg q-mr-none text-white rounded-borders">
                <q-icon :name="item.icon" color="white" size="24px"></q-icon>
              </q-item-section>
              <q-item-section class=" q-pa-md q-ml-none  text-white">
                <q-item-label class="text-white text-h6 text-weight-medium">{{ item.value }}</q-item-label>
                <q-item-label>{{ item.title }}</q-item-label>
              </q-item-section>
              <q-item-section v-if="icon_position === 'right'" side class="q-mr-md text-white">
                <q-icon :name="item.icon" color="white" size="44px"></q-icon>
              </q-item-section>
            </q-item>
          </router-link>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "CardSettings",
  props: {
    icon_position: {
      required: false,
      default: "left"
    }
  },
  computed: {
    items: function () {
      return this.icon_position === "left"
        ? [
        {
            title: "Informacje o koncie (użytkownicy, pliki, wysłane powiadomienia)",
            icon: "account_circle",
            value: "Konto",
            color1: "#546bfa",
            color2: "#3e51b5",
            link: "/settings/account"
          },
          {
              title: "Kategorie awarii, np: mechaniczna elektryczna ",
              icon: "label",
              value: "Tagi",
              color1: "#a270b1",
              color2: "#9f52b1",
              link: "/settings/tags"
          },
          {
            title: "Ustawienia powiadomień o awariach (sms, email)",
            icon: "notifications",
            value: "Powiadomienia",
            color1: "#5064b5",
            color2: "#3e51b5",
            link: "/settings/notifications"
          },
          {
            title: "Ustawienia Importu i Eksportu danych do pliku CSV",
            icon: "import_export",
            value: "Import/Export",
            color1: "#5064b5",
            color2: "#3e51b5",
            link: "/settings/import-export"
          },
          {
            title: "Kto ma jaki dostęp do funkcji w aplikacji",
            icon: "ballot",
            value: "Uprawnienia",
            color1: "#f37169",
            color2: "#f34636",
            link: "/settings/permissions"
          },
          {
            title: "Zdefiniowane grupy ludzi, np: serwis, biuro",
            icon: "groups",
            value: "Grupy użytkowników",
            color1: "#ea6a7f",
            color2: "#ea4b64",
            link: "/settings/groups"
          },


        ]
        : [
          {
            title: "Informacje o koncie (użytkownicy, pliki)",
            icon: "label",
            value: "Konto",
            color1: "#546bfa",
            color2: "#3e51b5",
            link: "/settings/account"
          },
          {
            title: "Weekly Sales",
            icon: "fas fa-chart-bar",
            value: "20",
            color1: "#3a9688",
            color2: "#3e51b5",
            link: "/settings/notifictions"
          },
          {
            title: "New Customers",
            icon: "fas fa-chart-line",
            value: "321",
            color1: "#7cb342",
            color2: "#3e51b5",
            link: "/settings/notifictions"
          },
          {
            title: "Active Users",
            icon: "person",
            value: "82",
            color1: "#f88c2b",
            color2: "#3e51b5",
            link: "/settings/notifictions"
          }
        ];
    }
  }
})
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
