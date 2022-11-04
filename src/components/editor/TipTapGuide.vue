<template>
    <div v-if="editor">
    <q-btn 
      flat
      @click="editor.chain().focus().toggleBold().run()" 
      :disabled="!editor.can().chain().focus().toggleBold().run()" 
      :class="{ 'is-active': editor.isActive('bold') }"
      icon="format_bold"
    />

    <q-btn 
      flat 
      @click="editor.chain().focus().toggleItalic().run()" 
      :disabled="!editor.can().chain().focus().toggleItalic().run()" 
      :class="{ 'is-active': editor.isActive('italic') }"
      icon="format_italic"
      />
    <q-btn 
    flat 
    @click="editor.chain().focus().toggleStrike().run()" 
    :disabled="!editor.can().chain().focus().toggleStrike().run()" 
    :class="{ 'is-active': editor.isActive('strike') }"
    icon="strikethrough_s"
    />
    <q-btn 
      flat 
      @click="editor.chain().focus().toggleCode().run()" 
      :disabled="!editor.can().chain().focus().toggleCode().run()" 
      :class="{ 'is-active': editor.isActive('code') }"
      icon="code"
    />
    <!-- <q-btn 
      flat 
      @click="editor.chain().focus().unsetAllMarks().run()" 
      icon="format_clear"  
    /> -->

    <q-btn 
      flat 
      @click="editor.chain().focus().clearNodes().run()"
      icon="format_clear" 
      >
      
    </q-btn>
     <!--    <q-btn flat @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
      paragraph
    </q-btn> -->
    <q-btn flat @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
      h1
    </q-btn>
    <q-btn flat @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
      h2
    </q-btn>
    <q-btn flat @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
      h3
    </q-btn>
    <q-btn flat @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
      h4
    </q-btn>
    <q-btn flat @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
      h5
    </q-btn>
    <q-btn flat @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
      h6
    </q-btn>
    <q-btn 
      flat 
      @click="editor.chain().focus().toggleBulletList().run()" 
      :class="{ 'is-active': editor.isActive('bulletList') }"
      icon="format_list_bulleted" 
    />
    <q-btn 
      flat 
      @click="editor.chain().focus().toggleOrderedList().run()" 
      :class="{ 'is-active': editor.isActive('orderedList') }"
      icon="format_list_numbered" 
      />
    <q-btn 
        flat 
        @click="editor.chain().focus().toggleCodeBlock().run()" 
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        icon="data_object"      
      />
    <q-btn 
      flat 
      @click="editor.chain().focus().toggleBlockquote().run()" 
      :class="{ 'is-active': editor.isActive('blockquote') }"
      icon="format_quote"
    />
    <q-btn 
      flat 
      @click="editor.chain().focus().setHorizontalRule().run()"
      icon="horizontal_rule"
    />
    <q-btn flat @click="editor.chain().focus().setHardBreak().run()">
      hard break
    </q-btn>
    <q-btn 
      flat 
      @click="editor.chain().focus().undo().run()" 
      :disabled="!editor.can().chain().focus().undo().run()"
      icon="undo"
      />
    <q-btn 
      flat 
      @click="editor.chain().focus().redo().run()" 
      :disabled="!editor.can().chain().focus().redo().run()"
      icon="redo" 
    />
  </div>
  <editor-content :editor="editor" />
  <div>

  </div>
  <div v-if="editor && props.readonly == false" :class="{'character-count': true, 'character-count--warning': editor.storage.characterCount.characters() === charLimit}">
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
  <!-- <q-btn flat>AAAA</q-btn> -->
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

// import { generateJSON } from '@tiptap/html'

// https://github.com/kfields/quasar-tiptap-demo
// https://github.com/ueberdosis/tiptap/issues/1316#issuecomment-851518606
// https://codesandbox.io/s/bold-voice-l58oq?file=/src/userProvider.js

// https://github.com/Dashibase/lotion/blob/dev/src/components/elements/Editor.vue
// https://github.com/Wizard-wen/Metagraph/blob/main/src/views/repository-editor/section-article/tiptap-readonly.vue

// const content = ref('')
const charCount = ref(0)

const charLimit = ref(2000)

const emit = defineEmits(['editorContent'])


const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  body: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Object,
    default: null
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})


const content = ref(
        `
        <h1>
        ${props.title}
        </h1>
        <p>
         ${props.body}
        </p>
      `,
)

if (props.modelValue != null && props.modelValue != ""){
  content.value = props.modelValue;
}


const CustomDocument = Document.extend({
  content: 'heading block*'
})

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
      showOnlyCurrent: false,
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return "What's the title?"
        }
        return 'Can you add some further context?'
      }
    }),
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
    // console.log(json_array.content)
    if (
      Array.isArray(json_array) &&
      json_array[0].hasOwnProperty("content") &&
      json_array[1].hasOwnProperty("content")
    ) {
      emit('editorContent', json, html)
    }



    // console.log("Title: " +json_array[0].hasOwnProperty("content"))
    // console.log("Body: " +json_array[1].hasOwnProperty("content"))
    // emit('editorContent', json)

  },
  
  beforeUnmount() {
    editor.destroy()
  },
})

const percentage = computed(() => (Math.round((100 / charLimit.value) * editor.value.storage.characterCount.characters())))
const insertText = (text) => unref(editor).commands.insertContent(text);


const text = ref([
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'First paragraph',
      },
    ],
  },
])

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