<template>
  <div class="items">
    <template v-if="items.length">
      <button
        class="item"
        :class="{ 'is-selected': index === selectedIndex }"
        v-for="(item, index) in items"
        :key="index"
        @click="selectItem(index)"
      >
        {{ item.label }}
      </button>
    </template>
    <div class="item" v-else>
      No result
  </div>
</div>
</template>

<!-- https://github.com/15653391491/monaco_web/blob/97a173b89c44f13b5be01a219630a11d3b1b4f45/src/components/common/MentionList.vue -->
<!-- https://github.com/mrfrase3/slack-export-vue/blob/69ad9485ad5c1dcfc4684d952e4f5f7e8b3ee59e/src/components/search/mention-list.vue -->
<!-- https://github.com/AnoRebel/aio/blob/c88fd953ecbb18be325239e578e1b844f3808d85/src/components/TipTap/extensions/MentionList.vue -->

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  items: {
    default: () => [],
    type: Array,
    required: true,
  },

  command: {
    type: Function,
    required: true,
  },

})

const selectedIndex = ref(0);

watch(() => props.items, () => { selectedIndex.value = 0; });

const onKeyDown = ({ event }) => {
  if (event.key === 'ArrowUp') {
    upHandler();
    return true;
  }
  if (event.key === 'ArrowDown') {
    downHandler();
    return true;
  }
  if (event.key === 'Enter') {
    enterHandler();
    return true;
  }
  return false;
};

const upHandler = () => {
  selectedIndex.value = (selectedIndex.value + props.items.length - 1) % props.items.length;
};
const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
};
const enterHandler = () => {
  selectItem(selectedIndex.value);
};

const selectItem = (index) => {
  const item = props.items[index];
  if (item) {
    props.command({ id: item.uuid, label: item.label });
  }
};

defineExpose({
  onKeyDown,
});

</script>
  
<style lang="scss">
.items {
  padding: 0.2rem;
  position: relative;
  border-radius: 0.5rem;
  background: #FFF;
  color: rgba(0, 0, 0, 0.8);
  overflow: hidden;
  font-size: 0.9rem;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0px 10px 20px rgba(0, 0, 0, 0.1),
  ;
}

.item {
  display: block;
  margin: 0;
  width: 100%;
  text-align: left;
  background: transparent;
  border-radius: 0.4rem;
  border: 1px solid transparent;
  padding: 0.2rem 0.4rem;

  &.is-selected {
    border-color: #000;
  }
}
</style>