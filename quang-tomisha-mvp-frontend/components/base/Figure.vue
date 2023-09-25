<template>
  <div>
    <div v-if="img" class="select-none">
      <img :src="img" class="w-full" :class="[imgClass]" />
    </div>

    <h3 class="text-2xl mt-6 mb-4" :class="[titleClass]">
      <slot name="title">
        {{ title }}
      </slot>
    </h3>

    <p
      v-if="html"
      class="text-gray-600 text-lg whitespace-pre-line"
      v-html="html"
    />

    <p
      v-else-if="text || $slots.text"
      class="text-gray-600 text-lg whitespace-pre-line"
    >
      <slot name="text">
        {{ text }}
      </slot>
    </p>

    <slot />
  </div>
</template>

<script>
export default {
  props: {
    img: { type: String, default: null },
    imgClass: { type: String, default: '' },
    title: { type: String, default: null },
    titleClass: { type: String, default: '' },
    html: { type: String, default: null },
    text: { type: String, default: null },
  },
}
</script>
