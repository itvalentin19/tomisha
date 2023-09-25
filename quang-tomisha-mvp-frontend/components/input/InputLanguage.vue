<template>
  <base-select
    ref="select"
    v-bind="$attrs"
    title="Sprachen"
    search-label="Gewünschte Sprache eintippen"
    :items="languages"
    item-text="name"
    item-value="id"
    item-icon="plus-circle"
    initial-scroll-item="eng"
    full-height
    v-on="$listeners"
  >
    <template #activator>
      <base-button secondary icon="plus-circle" class="mb-8" @click="open()">
        Sprachkenntnisse hinzufügen
      </base-button>
    </template>
  </base-select>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('tag', ['languages']),
  },
  created() {
    this.$store.dispatch('tag/fetchLanguages')
  },
  methods: {
    open() {
      this.$refs.select.open()
    },
  },
}
</script>
