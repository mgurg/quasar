<template>
  <editor-content :editor="editor" />
  <!-- <q-btn>AAAA</q-btn> -->
</template>

<script setup>
import { ref, onBeforeMount, onUpdated } from "vue";
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Mention from '@tiptap/extension-mention'

import Document from '@tiptap/extension-document'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

import suggestion from './suggestions'
// import { generateJSON } from '@tiptap/html'

// https://github.com/kfields/quasar-tiptap-demo
// https://github.com/ueberdosis/tiptap/issues/1316#issuecomment-851518606
// https://codesandbox.io/s/bold-voice-l58oq?file=/src/userProvider.js

// const content = ref('')
const charCount = ref(0)


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
        <pre></pre>
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
    Mention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          suggestion,
        }),
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


    console.log("Title: " +json_array[0].hasOwnProperty("content"))
    console.log("Body: " +json_array[1].hasOwnProperty("content"))
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
    line-height: 1.1;
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
  background-color: rgb(250, 245, 148);
}
</style>