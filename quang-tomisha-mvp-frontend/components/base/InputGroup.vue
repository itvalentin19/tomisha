<template>
  <div class="rounded-xl border border-gray-400 overflow-hidden">
    <div v-for="(item, i) in items" :key="item.value" class="px-6">
      <span
        class="flex items-center px-6 -mx-6 cursor-pointer text-teal-600 duration-300 bg-white relative z-10"
        :class="[
          active === item.value
            ? 'text-sm h-8'
            : 'font-semibold justify-center h-12 bg-white hover:bg-teal-100',
          i ? 'border-t border-gray-400' : '',
        ]"
        @click="active = active === item.value ? null : item.value"
      >
        {{ item.text }}
      </span>

      <collapse-transition>
        <div v-if="active === item.value">
          <div class="pb-6">
            <slot :name="item.value" />
          </div>
        </div>
      </collapse-transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: [Number, String], default: null },
    items: { type: Array, default: () => [] },
  },
  computed: {
    active: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      },
    },
  },
}
</script>
