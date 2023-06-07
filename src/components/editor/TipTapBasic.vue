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
      @click="editor.chain().focus().toggleCode().run()"
      :disabled="!editor.can().chain().focus().toggleCode().run()"
      :class="{ 'is-active': editor.isActive('code') }"
      icon="code"
      v-if="$q.screen.gt.sm"
    />
    <!-- <q-btn
      flat
      @click="editor.chain().focus().unsetAllMarks().run()"
      icon="format_clear"
    /> -->
    <!--    <q-btn flat @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
     paragraph
   </q-btn> -->
    <q-btn
      flat
      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      label="h1"
    />
    <q-btn
      flat
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      label="h2"
    />
    <q-btn
      flat
      @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      label="h3"
    />
    <!-- <q-btn flat @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
      h4
    </q-btn>
    <q-btn flat @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
      h5
    </q-btn>
    <q-btn flat @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
      h6
    </q-btn> -->
    <q-btn
      flat
      @click="editor.chain().focus().clearNodes().run()"
      icon="format_clear"
    />
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
      v-if="$q.screen.gt.sm"
    />
    <q-btn
      flat
      @click="editor.chain().focus().setHorizontalRule().run()"
      icon="horizontal_rule"
    />
    <q-btn
      flat
      @click="editor.chain().focus().setHardBreak().run()"
      icon="keyboard_return"
      v-if="$q.screen.gt.sm"
    />
    <q-btn
      flat
      @click="editor.chain().focus().undo().run()"
      :disabled="!editor.can().chain().focus().undo().run()"
      icon="undo"
      v-if="$q.screen.gt.sm"
    />
    <q-btn
      flat
      @click="editor.chain().focus().redo().run()"
      :disabled="!editor.can().chain().focus().redo().run()"
      icon="redo"
      v-if="$q.screen.gt.sm"
    />
  </div>
  <editor-content :editor="editor"/>
  <div>

  </div>
  <div v-if="editor && props.readonly === false"
       :class="{'character-count': true, 'character-count--warning': editor.storage.characterCount.characters() === charLimit}">
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

    <div class="character-count__text">{{ editor.storage.characterCount.characters() }}/{{ charLimit }}</div>
  </div>

</template>

<script setup>
import {computed, ref, unref} from "vue";

import {EditorContent, useEditor} from '@tiptap/vue-3'

import Document from '@tiptap/extension-document'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'


const charCount = ref(0)

const charLimit = ref(10000)

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
      placeholder: 'My Custom Placeholder',
    }),
  ],
  onCreate({editor}) {
    editor.setEditable(!props.readonly);
    editor.commands.setContent(content.value);
    const isEmpty = editor.state.doc.textContent.length === 0
    console.log(isEmpty)
  },
  onUpdate({editor}) {
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
  word-wrap: break-word !important;
  white-space: pre-wrap;
  //white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: 'liga' 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror {
  // >*+* {
  //   color: #1f2937 !important;

  // }

  // ------ Outstatic ------
  // https://github.com/avitorio/outstatic/blob/canary/packages/outstatic/src/styles.css

  // h1 {
  //   letter-spacing: -0.02em;
  //   font-weight: 700;
  //   font-style: normal;
  //   letter-spacing: 0;
  //   font-size: 40px;
  //   line-height: 1.15;
  //   letter-spacing: -0.015em;
  // }

  // h2 {
  //   letter-spacing: -0.02em;
  //   font-weight: 700;
  //   font-style: normal;
  //   letter-spacing: 0;
  //   font-size: 34px;
  //   line-height: 1.15;
  //   letter-spacing: -0.015em;
  // }

  // h3 {
  //   letter-spacing: -0.02em;
  //   font-weight: 700;
  //   font-style: normal;
  //   font-size: 26px;
  //   line-height: 1.22;
  //   letter-spacing: -0.012em;
  // }

  // h4,
  // h5,
  // h6 {

  //   line-height: 1.1;
  // }

  // p {
  //   font-family: 'Roboto', Arial, 'Cambria', 'Times New Roman', Times, serif;
  //   font-weight: 400;
  //   font-style: normal;
  //   font-size: 21px;
  //   line-height: 1.58;
  //   letter-spacing: -0.003em;
  // }

  // p:first-child:before {
  //   color: #adb5bd;
  //   float: left;
  //   height: 0;
  //   pointer-events: none;
  // }

  // ------ Outstatic ------

  // ------ publish.prx.org ------
  // https://github.com/PRX/publish.prx.org/blob/main/src/app/shared/wysiwyg/wysiwyg.component.css
  //    h1 {
  //   font-size: 2em;
  //   margin-top: 0.67em;
  //   margin-bottom: 0.67em;
  // }

  //  h2 {
  //   font-size: 1.5em;
  //   margin-top: 0.83em;
  //   margin-bottom: 0.83em;
  // }

  //  h3 {
  //   font-size: 1.17em;
  //   margin-top: 1em;
  //   margin-bottom: 1em;
  // }

  //  h4 {
  //   font-size: 1em;
  //   margin-top: 1.33em;
  //   margin-bottom: 1.33em;
  // }

  //  h5 {
  //   font-size: .83em;
  //   margin-top: 1.67em;
  //   margin-bottom: 1.67em;
  // }

  //  h6 {
  //   font-size: .67em;
  //   margin-top: 2.33em;
  //   margin-bottom: 2.33em;
  // }

  //  p {
  //   margin-top: 1em;
  //   margin-bottom: 1em;
  // }

  //  p:first-child {
  //   margin-top: 0;
  // }

  // ------ publish.prx.org ------


  // ------ Bangle ------
  // https://github.com/ssoju/bangle.dev/blob/master/core/style.css
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  blockquote,
  pre,
  hr,
  figure,
  dl,
  dd {
    margin: 0;
  }

  p:first-child,
  h1:first-child,
  h2:first-child,
  h3:first-child,
  h4:first-child,
  h5:first-child,
  h6:first-child,
  blockquote:first-child,
  pre:first-child,
  hr:first-child,
  figure:first-child,
  dl:first-child,
  dd:first-child,
  ul:first-child,
  ol:first-child {
    /** this prevents elements from bleeding out of the container */
    margin-top: 0;
  }

  hr {
    margin: 0.5em 0;
    padding: 2px 2px;
  }

  h1 {
    font-size: 3rem;
    margin-top: 1.5rem;
  }

  h2 {
    font-size: 1.875rem;
    margin-top: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 1.25rem;
  }

  h4 {
    font-size: 1.125rem;
    font-weight: 500;
    margin-top: 1.2rem;
  }

  h5 {
    font-weight: 500;
    font-size: 1rem;
    margin-top: 1rem;
  }

  h6 {
    font-weight: 500;
    font-size: 0.75rem;
    margin-top: 1rem;
  }

  p {
    font-size: 1rem;
    line-height: 1.625;
    //font-size: 1.125rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  }

  blockquote {
    padding-left: 0.5rem;
    background-color: #f7fafc;
    color: #414e64;
    margin-top: 1.5rem;
    margin-bottom: 1.25rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  li {
    position: relative;
  }

  li > span {
    display: block;
  }

  li.ProseMirror-selectednode:after {
    content: '';
    position: absolute;
    left: -32px;
    right: -2px;
    top: -2px;
    bottom: -2px;
    border: 2px solid #8cf;
    pointer-events: none;
  }

  ol {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  ol {
    list-style-type: decimal;
    list-style-position: outside;
    padding-left: 1.5rem;
  }

  /** Bullet List */
  ul {
    list-style-type: disc;
    list-style-position: outside;
    padding-left: 1.5rem;
  }


  // ------ Bangle ------
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
