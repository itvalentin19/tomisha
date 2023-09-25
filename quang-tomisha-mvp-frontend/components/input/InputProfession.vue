<template>
  <base-select
    ref="select"
    v-bind="$attrs"
    title="Berufsbezeichnung"
    :items="professions"
    :load-items="fetchProfessions"
    :total="totalProfessions"
    return-object
    item-text="title"
    item-value="id"
    item-icon="plus-circle"
    search-label="Gewünschte Berufsbezeichnung eintippen"
    full-height
    v-on="$listeners"
  >
    <template #activator="{ text }">
      <base-card
        v-if="text"
        dismiss-float
        class="inline-flex max-w-full py-2 mt-3 cursor-pointer"
        @dismiss="onDismiss"
      >
        <span class="truncate">
          {{ text }}
        </span>
      </base-card>

      <slot v-else name="activator">
        <base-button secondary icon="plus-circle">
          Berufsbezeichnung hinzufügen
        </base-button>
      </slot>
    </template>
  </base-select>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  inheritAttrs: false,
  computed: mapState('tag', ['professions', 'totalProfessions']),
  created() {
    this.fetchProfessions()
  },
  methods: {
    ...mapActions('tag', ['fetchProfessions']),

    open() {
      this.$refs.select.open()
    },

    onDismiss() {
      this.$emit('dismiss')
      this.$emit('input', null)
    },
  },
}
</script>
