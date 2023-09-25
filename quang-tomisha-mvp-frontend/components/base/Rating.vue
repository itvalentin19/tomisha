<template>
  <div>
    <label
      v-if="computedLabel && !hideLabel"
      class="flex justify-between items-center mb-1 text-sm"
    >
      <span class="truncate" :class="[labelClass]">
        {{ computedLabel }}
      </span>

      <span v-if="required || optional" class="text-xs text-gray-400 ml-2">
        {{ required ? 'erforderlich' : 'ergänzend' }}
      </span>
    </label>

    <div
      class="inline-flex -mx-1 mb-1"
      :class="{ 'pointer-events-none': disabled }"
      @mouseleave="tmp = -1"
    >
      <span
        v-for="i in levels.length"
        :key="i"
        class="cursor-pointer px-1 text-teal-400"
        @click="$emit('input', i)"
        @mouseenter="tmp = i - 1"
      >
        <base-icon
          :icon="value >= i || tmp >= i - 1 ? 'star-full' : 'star'"
          class="text-xl"
        />
      </span>
    </div>

    <div
      v-if="(label || hideLabel) && levels.length"
      class="text-gray-600 text-sm h-4 relative"
    >
      <div class="absolute top-0 left-0 bottom-0">
        <slot name="selected-level">
          {{ levels[tmp] || levels[value - 1] || '' }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
const levels = [
  'Grundkenntnisse',
  'Mittlere Kenntnisse',
  'Gute Kenntnisse',
  'Sehr gute Kenntnisse',
  'Expertenwissen',
]

export default {
  props: {
    value: { type: Number, default: 0 },
    label: { type: String, default: '' },
    labelClass: { type: String, default: '' },
    levels: { type: Array, default: () => levels },
    hideLabel: Boolean,
    required: Boolean,
    optional: Boolean,
    disabled: Boolean,
  },
  data() {
    return {
      tmp: -1,
    }
  },
  computed: {
    computedLabel() {
      return this.label || this.levels[this.value - 1] || null
    },
  },
}
</script>
