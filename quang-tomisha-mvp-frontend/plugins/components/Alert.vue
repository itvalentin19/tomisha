<template>
  <div class="fixed top-0 left-0 right-0 z-60 pointer-events-none">
    <slide-y-up-transition>
      <box-container
        v-if="alert.shown"
        transparent
        class="pointer-events-auto shadow-lg md:mr-0"
      >
        <div :class="[`bg-${color}-100 text-${color}-500`]" class="flex p-3">
          <div class="p-2 select-none" :class="[`text-${color}-600`]">
            <base-icon :icon="icon" />
          </div>

          <div class="p-2">
            <h4 class="mb-2 text-xl" :class="[`text-${color}-900`]">
              {{ alert.title }}
            </h4>

            <p class="text-sm">
              {{ alert.text }}
            </p>
          </div>
        </div>

        <div
          :class="[`border-${color}-600`]"
          class="rounded-b-alert border-b-4"
        />
      </box-container>
    </slide-y-up-transition>
  </div>
</template>

<script>
export default {
  props: {
    alert: { type: Object, default: () => ({}) },
  },
  data: () => ({
    styles: {
      success: { color: 'teal', icon: 'check-circle' },
      error: { color: 'red', icon: 'error-circle' },
      info: { color: 'blue', icon: 'info-circle' },
    },
  }),
  computed: {
    style() {
      return this.styles[this.alert.type]
    },
    color() {
      return this.style.color
    },
    icon() {
      return this.style.icon
    },
  },
}
</script>
