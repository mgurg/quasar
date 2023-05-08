<template>
  <q-card style="width: 350px">
    <q-card-section>
      <div class="text-h6">Wyszukaj użytkownika</div>
    </q-card-section>
    <q-card-section>
      <div v-for="(user, index) in usersList" v-if="usersList!= null" v-bind:key="index" class="q-gutter-xs">
        <q-chip color="primary" icon="person" removable text-color="white" @remove="unassignUser(user.uuid)">
          {{ user.first_name }} {{ user.last_name }}
        </q-chip>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input
        v-model="search"
        :label="$t('Type your search text')"
        clearable
        debounce="300"
        outlined
        type="search"
        @clear="clearUsers()"
        @update:model-value="fetchUsers()">
        <template v-if="!search" v-slot:append>
          <q-icon name="search"/>
        </template>

      </q-input>


      <q-list v-for="(user, index) in users" v-if="users != null" v-bind:key="index" bordered separator>
        <div @click="insertUser(user.first_name, user.last_name, user.uuid)">
          <q-item v-ripple clickable>
            <q-item-section>
              <q-item-label>{{ user.first_name }} {{ user.last_name }}</q-item-label>
              <!-- <q-item-label caption>Dodaj</q-item-label> -->
            </q-item-section>
        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn @click="insertUser(user.first_name, user.last_name, user.uuid)" class="gt-xs" size="12px" flat dense round icon="person_add" />
          </div>
        </q-item-section>
          </q-item>
        </div>
      </q-list>

    </q-card-section>

    <q-card-actions align="right">
      <q-btn v-close-popup color="primary" flat label="Cancel"/>
      <q-btn v-close-popup color="primary" flat label="OK" @click="emitUsers()"/>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import {ref} from "vue";
import {getUsersRequest} from "components/api/UserApiClient";
import {errorHandler} from "components/api/errorHandler";

const emit = defineEmits(['assignUserBtnClick', 'cancelBtnClick'])

const search = ref(null)
const isLoading = ref(false)
const users = ref(null)
const usersList = ref(null)

function fetchUsers() {

  if (search.value == null || search.value == "") {
    return;
  }
  let params = {
    search: search.value,
    size: 5,
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
  if (usersList.value === null) {
    usersList.value = [{"uuid": uuid, "first_name": first_name, "last_name": last_name}]
    return;
  }

  if (!usersList.value.some(el => el.uuid === uuid)) {
    usersList.value = [...usersList.value, {"uuid": uuid, "first_name": first_name, "last_name": last_name}]
    // usersList.value.push({"uuid": uuid, "first_name": first_name, "last_name": last_name})
  }

}

function clearUsers() {
  // console.log("clearing")
  search.value = null
  users.value = false
}

function unassignUser(uuid) {
  if (usersList.value !== null) {
    usersList.value = usersList.value.filter(function (el) {
      return el.uuid != uuid;
    });
  }
}

function emitUsers() {
  // console.log("emit:")
  // console.log(usersList.value)
  emit('assignUserBtnClick', usersList.value)
}

</script>
