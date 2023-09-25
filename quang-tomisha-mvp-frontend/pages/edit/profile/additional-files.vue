<template>
  <input-pdf-files
    v-model="items"
    label="Zusätzliche Dateien hinzufügen"
    @create="create"
    @remove="remove"
  >
    <base-bottom-actions
      :items="
        actions({
          disabled: !items.length,
          done: () => $emit('done', { files: items }),
        })
      "
    />
  </input-pdf-files>
</template>

<script>
export default {
  scrollToTop: true,
  props: {
    me: { type: Object, default: () => ({}) },
    actions: { type: Function, default: () => [] },
  },
  asyncData({ $axios }) {
    return $axios.get('file').then((items) => ({ items }))
  },
  data() {
    return {
      items: [],
    }
  },
  methods: {
    create(file) {
      this.$axios.post('/file', file)
      this.onChange(this.items)
    },
    remove(file) {
      this.$axios.delete('/file/' + file.id)
      this.onChange(this.items)
    },
    onChange(items) {
      this.$store.commit('me/setState', {
        personalInfo: {
          ...this.me,
          fileCount: items.length,
        },
      })
    },
  },
}
</script>
