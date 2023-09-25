<template>
  <div class="select-none text-right">
    <fade-transition :duration="400">
      <div
        v-if="shown"
        class="fixed inset-0 z-50 bg-dark-overlay"
        @click="close"
      />
    </fade-transition>

    <div class="relative" :class="{ 'z-50': shown }">
      <span
        class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white cursor-pointer"
        :class="{ 'text-teal-600': shown }"
        @click="shown = !shown"
      >
        <base-icon icon="vertical-dots" class="text-xl" />
      </span>

      <transition-group
        tag="div"
        name="base-menu"
        class="text-base text-teal-600 absolute top-full right-0"
      >
        <div
          v-for="(item, i) in shown ? items : []"
          :key="i + '_'"
          class="mt-5 px-6 py-3 inline-flex items-center rounded-xl bg-white cursor-pointer whitespace-no-wrap"
          @click="handleItemClick(item)"
        >
          <base-icon v-if="item.icon" :icon="item.icon" class="mr-4 text-sm" />

          <span class="font-medium">{{ item.text }}</span>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: { type: Array, default: () => [] },
  },
  data() {
    return {
      shown: false,
    }
  },
  watch: {
    shown(shown) {
      this.$utils.freezePageScroll(shown)
      if (process.client && shown) {
        document.documentElement.scrollTop = 0
      }
    },
  },
  methods: {
    close() {
      this.shown = false
    },
    handleItemClick(item) {
      item.handler && item.handler()
      this.shown = false
    },
  },
}
</script>

<style lang="scss">
.base-menu {
  &-enter-active,
  &-leave-active {
    transition: 0.3s;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translateY(-16px);
  }
}
</style>
