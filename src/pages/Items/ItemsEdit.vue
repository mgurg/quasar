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
        <q-breadcrumbs-el :label="$t('Edit')" icon="edit"/>
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

      <q-card class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section>
          <item-form
            v-if="itemDetails != null"
            :item="itemDetails"
            @cancelBtnClick="cancelButtonPressed"
            @itemFormBtnClick="editButtonPressed"
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
import {getOneItemRequest, editItemRequest} from "components/api/ItemApiClient";
import {onBeforeMount, ref} from "vue";
import {useUserStore} from "stores/user";
import {deleteFileRequest} from "components/api/FilesApiClient";

const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();
let itemUuid = ref(route.params.uuid);
let itemDetails = ref(null);
let dbImagesUuidList = ref(null);
let filesFormUuidList = ref(null);

let isLoading = ref(false);
let isSuccess = ref(false);
let isError = ref(false);
let isRemoving = ref(false);

function updateItem(uuid, formData) {

  const arr1 = dbImagesUuidList.value || [];
  const arr2 = formData.files;

  let removedItems = arr1.filter(x => !arr2.includes(x));
  let withoutChanges = arr1.filter(x => arr2.includes(x));
  let newItems = arr2.filter(x => !arr1.includes(x));

  console.log("Removed:")
  console.log(removedItems);

  console.log("Added:");
  console.log(newItems);

  console.log("To save:");

  let fileList = [...withoutChanges, ...newItems];

  formData.files = fileList;
  console.log(formData);

  isRemoving.value = true;
  removedItems.forEach(function (item, index) {
    deleteUnusedIdeaImages(item);
  });
  isRemoving.value = false;

  isLoading.value = true;
  editItemRequest(uuid, formData).then(function (response) {
    isLoading.value = false;
    if (isRemoving.value == false) {
      router.push("/items");
    }

  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


function deleteUnusedIdeaImages(uuid) {

  console.log("Deleting...: " + uuid);

  let token = UserStore.getToken;
  let tenant_id = UserStore.getTenant;

  isLoading.value = true;
  deleteFileRequest(uuid, token, tenant_id).then(function (response) {

    isLoading.value = false;

  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


function editButtonPressed(itemForm) {
  console.log(itemForm)
  updateItem(itemUuid.value, itemForm)
}


function cancelButtonPressed() {
  router.push("/items");
}

function getItemDetails(uuid) {
  isLoading.value = true;
  getOneItemRequest(uuid).then(function (response) {
    itemDetails.value = response.data
    console.log(response.data)
    dbImagesUuidList.value = response.data.files_item.map(a => a.uuid)


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
