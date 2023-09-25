<template>
  <div class="badge rounded-full px-2 py-1 text-sm">
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    text: { type: String, default: '' },
  },
}
</script>

<style lang="scss">
.badge {
  background-color: #63b3ed;
  color: #ebf8ff;
}
</style>
