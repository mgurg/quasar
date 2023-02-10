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
          <!--          <div class="row sm-gutter">-->
          <!--            <div class="q-pa-xs col-xs-12 col-sm-6">-->
          <!--              <q-input outlined v-model="newTag" label="Nazwa"/>-->
          <!--            </div>-->
          <!--            <div class="q-pa-xs col-xs-12 col-sm-6">-->
          <!--              <q-btn>AAAA</q-btn>-->
          <!--            </div>-->
          <!--          </div>-->

          <!-- <q-input v-model="newTag" bottom-slots counter label="Label" maxlength="12" outlined>
            <template v-slot:append>
              <q-btn dense flat icon="add" round @click="addTag(newTag)"/>
            </template>
            <template v-slot:after>
              <q-btn dense flat icon="add" round @click="addTag(newTag)"/>
            </template>
          </q-input> -->

          <div class="row">
            <q-input v-model="newTag" label="Nazwa" class="q-mr-xs" outlined></q-input>
            <q-btn flat icon="colorize" :style="{ 'background-color':mainColor }"  class="q-mr-xs">
              <q-menu>
                <q-color hide-underline dark v-model="mainColor" default-view="palette" no-header-tabs no-footer />
              </q-menu>
            </q-btn>
            <q-btn no-caps flat icon="add" label="Dodaj" class="q-mr-xs" @click="addTag(newTag)"/>
            <q-space />
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
              <q-item >
                <q-item-section>

                  <div>
                    <q-chip :style="{ 'background-color':tag.color }">{{ tag.name }}</q-chip>
                  </div>

                  <!-- <q-item-label caption>Dodaj</q-item-label> -->
                </q-item-section>
                <q-item-section side >
                  <div class="text-grey-8 q-gutter-xs">

                    <q-btn size="12px" flat dense round :icon="tag.is_hidden == true ? 'visibility_off' :'visibility'" @click="switchTagVisibility(tag.uuid, tag.is_hidden)" />
                    <q-btn size="12px" flat dense round icon="colorize">
                      <q-menu>
                        <q-card class="my-card" style="min-width: 300px">
                          <q-card-section>
                            <div class="text-h6">Zmień kolor</div>
                          </q-card-section>

                          <q-card-section>
                            <q-color hide-underline dark v-model="newColor" default-view="palette" no-header-tabs no-footer />
                          </q-card-section>

                          <q-separator dark />

                          <q-card-actions>
                              <q-space/>
                              <q-btn
                                :label="$t('Cancel')"
                                color="red-12"
                                flat
                                icon="cancel"
                                v-close-popup
                              />
                              <q-btn
                                :label="$t('Save')"
                                color="primary"
                                icon="done"
                                @click="changeTagColor(tag.uuid)"
                                v-close-popup
                              />


                          </q-card-actions>
                        </q-card>

                      </q-menu>
                    </q-btn>
                    <q-btn  icon="delete" flat dense round size="12px" @click="deleteTag(tag.uuid)"/>
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
import {onBeforeMount, reactive, ref} from "vue";
import {errorHandler} from "components/api/errorHandler";
import {addTagRequest, deleteTagRequest, editTagRequest, getTagsRequest} from "components/api/TagsApiClient";
import {useQuasar} from "quasar";

const $q = useQuasar()

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
    "name": name
  }
  addTagRequest(data).then(function (response) {
    fetchTags();
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
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

    if (err.response.data.detail === "Tag in use"){
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

function switchTagVisibility(uuid, visibility){
  let data = {
    "is_hidden" : !(visibility == true)
  }

  editTagRequest(uuid, data).then(function (response) {
    fetchTags();
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function changeTagColor(uuid){
  if (newColor.value !== null){
    let data = {
      "color" : newColor.value
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
