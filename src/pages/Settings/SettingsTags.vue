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

      <q-card bordered class="my-card no-shadow q-my-sm">
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
            <q-input v-model="newTag" label="Label" class="q-mr-xs" outlined></q-input>
            <q-btn dense flat icon="add" label="Dodaj" class="q-mr-xs" @click="addTag(newTag)"/>
            <q-space />
          </div>

          <!-- <q-chip icon="event" style="background-color: aquamarine;">Add to calendar</q-chip> -->
          <div class="q-py-md">
          Tagi mogą być tylko dodawane. Ich usunięcie jest możliwe jedynie jeżeli nie są używane w żadnym zadaniu.
          Tag który jest używany może zostać ukryty, nie pojawia się wtedy w liście podpowiedzi.
        </div>
        </q-card-section>


        <q-card-section>
          <q-list v-for="(tag, index) in tags" v-if="tags != null" v-bind:key="index">
            <div>
              <q-item >
                <q-item-section>
                  <q-item-label>{{ tag.name }}</q-item-label>
                  <!-- <q-item-label caption>Dodaj</q-item-label> -->
                </q-item-section>
                <q-item-section side>
                    <q-btn flat icon="delete" round size="12px" @click="deleteTag(tag.uuid)"/>
                </q-item-section>
              </q-item>
              <q-separator/>
            </div>
          </q-list>

        </q-card-section>
      </q-card>
    </q-page>
  </div>

</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {errorHandler} from "components/api/errorHandler";
import {addTagRequest, deleteTagRequest, getTagsRequest} from "components/api/TagsApiClient";

let isLoading = ref(false);
let isError = ref(false);

const tags = ref(null);
const newTag = ref(null);

function fetchTags() {
  isLoading.value = true;
  getTagsRequest().then(function (response) {
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
    isError.value = true;
  });
}

onBeforeMount(() => {
  fetchTags()
});


</script>
