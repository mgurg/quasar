<template>
  <q-btn-dropdown class="float-left q-mr-sm" color="grey" dense dropdown-icon="settings" flat round>
    <q-list bordered padding>
      <q-item>
        <q-item-section>

          <q-item-label>Domyślnie rozwinięte sekcje</q-item-label>
          <q-item-label caption>Określ które sekcje (Moje zadania/urządzenia) będę domyślnie rozwinięte
          </q-item-label>
        </q-item-section>

      </q-item>

      <q-item v-ripple tag="label">
        <q-item-section>
          <q-item-label>Moje zadania</q-item-label>
          <q-item-label caption>Zadania przypisane do Ciebie</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            v-model="expandedUserIssues"
            @update:model-value="setSectionVisibility('visibility-home-tasks')"
          />
        </q-item-section>
      </q-item>

      <q-item v-ripple tag="label">
        <q-item-section>
          <q-item-label>Moje urządzenia</q-item-label>
          <q-item-label caption>Lista zapisanych przez Ciebie urządzeń</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-toggle
            v-model="expandedUserItems"
            @update:model-value="setSectionVisibility('visibility-home-items')"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup>
import {ref} from 'vue';

const expandedUserItems = ref(JSON.parse(localStorage.getItem('visibility-home-items')) ?? true)
const expandedUserIssues = ref(JSON.parse(localStorage.getItem('visibility-home-tasks')) ?? true)

function setSectionVisibility(condition) {
  if (localStorage.getItem(condition) === null) {
    localStorage.setItem(condition, JSON.stringify(true))
  } else {
    let currentValue = JSON.parse(localStorage.getItem(condition))
    localStorage.setItem(condition, JSON.stringify(!currentValue))
  }

  forceRerender()
}

const componentKey = ref(0);

const forceRerender = () => {
  componentKey.value += 1;
};
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
