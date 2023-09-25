<template>
  <input-soft-skills v-model="items">
    <base-bottom-actions :items="actions({ done })" />
  </input-soft-skills>
</template>

<script>
export default {
  props: {
    me: { type: Object, default: () => ({}) },
    actions: { type: Function, default: () => [] },
  },
  data() {
    return {
      items: this.$utils.clone(this.me.softSkills),
    }
  },
  methods: {
    done() {
      const isDiff = this.$utils.isModified(this.me.softSkills, this.items)
      this.$emit('done', isDiff ? { softSkills: this.items } : null)
    },
  },
}
</script>
