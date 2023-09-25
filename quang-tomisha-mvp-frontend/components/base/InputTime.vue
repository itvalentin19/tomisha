<template>
  <base-modal
    ref="modal"
    :title="title || label"
    class="relative"
    @shown="onShown"
    @closed="onClosed"
  >
    <template #activator>
      <base-input
        v-bind="$attrs"
        :value="toHhMm(value)"
        :label="label"
        readonly
      />
    </template>

    <div class="flex flex-col h-full">
      <base-input
        ref="search"
        :value="toHhMm(tmp)"
        type="time"
        autofocus
        class="flex-shrink-0 mb-5 hidden lg:block"
        @input="setTmp"
      />

      <div class="flex-grow flex text-lg overflow-hidden lg:h-128 text-center">
        <ul ref="hours" class="list-none w-1/2 border h-full overflow-auto">
          <li
            v-for="i in 24"
            :key="i"
            class="text-teal-600 duration-200 hover:bg-teal-100 cursor-pointer px-5 py-2"
            :class="{
              'bg-gray-200': activeHour === i - 1,
            }"
            @click="setHour(i - 1)"
          >
            {{ !(i > 9) ? '0' : '' }}{{ i - 1 }}
          </li>
        </ul>

        <ul
          ref="mins"
          class="list-none w-1/2 border border-l-0 h-full overflow-auto"
        >
          <li
            v-for="i in 60"
            :key="i"
            class="text-teal-600 duration-200 hover:bg-teal-100 cursor-pointer px-5 py-2"
            :class="{
              'bg-gray-200': activeMin === i - 1,
            }"
            @click="setMin(i - 1)"
          >
            {{ !(i > 10) ? '0' : '' }}{{ i - 1 }}
          </li>
        </ul>
      </div>
    </div>
  </base-modal>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: { type: Number, default: null },
    title: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  data() {
    return {
      tmp: this.value,
    }
  },
  computed: {
    activeHour() {
      return typeof this.tmp === 'number' ? Math.floor(this.tmp / 60) : -1
    },

    activeMin() {
      return typeof this.tmp === 'number' ? this.tmp % 60 : -1
    },
  },
  methods: {
    onShown() {
      this.tmp = this.value

      setTimeout(() => {
        const hours = this.$refs.hours
        const mins = this.$refs.mins
        if (hours && this.activeHour >= 0) {
          hours.children?.[this.activeHour]?.scrollIntoView()
        }
        if (mins && this.activeMin >= 0) {
          mins.children?.[this.activeMin]?.scrollIntoView()
        }
      }, 200)
    },

    onClosed() {
      this.$emit('input', this.tmp || null)
    },

    setTmp(text) {
      if (!text) {
        this.tmp = null
      } else {
        const [h, m] = text.split(':')
        this.tmp = h * 60 + +m
      }
    },

    setHour(h) {
      this.tmp = h * 60 + ((this.tmp || 0) % 60)
    },

    setMin(m) {
      this.tmp = (this.tmp || 0) - ((this.tmp || 0) % 60) + m
      this.$refs.modal.close()
    },

    toHhMm(mins) {
      if (!mins) {
        return ''
      }
      const m = (mins % 60) + ''
      const h = (mins - m) / 60 + ''
      return h.padStart(2, '0') + ':' + m.padStart(2, '0')
    },
  },
}
</script>

<style lang="scss">
input[type='time']::-webkit-calendar-picker-indicator {
  background: none;
}
</style>
