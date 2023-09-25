<template>
  <layout-body>
    <profile-status class="p-6" @change="setStatus" />
  </layout-body>
</template>

<script>
export default {
  layout: 'basic',
  props: {
    actions: { type: Function, default: () => [] },
  },
  methods: {
    setStatus(status) {
      if (status === this.$auth.user.status) {
        return
      }

      this.$axios.patch('me', { status })
      this.$auth.updateUser({ status })
    },
  },
}
</script>
