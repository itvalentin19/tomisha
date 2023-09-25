<template>
  <base-modal
    v-model="datePickerShown"
    title="Datum"
    small-spacing
    :peristent="false"
    @closed="reset"
  >
    <template #activator>
      <slot name="activator">
        <base-input
          ref="input"
          v-bind="$attrs"
          :value="dateStr"
          readonly
          @clear="$emit('input', null)"
        />
      </slot>
    </template>

    <template #header-bottom>
      <base-segmented-controls v-model="step" :items="steps" :max-visible="3" />
    </template>

    <component
      :is="components[step]"
      :value="values[step]"
      :year="values[0]"
      :month="values[1]"
      :initial-scroll-year="initialScrollYear"
      v-bind="childProps"
      @input="onValuesChange"
    />
  </base-modal>
</template>

<script>
import YearSelector from './orgamisms/YearSelector'
import MonthSelector from './orgamisms/MonthSelector'
import DateSelector from './orgamisms/DateSelector'
export default {
  components: {
    YearSelector,
    MonthSelector,
    DateSelector,
  },
  inheritAttrs: false,
  props: {
    value: { type: [Date, String, Number], default: null },
    initialScrollYear: { type: Number, default: null },
    min: { type: [Date, String, Number], default: null },
    max: { type: [Date, String, Number], default: null },
  },
  data() {
    return {
      datePickerShown: false,
      step: 0,
      components: ['year-selector', 'month-selector', 'date-selector'],
      values: [null, null, null],
    }
  },
  computed: {
    steps() {
      const [year, month, date] = this.values
      return [
        {
          text: date || 'Tag',
          value: 2,
          disabled: typeof month !== 'number',
        },
        {
          text:
            typeof month === 'number'
              ? this.$dayjs().month(month).format('MMMM')
              : 'Monat',
          value: 1,
          disabled: typeof year !== 'number',
        },
        {
          text: year || 'Jahr',
          value: 0,
          disabled: typeof year !== 'number',
        },
      ]
    },
    dateStr() {
      const value =
        !this.value || this.value instanceof Date
          ? this.value
          : new Date(this.value)

      return value instanceof Date
        ? this.$dayjs(value).format('DD. MMMM YYYY')
        : ''
    },
    childProps() {
      const day = this.$dayjs()
      const curYear = day.year()
      const curMonth = day.month()
      const min = this.min && this.$dayjs(this.min)
      const max = this.max && this.$dayjs(this.max)
      const minYear = min?.year?.()
      const maxYear = max?.year?.()
      const minMonth = minYear === curYear ? min.month() : 0
      const maxMonth = maxYear === curYear ? max.month() : 11
      return {
        minYear,
        maxYear,
        minMonth,
        maxMonth,
        minDate: minMonth === curMonth ? min.date() : 1,
        maxDate: maxMonth === curMonth ? max.date() : 31,
      }
    },
  },
  created() {
    if (this.value && !(this.value instanceof Date)) {
      const d = new Date(this.value)
      this.$emit('input', d instanceof Date ? d : null)
    }
  },
  methods: {
    onValuesChange(val) {
      this.values.splice(this.step, 1, val)
      if (this.step === 2) {
        this.$emit('input', new Date(...this.values))
        this.reset()
      } else {
        this.setStep(this.step + 1)
      }
    },
    reset() {
      this.$refs.input && this.$refs.input.focus()
      this.datePickerShown = false
      this.setStep(0)
      this.values = [null, null, null]
    },
    setStep(v) {
      this.step = v
    },
  },
}
</script>
