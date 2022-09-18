import { VueRenderer } from "@tiptap/vue-3";
import { PluginKey } from "prosemirror-state";
import tippy from "tippy.js";
import { api } from "boot/axios";
import MentionList from "./MentionList.vue";
import { useUserStore } from "stores/user";
import { ref, watch } from "vue";

// https://github.com/search?q=VueRenderer+MentionList&type=code

export default {
  char: "@",
  pluginKey: new PluginKey("userSuggest"),

  
  items: async ({ query }) => {

    const UserStore = useUserStore();
    const users = UserStore.getEditorUsers

    return users
      .filter((item) =>
        item.first_name.toLowerCase().startsWith(query.toLowerCase())
      )
      .slice(0, 5);
  },

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new VueRenderer(MentionList, {
          // using vue 2:
          // parent: this,
          // propsData: props,
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
