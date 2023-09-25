<template>
  <base-card
    class="inline-block"
    v-bind="$attrs"
    v-on="$listeners"
    @dismiss="$emit('remove')"
  >
    <base-rating
      :value="level"
      v-bind="levels ? { levels } : {}"
      class="mb-3"
      disabled
    />

    <span class="truncate font-semibold">{{ title }}</span>

    <base-description
      v-if="description"
      quote
      :text="description"
      class="mt-2"
    />
  </base-card>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    level: { type: Number, default: 1 },
    levels: { type: Array, default: null },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  },
}
</script>
