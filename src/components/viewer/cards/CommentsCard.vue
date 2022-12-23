<template>
  <!--  Comments -->
  <q-card bordered class="my-card no-shadow q-my-xs">
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
  </q-card>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps({
  expandedComments: {
    type: Boolean,
    default: false,
  },
})

const expandedComments = ref(props.expandedComments)

</script>
