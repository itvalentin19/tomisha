<template>
  <base-autocomplete
    v-bind="$attrs"
    :items="items"
    type="number"
    item-icon="plus-circle"
    v-on="$listeners"
  >
    <template #input>
      <div class="text-sm mb-2">Klicke den gewünschten Monat an</div>
    </template>
  </base-autocomplete>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    minMonth: { type: Number, default: 0 },
    maxMonth: { type: Number, default: 11 },
  },
  computed: {
    items() {
      const min = this.minMonth
      const max = this.maxMonth
      const day = this.$dayjs().startOf('year')
      let tmp = 0
      return Array.from({ length: 12 }, (_, i) => ({
        value: i,
        text: day.add(tmp++, 'month').format('MMMM'),
        disabled: min > i || max < i,
      }))
    },
  },
}
</script>
