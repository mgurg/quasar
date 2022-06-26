<template>
  <q-layout>
    <div class="row justify-center text-blue-grey-10">
      <q-page class="col-lg-8 col-sm-10 col-xs q-pa-xs">
        <!-- <p class="text-h4">Voice recognition demo</p> -->
        {{ note }}
        <div>
          <header>
            <p class="text-h4"> Speech Recognition </p>
            <i class="header-icon fas fa-microphone-alt"></i>
          </header>
          <main>

            <!-- <p class="text-h4"> English Transcript </p> -->
            <!-- Conditionals to handle errors -->
            <p v-if="error">{{ error }}</p>
            <div v-else>
              <q-input outlined type="textarea" rows="5" v-model="note" :label="$t('Task description')">
                <template v-slot:append>
                  <q-btn round dense flat icon="mic"  @click="toggleListening" />
                  <!-- <q-btn round dense flat icon="mic_off" v-if="isListening" color="red" @click="stop" /> -->
                </template>
              </q-input>
              <textarea v-model="note" class="text-transcript" cols="30" rows="10">  </textarea>
            </div>
          </main>
        </div>

      </q-page>
    </div>
  </q-layout>
</template>

<script setup>
import { useStt } from 'src/composables/useStt.js'
const { startListening,  stopListening,  toggleListening,  note,  error, } = useStt({})


</script>


