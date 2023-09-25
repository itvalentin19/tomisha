<template>
  <input-references>
    <base-bottom-actions :items="actions()" />
  </input-references>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    actions: { type: Function, default: () => [] },
  },
}
</script>
