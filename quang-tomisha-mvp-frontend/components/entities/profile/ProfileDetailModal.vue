<template>
  <base-modal
    ref="modal"
    full-height
    v-bind="$attrs"
    :sticky-header="false"
    :actions="
      actions.map((a) => ({
        ...a,
        handler: () => a.handler && a.handler(profile),
      }))
    "
  >
    <profile-detail v-if="profile" :profile="profile" />

    <slot :profile="profile" />
  </base-modal>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    actions: { type: Array, default: () => [] },
  },
  data() {
    return {
      profile: null,
    }
  },
  methods: {
    async open(slug, occupationId) {
      this.profile = await this.$axios.get('/user/' + slug, {
        params: occupationId ? { occupationId } : {},
      })
      this.$refs.modal.open()
    },
    close() {
      this.$refs.modal.close()
    },
  },
}
</script>
