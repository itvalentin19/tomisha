<template>
  <base-modal
    v-model="shown"
    title="Angebotscode"
    @shown="onShown"
    @closed="draftCode = ''"
  >
    <template v-if="$slots.activator">
      <slot name="activator" />
    </template>

    <base-note class="mb-6"> Füge deine Angebotscode hinzu. </base-note>

    <base-input
      v-model="draftCode"
      label="Angebotscode"
      placeholder="Angebotscode"
      class="mb-6"
    />

    <template #footer>
      <base-button primary :disabled="draftCode.length < 2" @click="save">
        Hinzufügen
      </base-button>
    </template>
  </base-modal>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: { type: Object, default: null },
  },
  data() {
    return {
      shown: false,
      draftCode: '',
    }
  },
  methods: {
    onShown() {
      this.draftCode = this.value?.id || ''
    },
    async save() {
      if (this.value?.id === this.draftCode) {
        this.shown = false
        return
      }

      const coupon = await this.$axios
        .get('/subscription/coupon/' + this.draftCode)
        .catch(() => this.$alert.error('Invalid promotion code'))

      if (!coupon) {
        return
      }

      this.$emit('input', coupon)
      this.shown = false
    },
  },
}
</script>
