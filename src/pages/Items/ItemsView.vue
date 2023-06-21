<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
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
                        <q-item-label caption>Określ które sekcje (Moje zadania/urządzenia) będę domyślnie rozwinięte
                        </q-item-label>
                      </q-item-section>

                    </q-item>

                    <q-item v-ripple tag="label">
                      <q-item-section>
                        <q-item-label>Opis</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle
                          v-model="expandedDescription"
                          @update:model-value="setSectionVisibility('visibility-item-description')"
                        />
                      </q-item-section>
                    </q-item>

                    <q-item v-ripple tag="label">
                      <q-item-section>
                        <q-item-label>Zdjęcia</q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                        <q-toggle
                          v-model="expandedPhotos"
                          @update:model-value="setSectionVisibility('visibility-item-photos')"
                        />
                      </q-item-section>
                    </q-item>

                    <q-item v-ripple tag="label">
                      <q-item-section>
                        <q-item-label>Dokumenty</q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                        <q-toggle
                          v-model="expandedDocs"
                          @update:model-value="setSectionVisibility('visibility-item-docs')"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item v-ripple tag="label">
                      <q-item-section>
                        <q-item-label>Przewodniki</q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                        <q-toggle
                          v-model="expandedGuide"
                          @update:model-value="setSectionVisibility('visibility-item-guides')"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item v-ripple tag="label">
                      <q-item-section>
                        <q-item-label>Kod QR</q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                        <q-toggle
                          v-model="expandedQR"
                          @update:model-value="setSectionVisibility('visibility-item-qr')"
                        />
                      </q-item-section>
                    </q-item>
                    <!--                    <q-item v-ripple tag="label">-->
                    <!--                      <q-item-section>-->
                    <!--                        <q-item-label>Komentarze</q-item-label>-->
                    <!--                      </q-item-section>-->
                    <!--                      <q-item-section side top>-->
                    <!--                        <q-toggle-->
                    <!--                          v-model="expandedComments"-->
                    <!--                          @update:model-value="setSectionVisibility('visibility-item-comments')"-->
                    <!--                        />-->
                    <!--                      </q-item-section>-->
                    <!--                    </q-item>-->
                    <!--                    <q-item v-ripple tag="label">-->
                    <!--                      <q-item-section>-->
                    <!--                        <q-item-label>Oś czasu</q-item-label>-->
                    <!--                      </q-item-section>-->
                    <!--                      <q-item-section side top>-->
                    <!--                        <q-toggle-->
                    <!--                          v-model="expandedTimeline"-->
                    <!--                          @update:model-value="setSectionVisibility('visibility-item-timeline')"-->
                    <!--                        />-->
                    <!--                      </q-item-section>-->
                    <!--                    </q-item>-->
                  </q-list>
                </q-btn-dropdown>
                <q-btn
                  v-if="itemDetails"
                  :icon="favouritesList.includes(currentUserUuid) ? 'favorite':'favorite_border'"
                  :label="$q.screen.gt.xs ? 'Ulubiony' : ''" class="float-right q-mr-sm" color="accent"
                  flat
                  no-caps
                  outline @click="addToFavourite(itemDetails.uuid)"
                />
                <q-btn
                  v-if="hasPermission('ISSUE_EDIT')"
                  :label="$q.screen.gt.xs ? $t('Edit') : ''"
                  class="float-right q-mr-sm" color="primary" flat
                  icon="edit" no-caps
                  outline @click="editItem(itemDetails.uuid)"
                />
                <q-btn
                  v-if="hasPermission('ISSUE_DELETE')"
                  :label="$q.screen.gt.xs ? $t('Delete') : ''"
                  class="float-right q-mr-sm" color="red"
                  flat
                  icon="delete"
                  no-caps
                  @click="deleteItem(itemDetails.uuid, itemDetails.name)"
                />

              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <q-card-section v-if="itemDetails && !isLoading" class="q-pt-none">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5">{{ itemDetails.name }}</q-item-label>
                <!--                 <q-item-label caption>{{ itemDetails.summary }}</q-item-label>-->
                <q-item-label caption>{{ itemDetails.symbol }}</q-item-label>

              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>

        <q-card-actions align="right">
          <q-btn class="q-px-xs" color="primary" flat icon="bug_report" no-caps
                 @click="reportFailure(itemDetails.uuid)">Zgłoś awarie
          </q-btn>
          <!--          <q-btn color="primary" class="q-px-xs" flat icon="lightbulb_outline" no-caps>Usprawnienie</q-btn>-->
          <q-btn class="q-px-xs" color="primary" flat icon="insights" no-caps @click="itemReport(itemDetails.uuid)">
            Raporty
          </q-btn>
        </q-card-actions>
      </q-card>


      <description-card v-if="itemDetails!==null"
                        :key="'A'+ componentKey"
                        :expanded-description="expandedDescription"
                        :textJson="itemDetails.text_json"
      />
      <photo-card v-if="photoFiles!==null"
                  :key="'B'+ componentKey"
                  :expanded-photos="expandedPhotos"
                  :photo-files="photoFiles"
      />
      <document-card v-if="documentFiles!==null"
                     :key="'C'+ componentKey"
                     :document-files="documentFiles"
                     :expanded-docs="expandedDocs"
      />
      <guide-card v-if="guidesList!==null && itemDetails !==null"
                  :key="'D'+ componentKey"
                  :expanded-guide="expandedGuide"
                  :guides="guidesList"
                  :item-uuid="itemDetails.uuid"
                  :public-access="false"
      />
      <qr-card v-if="qrCode!==null"
               :key="'E'+ componentKey"
               :expanded-qr="expandedQR"
               :qr-code="qrCode"
      />
      <!--      <comments-card :expanded-comments="false"/>-->
      <!--      <timeline-card v-if="itemDetails!==null"-->
      <!--                     :item-uuid="itemDetails.uuid"-->
      <!--                     :expanded-timeline="expandedTimeline"-->
      <!--                     :key="'F'+ componentKey"-->

      <!--      />-->
    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useQuasar} from "quasar";
import {useUserStore} from "stores/user";
import {useI18n} from "vue-i18n";

import {deleteItemRequest, getOneItemRequest, setItemFavouriteRequest} from 'src/components/api/ItemApiClient.js'
import {errorHandler} from 'src/components/api/errorHandler.js'

import DescriptionCard from "components/viewer/cards/DescriptionCard.vue";
import PhotoCard from "components/viewer/cards/PhotoCard.vue";
import DocumentCard from "components/viewer/cards/DocumentCard.vue";
import GuideCard from "components/viewer/cards/GuideCard.vue";
import QrCard from "components/viewer/cards/QrCard.vue";

let itemDetails = ref(null);
let photoFiles = ref(null);
let documentFiles = ref(null);
let guidesList = ref(null);
let favouritesList = ref(null);
let qrCode = ref(null);
const guides = ref([]);


let isLoading = ref(false);
let isError = ref(false);

const $q = useQuasar();
const UserStore = useUserStore();

const permissions = computed(() => UserStore.getPermissions);

function hasPermission(permission) {
  if (permission === null) {
    return true;
  }
  return permissions.value === null ? false : Boolean(permissions.value.includes(permission));
}

const route = useRoute();
const router = useRouter();

const {t} = useI18n({useScope: "global"});
const confirmDeleteMessage = computed(() => t("Delete:"));
const successfulDeleteMessage = computed(() => t("Deleted:"));

const currentUserUuid = UserStore.getCurrentUserId

let expandedDescription = ref(JSON.parse(localStorage.getItem('visibility-item-description')) ?? true)
let expandedPhotos = ref(JSON.parse(localStorage.getItem('visibility-item-photos')) ?? true)
let expandedDocs = ref(JSON.parse(localStorage.getItem('visibility-item-docs')) ?? true)
let expandedGuide = ref(JSON.parse(localStorage.getItem('visibility-item-guides')) ?? true)
let expandedQR = ref(JSON.parse(localStorage.getItem('visibility-item-qr')) ?? true)
let expandedComments = ref(JSON.parse(localStorage.getItem('visibility-item-comments')) ?? true)
let expandedTimeline = ref(JSON.parse(localStorage.getItem('visibility-item-timeline')) ?? true)


function getItemDetails(uuid) {
  isLoading.value = true;

  getOneItemRequest(uuid).then(function (response) {
    console.log(response.data);
    itemDetails.value = response.data;

    photoFiles.value = response.data.files_item.filter((item) => item.mimetype.match('image.*'));
    documentFiles.value = response.data.files_item.filter((item) => !item.mimetype.match('image.*'));
    guidesList.value = response.data.item_guides;
    qrCode.value = response.data.qr_code;
    favouritesList.value = response.data.users_item.map(a => a.uuid)

    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage);
  });

}


function editItem(uuid) {
  router.push("/items/edit/" + uuid);
}

function itemReport(uuid) {
  router.push("/items/summary/" + uuid);
}

function deleteItem(uuid, itemName) {
  // console.log(itemName);
  $q.dialog({
    title: "Confirm",
    message: confirmDeleteMessage.value + " '" + itemName + "' ?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    isLoading.value = true;
    deleteItemRequest(uuid).then(function (response) {
      $q.notify({
        type: 'warning',
        message: successfulDeleteMessage.value + " " + itemName,
      });
      router.push("/items/");
      isLoading.value = false;
    }).catch((err) => {
      const errorMessage = errorHandler(err);
      isError.value = true;
    });
  });
}

function addToFavourite() {
  let data = {
    item_uuid: route.params.uuid,
    user_uuid: currentUserUuid,
  }
  isLoading.value = true;
  setItemFavouriteRequest(data).then(function (response) {
    getItemDetails(route.params.uuid);
    isLoading.value = false;

  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


function setSectionVisibility(condition) {
  console.log(condition)
  if (localStorage.getItem(condition) === null) {
    localStorage.setItem(condition, JSON.stringify(true))
  } else {
    let currentValue = JSON.parse(localStorage.getItem(condition))
    localStorage.setItem(condition, JSON.stringify(!currentValue))
  }

  forceRerender()
}

const componentKey = ref(0);

const forceRerender = () => {
  componentKey.value += 1;
};

function reportFailure(uuid) {
  router.push("/failure/" + uuid);
}

onBeforeMount(() => {
  isLoading.value = true;
  getItemDetails(route.params.uuid);

});

</script>
