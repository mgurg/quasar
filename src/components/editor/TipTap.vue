<template>
  <editor-content :editor="editor" />
  <!-- <q-btn>AAAA</q-btn> -->
</template>

<script setup>
import { ref, onBeforeMount, onUpdated } from "vue";
import { useUserStore } from 'stores/user'

import { useEditor, EditorContent } from '@tiptap/vue-3'
import Mention from '@tiptap/extension-mention'

import Document from '@tiptap/extension-document'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

import suggestion from './suggestions'
import groups from './groups'
// import { generateJSON } from '@tiptap/html'

// https://github.com/kfields/quasar-tiptap-demo
// https://github.com/ueberdosis/tiptap/issues/1316#issuecomment-851518606
// https://codesandbox.io/s/bold-voice-l58oq?file=/src/userProvider.js

// const content = ref('')
const charCount = ref(0)
const UserStore = useUserStore();

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
  title: {
    type: String,
    default: ''
  },
  body: {
    type: String,
    default: ''
  }
})

const CustomDocument = Document.extend({
  content: 'heading block*'
})

const editor = useEditor({
  content: `
        <h4>
        ${props.title}
        </h4>
        <p>
         ${props.body}
        </p>
      `,
  extensions: [
    CustomDocument,
    StarterKit.configure({
      document: false
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return "What's the title?"
        }
        return 'Can you add some further context?'
      }
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
    const isEmpty = editor.state.doc.textContent.length === 0
    console.log(isEmpty)
  },
  onUpdate({ editor }) {


    const html = editor.getHTML()
    const json = editor.getJSON()

    let json_array = json.content
    console.log(json_array.content)
    if (
      Array.isArray(json_array) &&
      json_array[0].hasOwnProperty("content") &&
      json_array[1].hasOwnProperty("content")
    ) {
      emit('editorContent', json)
    }


    // console.log("Title: " +json_array[0].hasOwnProperty("content"))
    // console.log("Body: " +json_array[1].hasOwnProperty("content"))
    // emit('editorContent', json)

  },
  beforeUnmount() {
    editor.destroy()
  },
})



// watch(
//     () => props.modelValue,
//     (value) => {
//         const isSame = editor.getHTML() === value;
//         if (isSame) {
//             return;
//         }
//         editor.commands.setContent(value, false);
//     }
// );

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
    }
  
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 0.4;
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
  </style>

<style lang="scss" scoped>
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
  </style>