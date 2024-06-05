<template>
  <div v-if="editor && !readonly" class="q-pt-xs q-pb-lg">
    <FormattingButton
      @click="editor.chain().focus().toggleBold().run()"
      :disabled="!editor.can().chain().focus().toggleBold().run()"
      :is-active="editor.isActive('bold')"
      icon="format_bold"
    />

    <FormattingButton
      @click="editor.chain().focus().toggleItalic().run()"
      :disabled="!editor.can().chain().focus().toggleItalic().run()"
      :is-active="editor.isActive('italic')"
      icon="format_italic"
    />

    <FormattingButton
      @click="editor.chain().focus().toggleStrike().run()"
      :disabled="!editor.can().chain().focus().toggleStrike().run()"
      :is-active="editor.isActive('strike')"
      icon="strikethrough_s"
    />

    <FormattingButton
      @click="editor.chain().focus().toggleCode().run()"
      :disabled="!editor.can().chain().focus().toggleCode().run()"
      :is-active="editor.isActive('code')"
      icon="code"
      v-if="$q.screen.gt.sm"
    />

    <FormattingButton
      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      :is-active="editor.isActive('heading', { level: 1 })"
      label="h1"
    />

    <FormattingButton
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      :is-active="editor.isActive('heading', { level: 2 })"
      label="h2"
    />

    <FormattingButton
      @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      :is-active="editor.isActive('heading', { level: 3 })"
      label="h3"
    />

    <FormattingButton
      @click="editor.chain().focus().clearNodes().run()"
      icon="format_clear"
    />

    <FormattingButton
      @click="editor.chain().focus().toggleBulletList().run()"
      :is-active="editor.isActive('bulletList')"
      icon="format_list_bulleted"
    />

    <FormattingButton
      @click="editor.chain().focus().toggleOrderedList().run()"
      :is-active="editor.isActive('orderedList')"
      icon="format_list_numbered"
    />

    <FormattingButton
      @click="editor.chain().focus().toggleCodeBlock().run()"
      :is-active="editor.isActive('codeBlock')"
      icon="data_object"
    />

    <FormattingButton
      @click="editor.chain().focus().toggleBlockquote().run()"
      :is-active="editor.isActive('blockquote')"
      icon="format_quote"
      v-if="$q.screen.gt.sm"
    />

    <FormattingButton
      @click="editor.chain().focus().setHorizontalRule().run()"
      icon="horizontal_rule"
    />

    <FormattingButton
      @click="editor.chain().focus().setHardBreak().run()"
      icon="keyboard_return"
      v-if="$q.screen.gt.sm"
    />

    <FormattingButton
      @click="editor.chain().focus().undo().run()"
      :disabled="!editor.can().chain().focus().undo().run()"
      icon="undo"
      v-if="$q.screen.gt.sm"
    />

    <FormattingButton
      @click="editor.chain().focus().redo().run()"
      :disabled="!editor.can().chain().focus().redo().run()"
      icon="redo"
      v-if="$q.screen.gt.sm"
    />
  </div>

  <editor-content :editor="editor" tabindex="0" />

  <div v-if="editor && !props.readonly" :class="characterCountClass">
    <CharacterCountGraph :percentage="percentage" />
    <div class="character-count__text">{{ editor.storage.characterCount.characters() }}/{{ charLimit }}</div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { useQuasar } from "quasar";
import FormattingButton from "components/editor/components/FormattingButton.vue";
import CharacterCountGraph from "components/editor/components/CharacterCountGraph.vue";

const $q = useQuasar();

const charLimit = ref(10000);

const emit = defineEmits(["editorContent"]);

const props = defineProps({
  bodyContent: {
    type: Object,
    default: null,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const content = ref(props.bodyContent || "");

const CustomDocument = Document.extend({});

const editor = useEditor({
  content: content.value,
  extensions: [
    CustomDocument,
    CharacterCount.configure({
      limit: charLimit.value,
    }),
    StarterKit.configure({
      document: false,
    }),
    Placeholder.configure({
      placeholder: "My Custom Placeholder",
    }),
  ],
  onCreate({ editor }) {
    editor.setEditable(!props.readonly);
    editor.commands.setContent(content.value);
  },
  onUpdate({ editor }) {
    const html = editor.getHTML();
    const json = editor.getJSON();
    emit("editorContent", json, html);
  },
  beforeUnmount() {
    editor.destroy();
  },
});

const percentage = computed(() => Math.round((100 / charLimit.value) * editor.value.storage.characterCount.characters()));

const characterCountClass = computed(() => ({
  "character-count": true,
  "character-count--warning": editor.value.storage.characterCount.characters() === charLimit.value,
}));
</script>

<style lang="scss">
/* remove outline */
.ProseMirror:focus {
  outline: none !important;
}

.ProseMirror {
  word-wrap: break-word !important;
  white-space: pre-wrap;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0;
}

.ProseMirror {
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
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
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
    content: "";
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
    list-style-type: decimal;
    list-style-position: outside;
    padding-left: 1.5rem;
  }

  ul {
    list-style-type: disc;
    list-style-position: outside;
    padding-left: 1.5rem;
  }
}

.ProseMirror .is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}

.mention {
  border: 0 solid #000;
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
  color: #68cef8;

  &--warning {
    color: #fb5151;
  }

  &__graph {
    margin-right: 0.5rem;
  }

  &__text {
    color: #868e96;
  }
}
</style>
