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
        <q-breadcrumbs-el :label="$t('Guides')" icon="fact_check" to="/guides"/>
        <q-breadcrumbs-el :label="$t('Edit')" icon="edit"/>
      </q-breadcrumbs>

      <q-card bordered class="my-card no-shadow q-mt-sm q-mb-md">
        <q-card-section>
          <q-list>
            <q-item class="q-px-none">

              <q-item-section>

                <q-item-label class="text-h6" v-if="guideDetails != null">{{ $t('Edit') }}: {{ guideDetails.name }}
                </q-item-label>
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

      <!--      <q-card bordered class="my-card no-shadow q-mt-sm">-->
      <!--        <q-card-section class="row q-pa-sm">-->
      <!--          <q-breadcrumbs>-->
      <!--            <q-breadcrumbs-el icon="home" to="/home" />-->
      <!--            <q-breadcrumbs-el :label="$t('Guides')" icon="fact_check" to="/guides" />-->
      <!--            <q-breadcrumbs-el :label="$t('Edit')" icon="edit" />-->
      <!--          </q-breadcrumbs>-->

      <!--        </q-card-section>-->

      <!--        <q-separator />-->
      <!--        <q-card-section>-->
      <!--          <q-list>-->
      <!--            <q-item class="q-px-none">-->

      <!--              <q-item-section>-->
      <!--                <q-item-label class="text-h6" v-if="guideDetails != null">{{ $t('Edit') }}: {{guideDetails.name}} </q-item-label>-->
      <!--                &lt;!&ndash; <q-item-label caption>Nowy pracownik będzie musiał potwierdzić hasło. Wiecej użytkowników? Pamiętaj o opcji importu!</q-item-label> &ndash;&gt;-->
      <!--              </q-item-section>-->
      <!--            </q-item>-->

      <!--          </q-list>-->
      <!--        </q-card-section>-->
      <!--      </q-card>-->


      <!-- https://github.com/oneriang/quasar_dashboard/blob/main/src/components/Editor.vue -->

      <q-card class="my-card no-shadow q-ma-none q-pa-none">
        <q-card-section>
          <guide-form
            v-if="guideDetails != null"
            :guide="guideDetails"
            @cancelBtnClick="cancelButtonPressed"
            @guideFormBtnClick="addButtonPressed"
          />
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>


<script setup>
import {onBeforeMount, ref} from "vue";
import GuideForm from 'src/components/forms/GuideForm.vue'
import {useRoute, useRouter} from "vue-router";
import {useUserStore} from "stores/user";
import {authApi} from "boot/axios";
import 'viewerjs/dist/viewer.css'
import {deleteFileRequest} from "components/api/FilesApiClient";
import {errorHandler} from "components/api/errorHandler";
import {updateGuideRequest} from "components/api/GuideApiClient";

const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();

let guideUuid = ref(route.params.uuid);
let guideDetails = ref(null);
let dbImagesUuidList = ref(null);

function getDetails(uuid) {
  authApi
    .get("/guides/" + uuid)
    .then((response) => {
      console.log(response.data);

      guideDetails.value = response.data
      dbImagesUuidList.value = response.data.files_item.map(a => a.uuid)

      // if (response.data.date_from == null) {
      //     guideDetails.value.mode = 'task'
      // }
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


let isLoading = ref(false);
let isRemoving = ref(false);

function updateGuide(uuid, formData) {
  console.log(uuid)
  console.log(formData)

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
  updateGuideRequest(uuid, formData).then(function (response) {
    isLoading.value = false;
    if (isRemoving.value === false) {
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

function addButtonPressed(itemForm) {
  // console.log(itemForm)
  updateGuide(guideUuid.value, itemForm)
}

function cancelButtonPressed() {
  router.push("/guides");
}


onBeforeMount(() => {
  if (route.params.uuid != null)
    getDetails(route.params.uuid)
  // getUsers();
  isLoading.value = false;
});


</script>
