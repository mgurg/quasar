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
                <q-item-label class="text-h5 text-weight-medium">{{ $t("Permissions") }}</q-item-label>
                <!-- <q-item-label caption>{{ userDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <!-- v-if="hasPermission('USERS_ADD')"  -->
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('New permission') : ''"
                    class="float-right"
                    color="primary"
                    flat
                    icon="add"
                    no-caps size="md"
                    to="/settings/permissions/add"
                  />

                </div>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <q-card v-if="pagination.total > 0" bordered class="my-card no-shadow q-mt-sm q-pt-none">
        <q-list v-if="permissions !== null" class="q-mt-none q-pt-none" padding>
          <q-item :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'" class="q-pa-xs">
            <q-item-section avatar>
              <div class="q-pa-none">
                <q-btn-dropdown color="primary" dropdown-icon="sort" flat>
                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label caption>Sortuj wyniki po:</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item v-close-popup clickable @click="setSortingParams('first_name')">
                      <q-item-section>
                        <q-item-label>Liczbie osób</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-close-popup clickable @click="setSortingParams('last_name')">
                      <q-item-section>
                        <q-item-label>Nazwie</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-close-popup clickable @click="setSortingParams('created_at')">
                      <q-item-section>
                        <q-item-label>Uprawnienia własne/systemowe</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </q-item-section>
            <q-item-section>
              <span>{{ $t(sortName) }}
                <q-btn :icon="getSortIcon()" color="primary"
                       flat padding="xs"
                       size="sm" @click="changeSortOrder()"/>
              </span>
            </q-item-section>
          </q-item>

          <div v-for="(permission, index) in permissions" v-if="permissions != null" v-bind:key="index">
            <permission-list-row :permission="permission" @refreshList="fetchPermissions"/>
          </div>

        </q-list>
        <div v-if="pagination.total > 10" class="q-pa-lg flex flex-center">
          <q-pagination v-model="pagination.page" :max='pagesNo' direction-links/>
        </div>

      </q-card>


    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import {authApi} from "boot/axios";
import {useQuasar} from 'quasar'
import PermissionListRow from 'components/listRow/PermissionListRow.vue'

const $q = useQuasar()
let isLoading = ref(false);
let selected = ref(null);
let search = ref(null);

let sort = reactive({name: "asc", is_custom: "asc", active: "name"})
let sortName = ref("Name")

function setSortingParams(name) {
  switch (name) {
    case 'first_name':
      sort.active = "first_name"
      sortName.value = "Name"
      break;
    case 'last_name':
      sort.active = "last_name"
      sortName.value = "Name"
      break;
    case 'created_at':
      sort.active = "created_at"
      sortName.value = "Age"
      break;
  }
  fetchPermissions();
}

function getSortIcon() {
  let field = sort.active
  return sort[field] === 'asc' ? 'arrow_upward' : 'arrow_downward'
}

function changeSortOrder() {
  let field = sort.active
  sort[field] === "asc" ? sort[field] = 'desc' : sort[field] = "asc"
  fetchPermissions();
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
  fetchPermissions();
})

const permissions = ref(null);

function fetchPermissions() {
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
    .get("/permissions/", {params: params})
    .then((res) => {
      permissions.value = res.data.items
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

  fetchPermissions();
});


</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>

