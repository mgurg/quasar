<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-py-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-list>
          <q-item class="q-px-sm">
            <q-item-section avatar>
              <q-btn color="grey" dense flat icon="arrow_back_ios" no-caps @click="router.back()">{{
                  $t("Return")
                }}
              </q-btn>
            </q-item-section>
            <q-item-section></q-item-section>
            <q-item-section side>
              <div class="col-12 text-h6 q-mt-none">
                <q-btn-dropdown class="float-right q-mr-sm" color="grey" dense dropdown-icon="settings" flat round>
                  <q-list bordered padding>
                    <q-item>
                      <q-item-section>

                        <q-item-label>Domyślnie rozwinięte sekcje</q-item-label>
                        <q-item-label caption>Określ które sekcje (Moje zadania/urządzenia) będę domyślnie rozwinięte</q-item-label>
                      </q-item-section>

                    </q-item>

                    <q-item v-ripple tag="label">
                      <q-item-section>
                        <q-item-label>Zadania</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="expandedIssues"/>
                      </q-item-section>
                    </q-item>

                  </q-list>
                </q-btn-dropdown>
                <q-btn
                  v-if="currentUserUuid !== userUuid && hasPermission('USER_EDIT')"
                  :label="$q.screen.gt.xs ? $t('Edit') : ''"
                  class="float-right q-mr-sm" color="primary"
                  flat
                  icon="edit"
                  no-caps
                  @click="editUser(userDetails.uuid)"

                />
                <q-btn
                  v-if="currentUserUuid === userUuid && hasPermission('USER_EDIT_SELF')"
                  :label="$q.screen.gt.xs ? $t('Edit') : ''"
                  class="float-right q-mr-sm" color="primary"
                  icon="edit"
                  no-caps
                  flat @click="editUser(userDetails.uuid)"
                />
                <q-btn
                  :label="$q.screen.gt.xs ? $t('Delete') : ''"
                  class="float-right q-mr-sm"
                  color="red"
                  flat
                  icon="delete"
                  no-caps @click="deleteUser(userDetails.uuid)"
                  v-if="hasPermission('USER_DELETE')"
                />

              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <q-card-section v-if="userDetails && !isLoading" class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5">{{ userDetails.first_name }} {{ userDetails.last_name }}</q-item-label>
                <q-item-label caption>{{ userDetails.role_FK.role_title }}</q-item-label>
                <!--                <q-item-label caption>Krótki opis</q-item-label>-->
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>

        <q-card-actions v-if="userDetails && !isLoading" align="right">
          <!--          <q-btn-dropdown-->
          <!--            split-->
          <!--            no-caps-->
          <!--            outline-->
          <!--            color="primary"-->
          <!--            :label="userDetails.email"-->
          <!--            dropdown-icon="copy">-->
          <!--            <q-list>-->
          <!--            </q-list>-->
          <!--          </q-btn-dropdown>-->
          <q-btn :href="`mailto:${userDetails.email}`" color="primary" flat icon="mail" no-caps type="a">
            &nbsp;{{ userDetails.email }}
          </q-btn>
          <q-btn :href="`tel:${userDetails.phone}`" color="primary" flat icon="phone" no-caps type="a">
            &nbsp;{{ userDetails.phone }}
          </q-btn>

        </q-card-actions>
      </q-card>

      <!--      <q-card v-if="userDetails && !isLoading" bordered class="my-card no-shadow q-my-sm">-->
      <!--        <q-card-section>-->
      <!--          <div class="row q-col-gutter-xs">-->
      <!--            <div class="text-h5">{{ $t('Details') }}</div>-->
      <!--            <q-space></q-space>-->
      <!--            <q-btn-->
      <!--              :icon="expandedDetails ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"-->
      <!--              color="grey"-->
      <!--              dense-->
      <!--              flat-->
      <!--              round-->
      <!--              @click="expandedDetails = !expandedDetails"-->
      <!--            />-->
      <!--          </div>-->
      <!--        </q-card-section>-->

      <!--        <q-slide-transition>-->
      <!--          <div v-show="expandedDetails">-->
      <!--            <q-separator/>-->
      <!--            <q-card-section class="text-subitle2">-->
      <!--              <q-btn icon="mail" no-caps type="a" :href="`mailto:${userDetails.email}`" flat>{{ userDetails.email }}</q-btn>-->
      <!--              <q-btn icon="phone" no-caps type="a" :href="`tel:${userDetails.phone}`" flat>{{ userDetails.phone }}</q-btn>-->
      <!--              <p>{{ $t('E-mail') }}: <a :href="`mailto:${userDetails.email}`">{{ userDetails.email }}</a></p>-->
      <!--              <p>{{ $t('Phone') }}: <a :href="`tel:${userDetails.phone}`">{{ userDetails.phone }}</a></p>-->
      <!--              <p>{{ $t('Role') }}: <strong>{{ userDetails.role_FK.role_title }}</strong></p>-->
      <!--            </q-card-section>-->
      <!--          </div>-->
      <!--        </q-slide-transition>-->
      <!--      </q-card>-->


      <q-card v-if="userIssues && !isLoading" bordered class="my-card no-shadow q-my-sm">
        <q-card-section>
          <div class="row q-col-gutter-xs">
            <div class="text-h5">Przypisane zadania</div>
            <q-space></q-space>
            <q-btn
              :icon="expandedIssues ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              color="grey"
              dense
              flat
              round
              @click="expandedIssues = !expandedIssues"
            />
          </div>
        </q-card-section>

        <q-slide-transition>
          <div v-show="expandedIssues">
            <q-separator/>
            <q-card-section>
              <p v-if="userIssues === null || userIssues.length == 0" class="q-pt-xs text-body2">
                Użytkownik nie ma przypisanych zadań
              </p>

              <q-list v-if="userIssues !== null && userIssues.length > 0">
                <q-item :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'" class="rounded-borders q-pa-xs">
                  <q-item-section avatar>
                    <div class="q-pa-none">
                      <q-btn-dropdown color="primary" dropdown-icon="sort" flat>
                        <q-list>
                          <q-item>
                            <q-item-section>
                              <q-item-label caption>Sortuj wyniki po:</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item v-close-popup clickable @click="setSortingParams('status')">
                            <q-item-section>
                              <q-item-label>Status</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item v-close-popup clickable @click="setSortingParams('name')">
                            <q-item-section>
                              <q-item-label>Nazwa</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item v-close-popup clickable @click="setSortingParams('priority')">
                            <q-item-section>
                              <q-item-label>Priorytet</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item v-close-popup clickable @click="setSortingParams('created_at')">
                            <q-item-section>
                              <q-item-label>Wiek</q-item-label>
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

                <div v-for="(issue, index) in userIssues" v-if="userIssues != null" v-bind:key="index">
                  <issue-list-row v-if="!isLoading" :issue="issue"></issue-list-row>
                </div>

              </q-list>
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>


    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from "vue";

import {useQuasar} from 'quasar'
import {useRoute, useRouter} from "vue-router";
import IssueListRow from "components/listRow/IssueListRow.vue";
import {getUserIdeasRequest} from "components/api/IdeaApiClient";

import {activateUserRequest, deleteUserRequest, getUserRequest} from 'src/components/api/UserApiClient.js'
import {errorHandler} from 'src/components/api/errorHandler.js'
import {useUserStore} from "stores/user";
import {getManyIssuesRequest} from "components/api/IssueApiClient";

const $q = useQuasar()
const router = useRouter();
const UserStore = useUserStore();
const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return Boolean(permissions.value.includes(permission));
}

const currentUserUuid = UserStore.getCurrentUserId

let expandedDetails = ref(true)
let expandedIdeas = ref(true)
let expandedIssues = ref(true)

let isLoading = ref(false);

const route = useRoute();
let userUuid = ref(route.params.uuid)
let userDetails = ref(null);
let ideas = ref(null);
let userIssues = ref(null);

const initials = ref("")

let sort = reactive({status: "asc", title: "asc", created_at: "asc", name: "asc", active: "created_at"})
let sortName = ref("Age")

function setSortingParams(name) {
  switch (name) {
    case 'name':
      sort.active = "name"
      sortName.value = "Name"
      break;
    case 'created_at':
      sort.active = "created_at"
      sortName.value = "Age"
      break;
    case 'status':
      sort.active = "status"
      sortName.value = "Status"
      break;
    case 'priority':
      sort.active = "priority"
      sortName.value = "Priority"
      break;

    default:
      console.log(`Sorry, we are out of ${name}.`);
  }
  getUserIssues();
}

function changeSortOrder() {
  let field = sort.active

  sort[field] === "asc" ? sort[field] = 'desc' : sort[field] = "asc"
  getUserIssues();
}

function getSortIcon() {
  let column = sortName.value.toLowerCase();
  switch (column) {
    case 'age':
      column = 'created_at'
      break;
  }

  return sort[column] === 'asc' ? 'arrow_upward' : 'arrow_downward'
}

const pagination = reactive({page: 1, size: 10, total: 1})

const pagesNo = computed(() => {
  // console.log(Math.ceil(pagination.total/pagination.size))
  return Math.ceil(pagination.total / pagination.size)
})

watch(() => pagination.page, (oldPage, newPage) => {
  console.log(oldPage, newPage);
  getUserIssues();
})

function getUserDetails(uuid) {
  isLoading.value = true;
  getUserRequest(uuid).then(function (response) {
    userDetails.value = response.data;
    initials.value = (response.data.first_name[0] + response.data.last_name[0]).toUpperCase()
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function activateUser(uuid) {
  // userDetails.value.uuid
  isLoading.value = true;
  activateUserRequest(uuid).then(function (response) {
    userDetails.value.is_verified = true
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function getUserIdeas(uuid) {
  // userUuid.value
  isLoading.value = true;
  getUserIdeasRequest(uuid).then(function (response) {
    ideas.value = response.data.items

    if (response.data.items.length == 0) {
      expandedIdeas.value = false;
    }
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


function getUserIssues(uuid) {
  // userUuid.value
  isLoading.value = true;
  let params ={
    user_uuid: uuid,
    page: pagination.page,
    size: pagination.size,
  }
  getManyIssuesRequest(params).then(function (response) {
    userIssues.value = response.data.items

    if (response.data.items.length == 0) {
      expandedIssues.value = false;
    }
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function editUser(uuid) {
  router.push("/users/edit/" + uuid);
}

function deleteUser(uuid) {
  $q.dialog({title: "Confirm", message: "Really delete?", cancel: true, persistent: true,})
    .onOk(() => {
      isLoading.value = true;
      deleteUserRequest(uuid).then(function (response) {
        $q.notify("User deleted");
        router.push("/users/");
        isLoading.value = false;
      }).catch((err) => {
        const errorMessage = errorHandler(err);
        isError.value = true;
      });
    });
}

onBeforeMount(() => {
  isLoading.value = true;
  getUserDetails(route.params.uuid);
  getUserIdeas(route.params.uuid);
  getUserIssues(route.params.uuid);
});


</script>

<style>
.q-breadcrumbs {
  opacity: 0.7;
}
</style>
