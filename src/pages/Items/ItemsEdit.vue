<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-breadcrumbs class="row q-pa-sm">
        <q-breadcrumbs-el icon="home" to="/home"/>
        <q-breadcrumbs-el :label="$t('Items')" icon="tips_and_updates" to="/items"/>
        <q-breadcrumbs-el :label="$t('Add')" icon="add"/>
      </q-breadcrumbs>

      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">

              <q-item-section>
                <q-item-label class="text-h6">{{ $t("Item") }}</q-item-label>
                <!--
                  <q-item-label caption>
                  Nowy pracownik będzie musiał potwierdzić hasło. Wiecej użytkowników?
                  Pamiętaj o opcji importu!
                </q-item-label>
                -->
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

      <div>&nbsp;</div>

      <q-card class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section>
<!--          v-if="itemDetails != null"-->
<!--          :item="itemDetails"-->
          <item-form

            @cancelBtnClick="cancelButtonPressed"
            @itemFormBtnClick="addButtonPressed"
          />
        </q-card-section>
      </q-card>

    </q-page>
  </div>
</template>

<script setup>
import ItemForm from 'src/components/forms/ItemForm.vue'
import {useRoute, useRouter} from "vue-router";
import {errorHandler} from "components/api/errorHandler";
import {createItemRequest, getItemRequest, getItemUuidRequest} from "components/api/ItemApiClient";
import {onBeforeMount, ref} from "vue";
import {useUserStore} from "stores/user";

const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();
let itemUuid = ref(route.params.uuid);
let itemDetails = ref(null);

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);

function createItem(formData) {
  isLoading.value = true;
  createItemRequest(formData).then(function (response) {
    isLoading.value = false;
    router.push("/items");
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}

function addButtonPressed(itemForm) {
  // console.log(itemForm)
  createItem(itemForm)
}


function cancelButtonPressed() {
  router.push("/items");
}

function getItemDetails(uuid) {
  isLoading.value = true;
  getItemUuidRequest(uuid).then(function (response) {
    itemDetails.value = response.data
    console.log(response.data)
    // dbImagesUuidList.value = response.data.files_idea.map(a => a.uuid)


    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage)
    isError.value = true;
  });
}

onBeforeMount(() => {
  if (route.params.uuid != null)
    getItemDetails(route.params.uuid)
  // getUsers();
  isLoading.value = false;
});
</script>
