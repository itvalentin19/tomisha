<template>
  <div class="bg-white rounded-b-xl shadow-lg px-6 pt-4 pb-5 relative z-20">
    <div
      class="absolute hidden left-0 bottom-0 top-0 pl-6 xl:pl-26 lg:flex items-center"
    >
      <base-logo />
    </div>

    <box-container class="mx-auto">
      <div class="flex justify-between mb-2">
        <div class="truncate">
          {{ title }}
        </div>

        <div class="whitespace-no-wrap flex-shrink-0">
          {{ value }} / {{ total }}
        </div>
      </div>

      <div class="h-4 rounded-lg bg-white relative overflow-hidden">
        <div
          class="absolute top-0 left-0 bottom-0 bg-gradient-r-primary"
          :style="{ width: `${(value / total) * 100}%` }"
        />

        <div class="absolute inset-0 rounded-lg border border-gray-600" />
      </div>
    </box-container>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: '' },
    value: { type: Number, default: 1 },
    total: { type: Number, default: 1 },
  },
}
</script>
