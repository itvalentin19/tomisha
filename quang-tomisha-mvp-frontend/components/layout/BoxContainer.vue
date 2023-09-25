<template>
  <div
    class="w-full max-w-full sm:max-w-xl mx-auto"
    :class="{ 'bg-white': !transparent }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    transparent: Boolean,
  },
}
</script>
