<template>
  <div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    storageKey: { type: String, default: null },
    uniqueId: { type: String, default: '' },
    value: { type: Object, default: () => ({}) },
    off: Boolean,
  },

  mounted() {
    if (!this.storageKey) {
      return
    }

    this.read()

    window.addEventListener('beforeunload', this.write)
  },

  beforeDestroy() {
    if (this.storageKey) {
      this.write()
    }
    window.removeEventListener('beforeunload', this.write)
  },

  methods: {
    write() {
      if (this.off) {
        this.purge()
      } else {
        const payload = { ...this.value }
        if (this.uniqueId) {
          payload._sid = this.uniqueId
        }
        localStorage.setItem(this.storageKey, JSON.stringify(payload))
      }
    },

    read() {
      const tmp = localStorage.getItem(this.storageKey)
      if (tmp) {
        const data = this.$utils.parseJSON(tmp)
        if (data?._sid === this.uniqueId) {
          delete data._sid
          this.$emit('input', data)
          return
        }
        this.purge()
      }
    },

    purge() {
      localStorage.removeItem(this.storageKey)
      this.$emit('reset')
    },
  },
}
</script>
