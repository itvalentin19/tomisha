<template>
  <profile-basic-info-form :profile="me" @done="$emit('done', $event)">
    <base-button primary type="submit" class="mt-12">Weiter</base-button>
  </profile-basic-info-form>
</template>

<script>
export default {
  inheritAttrs: false,
  scrollToTop: true,
  props: {
    me: { type: Object, default: () => ({}) },
  },
}
</script>
