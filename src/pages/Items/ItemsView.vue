<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-list>
          <q-item class="q-px-sm">
            <q-item-section avatar>
              <q-btn color="grey" flat @click="router.back()">← back</q-btn>
            </q-item-section>
          <q-item-section></q-item-section>
          <q-item-section side>
            <div class="col-12 text-h6 q-mt-none">
<!--              <q-btn-->
<!--                class="float-right q-mr-sm"-->
<!--                color="grey"-->
<!--                dense-->
<!--                flat-->
<!--                round-->
<!--                icon="settings"-->
<!--                no-caps @click="deleteItem(itemDetails.uuid, itemDetails.name)"-->
<!--              />-->
              <q-btn-dropdown color="grey" class="float-right q-mr-sm" dense flat round dropdown-icon="settings">
                <q-list bordered>
                  <q-item-label header>Notifications</q-item-label>

                  <q-item tag="label" v-ripple>
                    <q-item-section>
                      <q-item-label>Opis</q-item-label>
                    </q-item-section>
                    <q-item-section side >
                      <q-toggle v-model="expandedDescription" />
                    </q-item-section>
                  </q-item>

                  <q-item tag="label" v-ripple>
                    <q-item-section>
                      <q-item-label>Zdjęcia</q-item-label>
                      <q-item-label caption>Allow notification</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-toggle v-model="expandedPhotos"  />
                    </q-item-section>
                  </q-item>

                  <q-item tag="label" v-ripple>
                    <q-item-section>
                      <q-item-label>Dokumenty</q-item-label>
                      <q-item-label caption>Allow notification when uploading images</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-toggle v-model="expandedDocs" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-btn
                :label="$q.screen.gt.xs ? $t('Edit') : ''"
                class="float-right q-mr-sm" color="primary" flat
                icon="edit" no-caps
                outline @click="editItem(itemDetails.uuid)"
              />
              <q-btn
                :label="$q.screen.gt.xs ? $t('Delete') : ''"
                class="float-right q-mr-sm" color="red" flat
                icon="delete"
                no-caps @click="deleteItem(itemDetails.uuid, itemDetails.name)"
              />

            </div>
          </q-item-section>
          </q-item>
        </q-list>

<!--        <q-card-section class="row q-pa-sm">-->

<!--          <a class="cursor-pointer" @click="router.back()">← back</a>-->
<!--          <q-space></q-space>-->

<!--&lt;!&ndash;          <q-breadcrumbs>&ndash;&gt;-->
<!--&lt;!&ndash;            <q-breadcrumbs-el icon="home" to="/"/>&ndash;&gt;-->
<!--&lt;!&ndash;            <q-breadcrumbs-el :label="$t('Items')" icon="apps" to="/items"/>&ndash;&gt;-->
<!--&lt;!&ndash;            <q-breadcrumbs-el :label="$t('View')" icon="info"/>&ndash;&gt;-->
<!--&lt;!&ndash;          </q-breadcrumbs>&ndash;&gt;-->
<!--          <div class="col-12 text-h6 q-mt-none">-->
<!--            <q-btn-->
<!--              :label="$q.screen.gt.xs ? $t('Edit') : ''"-->
<!--              dense-->
<!--              class="float-right q-mr-sm" color="primary"-->
<!--              icon="edit" no-caps-->
<!--              outline @click="editItem(itemDetails.uuid)"-->
<!--            />-->
<!--            <q-btn-->
<!--              :label="$q.screen.gt.xs ? $t('Delete') : ''"-->
<!--              dense-->
<!--              class="float-right q-mr-sm" color="red" flat-->
<!--              icon="delete"-->
<!--              no-caps @click="deleteItem(itemDetails.uuid, itemDetails.name)"-->
<!--            />-->
<!--          </div>-->
<!--        </q-card-section>-->

<!--        <q-separator/>-->

        <q-card-section v-if="itemDetails && !isLoading" class="q-pt-none">
<!--          <q-breadcrumbs>-->
<!--            <q-breadcrumbs-el icon="home" to="/"/>-->
<!--            <q-breadcrumbs-el :label="$t('Items')" icon="apps" to="/items"/>-->
<!--            <q-breadcrumbs-el icon="info"/>-->
<!--          </q-breadcrumbs>-->

          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h5">{{ itemDetails.name }}</q-item-label>
<!--                 <q-item-label caption>{{ itemDetails.summary }}</q-item-label>-->
                <q-item-label caption>Krótki publicznie dostępny opis</q-item-label>
              </q-item-section>
<!--              <q-item-section side>-->
<!--                <div class="col-12 text-h6 q-mt-none">-->
<!--                  <q-btn-->
<!--                    :label="$q.screen.gt.xs ? $t('Edit') : ''"-->
<!--                    class="float-right q-mr-sm" color="primary"-->
<!--                    icon="edit" no-caps-->
<!--                    outline @click="editItem(itemDetails.uuid)"-->
<!--                  />-->
<!--                  <q-btn-->
<!--                    :label="$q.screen.gt.xs ? $t('Delete') : ''"-->
<!--                    class="float-right q-mr-sm" color="red" flat-->
<!--                    icon="delete"-->
<!--                    no-caps @click="deleteItem(itemDetails.uuid, itemDetails.name)"-->
<!--                  />-->
<!--                </div>-->
<!--              </q-item-section>-->
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator/>

        <q-card-actions align="right">
          <q-btn color="primary" flat icon="bug_report" no-caps>Zgłoś awarie</q-btn>
          <q-btn color="primary" flat icon="lightbulb_outline" no-caps>Usprawnienie</q-btn>
          <q-btn color="primary" flat icon="insights" no-caps>Raporty</q-btn>
        </q-card-actions>
      </q-card>


      <q-card bordered class="my-card no-shadow q-my-sm">
        <q-card-section class="q-py-sm">
          <div class="row q-col-gutter-xs">

            <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedDescription = !expandedDescription">
              Opis
            </div>
            <q-space/>
            <q-btn :icon="expandedDescription ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                   color="grey"
                   dense
                   flat
                   round
                   @click="expandedDescription = !expandedDescription"/>
          </div>
        </q-card-section>
        <q-separator v-if="!expandedDescription"/>
        <q-slide-transition>
          <div v-show="expandedDescription">
            <q-card-section>
              <div
                :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-1', $q.screen.lt.sm?'q-py-md q-pl-sm':'q-py-lg q-pl-md'"
                class="rounded-borders">
                <tip-tap
                  v-if="itemDetails && !isLoading"
                  :body-content="itemDetails.text_json"
                  :readonly="true"
                />
              </div>
            </q-card-section>
          </div>
        </q-slide-transition>

      </q-card>
      <photo-card v-if="photoFiles!==null" :expanded-photos="false" :photo-files="photoFiles"/>
      <document-card v-if="documentFiles!==null" :document-files="documentFiles" :expanded-docs="false"/>
      <guide-card v-if="guidesList!==null && itemDetails !==null" :expanded-guide="false" :guides="guidesList"
                  :item-uuid="itemDetails.uuid" :public-access="false"/>
      <qr-card v-if="qrCode!==null" :expanded-q-r="false" :qr-code="qrCode"/>
      <chat-card :expanded-comments="false"/>
      <timeline-card :expanded-timeline="false"/>
    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import TipTap from 'src/components/editor/TipTap.vue'

import PhotoCard from "components/viewer/cards/PhotoCard.vue";
import DocumentCard from "components/viewer/cards/DocumentCard.vue";
import GuideCard from "components/viewer/cards/GuideCard.vue";
import QrCard from "components/viewer/cards/QrCard.vue";
import ChatCard from "components/viewer/cards/ChatCard.vue";
import TimelineCard from "components/viewer/cards/TimelineCard.vue";
import {deleteItemRequest, getItemUuidRequest} from 'src/components/api/ItemApiClient.js'
import {errorHandler} from 'src/components/api/errorHandler.js'
import {useQuasar} from "quasar";
import {useUserStore} from "stores/user";
import {useI18n} from "vue-i18n";


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

  getItemUuidRequest(uuid).then(function (response) {
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

onBeforeMount(() => {
  isLoading.value = true;
  getItemDetails(route.params.uuid);

});

</script>
