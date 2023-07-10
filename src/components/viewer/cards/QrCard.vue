<template>
  <!--  QR CODE -->
  <q-card bordered class="my-card no-shadow q-my-xs">
    <div :style="expandedQR ? 'border-left: 5px solid #4c29bb':''">
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="text-h6 text-weight-regular cursor-pointer" @click="expandedQR = !expandedQR">
            {{ $t("QR Code") }}
          </div>
          <q-space></q-space>
          <q-btn :icon="expandedQR ? 'keyboard_arrow_up' : 'keyboard_arrow_down'" color="grey" dense flat round
                 @click="expandedQR = !expandedQR"/>
        </div>

      </q-card-section>


      <q-slide-transition>
        <div v-show="expandedQR">

          <q-card-section>

            <div v-if="qrCode!==null" class="row">
              <div class="q-pa-xs col-xs-12 col-sm-6">
<!--                <img-->
<!--                  :src="GenerateQR(qrCode.qr_code_full_id, qrCode.ecc)"-->
<!--                  alt="qr code image"-->
<!--                />-->

                <QRCodeVue3
                  :dotsOptions="{
                    type: 'square',
                    color: '#000000',
                  }"
                  :backgroundOptions="{ color: '#ffffff' }"
                  :cornersSquareOptions="{ type: 'square', color: '#000000' }"
                  :cornersDotOptions="{ type: 'square', color: '#000000' }"

                  :download="true"
                  :downloadOptions="{ name: 'vqr', extension: 'png' }"
                  :value="GenerateQRUrl(qrCode.qr_code_full_id)"
                  fileExt="png"
                  imgclass="img-qr"
                  myclass="my-qur"
                />
                <p>Jeśli chcesz wygenerować kod samodzielnie, użyj tekstu:</p>
                <p class="text-weight-bold">{{ generateQRUrl(qrCode.qr_code_full_id) }}</p>
              </div>
              <div class="q-pa-xs col-xs-12 col-sm-6">
                <p>To specjalny <span class="text-weight-bold">obraz z zakodowaną informacją</span>, który może być
                  odczytany przez kamerę/aparat w telefonie komórkowym.
                  <span class="text-weight-bold">Wydruku i przyklej na urządzenie.</span></p>
                <img v-if="$q.screen.gt.sm" src="~assets/qr-code-scan-mini.gif">
                <p>Uruchom opcję robienia zdjęć w telefonie - jeżeli obraz znajdzie się kadrze zobaczysz
                  rozszyfrowany odnośnik.
                  Jego <span class="text-weight-bold">kliknięcie otworzy formularz zgłaszania usterek</span> tego urządzenia
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

                <q-btn class="my-button"
                  :href="GenerateQR(qrCode.qr_code_full_id, qrCode.ecc, qrCodeSize)"

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
  </q-card>
</template>

<script setup>
import {ref} from "vue";
import QRCodeVue3 from "qrcode-vue3";

const props = defineProps({
  qrCode: {
    type: Object,
    default() {
      return {
        ecc: null,
        qr_code_full_id: null,
        resource: null,
      }
    }
  },
  expandedQr: {
    type: Boolean,
    default: false,
  },
})

const expandedQR = ref(props.expandedQr)
const qrCode = ref(props.qrCode)
const qrCodeSize = ref(300)


function generateQRUrl(qrCodeId) {

  return process.env.VUE_BASE_URL + "/qr/" + qrCodeId;
}

function GenerateQRUrl(qrCodeId) {
  qrCodeId = qrCodeId.replace("+", "%2B")
  return process.env.VUE_BASE_URL + "/qr/" + qrCodeId;
}

function GenerateQR(qrCodeId, ecc, size = 300) {
  // https://app.malgori.pl/qr/mxw+234

  qrCodeId = qrCodeId.replace("+", "%2B")
  let url = process.env.VUE_BASE_URL + "/qr/" + qrCodeId;
  // console.log(qrCodeId)
  // console.log("QR: " + url)

  return "https://chart.googleapis.com/chart?chs=" + size + "x" + size + "&cht=qr&chl=" + url + "&choe=UTF-8&chld=" + ecc
}
</script>
