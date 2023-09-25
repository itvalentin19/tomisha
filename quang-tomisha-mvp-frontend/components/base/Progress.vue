<template>
  <base-input-wrapper class="base-progress" v-bind="$attrs" :value="value">
    <div
      ref="input"
      class="relative w-full select-none px-5 h-10"
      @click="$refs.circles[0].focus()"
    >
      <div
        class="base-progress__track absolute bg-gray-600 cursor-pointer z-10"
        @click.stop="onTrackClick"
      >
        <div
          class="absolute top-0 h-full bg-teal-300"
          :style="{
            right: `${100 - ((100 / max) * values[values.length - 1] || 0)}%`,
            left: `${(100 / max) * values[values.length - 2] || 0}%`,
          }"
        />
      </div>

      <div class="relative w-full h-full">
        <span
          v-for="(val, i) in values"
          :key="i"
          ref="circles"
          tabindex="0"
          class="absolute top-0 z-10 inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-300 text-sm text-white transform -translate-x-1/2 cursor-pointer focus:outline-none focus:shadow-outline"
          :style="{ left: `${(100 / max) * val}%` }"
          @keydown.right="change(i, val + 1)"
          @keydown.left.exact="change(i, val - 1)"
          @mousedown="onDragStart(i, $event)"
          @touchstart.prevent="onDragStart(i, $event.touches[0])"
          @click.stop
        >
          {{ val }}
        </span>
      </div>
    </div>
  </base-input-wrapper>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: { type: [Number, Array], default: 100 },
    minDistance: { type: Number, default: 5 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
  },
  data() {
    return {
      touching: false,
      tmpIndex: 0,
      touchStartAt: 0,
      valueStartAt: 0,
    }
  },
  computed: {
    values() {
      return []
        .concat(this.value)
        .slice(0, 2)
        .map((v) => v || 0)
    },
  },
  methods: {
    change(i, v) {
      if (v < this.min || v > this.max) {
        return
      }

      if (Array.isArray(this.value)) {
        const vals = [...this.values]
        vals.splice(i, 1, v)
        if (vals[0] <= vals[1] - this.minDistance) {
          this.$emit(
            'input',
            vals.map((v) => Math.max(this.min, Math.min(this.max, v)))
          )
        }
      } else {
        this.$emit('input', Math.max(this.min, Math.min(this.max, v)))
      }
    },

    onTrackClick(e) {
      this.change(
        0,
        Math.round(
          ((e.offsetX - 5) / (this.$refs.input.clientWidth - 10)) * this.max
        )
      )
    },

    onDragStart(i, { clientX }) {
      this.touching = true
      this.touchStartAt = clientX
      this.valueStartAt = this.values[i]
      this.tmpIndex = i

      const listen = document.documentElement.addEventListener
      listen('mouseup', this.onDragEnd)
      listen('mousemove', this.onDragMove)
      listen('touchend', this.onDragEnd)
      listen('touchmove', this.onDragMove)
    },
    onDragMove(e) {
      if (!this.touching) {
        return
      }

      const { clientX } = (e.touches && e.touches[0]) || e

      const width = this.$refs.input.clientWidth

      const flux = this.touchStartAt - clientX

      this.change(
        this.tmpIndex,
        this.valueStartAt - Math.round((flux / width) * this.max)
      )
    },
    onDragEnd() {
      if (this.touching) {
        this.touching = false
      }

      const stop = document.documentElement.removeEventListener
      stop('mouseup', this.onDragEnd)
      stop('mousemove', this.onDragMove)
      stop('touchend', this.onDragEnd)
      stop('touchmove', this.onDragMove)
    },
  },
}
</script>

<style lang="scss" scoped>
.base-progress {
  &__track {
    height: 2px;
    top: calc(1.25rem - 1px);
    left: 2px;
    right: 2px;
  }
}
</style>
