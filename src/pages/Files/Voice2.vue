<template>
  <q-layout>
    <q-page-container>
      <div class="row justify-center text-blue-grey-10">
        <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
          <!-- <p class="text-h4">Voice recognition demo</p> -->
          {{ result }}<br/>
          {{ raw }}
          <div v-if="!isSupported">
            Your browser does not support SpeechRecognition API,
            <a href="https://caniuse.com/mdn-api_speechrecognition" target="_blank">more details</a>
          </div>
          <div v-else>
            <header>
              <p :class="$q.dark.isActive?'text-blue-grey-1':'text-blue-grey-10'" class="text-h4"> Speech
                Recognition </p>
              <i class="header-icon fas fa-microphone-alt"></i>
            </header>
            <main>
              <div class="mic-buttons">
                <!-- To handle the controls -->
                <button v-if="!isListening" @click="start">
                  Speak
                </button>
                <button v-if="isListening" class="orange" @click="stop">
                  Stop
                </button>
              </div>
              <!-- <p class="text-h4"> English Transcript </p> -->
              <!-- Conditionals to handle errors -->
              <p v-if="error">{{ error }}</p>
              <div v-else>
                <q-input v-model="text" :label="$t('Task description')" outlined rows="5" type="textarea">
                  <template v-slot:append>
                    <q-btn v-if="!isListening" dense flat icon="mic" round @click="start"/>
                    <q-btn v-if="isListening" color="red-12" dense flat icon="mic_off" round @click="stop"/>
                  </template>
                </q-input>
              </div>

              <p>Android: {{ isAndroid }}</p>
              <p>isListening: {{ isListening }}</p>
            </main>
          </div>

        </q-page>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {ref, watch} from "vue";
import {useSpeechRecognition} from 'src/composables/useSpeechRecognition.js'
import {useAndroidDetection} from 'src/composables/useAndroidDetection.js'

const {isListening, isSupported, stop, result, raw, start, error} = useSpeechRecognition({
  lang: 'pl-PL',
  continuous: false,
  interimResults: false,
})
const {isAndroid} = useAndroidDetection()

const text = ref("13 ")

watch(result, (newValue, oldValue) => {

  text.value = text.value + ' ' + newValue

})

</script>


