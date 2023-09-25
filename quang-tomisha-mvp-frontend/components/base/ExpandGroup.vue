<template>
  <div class="b-expand-group">
    <template v-if="!items.length">
      <slot name="fallback" />
    </template>

    <div
      v-for="(item, i) in items"
      :key="item.key || i"
      :class="{ 'mt-12': !!i }"
    >
      <h4
        class="text-xl flex items-center mb-6 cursor-pointer text-gray-600"
        @click="expandStates.splice(i, 1, !expandStates[i])"
      >
        <base-icon
          icon="chevron-up-circle"
          class="mr-3 flex-shrink-0 duration-200"
          :class="{ 'transform rotate-180': expandStates[i] }"
        />

        <slot name="title" :item="item" :index="i">
          {{ item.title }}
        </slot>
      </h4>

      <collapse-transition>
        <div v-show="expandStates[i]">
          <slot v-if="!!$scopedSlots.default" :item="item" :index="i" />

          <slot v-else :name="item.key || `item:${i}`" :index="i" />
        </div>
      </collapse-transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: { type: Array, default: () => [] },
  },
  data() {
    return {
      expandStates: this.items.map(() => true),
    }
  },
  watch: {
    items(items) {
      this.expandStates = items.map(() => true)
    },
  },
}
</script>
