<template>
  <profile-status v-slot="{ status }">
    <base-bottom-actions :items="actions({ done: () => done(status) })" />
  </profile-status>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    actions: { type: Function, default: () => [] },
  },
  methods: {
    done(status) {
      this.$emit('done', status !== this.$auth.user.status ? { status } : null)
      this.$auth.updateUser({ status })
    },
  },
}
</script>
