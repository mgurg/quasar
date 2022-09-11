<template>
  <editor-content :editor="editor" />
  <!-- <q-btn>AAAA</q-btn> -->
</template>

<script setup>
import { ref, onBeforeMount, onUpdated } from "vue";
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
// import { generateJSON } from '@tiptap/html'

// https://github.com/kfields/quasar-tiptap-demo

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
        })
    ],
    onUpdate({ editor }) {
      // charCount.value = editor.storage.characterCount.characters()
      const html = editor.getHTML()
      const json = editor.getJSON()
      emit('editorContent', html)
    // The content has changed.
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
  > * + * {
    margin-top: 0.75em;
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
</style>