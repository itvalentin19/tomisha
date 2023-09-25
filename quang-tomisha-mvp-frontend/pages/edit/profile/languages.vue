<template>
  <input-languages @changes="onChanges">
    <base-bottom-actions :items="actions()" />
  </input-languages>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    actions: { type: Function, default: () => [] },
    me: { type: Object, default: () => ({}) },
  },
  methods: {
    onChanges(items) {
      this.$store.commit('me/setState', {
        personalInfo: {
          ...this.me,
          languageCount: items.length,
        },
      })
    },
  },
}
</script>
