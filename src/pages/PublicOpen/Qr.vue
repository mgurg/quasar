<template>
  <q-layout>
    <q-page-container>
      <div class="row justify-center">
        <q-linear-progress stripe size="20px" :value="validToProgress" />
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">


          <q-card bordered class="my-card no-shadow q-mt-sm">
            <q-card-section v-if="itemDetails && !isLoading">
              <q-list>
                <q-item class="q-px-none">
                  <q-item-section>
                    <q-item-label class="text-h4">{{ itemDetails.name }}</q-item-label>
                    <!-- <q-item-label caption>{{ itemDetails.last_name }}</q-item-label> -->
                  </q-item-section>
                  <q-item-section side>
                    <div class="col-12 text-h6 q-mt-none">
                      <q-btn
                        :label="$q.screen.gt.xs ? 'Zaloguj się żeby zobaczyć wszystkie dane' : ''"
                        class="float-right q-mr-sm" color="primary"
                        icon="login" no-caps
                        outline
                        @click="redirectToPage('/login')"
                      />

                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>

            <q-separator/>

            <q-card-actions align="right">
              <q-btn color="primary" icon="bug_report" no-caps flat>Zgłoś awarie</q-btn>
            </q-card-actions>
          </q-card>

          <q-card bordered class="my-card no-shadow q-my-sm">
            <!--        GUIDES -->
            <div>
              <q-card-section class="q-py-sm">
                <div class="row q-col-gutter-xs">
                  <div @click="expandedGuide = !expandedGuide" class="text-h6 text-weight-regular cursor-pointer">Instrukcje</div>
                  <q-space></q-space>
                  <q-btn :icon="expandedGuide ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat round
                         @click="expandedGuide = !expandedGuide"/>
                </div>

              </q-card-section>

              <q-separator v-if="!expandedGuide" />
              <q-slide-transition>
                <div v-show="expandedGuide">

                  <q-card-section>

                    <q-list v-if="!isLoading">

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
                        <guide-item v-if="!isLoading" :guide="guide"></guide-item>
                      </div>

                    </q-list>

                  </q-card-section>
                </div>
              </q-slide-transition>
            </div>
          </q-card>

          <q-card bordered class="my-card no-shadow q-my-sm">
            <q-card-section>
              <div class="row q-col-gutter-xs">
                <div class="text-h5">Awaria</div>
                <q-space></q-space>
                <q-btn :icon="expandedFailureReport ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat
                       round
                       @click="expandedFailureReport = !expandedFailureReport"/>
              </div>

            </q-card-section>

            <q-slide-transition>
              <div v-show="expandedFailureReport">
                AAAA
              </div>
            </q-slide-transition>
          </q-card>

          <div class="q-pa-md">


            <div v-if="redirectTo!=null">
              {{ isAuthenticated }} <br>
              {{ qrId }} <br>
              {{ anonymousToken }} <br>
              {{ tenantId }} <br>
              {{ validTo }} <br>
              {{ redirectTo }}<br>

            </div>


            <br>
            <router-link v-if="isAuthenticated===false" to="/login">Zaloguj</router-link>
            <!-- <img
              src="https://chart.googleapis.com/chart?chs=400x400&cht=qr&chl=https://remontmaszyn.pl/new/8tl+234&choe=UTF-8&chld=M"
              alt="string"
            /> -->

          </div>
        </q-page>
      </div>
    </q-page-container>
  </q-layout>

</template>

<script setup>
import {computed, onBeforeMount, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {resolveQRtoURL} from "components/api/AuthApiClient";
import {errorHandler} from "components/api/errorHandler";
import {useUserStore} from "stores/user";
import {getAnonymousItemUuidRequest} from "components/api/ItemApiClient";
import GuideItem from "components/listRow/GuideListRow.vue";
import {DateTime} from "luxon";

const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();

const qrId = ref(null);
const itemUuid = ref(null);

const isAuthenticated = ref(null);
const anonymousToken = ref(null);
const tenantId = ref(null);
const validTo = ref(null);
const validToProgress = ref(0);
const redirectTo = ref(null);

let expandedGuide = ref(true)
let expandedFailureReport = ref(true)

const isLoading = ref(false);
let isError = ref(false);

let sort = reactive({
  name: "asc",
  active: "name"
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 1
})

async function verifyToken() {
  console.log('verifyToken')
  await UserStore.autoLogin();
}

function redirectToPage(page){
  //  /items/094b4373-a120-42f5-90ed-23dbfbe1cd9d
  router.push({ name: 'login', query: { redirect: redirectTo.value } })
}

function goToPage() {
  if (UserStore.isAuthenticated === true) {
    router.push(redirectTo.value);
  }
}

function countDown(){

  if (validTo.value !==null){
    console.log("validTo: " + DateTime.fromFormat(validTo.value, 'yyyy-MM-dd HH:mm:ss', {zone: 'UTC'}).toFormat('yyyy-LL-dd HH:mm:ss z'))
    console.log("validFrom: " + DateTime.now().setZone("UTC").toFormat('yyyy-LL-dd HH:mm:ss z'))

    const to = DateTime.fromFormat(validTo.value, 'yyyy-MM-dd HH:mm:ss',{zone: 'UTC'})
    const now = DateTime.now().setZone("UTC")

    const remainingTime = Math.abs(now.diff(to, 'minutes').as('minutes'));
    console.log(1-(remainingTime/15))
    validToProgress.value = 1-(remainingTime/15)
  }
    setTimeout(countDown, 5000);


}

function resolveQrCode(qrCode) {
  isLoading.value = true;
  console.log("ID: ", qrCode)

  resolveQRtoURL(qrCode).then(function (response) {
    console.log(response.data)



    const lastIndex = response.data.url.lastIndexOf('/');
    if (lastIndex !== -1) {
      itemUuid.value = response.data.url.slice(lastIndex + 1)
      console.log(response.data.url.slice(lastIndex + 1));
    }


    anonymousToken.value = response.data.anonymous_token
    tenantId.value = atob(anonymousToken.value).split(".")[0]
    validTo.value= atob(anonymousToken.value).split(".")[1]

    sessionStorage.clear();
    sessionStorage.setItem("anonymousToken", anonymousToken.value );
    sessionStorage.setItem("anonymousTenantId", tenantId.value );
    sessionStorage.setItem("anonymousTokenValidTo", validTo.value );

    // const now = DateTime.now()
    // const to =  DateTime.fromFormat(validTo.value, 'yyyy-MM-dd HH:mm:ss')
    //
    // console.log(now.toLocaleString(DateTime.DATETIME_FULL))
    // console.log(to.toLocaleString(DateTime.DATETIME_FULL))
    // const diff = now.diff(to, ["years", "months", "days", "hours"])





    // console.log(diff.as('seconds'))

    // const diff = DateTime.fromFormat('2022-12-19 11:12:35', 'yyyy-MM-dd HH:mm:ss').diff(DateTime.now(),'minutes');
    // console.log("Time  diff: " + diff)



    redirectTo.value = response.data.url;
    isAuthenticated.value = UserStore.isAuthenticated;
    if (UserStore.isAuthenticated === true) {
      router.push(redirectTo.value);
    } else {
      // getItemDetails('dd11ca7d-038f-4315-9b0d-a582a07db4d1')
      console.log('Czeka na logowanie')
    }
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    isError.value = true;
  });
}


let itemDetails = ref(null);
let photoFiles = ref(null);
let documentFiles = ref(null);
const guides = ref([]);


function getItemDetails(uuid) {
  isLoading.value = true;

  console.log(uuid)
  console.log(anonymousToken.value)
  console.log(tenantId.value)

  getAnonymousItemUuidRequest(uuid, anonymousToken.value, tenantId.value).then(function (response) {
    console.log(response.data);
    itemDetails.value = response.data;

    console.log("photoFiles")

    photoFiles.value = response.data.files_item.filter((item) => item.mimetype.match('image.*'));
    documentFiles.value = response.data.files_item.filter((item) => !item.mimetype.match('image.*'));
    guides.value = response.data.item_guides;
    console.log(photoFiles.value)

    // documentFiles.value =  itemDetails.value;
    // json.value = res.data.body_json;
    isLoading.value = false;
  }).catch((err) => {
    const errorMessage = errorHandler(err);
    console.log(errorMessage);
  });
}

onBeforeMount(() => {
  countDown();
  isLoading.value = true;
  verifyToken();
  // UserStore.autoLogin();

  if (route.params.qr != null) {
    qrId.value = route.params.qr
    resolveQrCode(qrId.value);
  }
  isLoading.value = false;
});


</script>
