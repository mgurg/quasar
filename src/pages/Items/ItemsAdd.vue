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
        <q-breadcrumbs-el icon="home" to="/home"/>
        <q-breadcrumbs-el :label="$t('Items')" icon="apps" to="/items"/>
        <q-breadcrumbs-el :label="$t('New item')" icon="add"/>
      </q-breadcrumbs>
      <q-card bordered class="my-card no-shadow q-mt-sm q-mb-md">
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

      <q-card bordered class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section>
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
import {useRouter} from "vue-router";
import {errorHandler} from "components/api/errorHandler";
import {addItemRequest} from "components/api/ItemApiClient";
import {ref} from "vue";

const router = useRouter();

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);

function createItem(formData) {
  isLoading.value = true;
  addItemRequest(formData).then(function (response) {
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


</script>
