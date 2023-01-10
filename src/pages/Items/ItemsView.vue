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
                        <q-item-label caption>Określ które sekcje (Moje zadania/urządzenia) będę domyślnie rozwinięte</q-item-label>
                      </q-item-section>

                    </q-item>

                    <q-item v-ripple tag="label">
                      <q-item-section>
                        <q-item-label>Opis</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-toggle v-model="expandedDescription"/>
                      </q-item-section>
                    </q-item>

                    <q-item v-ripple tag="label">
                      <q-item-section>
                        <q-item-label>Zdjęcia</q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                        <q-toggle v-model="expandedPhotos"/>
                      </q-item-section>
                    </q-item>

                    <q-item v-ripple tag="label">
                      <q-item-section>
                        <q-item-label>Dokumenty</q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                        <q-toggle v-model="expandedDocs"/>
                      </q-item-section>
                    </q-item>
                    <q-item v-ripple tag="label">
                      <q-item-section>
                        <q-item-label>Przewodniki</q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                        <q-toggle v-model="expandedGuide"/>
                      </q-item-section>
                    </q-item>
                    <q-item v-ripple tag="label">
                      <q-item-section>
                        <q-item-label>Kod QR</q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                        <q-toggle v-model="expandedQR"/>
                      </q-item-section>
                    </q-item>
                    <q-item v-ripple tag="label">
                      <q-item-section>
                        <q-item-label>Komentarze</q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                        <q-toggle v-model="expandedComments"/>
                      </q-item-section>
                    </q-item>
                    <q-item v-ripple tag="label">
                      <q-item-section>
                        <q-item-label>Oś czasu</q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                        <q-toggle v-model="expandedTimeline"/>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                <q-btn
                  :label="$q.screen.gt.xs ? 'Ulubiony' : ''"
                  class="float-right q-mr-sm" color="accent" flat
                  icon="favorite_border" no-caps
                  outline @click="addToFavourite(itemDetails.uuid)"
                />
                <q-btn
                  :label="$q.screen.gt.xs ? $t('Edit') : ''"
                  class="float-right q-mr-sm" color="primary" flat
                  icon="edit" no-caps
                  outline @click="editItem(itemDetails.uuid)"
                />
                <q-btn
                  :label="$q.screen.gt.xs ? $t('Delete') : ''"
                  disable
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
                <q-item-label caption>Krótki, publicznie dostępny opis</q-item-label>
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
          <q-btn class="q-px-xs" color="primary" flat icon="insights" no-caps>Raporty</q-btn>
        </q-card-actions>
      </q-card>


      <description-card v-if="itemDetails!==null" :expanded-description="true" :textJson="itemDetails.text_json"/>
      <photo-card v-if="photoFiles!==null" :expanded-photos="false" :photo-files="photoFiles"/>
      <document-card v-if="documentFiles!==null" :document-files="documentFiles" :expanded-docs="false"/>
      <guide-card v-if="guidesList!==null && itemDetails !==null" :expanded-guide="false" :guides="guidesList"
                  :item-uuid="itemDetails.uuid" :public-access="false"/>
      <qr-card v-if="qrCode!==null" :expanded-qr="false" :qr-code="qrCode"/>
      <comments-card :expanded-comments="false"/>
      <timeline-card v-if="itemDetails!==null" :expanded-timeline="false" :item-uuid="itemDetails.uuid"/>
    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useQuasar} from "quasar";
import {useUserStore} from "stores/user";
import {useI18n} from "vue-i18n";

import {deleteItemRequest, getOneItemRequest} from 'src/components/api/ItemApiClient.js'
import {errorHandler} from 'src/components/api/errorHandler.js'

import DescriptionCard from "components/viewer/cards/DescriptionCard.vue";
import PhotoCard from "components/viewer/cards/PhotoCard.vue";
import DocumentCard from "components/viewer/cards/DocumentCard.vue";
import GuideCard from "components/viewer/cards/GuideCard.vue";
import QrCard from "components/viewer/cards/QrCard.vue";
import CommentsCard from "components/viewer/cards/CommentsCard.vue";
import TimelineCard from "components/viewer/cards/TimelineCard.vue";

let itemDetails = ref(null);
let photoFiles = ref(null);
let documentFiles = ref(null);
let guidesList = ref(null)
let qrCode = ref(null);
const guides = ref([]);
let isLoading = ref(false);
let isError = ref(false);

const $q = useQuasar();
const UserStore = useUserStore();
const route = useRoute();
const router = useRouter();

const {t} = useI18n({useScope: "global"});
const confirmDeleteMessage = computed(() => t("Delete:"));
const successfulDeleteMessage = computed(() => t("Deleted:"));


let expandedDescription = ref(true)
let expandedPhotos = ref(false)
let expandedDocs = ref(false)
let expandedGuide = ref(false)
let expandedQR = ref(false)
let expandedComments = ref(false)
let expandedTimeline = ref(false)


function getItemDetails(uuid) {
  isLoading.value = true;

  getOneItemRequest(uuid).then(function (response) {
    console.log(response.data);
    itemDetails.value = response.data;

    photoFiles.value = response.data.files_item.filter((item) => item.mimetype.match('image.*'));
    documentFiles.value = response.data.files_item.filter((item) => !item.mimetype.match('image.*'));
    guidesList.value = response.data.item_guides;
    qrCode.value = response.data.qr_code;

    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage);
  });

}


function editItem(uuid) {
  router.push("/items/edit/" + uuid);
}

function deleteItem(uuid, itemName) {
  console.log(itemName);
  $q.dialog({
    title: "Confirm",
    message: confirmDeleteMessage.value + " '" + itemName + "' ?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    isLoading = true;
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
  console.log('<3')
}

function reportFailure(uuid) {
  router.push("/failure/" + uuid);
}

onBeforeMount(() => {
  isLoading.value = true;
  getItemDetails(route.params.uuid);

});

</script>
