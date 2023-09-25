<template>
  <div>
    <div class="text-sm text-gray-600 mb-2">Klicke den gewünschten Tag an</div>

    <ul class="flex flex-wrap text-teal-600 text-center">
      <li v-for="date in dates" :key="date.value" class="p-2 sm:p-3 w-1/5">
        <div
          :tabindex="date.disabled ? -1 : 0"
          class="w-12 h-12 rounded-full border border-gray-400 duration-200 inline-flex justify-center items-center"
          :class="[
            date.disabled
              ? 'opacity-50 cursor-default'
              : 'cursor-pointer hover:bg-teal-100 focus:outline-none focus:shadow-outline',
          ]"
          @click="select(date)"
          @keyup.exact.space="select(date)"
        >
          {{ date.value }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    month: { type: Number, default: 0 },
    year: { type: Number, default: 2020 },
    minDate: { type: Number, default: 1 },
    maxDate: { type: Number, default: 31 },
  },
  computed: {
    dates() {
      const lastDay = new Date(this.year, this.month + 1, 0).getDate()
      const min = this.minDate
      const max = this.maxDate

      return Array.from({ length: lastDay }, (_, i) => {
        const value = i + 1
        return { value, disabled: min > value || max < value }
      })
    },
  },
  methods: {
    select(date) {
      if (!date.disabled) {
        this.$emit('input', date.value)
      }
    },
  },
}
</script>
