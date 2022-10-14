import { ref } from 'vue'
import { EmojiIndex } from "emoji-mart-vue-fast/src";
import data from "emoji-mart-vue-fast/data/twitter.json";

// https://github.com/Markniconico/chatroom/blob/dev/src/views/chat-window/model/emojiModel.js


export function useEmoji(input) {
    const systemEmoji = ref("🚨")
    return {
        systemEmoji
    };

}
// export function useEmoji(input) {

//   const emojiShow = ref(false)


//   const togglEmmoji = () => {
//     emojiShow.value = !emojiShow.value
//   }

//   const selectOnEmoji = (data) => {
//     input.value += data
//   }

//   return {
//     emojiShow,
//     togglEmmoji,
//     selectOnEmoji
//   }
// }

// let emojiIndexs = new EmojiIndex(data)

// export function selectEmitEmoji (props, context) {
//   const emojiIndex = ref(emojiIndexs)

//   const selectEmoji = (emoji) => {
//     context.emit('selectEmoji', emoji.native)
//   }

//   return {
//     emojiIndex,
//     selectEmoji
//   }



