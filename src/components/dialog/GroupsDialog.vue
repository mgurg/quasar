<template>
  <q-card style="width: 300px">
    <q-card-section>
      <div class="text-h6">Wyszukaj grupę użytkowników</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input
        v-model="search"
        :label="$t('Type your search text')"
        clearable
        debounce="300"
        dense
        outlined
        type="search"
        @update:model-value="fetchUsers()">
        <template v-if="!search" v-slot:append>
          <q-icon name="search"/>
        </template>

      </q-input>
      <div v-for="(user, index) in users" v-if="users != null" v-bind:key="index">
        <q-btn @click="insertUser(user.first_name, user.last_name, user.uuid)">Dodaj: {{ user.first_name }}</q-btn>

      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn v-close-popup color="primary" flat label="OK"/>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import {ref} from "vue";
import {getUsersRequest} from "components/api/UserApiClient";
import {errorHandler} from "components/api/errorHandler";


const emit = defineEmits(['insertUserBtnClick', 'cancelBtnClick'])

const search = ref(null)
const isLoading = ref(false)
const users = ref(null)

function fetchUsers() {
  let params = {
    search: search.value,
  };

  getUsersRequest(params).then(function (response) {
    users.value = response.data.items
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });

}

function insertUser(first_name, last_name, uuid) {
  let fullName = first_name + " " + last_name;
  let jsonMention = {"type": "userMention", "attrs": {"id": uuid, "label": fullName}}
  // console.log(jsonMention);

  emit('insertUserBtnClick', jsonMention)
}

</script>
