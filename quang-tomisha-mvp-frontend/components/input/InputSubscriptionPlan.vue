<template>
  <div class="-mx-6 md:-mx-10 lg:-mx-16">
    <div class="w-full relative my-6 h-120 overflow-hidden">
      <div
        v-for="(item, i) in plans"
        :key="item.id"
        class="rounded-xl bg-white border border-gray-400 shadow-lg p-6 w-80 h-100 flex flex-col flex-shrink-0 absolute top-0 bottom-0 mt-10"
        :style="generateStyle(i)"
        @click="$emit('input', item)"
      >
        <div
          v-if="item.recommended"
          class="absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full inline-block px-6 leading-loose text-white font-semibold bg-blue-600 text-sm whitespace-no-wrap"
        >
          Am beliebtesten
        </div>

        <h3 class="flex items-center justify-center text-2xl mb-6 mt-2">
          <base-icon :icon="item.icon" class="mr-4" />
          {{ item.name }}
        </h3>

        <div class="flex items-center justify-center text-gray-700 mb-6">
          CHF
          <span class="mx-2 text-xl text-blue-600">{{ item.price }}</span>
          /Mo.
        </div>

        <div
          v-for="feature in item.features"
          :key="feature"
          class="flex items-center"
        >
          <base-icon
            icon="sub-bullet"
            class="text-3xl text-teal-600 flex-shrink-0 mr-3"
          />

          {{ feature }}
        </div>

        <div
          v-if="item.refundDays"
          class="text-gray-500 text-center flex-shrink-0 mt-3 mb-1 text-sm"
        >
          {{ item.refundDays }} Tage Geld-zurück-Garantie!
        </div>

        <base-button
          :primary="item.recommended"
          :secondary="!item.recommended"
          class="my-auto"
          @click="$emit('done')"
        >
          Auswählen
        </base-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: Object, default: null },
  },
  data() {
    return {
      plans: [
        {
          id: 'starter',
          price: 120,
          months: 1,
          name: 'Starter',
          icon: 'sub-starter',
          features: ['1 Monat', 'Inklusiv Bewertungssystem'],
        },
        {
          id: 'premium',
          price: 24,
          months: 36,
          recommended: true,
          name: 'Premium',
          icon: 'sub-premium',
          features: [
            '3 Jahre',
            'Inklusiv Bewertungssystem',
            'Die günstigsten Jobinserate',
          ],
          refundDays: 30,
        },
        {
          id: 'basic',
          price: 60,
          months: 12,
          name: 'Basic',
          icon: 'sub-basic',
          features: ['1 Jahre', 'Inklusiv Bewertungssystem'],
          refundDays: 30,
        },
      ],
    }
  },
  computed: {
    activeIndex() {
      return this.plans.indexOf(this.value)
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        if (!v) {
          return this.$emit('input', this.plans[1])
        }
        const plan = this.plans.find((p) => p.id === v.id)
        this.$emit('input', plan || this.plans[1])
      },
    },
  },
  methods: {
    generateStyle(i) {
      const activeIndex = Math.max(0, this.activeIndex)
      const distance = Math.abs(i - activeIndex)
      const scale = 1.1 - distance / 10
      const middle = (this.plans.length - 1) / 2
      // const start =
      const translateX = -50 + (i - middle) * 15 + (i - activeIndex) * 40
      return {
        left: '50%',
        transform: `scale(${scale}) translateX(${translateX}%)`,
        zIndex: this.plans.length - distance,
      }
    },
  },
}
</script>
