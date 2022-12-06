<template>
  <q-card style="width: 300px">
    <q-card-section>
      <div class="text-h6">Wyszukaj grupę użytkowników</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input
        dense
        clearable
        outlined
        v-model="search"
        :label="$t('Type your search text')"
        type="search"
        debounce="300"
        @update:model-value="fetchUsers()">
        <template v-if="!search" v-slot:append>
          <q-icon name="search" />
        </template>

      </q-input>
      <div v-for="(user, index) in users" v-bind:key="index" v-if="users != null">
        <q-btn @click="insertUser(user.first_name, user.last_name, user.uuid)">Dodaj: {{user.first_name}}</q-btn>

      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="OK" color="primary" v-close-popup />
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

function insertUser(first_name, last_name, uuid){
  let fullName = first_name + " " + last_name;
  let jsonMention = {"type":"userMention","attrs":{"id":uuid,"label":fullName}}
  console.log(jsonMention);

  emit('insertUserBtnClick', jsonMention)


}

</script>
