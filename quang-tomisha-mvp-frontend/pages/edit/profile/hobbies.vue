<template>
  <input-hobbies v-model="items">
    <base-bottom-actions :items="actions({ done })" />
  </input-hobbies>
</template>

<script>
export default {
  props: {
    me: { type: Object, default: () => ({}) },
    actions: { type: Function, default: () => [] },
  },
  data() {
    return {
      items: [...this.me.hobbies],
    }
  },
  methods: {
    done() {
      const isDiff = this.$utils.isModified(this.me.hobbies, this.items)
      this.$emit('done', isDiff ? { hobbies: this.items } : null)
    },
  },
}
</script>
