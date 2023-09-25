<template>
  <base-autocomplete
    v-bind="$attrs"
    :items="years"
    label="Gewünschtes Jahr eintippen"
    type="number"
    return-object
    :initial-scroll-item="initialScrollYear"
    v-on="$listeners"
  />
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    initialScrollYear: { type: Number, default: null },
    maxYear: { type: Number, default: 0 },
    minYear: { type: Number, default: 1920 },
  },
  computed: {
    years() {
      let cur = this.maxYear || this.$dayjs().year()
      return Array.from({ length: cur - this.minYear + 1 }, () => cur--)
    },
  },
}
</script>
