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
import ItemForm from 'components/forms/item/ItemForm.vue'
import {useRouter} from "vue-router";
import {useAuthAPI} from "src/composables/useAuthAPI.js";

const router = useRouter();
const authAPI = useAuthAPI()

async function createItem(formData) {

  const {error} = await authAPI.post("/items/", formData)
  if (error !== null) {
    return;
  }
  router.push("/items");
}

async function addButtonPressed(itemForm) {
  await createItem(itemForm)
}


function cancelButtonPressed() {
  router.push("/items");
}


</script>
