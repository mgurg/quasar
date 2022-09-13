import { VueRenderer } from "@tiptap/vue-3";
import { PluginKey } from "prosemirror-state";
import tippy from "tippy.js";

import MentionList from "./MentionList.vue";

export default {
  char: "#",
  pluginKey: new PluginKey("groupSuggest"),
  items: ({ query }) => {
    const users = [
      { uuid: "7105b056-c031-4228-965b-74b8cf872c1b", label: "Openlane"},
      { uuid: "113f5152-9130-4f20-a4dc-0d923e814988", label: "Yearin"},
      { uuid: "91ce4b99-24ca-4a01-abaf-12d8a27dd984", label: "Goodsilron"},
      { uuid: "571cf687-f71d-40a1-8b56-12ab62a6889c", label: "Condax"},
      { uuid: "f443c752-e9df-4a09-be5f-d0fc4ce7b5eb", label: "Opentech"},
      { uuid: "05ec63be-fd0a-4e65-8938-e1dbb3d99dc3", label: "Golddex"},
      { uuid: "83ff990d-3d34-460b-8f74-25d9f710cb30", label: "year-job"},
      { uuid: "7366c352-8035-4ed5-bca5-1774cc0f7152", label: "Isdom"},
      { uuid: "588c7ef6-88c9-4bcf-b369-0e67b9b5357b", label: "Gogozoom"},
      { uuid: "60ce3afe-412d-49f1-872d-2387a4a011cc", label: "Y-corporation"},
      { uuid: "482dfef9-5221-4941-b14f-7c6e9b73ba07", label: "Nam-zim"},
      { uuid: "de1a1899-5205-47b9-99dd-7bf1d04d52af", label: "Donquadtech"},
      { uuid: "f64584a9-eba2-4bb5-8755-fca82490bc73", label: "Warephase"},
      { uuid: "679e7923-8b2d-4224-b3c1-165adfe3abe5", label: "Donware"},
      { uuid: "b1986689-5b7d-4c6b-9ce9-65fb83f03e78", label: "Faxquote"},
      { uuid: "ee41b5fc-00b5-4772-aa44-356d65b2dd0f", label: "Sunnamplex"},
      { uuid: "e874b8ef-83ac-41e4-aad6-a1863a25d38d", label: "Lexiqvolax"},
      { uuid: "b507a6cc-09d7-4f4a-a63a-786ebdd0bdd8", label: "Sumace"},
      { uuid: "6e80772e-dbf2-43a2-a686-3e3f1383d862", label: "Treequote"},
      { uuid: "e963d294-9e51-4b04-8eeb-d3ccbf638b0e", label: "Iselectrics"},
      { uuid: "c5363446-46bc-46a9-a6a4-a34e87314c51", label: "Zencorporation"},
      { uuid: "55baa545-d7e5-4566-bf8e-bac4f84aa8e8", label: "Plusstrip"},
      { uuid: "d2f34fba-0721-4aa9-aee0-93e04b51d5e5", label: "dambase"},
      { uuid: "cc495745-2e49-445b-8fe8-399da8868ec5", label: "Toughzap"},
      { uuid: "46858c5a-3e7e-446d-b650-c4353e176d34", label: "Codehow"},
    ];
    return users
      .filter((item) =>
        item.label.toLowerCase().startsWith(query.toLowerCase())
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
