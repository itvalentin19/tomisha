<template>
  <div
    class="rounded-xl bg-gray-200 text-gray-700 inline-flex items-center px-4 py-1 font-medium duration-200 text-sm"
    :class="{ 'cursor-pointer': !!$listeners.click }"
    v-on="$listeners"
  >
    <base-icon v-if="icon" :icon="icon" class="mr-2 text-xs" />
    <slot>
      {{ text }}
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    icon: { type: String, default: null },
    text: { type: String, default: '' },
  },
}
</script>
