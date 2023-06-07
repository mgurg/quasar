<template>
  <q-list>
    <!-- USERS-->
    <q-item-section>
      <q-item-label class="text-blue-grey-10 text-h5 q-pt-md">Użytkownicy</q-item-label>
      <q-item-label caption class="q-pb-sm">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit
        elit.
      </q-item-label>
    </q-item-section>
    <div v-for="(permission, index) in usersPermissions" v-if="usersPermissions !== null" v-bind:key="index">
      <q-item v-ripple tag="label">
        <q-item-section avatar top>
          <q-checkbox v-model="selectedPermissions" :disable="!allowEdit" :val="permission.uuid" color="cyan"/>
        </q-item-section>
        <q-item-section>
          <q-item-label> {{ $t(permission.title) }}</q-item-label>
          <q-item-label caption>
            {{ $t(permission.description) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>

    <!-- ISSUES -->
    <q-item-section>
      <q-item-label class="text-blue-grey-10 text-h5 q-pt-md">Zgłoszenia</q-item-label>
      <q-item-label caption class="q-pb-sm">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit
        elit.
      </q-item-label>
    </q-item-section>
    <div v-for="(permission, index) in issuesPermissions" v-if="issuesPermissions !== null" v-bind:key="index">
      <q-item v-ripple tag="label">
        <q-item-section avatar top>
          <q-checkbox v-model="selectedPermissions" :disable="!allowEdit" :val="permission.uuid" color="cyan"/>
        </q-item-section>
        <q-item-section>
          <q-item-label> {{ $t(permission.title) }}</q-item-label>
          <q-item-label caption>
            {{ $t(permission.description) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>


    <!-- ITEMS -->
    <q-item-section>
      <q-item-label class="text-blue-grey-10 text-h5 q-pt-md">Przedmioty</q-item-label>
      <q-item-label caption class="q-pb-xs">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit
        elit.
      </q-item-label>
    </q-item-section>
    <div v-for="(permission, index) in itemsPermissions" v-if="itemsPermissions !== null" v-bind:key="index">
      <q-item v-ripple tag="label">
        <q-item-section avatar top>
          <q-checkbox v-model="selectedPermissions" :disable="!allowEdit" :val="permission.uuid" color="cyan"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ permission.title }}</q-item-label>
          <q-item-label caption>
            {{ permission.description }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>


    <!-- TAGS -->
    <q-item-section>
      <q-item-label class="text-blue-grey-10 text-h5 q-pt-md">Tagi</q-item-label>
      <q-item-label caption class="q-pb-xs">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit
        elit.
      </q-item-label>
    </q-item-section>
    <div v-for="(permission, index) in tagsPermissions" v-if="tagsPermissions !== null" v-bind:key="index">
      <q-item v-ripple tag="label">
        <q-item-section avatar top>
          <q-checkbox v-model="selectedPermissions" :disable="!allowEdit" :val="permission.uuid" color="cyan"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ permission.title }}</q-item-label>
          <q-item-label caption>
            {{ permission.description }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>

    <!-- SECTIONS -->
    <q-item-section>
      <q-item-label class="text-blue-grey-10 text-h5 q-pt-md">Ustawienia</q-item-label>
      <q-item-label caption class="q-pb-xs">Secondary line text. Lorem ipsum dolor sit amet, consectetur adipiscit
        elit.
      </q-item-label>
    </q-item-section>
    <div v-for="(permission, index) in sectionsPermissions" v-if="sectionsPermissions !== null" v-bind:key="index">
      <q-item v-ripple tag="label">
        <q-item-section avatar top>
          <q-checkbox v-model="selectedPermissions" :disable="!allowEdit" :val="permission.uuid" color="cyan"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ permission.title }}</q-item-label>
          <q-item-label caption>
            {{ permission.description }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>

    <!--      <div v-for="(permission, index) in allPermissions" v-bind:key="index">-->
    <!--        <q-item v-ripple tag="label">-->
    <!--          <q-item-section avatar top>-->
    <!--            <q-checkbox v-model="selectedPermissions" :disable="!allowEdit" :val="permission.uuid" color="cyan"/>-->
    <!--          </q-item-section>-->
    <!--          <q-item-section>-->
    <!--            <q-item-label>{{ permission.title }}</q-item-label>-->
    <!--            <q-item-label caption>-->
    <!--              {{ permission.description }}-->
    <!--            </q-item-label>-->
    <!--          </q-item-section>-->
    <!--        </q-item>-->
    <!--      </div>-->
  </q-list>
</template>


<script setup>

import {authApi} from "boot/axios";
import {computed, onBeforeMount, ref, watch} from "vue";

const props = defineProps({
  selectedItems: {
    type: Array,
    default: [],
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
})


const emit = defineEmits(['changeSelection'])


let isLoading = ref(false);
const isError = ref(false);

let selectedPermissions = ref(props.selectedItems)
let allowEdit = computed(() => props.canEdit)

watch(() => selectedPermissions.value, (newValue, oldValue) => {
  // allowEdit.value = newValue
  console.log(newValue)
  emit('changeSelection', newValue)
});

let usersPermissions = ref(null);
let issuesPermissions = ref(null);
let itemsPermissions = ref(null);
let tagsPermissions = ref(null);
let sectionsPermissions = ref(null);

function getAllPermissions() {
  authApi
    .get("/permissions/all")
    .then((res) => {

      // allPermissions.value = res.data;

      usersPermissions.value = res.data.filter(obj => obj.group === 'users')
      issuesPermissions.value = res.data.filter(obj => obj.group === 'issues')
      itemsPermissions.value = res.data.filter(obj => obj.group === 'items')
      tagsPermissions.value = res.data.filter(obj => obj.group === 'tags')
      sectionsPermissions.value = res.data.filter(obj => obj.group === 'settings')

      // if (props.role.permission != null && props.role.permission != 'undefined') {
      //   selectedPermissions.value = props.role.permission.map(value => value.uuid);
      // }

      isLoading.value = false;
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("General Error");
      }
    });
}

onBeforeMount(() => {
  getAllPermissions();
  // getRoles();
});

</script>
