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
        <q-breadcrumbs-el :label="$t('Settings')" icon="settings" to="/settings"/>
        <q-breadcrumbs-el :label="$t('Ideas')" icon="info"/>
      </q-breadcrumbs>

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
          </q-item>
        </q-list>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5">Tagi</q-item-label>
                <!--                 <q-item-label caption>{{ itemDetails.summary }}</q-item-label>-->
                <!--                <q-item-label caption>{{permissionDetails.role_description}}</q-item-label>-->
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card bordered class="my-card no-shadow q-mt-sm q-pt-none">
        <q-card-section>
          <div class="row">
            <q-input v-model="newTag" class="q-mr-xs" dense label="Nazwa" outlined :disable="!hasPermission('TAG_ADD')">
              <template v-slot:append>
                <q-icon :style="{ 'color':mainColor }" name="square"/>
              </template>

            </q-input>
            <q-btn-dropdown color="primary" dense dropdown-icon="palette" flat label="Dodaj" no-caps split
                            :disable="!hasPermission('TAG_ADD')"
                            @click="addTag(newTag)">
              <q-list style="min-width: 300px">
                <q-color v-model="mainColor" dark default-view="palette" hide-underline no-footer no-header-tabs/>
              </q-list>
            </q-btn-dropdown>
            <!--            <q-btn :style="{ 'background-color':mainColor }" class="q-mr-xs" flat icon="colorize">-->
            <!--              <q-menu>-->
            <!--                <q-color v-model="mainColor" dark default-view="palette" hide-underline no-footer no-header-tabs/>-->
            <!--              </q-menu>-->
            <!--            </q-btn>-->
            <!--            <q-btn class="q-mr-xs" flat icon="add" label="Dodaj" no-caps @click="addTag(newTag)"/>-->
            <q-space/>
          </div>

          <!-- <q-chip icon="event" style="background-color: aquamarine;">Add to calendar</q-chip> -->
          <div class="q-py-md">
            Tagi mogą być tylko dodawane. Ich usunięcie jest możliwe jedynie jeżeli nie są używane w żadnym zadaniu.
            Tag który jest używany może zostać ukryty, nie pojawia się wtedy w liście podpowiedzi.
          </div>
        </q-card-section>


        <q-card-section>
          <q-list v-if="tags != null" class="q-mt-none q-pt-none" padding>
            <q-item :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-blue-grey-11'" class="q-pa-xs rounded-borders">
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
                          <q-item-label>Imię</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item v-close-popup clickable @click="setSortingParams('last_name')">
                        <q-item-section>
                          <q-item-label>Nazwisko</q-item-label>
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

            <q-list v-for="(tag, index) in tags" v-if="tags != null" v-bind:key="index">
              <div>
                <q-item>
                  <q-item-section>

                    <div>
                      <q-chip :style="{ 'background-color':tag.color }">{{ tag.name }}</q-chip>
                    </div>

                    <!-- <q-item-label caption>Dodaj</q-item-label> -->
                  </q-item-section>
                  <q-item-section side>
                    <div class="text-grey-8 q-gutter-xs">

                      <q-btn :icon="tag.is_hidden === true ? 'visibility_off' :'visibility'" dense flat round size="12px"
                             :disable="!hasPermission('TAG_HIDE')"
                             @click="switchTagVisibility(tag.uuid, tag.is_hidden)"/>
                      <q-btn dense flat icon="palette" round size="12px" :disable="!hasPermission('TAG_EDIT')">
                        <q-menu>
                          <q-card class="my-card" style="min-width: 300px">
                            <q-card-section>
                              <div class="text-h6">Zmień kolor</div>
                            </q-card-section>

                            <q-card-section>
                              <q-color v-model="newColor" dark default-view="palette" hide-underline no-footer
                                       no-header-tabs/>
                            </q-card-section>

                            <q-separator dark/>

                            <q-card-actions>
                              <q-space/>
                              <q-btn
                                v-close-popup
                                :label="$t('Cancel')"
                                color="red-12"
                                flat
                                icon="cancel"
                              />
                              <q-btn
                                v-close-popup
                                :label="$t('Save')"
                                color="primary"
                                icon="done"
                                @click="changeTagColor(tag.uuid)"
                              />


                            </q-card-actions>
                          </q-card>

                        </q-menu>
                      </q-btn>
                      <q-btn dense flat icon="delete" round size="12px" @click="deleteTag(tag.uuid)" :disable="!hasPermission('TAG_DELETE')" />
                    </div>
                  </q-item-section>
                </q-item>
                <q-separator/>
              </div>
            </q-list>

          </q-list>
        </q-card-section>
      </q-card>
    </q-page>
  </div>

</template>

<script setup>
import {computed, onBeforeMount, reactive, ref} from "vue";
import {errorHandler} from "components/api/errorHandler";
import {addTagRequest, deleteTagRequest, editTagRequest, getTagsRequest} from "components/api/TagsApiClient";
import {useQuasar} from "quasar";
import {useRouter} from "vue-router";
import {useUserStore} from 'stores/user'

const UserStore = useUserStore();
const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  return permissions.value === null ? false : Boolean(permissions.value.includes(permission));
}


const $q = useQuasar()
const router = useRouter();

let isLoading = ref(false);
let isError = ref(false);

const tags = ref(null);
const newTag = ref(null);
const mainColor = ref('#1976D2');
const newColor = ref(null);

// sort & paginate
let sort = reactive({first_name: "asc", last_name: "asc", created_at: "asc", active: "last_name"})
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
  fetchTags();
}

function getSortIcon() {
  let field = sort.active
  return sort[field] === 'asc' ? 'arrow_upward' : 'arrow_downward'
}

function changeSortOrder() {
  let field = sort.active
  sort[field] === "asc" ? sort[field] = 'desc' : sort[field] = "asc"
  fetchTags();
}


function fetchTags() {
  isLoading.value = true;

  let params = {
    is_hidden: false
  }

  getTagsRequest(params).then(function (response) {
    tags.value = response.data;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function addTag(name) {
  isLoading.value = true;

  let data = {
    "name": name,
    "color": mainColor.value
  }
  addTagRequest(data).then(function (response) {
    fetchTags();
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    if (errorMessage.status === 400) {
      // deleteUserToken();
      // history.push(Routes.Login);
      $q.notify("Tag already exists");
    }
    isError.value = true;
  });
}

function deleteTag(uuid) {
  isLoading.value = true;
  deleteTagRequest(uuid).then(function (response) {
    fetchTags();
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);

    if (err.response.data.detail === "Tag in use") {
      $q.dialog({
        title: "Confirm",
        message: "Tag jest używany w istniejących zgłoszeniach, brak możliwości usunięcia",
        persistent: true,
      }).onOk(() => {

      });

      return;
    }

    isError.value = true;
  });
}

function switchTagVisibility(uuid, visibility) {
  let data = {
    "is_hidden": !(visibility === true)
  }

  editTagRequest(uuid, data).then(function (response) {
    fetchTags();
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function changeTagColor(uuid) {
  if (newColor.value !== null) {
    let data = {
      "color": newColor.value
    }

    editTagRequest(uuid, data).then(function (response) {
      fetchTags();
      isLoading.value = false;
    }).catch((err) => {
      const errorMessage = errorHandler(err);
      isError.value = true;
    });
  }

}


onBeforeMount(() => {
  fetchTags()
});


</script>
