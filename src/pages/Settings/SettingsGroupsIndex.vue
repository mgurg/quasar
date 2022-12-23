<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs class="q-ma-sm text-grey" active-color="grey">
        <template v-slot:separator>
          <q-icon
            size="1.5em"
            name="chevron_right"
            color="grey"
          />
        </template>
        <q-breadcrumbs-el icon="home" to="/"/>
        <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings"/>
        <q-breadcrumbs-el :label="$t('Permissions')" icon="ballot" to="/settings/permissions"/>
      </q-breadcrumbs>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5 text-weight-medium">{{ $t("Groups") }}</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <!-- v-if="hasPermission('USERS_ADD')"  -->
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('New group') : ''"
                    class="float-right"
                    color="primary"
                    flat
                    icon="add"
                    no-caps size="md"
                    to="/settings/groups/add"
                  />

                </div>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <q-card class="my-card no-shadow q-ma-none q-pa-none" v-if="groups.length > 0">
        <q-card-section>


          <q-list padding v-if="!isLoading">
            <q-item class="rounded-borders" :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-11'">
              <q-item-section avatar>

              </q-item-section>
              <q-item-section>
          <span>{{ $t("Name") }}
            <q-btn
              padding="xs"
              :unelevated="sort.active=='name'? true:false"
              :flat="sort.active=='name'? false:true"
              size="sm"
              color="primary"
              :icon="sort.name=='asc'? 'arrow_upward':'arrow_downward'"
              @click="changeSortOrder('name')"/>
          </span>

              </q-item-section>
              <q-item-section side>

              </q-item-section>
            </q-item>
            <div v-for="(group, index) in groups" v-bind:key="index">
              <group-item @selectedItem="selectGroup" @refreshList="fetchGroups" :group="group" :selected="selected"
                          v-if="!isLoading">
              </group-item>
            </div>
          </q-list>

          <div v-else class="q-pa-lg flex flex-center">
            <q-pagination v-model="pagination.page" :max='pagesNo' direction-links @click="goToPage(pagination.page)"/>
          </div>

        </q-card-section>
      </q-card>

      <div v-if="groups.length == 0" class="text-h5 text-center q-pa-lg">  <!-- -->
        {{ $t("No groups, add a first one!") }} 🚀
      </div>

    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import {authApi} from "boot/axios";
import {useQuasar} from 'quasar'
import GroupItem from 'components/listRow/GroupListRow.vue'

const $q = useQuasar()

let isLoading = ref(false);
let selected = ref(null);
let search = ref(null);


let sort = reactive({
  name: "asc",
  active: "name"
})

function selectGroup(uuid) {
  if (selected.value == null) {
    selected.value = uuid;
  } else if (selected.value !== uuid) {
    selected.value = uuid;
  } else {
    selected.value = null;
  }
}

function changeSortOrder(column) {
  sort[column] == "asc" ? sort[column] = 'desc' : sort[column] = "asc"
  sort.active = column
  fetchGroups()
}

const pagination = reactive({
  page: 1,
  size: 10,
  total: 1
})

const pagesNo = computed(() => {
  return Math.ceil(pagination.total / pagination.size)
})

watch(() => pagination.page, (oldPage, newPage) => {
  console.log(oldPage, newPage);
  fetchGroups();
})

const groups = ref(0);

function fetchGroups() {
  isLoading.value = true;

  let params = {
    search: search.value,
    page: pagination.page,
    size: pagination.size,
    sortOrder: sort[sort.active],
    sortColumn: sort.active
  };

  console.log(params)
  authApi
    .get("/groups/", {params: params})
    .then((res) => {
      groups.value = res.data.items
      pagination.total = res.data.total
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
  fetchGroups();
});


</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>

