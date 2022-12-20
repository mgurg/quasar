<template>
  <div class="row justify-center">
    <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
      <q-card bordered class="my-card no-shadow q-mt-sm">
        <q-card-section class="row q-pa-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/"/>
            <q-breadcrumbs-el :label="$t('Items')" icon="tips_and_updates" to="/items"/>
            <q-breadcrumbs-el :label="$t('View')" icon="info"/>
          </q-breadcrumbs>
        </q-card-section>

        <q-separator/>

        <q-card-section v-if="itemDetails && !isLoading">
          <q-list>
            <q-item class="q-px-none">
              <q-item-section>
                <q-item-label class="text-h6">{{ itemDetails.name }}</q-item-label>
                <!-- <q-item-label caption>{{ itemDetails.last_name }}</q-item-label> -->
              </q-item-section>
              <q-item-section side>
                <div class="col-12 text-h6 q-mt-none">
                  <q-btn
                    :label="$q.screen.gt.xs ? $t('Edit') : ''"
                    class="float-right q-mr-sm" color="primary"
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
        </q-card-section>

        <q-separator/>

        <q-card-actions align="right">
          <q-btn color="primary" flat icon="bug_report" no-caps>Zgłoś awarie</q-btn>
          <q-btn color="primary" flat icon="lightbulb_outline" no-caps>Usprawnienie</q-btn>
          <q-btn color="primary" flat icon="insights" no-caps>Statystyki</q-btn>
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
                  :body-content="itemDetails.description_jsonb"
                  :readonly="true"
                />
              </div>
            </q-card-section>
          </div>
        </q-slide-transition>

        <!--        PHOTOS -->
        <div :style="expandedPhotos ? 'border-left: 5px solid #2d7df8':''">
          <q-card-section class="q-py-sm">
            <div class="row q-col-gutter-xs">
              <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedPhotos = !expandedPhotos">
                Zdjęcia
              </div>
              <q-space></q-space>
              <q-btn
                :icon="expandedPhotos ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                color="grey"
                dense
                flat
                round
                @click="expandedPhotos = !expandedPhotos"
              />
            </div>

          </q-card-section>
          <q-separator v-show="!expandedPhotos"/>
          <q-slide-transition>
            <div v-show="expandedPhotos">

              <q-card-section :class="$q.screen.lt.sm?'q-mx-xs q-px-xs':'q-mx-md q-px-md'">
                <div class="q-mt-md">
                  <photo-viewer v-if="photoFiles && !isLoading" :pictures-list="photoFiles"/>
                </div>


              </q-card-section>
              <q-separator/>
            </div>
          </q-slide-transition>
        </div>
        <!--        DOCS  -->

        <div :style="expandedDocs ? 'border-left: 5px solid #f31060':''">
          <q-card-section class="q-py-sm">
            <div class="row q-col-gutter-xs">
              <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedDocs = !expandedDocs">Dokumenty
              </div>
              <q-space></q-space>
              <q-btn
                :icon="expandedDocs ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                color="grey"
                dense
                flat
                round
                @click="expandedDocs = !expandedDocs"
              />
            </div>

          </q-card-section>
          <q-separator v-if="!expandedDocs"/>
          <q-slide-transition>
            <div v-show="expandedDocs">
              <q-card-section :class="$q.screen.lt.sm?'q-mx-xs q-px-xs':'q-mx-md q-px-md'">

                <q-item :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-11'" class=" rounded-borders">
                  <q-item-section avatar>
                    <span>&nbsp;</span>
                  </q-item-section>
                  <q-item-section>
                    <span>
                      {{ $t("Name") }}
                      <q-btn
                        :flat="sort.active!=='title'"
                        :icon="sort.title==='asc'? 'arrow_upward':'arrow_downward'"
                        :unelevated="sort.active==='title'"
                        color="primary"
                        padding="xs"
                        size="sm"
                        @click="changeSortOrder('title')"/>
                    </span>
                  </q-item-section>

                </q-item>
                <div>
                  <document-viewer v-if="documentFiles && !isLoading" :files-list="documentFiles"/>
                </div>


              </q-card-section>
              <q-separator/>
            </div>
          </q-slide-transition>
        </div>
        <!--        GUIDES -->
        <div :style="expandedGuide ? 'border-left: 5px solid #2bba82':''">
          <q-card-section class="q-py-sm">
            <div class="row q-col-gutter-xs">
              <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedGuide = !expandedGuide">
                Instrukcje
              </div>
              <q-space></q-space>
              <q-btn class="q-mr-lg" color="primary" flat no-caps>Dodaj nową</q-btn>
              <q-btn :icon="expandedGuide ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat round
                     @click="expandedGuide = !expandedGuide"/>
            </div>

          </q-card-section>

          <q-separator v-if="!expandedGuide"/>
          <q-slide-transition>
            <div v-show="expandedGuide">

              <q-card-section>

                <q-list v-if="!isLoading && pagination.total > 0">

                  <q-item :class="$q.dark.isActive?'bg-blue-grey-10':'bg-blue-grey-11'" class=" rounded-borders">
                    <q-item-section avatar>
                      <span>&nbsp;</span>
                    </q-item-section>
                    <q-item-section>
                    <span>
                      {{ $t("Name") }}
                      <q-btn
                        :flat="sort.active!=='title'"
                        :icon="sort.title==='asc'? 'arrow_upward':'arrow_downward'"
                        :unelevated="sort.active==='title'"
                        color="primary"
                        padding="xs"
                        size="sm"
                        @click="changeSortOrder('title')"/>
                    </span>
                    </q-item-section>

                  </q-item>

                  <div v-for="(guide, index) in guides" v-if="guides!= null" v-bind:key="index">
                    <guide-item v-if="!isLoading" :guide="guide" @forceRefresh="fetchGuides"></guide-item>
                  </div>

                </q-list>

              </q-card-section>
            </div>
          </q-slide-transition>
        </div>

        <!--  QR CODE -->
        <div :style="expandedQR ? 'border-left: 5px solid #4c29bb':''">
          <q-card-section class="q-py-sm">
            <div class="row q-col-gutter-xs">
              <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedQR = !expandedQR">Kod QR</div>
              <q-space></q-space>
              <q-btn :icon="expandedQR ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat round
                     @click="expandedQR = !expandedQR"/>
            </div>

          </q-card-section>

          <q-separator v-if="!expandedQR"/>
          <q-slide-transition>
            <div v-show="expandedQR">

              <q-card-section>

                <div v-if="qrCode!==null" class="row">
                  <div class="q-pa-xs col-xs-12 col-sm-6">
                    <img
                      :src="GenerateQR(qrCode.qr_code_content, qrCode.ecc)"
                    />
                    <p>Jeśli chcesz wygenerować kod samodzielnie, użyj tekstu:</p>
                    <p class="text-weight-bold">{{ generateQRUrl(qrCode.qr_code_content) }}</p>
                  </div>
                  <div class="q-pa-xs col-xs-12 col-sm-6">
                    <p>To specjalny <span class="text-weight-bold">obraz z zakodowaną informacją</span>, który może być
                      odczytany przez kamerę/aparat w telefonie komórkowym.
                      <span class="text-weight-bold">Wydruku i przyklej na urządzenie.</span></p>
                    <img v-if="$q.screen.gt.sm" src="~assets/qr-code-scan-mini.gif">
                    <p>Uruchom opcję robienia zdjęć w telefonie - jeżeli obraz znajdzie się kadrze zobaczysz
                      rozszyfrowany tekst.
                      Jego <span class="text-weight-bold">kliknięcie otworzy kartę informacyjną</span> tego urządzenia
                    </p>
                    <!--                    <p>{{ qrCode }} {{qrCodeSize}}</p>-->
                    <!--                    <q-btn-toggle-->
                    <!--                      class="q-mr-sm"-->
                    <!--                      v-model="qrCodeSize"-->
                    <!--                      unelevated-->
                    <!--                      :options="[-->
                    <!--                        {label: 'S', value: 300},-->
                    <!--                        {label: 'M', value: 600},-->
                    <!--                        {label: 'L', value: 1000}-->
                    <!--                      ]"-->
                    <!--                      toggle-color="primary"-->
                    <!--                    />-->

                    <q-btn
                      :href="GenerateQR(qrCode.qr_code_content, qrCode.ecc, qrCodeSize)"

                      download
                      icon="download"
                      no-caps
                      outline
                      target="_blank"
                      type="a"
                    >Pobierz plik do druku
                    </q-btn>
                  </div>
                </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </div>

        <!--  Comments -->
        <div :style="expandedComments ? 'border-left: 5px solid #fb510a':''">
          <q-card-section class="q-py-sm">
            <div class="row q-col-gutter-xs">
              <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedComments = !expandedComments">
                Komentarze
              </div>
              <q-space></q-space>
              <q-btn :icon="expandedComments ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat
                     round
                     @click="expandedComments = !expandedComments"/>
            </div>

          </q-card-section>

          <q-separator v-if="!expandedComments"/>
          <q-slide-transition>
            <div v-show="expandedComments">

              <q-card-section>

                <div class="q-pa-md row justify-center">
                  <div style="width: 100%; max-width: 600px">
                    <q-chat-message
                      :text="['Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut\n'+
'                      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris\n'+
'                      nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit\n'+
'                      esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt\n'+
'                      in culpa qui officia deserunt mollit anim id est laborum.']"
                      name="me"
                      sent
                      size="10"
                      stamp="7 minutes ago"
                    >
                      <template v-slot:avatar>
                        <q-avatar class="q-message-avatar q-message-avatar--sent" color="red" text-color="white">MG
                        </q-avatar>
                      </template>
                    </q-chat-message>
                    <q-chat-message
                      :text="[`doing fine, how r you?`]"
                      name="Jane"
                      size="8"
                      stamp="4 minutes ago"
                    >
                      <template v-slot:avatar>
                        <q-avatar class="q-message-avatar q-message-avatar--sent" color="red" text-color="white">MG
                        </q-avatar>
                      </template>
                    </q-chat-message>
                  </div>
                </div>
                <q-input label="Wyślij wiadomość" outlined>
                  <template v-slot:after>
                    <q-btn dense flat icon="send" round/>
                  </template>
                </q-input>
              </q-card-section>
            </div>
          </q-slide-transition>
        </div>


        <!--  Timeline -->
        <div :style="expandedTimeline ? 'border-left: 5px solid #a04d2c':''">
          <q-card-section class="q-py-sm">
            <div class="row q-col-gutter-xs">
              <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedTimeline = !expandedTimeline">Oś
                zdarzeń
              </div>
              <q-space></q-space>
              <q-btn :icon="expandedTimeline ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat
                     round
                     @click="expandedTimeline = !expandedTimeline"/>
            </div>

          </q-card-section>

          <q-separator v-if="!expandedTimeline"/>
          <q-slide-transition>
            <div v-show="expandedTimeline">

              <q-card-section>
                <div class="q-px-lg q-pb-md">
                  <q-timeline :layout="layout" color="secondary">
                    <q-timeline-entry heading>
                      Timeline heading
                      <br>
                      ({{ $q.screen.lt.sm ? 'Dense' : ($q.screen.lt.md ? 'Comfortable' : 'Loose') }} layout)
                    </q-timeline-entry>

                    <q-timeline-entry
                      side="left"
                      subtitle="February 22, 1986"
                      title="Event Title"
                    >
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                        velit
                        esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt
                        in culpa qui officia deserunt mollit anim id est laborum.
                      </div>
                    </q-timeline-entry>

                    <q-timeline-entry
                      icon="delete"
                      side="right"
                      subtitle="February 21, 1986"
                      title="Event Title"
                    >
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                        velit
                        esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt
                        in culpa qui officia deserunt mollit anim id est laborum.
                      </div>
                    </q-timeline-entry>

                    <q-timeline-entry heading>November, 2017</q-timeline-entry>

                    <q-timeline-entry
                      side="left"
                      subtitle="February 22, 1986"
                      title="Event Title"
                    >
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                        velit
                        esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt
                        in culpa qui officia deserunt mollit anim id est laborum.
                      </div>
                    </q-timeline-entry>

                    <q-timeline-entry
                      side="right"
                      subtitle="February 22, 1986"
                      title="Event Title"
                    >
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                        velit
                        esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt
                        in culpa qui officia deserunt mollit anim id est laborum.
                      </div>
                    </q-timeline-entry>

                    <q-timeline-entry
                      color="orange"
                      icon="done_all"
                      side="left"
                      subtitle="February 22, 1986"
                      title="Event Title"
                    >
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                        velit
                        esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt
                        in culpa qui officia deserunt mollit anim id est laborum.
                      </div>
                    </q-timeline-entry>

                    <q-timeline-entry
                      side="right"
                      subtitle="February 22, 1986"
                      title="Event Title"
                    >
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                        velit
                        esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt
                        in culpa qui officia deserunt mollit anim id est laborum.
                      </div>
                    </q-timeline-entry>

                    <q-timeline-entry
                      side="left"
                      subtitle="February 22, 1986"
                      title="Event Title"
                    >
                      <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                        velit
                        esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt
                        in culpa qui officia deserunt mollit anim id est laborum.
                      </div>
                    </q-timeline-entry>
                  </q-timeline>
                </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </div>

      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

import GuideItem from "components/listRow/GuideListRow.vue";
import TipTap from 'src/components/editor/TipTap.vue'
import PhotoViewer from 'src/components/viewer/PhotoViewer.vue'
import DocumentViewer from 'src/components/viewer/DocumentViewer.vue'

import {getGuideRequest} from 'src/components/api/GuideApiClient.js'
import {deleteItemRequest, getItemUuidRequest} from 'src/components/api/ItemApiClient.js'
import {errorHandler} from 'src/components/api/errorHandler.js'
import {useQuasar} from "quasar";
import {useUserStore} from "stores/user";
import {useI18n} from "vue-i18n";


let itemDetails = ref(null);
let photoFiles = ref(null);
let documentFiles = ref(null);
let qrCode = ref(null);
let qrCodeSize = ref(300);
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

// const layout = computed(() => {return $q.screen.lt.sm ? 'dense' : ($q.screen.lt.md ? 'comfortable' : 'loose');

const layout = computed(() => {
  return $q.screen.lt.sm ? 'dense' : ($q.screen.lt.md ? 'comfortable' : 'loose')
});

let expandedDescription = ref(true)
let expandedPhotos = ref(false)
let expandedDocs = ref(false)
let expandedGuide = ref(false)
let expandedQR = ref(false)
let expandedComments = ref(false)
let expandedTimeline = ref(false)


let sort = reactive({
  name: "asc",
  active: "name"
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 1
})

function fetchGuides() {
  isLoading.value = true;

  let params = {
    search: null,
    page: pagination.page,
    size: pagination.size,
    sortOrder: sort[sort.active],
    sortColumn: sort.active
  };

  getGuideRequest(params).then(function (response) {
    console.log(response.data);
    guides.value = response.data.items;
    pagination.total = response.data.total
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
  });
}


function getItemDetails(uuid) {
  isLoading.value = true;

  getItemUuidRequest(uuid).then(function (response) {
    console.log(response.data);
    itemDetails.value = response.data;


    // console.log("photoFiles")

    photoFiles.value = response.data.files_item.filter((item) => item.mimetype.match('image.*'));
    documentFiles.value = response.data.files_item.filter((item) => !item.mimetype.match('image.*'));
    qrCode.value = response.data.qr_code;
    // console.log(photoFiles.value)

    // documentFiles.value =  itemDetails.value;
    // json.value = res.data.body_json;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage);
  });

}

function changeSortOrder(column) {
  sort[column] === "asc" ? sort[column] = 'desc' : sort[column] = "asc"
  sort.active = column
  fetchItems()
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

function generateQRUrl(qrCodeId) {
  return process.env.VUE_BASE_URL + "/qr/" + qrCodeId;
}

function GenerateQR(qrCodeId, ecc, size = 300) {
  // http://beta.remontmaszyn.pl/qr/mxw+234

  let url = process.env.VUE_BASE_URL + "/qr/" + qrCodeId;
  console.log(url)

  return "https://chart.googleapis.com/chart?chs=" + size + "x" + size + "&cht=qr&chl=" + url + "&choe=UTF-8&chld=" + ecc
}

onBeforeMount(() => {
  isLoading.value = true;
  getItemDetails(route.params.uuid);
  fetchGuides();
});

</script>
