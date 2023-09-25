<template>
  <base-modal
    v-model="shown"
    :actions="actions"
    :sticky-header="false"
    full-height
    @closed="$emit('closed')"
  >
    <branch-detail v-if="branch" :branch="branch" />

    <branch-editor
      v-if="branch && actions.length"
      ref="editor"
      :company-id="branch.companyId"
      hide-activator
    />
  </base-modal>
</template>

<script>
export default {
  data() {
    return {
      branch: null,
      shown: false,
    }
  },
  computed: {
    actions() {
      const { companyId } = this.branch || {}
      return companyId && companyId === this.$auth.companyId
        ? [
            {
              icon: 'pencil',
              text: 'Bearbeiten',
              handler: () => this.$refs.editor.open(this.branch),
            },
          ]
        : []
    },
  },
  methods: {
    open(branch) {
      this.branch = branch
      this.shown = true
    },
  },
}
</script>
