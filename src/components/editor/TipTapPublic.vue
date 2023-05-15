<template>
  <div v-if="editor && !readonly" class="q-pt-xs q-pb-lg">
    <q-btn
      :class="{ 'shadow-1': editor.isActive('bold') }"
      :disabled="!editor.can().chain().focus().toggleBold().run()"
      flat
      icon="format_bold"
      @click="editor.chain().focus().toggleBold().run()"
    />

    <q-btn
      :class="{ 'shadow-1': editor.isActive('italic') }"
      :disabled="!editor.can().chain().focus().toggleItalic().run()"
      flat
      icon="format_italic"
      @click="editor.chain().focus().toggleItalic().run()"
    />
    <q-btn
      :class="{ 'shadow-1': editor.isActive('strike') }"
      :disabled="!editor.can().chain().focus().toggleStrike().run()"
      flat
      icon="strikethrough_s"
      @click="editor.chain().focus().toggleStrike().run()"
    />
  </div>
  <editor-content :editor="editor"/>
  <div>

  </div>
  <div v-if="editor && props.readonly == false"
       :class="{'character-count': true, 'character-count--warning': editor.storage.characterCount.characters() === charLimit}"
  >
<!--    <q-btn dense flat icon="person_add" round @click="showUserDialog = true"/>-->
<!--    <q-btn dense flat icon="group_add" round @click="showGroupDialog = true"/>-->
<!--    <q-btn dense flat icon="mic" round @click="insertText('\u03C0')"/>-->
    <q-space></q-space>
    <svg class="character-count__graph" height="20" viewBox="0 0 20 20" width="20">
      <circle cx="10" cy="10" fill="#e9ecef" r="10"/>
      <circle :stroke-dasharray="`calc(${percentage} * 31.4 / 100) 31.4`" cx="10" cy="10" fill="transparent" r="5"
              stroke="currentColor" stroke-width="10" transform="rotate(-90) translate(-20)"/>
      <circle cx="10" cy="10" fill="white" r="6"/>
    </svg>

    <div class="character-count__text">{{ editor.storage.characterCount.characters() }}/{{ charLimit }}</div>
  </div>

</template>

<script setup>
import {computed, ref, unref} from "vue";
import {useUserStore} from 'stores/user'


import UsersDialog from 'components/dialog/UsersDialog.vue'
import GroupsDialog from 'components/dialog/GroupsDialog.vue'

import {EditorContent, useEditor} from '@tiptap/vue-3'
import Mention from '@tiptap/extension-mention'

import Document from '@tiptap/extension-document'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'

import suggestion from './suggestions'
import groups from './groups'
// import { generateJSON } from '@tiptap/html'

// https://github.com/kfields/quasar-tiptap-demo
// https://github.com/ueberdosis/tiptap/issues/1316#issuecomment-851518606
// https://codesandbox.io/s/bold-voice-l58oq?file=/src/userProvider.js

// https://github.com/Dashibase/lotion/blob/dev/src/components/elements/Editor.vue
// https://github.com/Wizard-wen/Metagraph/blob/main/src/views/repository-editor/section-article/tiptap-readonly.vue


const props = defineProps({
  bodyContent: {
    type: Object,
    default: null
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['editorContent'])

const charCount = ref(0)

const charLimit = ref(2000)
const UserStore = useUserStore();

const content = ref('')

if (props.bodyContent !== null && props.bodyContent !== '') {
  // console.log("Props:"  + JSON.stringify(props.bodyContent))
  content.value = props.bodyContent;
}


const CustomDocument = Document.extend({})

const editor = useEditor({
  content: content.value,
  extensions: [
    CustomDocument,
    CharacterCount.configure({
      limit: charLimit.value,
    }),
    StarterKit.configure({
      document: false
    }),
    Placeholder.configure({
      // showOnlyWhenEditable: false,
      placeholder: '',
    }),
  ],
  onCreate({editor}) {
    editor.setEditable(!props.readonly);
    editor.commands.setContent(content.value);
    const isEmpty = editor.state.doc.textContent.length === 0
    // console.log(isEmpty)
  },
  onUpdate({editor}) {
    const html = editor.getHTML()
    const json = editor.getJSON()
    emit('editorContent', json, html)

  },

  beforeUnmount() {
    editor.destroy()
  },
})


//  https://github.com/ueberdosis/tiptap/issues/1248

const percentage = computed(() => (Math.round((100 / charLimit.value) * editor.value.storage.characterCount.characters())))


function insertUserMention(jsonMention) {
  unref(editor).commands.insertContent(jsonMention);
  unref(editor).commands.insertContent(" ");
  showUserDialog.value = false;
}

function insertGroupMention(jsonMention) {
  unref(editor).commands.insertContent(jsonMention);
  unref(editor).commands.insertContent(" ");
  showUserDialog.value = false;
}

</script>

<style lang="scss">
/* remove outline */
.ProseMirror:focus {
  outline: none !important;
}

/* set */
// .ProseMirror {
//   min-height: 100px;
//   // max-height: 100px;
//   overflow: scroll;
//   outline: none !important;
// }

.ProseMirror {
  > * + * {
    margin-top: 0.75em;
    //color: #1f2937 !important;
  }

  h1 {
    font-size: 2rem;
    font-weight: 400;
    line-height: 1;

  }

  h2,
  h3,
  h4 {
    font-size: 1rem;
  }

  h5,
  h6 {
    line-height: 0.4;
  }

  p {
    font-size: 1.1rem;
  }
}

/* Placeholder (on every new line) */
.ProseMirror .is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}

.mention {
  border: 0px solid #000;
  border-radius: 0.4rem;
  padding: 0.1rem 0.3rem;
  box-decoration-break: clone;
}

[data-type="groupMention"] {
  background-color: rgb(236, 253, 99);
}

[data-type="userMention"] {
  background-color: rgb(82, 226, 238);
}

.character-count {
  margin: 1rem 0.3rem 0.1rem 0.1rem;
  display: flex;
  align-items: center;
  color: #256885;

  &--warning {
    color: #FB5151;
  }

  &__graph {
    margin-right: 0.5rem;
  }

  &__text {
    color: #868e96;
  }
}
</style>
