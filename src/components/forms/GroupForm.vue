<template>
      <div class="row">
        &nbsp;
   
      </div>
    <q-form 
      autocorrect="off" 
      autocapitalize="off" 
      autocomplete="off" 
      spellcheck="false" 
      class="q-gutter-md" 
      @submit.prevent
    >

    <q-input
      outlined
      v-model="groupName"
      :disable="isLoading"
      :readonly="!allowEdit"
      :error="!!errors.groupName"
      :error-message="errors.groupName"
      :label="$t('Name')"
    >                    
      <template v-slot:prepend>
        <q-avatar rounded color="blue-grey-1" size="xl" @click="showEmojiPicker = true" class="cursor-pointer"> {{nativeEmojiSymbol}}</q-avatar>
      </template>
    </q-input>
               
    <q-input
      outlined
      v-model="groupDescription"
      :disable="isLoading"
      :readonly="!allowEdit"
      :error="!!errors.groupDescription"
      :error-message="errors.groupDescription"
      :label="$t('Description')"
    />
    <q-list>
      <div v-for="(user, index) in allUsers" v-bind:key="index">
        <q-item tag="label" v-ripple>
          <q-item-section avatar top>
            <q-checkbox v-model="groupUsers" :val="user.uuid" :disable="!allowEdit" color="cyan" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{user.first_name}} {{user.last_name}}</q-item-label>
            <q-item-label caption>
              {{user.description}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-list>
    <div class="row">
            <q-btn type="submit" color="red-12" @click="cancelButtonHandle">{{ $t("Cancel") }}</q-btn>
            <q-space />
            <q-btn v-if="allowEdit" type="submit" color="primary" @click="submit">{{ $t(buttonText) }}</q-btn>
            <q-btn v-if="!allowEdit" type="submit" color="primary" @click="enableEditMode">{{ $t("Edit") }}</q-btn>
        </div>

    </q-form>

    <q-dialog  v-model="showEmojiPicker" v-if="allowEdit">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Close icon</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <Picker 
          :data="emojiIndex"
          :style="{ width: '100%'}"
          set="twitter"      
          @select="showEmoji"
          :showSearch="false"
          :showSkinTones="false"
          :showPreview="false" 
          />
        </q-card-section>
      </q-card>
    </q-dialog>
</template>


<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { authApi } from "boot/axios";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";



import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import data from "emoji-mart-vue-fast/data/twitter.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";


import { useField, useForm } from "vee-validate";
import * as yup from 'yup';

const handleEmojiClick = (detail) => {}

const props = defineProps({
    group: {
        type: Object,
        default() {
            return {
              name: '',
              description: '',
              symbol: ':+1:',
              users: []

            }
        }
    },
    groupUuid: {
        type: String,
        default: null,
    },
    buttonText: {
        type: String,
        default: 'Save',
    },
    canEdit: {
        type: Boolean,
        default: false,
    },
})

let emojiIndex = new EmojiIndex(data);
let emojiOutput = ref(props.group.symbol);
const nativeEmojiSymbol = computed(() => (emojiIndex.findEmoji(emojiOutput.value).native))

console.log(props.group);

const showEmojiPicker = ref(false);

function showEmoji(emoji) {
  emojiOutput.value = emoji.colons;
  showEmojiPicker.value = false;
}

const emit = defineEmits(['groupFormBtnClick', 'cancelBtnClick'])

const router = useRouter();

let isLoading = ref(false);

let roleDetails = ref(null);
let groupUsers = ref([])

let allUsers = ref(null);
let allowEdit = ref(props.canEdit)

function enableEditMode(){
  allowEdit.value = true
}

function getAllUsers() {
  authApi
    .get("/users/")
    .then((res) => {
      allUsers.value = res.data.items;
      if (props.group.users != null && props.group.users !='undefined'){
      groupUsers.value = props.group.users.map(value => value.uuid);
      }
      isLoading.value = false;
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

function addNewGroup(data){
  isLoading.value = true;
  authApi
    .post("/groups/", data)
    .then((res) => {
      isLoading.value = false;
      router.push("/settings/groups");
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

function editExistingGroup(data, uuid){
  isLoading.value = true;
  authApi
    .patch("/groups/" + uuid, data)
    .then((res) => {
      isLoading.value = false;
      router.push("/settings/groups");
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

// --------------- Form --------------
const { resetForm } = useForm();

const validationSchema = yup.object({
    groupName: yup.string().required(),
    groupDescription: yup.string().required(),
})


const { handleSubmit, errors } = useForm({
    validationSchema
})

const { value: groupName } = useField('groupName', undefined, { initialValue: props.group.name })
const { value: groupDescription } = useField('groupDescription', undefined, { initialValue: props.group.description })

const submit = handleSubmit(values => {

    let symbol = emojiOutput.value.match(/[^:]+(\:[^:]+)?/g)[0];
    
    let data = {
        "name": groupName.value,
        "description": groupDescription.value,
        "users": JSON.parse(JSON.stringify(groupUsers.value)),
        "symbol": ":"+ symbol+":"
    }

    console.log(data)
    if (!!props.groupUuid){
    //   emit('groupFormBtnClick', {data : data, uuid: props.groupUuid})
      editExistingGroup(data, props.groupUuid)
    } else{
      addNewGroup(data);
    // emit('groupFormBtnClick', {data : data, uuid: null})
    }

})

function  cancelButtonHandle()
{
    router.push("/settings/groups");
    // console.log('cancelBtnClick')
    // emit('cancelBtnClick')
}
// --------------- Form --------------

onBeforeMount(() => {
    getAllUsers();
    // getRoles();
});

</script>

<style lang="scss" scoped>

:deep(.q-field__marginal) {
  color: inherit !important;
}
</style>