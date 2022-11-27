<template>
      <div v-if="editor && !readonly" class="q-pt-xs q-pb-lg">
    <q-btn 
      flat
      @click="editor.chain().focus().toggleBold().run()" 
      :disabled="!editor.can().chain().focus().toggleBold().run()" 
      :class="{ 'shadow-1': editor.isActive('bold') }"
      icon="format_bold"
    />

    <q-btn 
      flat 
      @click="editor.chain().focus().toggleItalic().run()" 
      :disabled="!editor.can().chain().focus().toggleItalic().run()" 
      :class="{ 'shadow-1': editor.isActive('italic') }"
      icon="format_italic"
      />
    <q-btn 
    flat 
    @click="editor.chain().focus().toggleStrike().run()" 
    :disabled="!editor.can().chain().focus().toggleStrike().run()" 
    :class="{ 'shadow-1': editor.isActive('strike') }"
    icon="strikethrough_s"
    />
    <q-btn 
    flat 
    @click='editor.chain().focus().insertContent({"type":"userMention","attrs":{"id":"e21f3ca6-a7a6-4c48-896a-bb51663ef81e","label":"Jan Kłos"}}).insertContent(" ").run();' 
    :disabled="!editor.can().chain().focus().toggleStrike().run()" 
    icon="person_add"
    />
    <q-btn 
    flat 
    @click="editor.chain().focus().toggleStrike().run()" 
    :disabled="!editor.can().chain().focus().toggleStrike().run()" 
    icon="group_add"
    />
    </div>
  <editor-content :editor="editor" />
  <div>

  </div>
  <div v-if="editor && props.readonly == false" :class="{'character-count': true, 'character-count--warning': editor.storage.characterCount.characters() === charLimit}">
    <q-btn round dense flat icon="person_add" @click="insertText('\u03C0')" />
    <q-btn round dense flat icon="group_add" @click="insertText('\u03C0')" />
    <q-btn round dense flat icon="mic" @click="insertText('\u03C0')" />
    <q-space></q-space>
    <svg
      height="20"
      width="20"
      viewBox="0 0 20 20"
      class="character-count__graph"
    >
      <circle
        r="10"
        cx="10"
        cy="10"
        fill="#e9ecef"
      />
      <circle
        r="5"
        cx="10"
        cy="10"
        fill="transparent"
        stroke="currentColor"
        stroke-width="10"
        :stroke-dasharray="`calc(${percentage} * 31.4 / 100) 31.4`"
        transform="rotate(-90) translate(-20)"
      />
      <circle
        r="6"
        cx="10"
        cy="10"
        fill="white"
      />
    </svg>

    <div class="character-count__text">{{ editor.storage.characterCount.characters() }}/{{ charLimit }} </div>
  </div>

</template>

<script setup>
import { ref,unref, watch ,computed, onUpdated } from "vue";
import { useUserStore } from 'stores/user'

import { useEditor, EditorContent } from '@tiptap/vue-3'
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

// const content = ref('')
const charCount = ref(0)

const charLimit = ref(2000)
const UserStore = useUserStore();

const customMention=ref('{"type":"userMention","attrs":{"id":"e21f3ca6-a7a6-4c48-896a-bb51663ef81e","label":"Jan Kłos"}}');

async function getEditorUsers() {
  try {
    await UserStore.setEditorUsers();
  } catch (err) {
    console.log(err);
    // console.log(err.error_description || err.message)
    // console.log(err.data)
    // errorMsg.value = err
  }
}
async function getEditorGroups() {
  try {
    await UserStore.setEditorGroups();
  } catch (err) {
    console.log(err);
    // console.log(err.error_description || err.message)
    // console.log(err.data)
    // errorMsg.value = err
  }
}



getEditorUsers();
getEditorGroups();

const emit = defineEmits(['editorContent'])


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


const content = ref('')

if (props.bodyContent !== null && props.bodyContent !== ''){
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
      placeholder: 'My Custom Placeholder',
}),
Mention.extend({
      name: "userMention"
    }).configure({
      HTMLAttributes: {
        class: "mention"
      },
      suggestion: suggestion
    }),
    Mention.extend({
      name: "groupMention"
    }).configure({
      HTMLAttributes: {
        class: "mention"
      },
      suggestion: groups
    })
  ],
  onCreate({ editor }) {
    editor.setEditable(!props.readonly);
    editor.commands.setContent(content.value);
    const isEmpty = editor.state.doc.textContent.length === 0
    console.log(isEmpty)
  },
  onUpdate({ editor }) {
    const html = editor.getHTML()
    const json = editor.getJSON()

    let json_array = json.content
    // console.log(json)
    // if (
    //   Array.isArray(json_array) &&
    //   json_array[0].hasOwnProperty("content")
    // ) {
    //   emit('editorContent', json, html)
    // }



    // console.log("Title: " +json_array[0].hasOwnProperty("content"))
    // console.log("Body: " +json_array[1].hasOwnProperty("content"))
    emit('editorContent', json, html)

  },
  
  beforeUnmount() {
    editor.destroy()
  },
})


//  https://github.com/ueberdosis/tiptap/issues/1248

const percentage = computed(() => (Math.round((100 / charLimit.value) * editor.value.storage.characterCount.characters())))
const insertText = (text) => unref(editor).commands.insertContent(text);


// const text = ref([
//   {
//     type: 'paragraph',
//     content: [
//       {
//         type: 'text',
//         text: 'First paragraph',
//       },
//     ],
//   },
// ])

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
    >*+* {
      margin-top: 0.75em;
      color: #1f2937!important;
    }
  
    h1 {
      font-size: 2rem;
      font-weight: 400;
      line-height: 1;
    
    }
    h2,
    h3,
    h4{
      font-size: 1rem;
    }
    h5,
    h6 {
      line-height: 0.4;
    }
    p{
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
  margin-top: 1rem;
  margin-bottom: 0.1rem;
  margin-left: 0.1rem;
  margin-right: 0.3rem;
  display: flex;
  align-items: center;
  color: #68CEF8;

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

<!-- <style lang="scss" scoped>
  :deep(.ProseMirror) {
      /* Basic editor styles */
      > * + * {
          margin-top: 0.5em;
      }
  
      &:focus {
          outline: none;
      }
  
      /* Placeholder (at the top) */
      p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #4280be;
          pointer-events: none;
          height: 8rem;
          outline: none;
      }
  
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
          line-height: 0.1;
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
  
      /* Placeholder (on every new line) */
      /*.ProseMirror p.is-empty::before {
        content: attr(data-placeholder);
        float: left;
        color: #ced4da;
        pointer-events: none;
        height: 0;
      }*/
  }
  </style> -->