<template>
  <base-modal
    :value="state.shown"
    :dismissible="state.dismissible"
    :persistent="state.persistent"
    hide-header
    @input="!$event && close()"
  >
    <base-figure
      :img="state.img"
      :title="state.title"
      title-class="flex items-center"
      :html="state.html"
      :text="state.text"
      class="mt-6"
    >
      <template v-if="state.icon" #title>
        <base-icon
          :icon="state.icon"
          :class="[state.iconColor ? `text-${state.iconColor}` : '']"
          class="text-lg mr-2"
        />

        <span>
          {{ state.title }}
        </span>
      </template>
    </base-figure>

    <template #footer>
      <template v-if="!state.actions || !state.actions.length">
        <base-button v-if="state.okText" primary @click="done">
          {{ state.okText }}
        </base-button>

        <base-button v-if="state.cancelText" class="mt-6" @click="cancel">
          {{ state.cancelText }}
        </base-button>
      </template>

      <template v-else>
        <base-button
          v-for="({ handler, text, ...props }, i) in state.actions"
          :key="i"
          v-bind="props"
          :class="{ 'mt-6': !!i }"
          @click="handleActionClick(handler)"
        >
          {{ text }}
        </base-button>
      </template>
    </template>
  </base-modal>
</template>

<script>
export default {
  props: {
    state: { type: Object, default: () => ({}) },
  },
  methods: {
    done() {
      this.state.done()
      if (this.state.closeOnDone) {
        this.close()
      }
    },
    cancel() {
      const cancel = this.state.cancel
      setTimeout(() => cancel && cancel())
      this.close()
    },
    close() {
      this.$emit('close')
    },
    handleActionClick(handler) {
      handler && handler()

      this.cancel()
    },
  },
}
</script>
