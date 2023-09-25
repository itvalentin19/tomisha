<template>
  <base-bottom-slide-panel
    v-if="isClient && items.length"
    v-slot="{ expanded }"
    :disabled="items.length < 2 || !!$screen.lg"
    :full-width="!!$screen.lg"
    actions-mode
  >
    <ul
      :class="{ 'pb-7': items.length > 1 }"
      class="lg:flex flex-row-reverse justify-center"
    >
      <li
        v-for="({ disabled, handler, text, ...props }, i) in items"
        :key="i"
        class="block md:mx-2 lg:mx-4 xl:mx-6 flex-grow lg:max-w-md"
        :class="[$screen.lg ? 'self-center' : i ? 'pt-6' : '']"
      >
        <base-button
          v-bind="props"
          :disabled="disabled || (!$screen.lg && !expanded && i !== 0)"
          @click="handler && handler($event)"
        >
          {{ text }}
        </base-button>
      </li>
    </ul>
  </base-bottom-slide-panel>

  <span v-else class="absolute opacity-0 w-0 h-0" />
</template>

<script>
export default {
  props: {
    items: { type: Array, default: () => [] },
  },
  data() {
    return {
      isClient: process.client,
    }
  },
}
</script>
