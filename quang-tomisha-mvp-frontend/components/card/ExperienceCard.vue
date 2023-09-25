<template>
  <base-card v-bind="$attrs" class="max-w-md" v-on="$listeners">
    <div v-if="item.startedAt || item.endedAt" class="text-sm text-gray-600">
      {{
        [item.startedAt, item.endedAt]
          .filter(Boolean)
          .map((time) => $dayjs(time).format('MMMM YYYY'))
          .join(' – ')
      }}
    </div>

    <base-rating
      v-if="levels || showLevel"
      :value="item.level || 0"
      v-bind="levels ? { levels } : {}"
      disabled
      hide-label
      class="mt-2 mb-4"
    />

    <div v-if="item.title" class="mt-2">
      <base-chip :text="item.title" />
    </div>

    <div v-if="item.profession" class="mt-2">
      <base-chip :text="item.profession.title + '*'" />
    </div>

    <h4 v-if="title" class="text-base font-medium text-gray-800 mt-2">
      {{ title }}
    </h4>

    <profile-brief
      v-if="item.branch"
      :profile="item.branch"
      class="mt-4"
      body-class="text-sm text-gray-600"
    />

    <base-chip
      v-for="(file, i) in item.files || []"
      :key="file.id || i + '_'"
      :text="file.name"
      icon="document"
      class="mt-4"
      @click="$refs.pdfModal.open(file)"
    />

    <pdf-viewer-modal ref="pdfModal" />

    <base-description
      v-if="item.description"
      :text="item.description"
      quote
      class="text-sm mt-4"
    />

    <slot />
  </base-card>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    item: { type: Object, default: () => ({}) },
    levels: { type: Array, default: null },
    title: { type: String, default: null },
    showLevel: Boolean,
  },
}
</script>
