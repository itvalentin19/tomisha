<template>
  <div
    v-show="!!$slots.activator"
    class="base-modal-activator"
    @click.stop="open"
  >
    <slot name="activator" />

    <div ref="wrapper" class="base-modal-wrapper" :class="{ active: shown }">
      <fade-transition>
        <div
          v-if="shown"
          class="base-modal bg-gray-100 lg:bg-dark-overlay fixed z-50 top-1.125 lg:top-0 bottom-0 left-0 right-0 overflow-auto lg:flex items-center lg:py-9"
          @click.self="onOverlayClick"
        >
          <box-container
            class="base-modal__container relative flex flex-col min-h-full lg:min-h-116 lg:rounded-xl lg:overflow-hidden"
            :class="{ 'full-height': fullHeight, 'md:max-w-md': smallSpacing }"
            @hook:beforeCreate="onModalShown"
            @hook:beforeDestroy="onModalHidden"
          >
            <base-page-header
              :title="hideHeader ? '' : title"
              :actions="actions"
              :back-icon="backIcon"
              :dismissible="dismissible"
              class="z-20 p-9 flex-shrink-0"
              :class="{
                'lg:px-16 lg:pt-16 lg:pb-10': !smallSpacing,
                'sticky top-0 bg-white': stickyHeader && !hideHeader,
                'absolute top-0 left-0 right-0': hideHeader,
              }"
              @dismiss="close(true)"
            >
              <template v-if="$slots.actions" #actions>
                <slot name="actions" />
              </template>

              <template v-if="$slots.title" #title>
                <slot name="title" />
              </template>

              <template v-if="$slots['header-bottom']" #default>
                <slot name="header-bottom" />
              </template>
            </base-page-header>

            <main
              class="px-9 flex-grow mb-9 lg:overflow-auto"
              :class="{ 'lg:px-16 lg:pb-0 lg:mb-16': !smallSpacing }"
            >
              <slot />
            </main>

            <footer
              v-if="$slots.footer"
              class="px-9 pt-4 pb-9 flex-shrink-0 bg-white"
              :class="{ 'lg:px-16 lg:pt-0 lg:pb-16': !smallSpacing }"
            >
              <slot name="footer" />
            </footer>
          </box-container>
        </div>
      </fade-transition>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    title: { type: String, default: '' },
    backIcon: Boolean,
    value: Boolean,
    hideHeader: Boolean,
    fullHeight: Boolean,
    smallSpacing: Boolean,
    persistent: Boolean,
    stickyHeader: { type: Boolean, default: true },
    dismissible: { type: Boolean, default: true },
    actions: { type: Array, default: () => [] },
  },
  data() {
    return {
      docScrollTop: 0,
      shown: this.value,
      parentModal: null,
    }
  },
  watch: {
    value(shown) {
      this.shown = shown
    },
  },
  mounted() {
    document.body.appendChild(this.$refs.wrapper)
  },
  beforeDestroy() {
    document.body.removeChild(this.$refs.wrapper)
  },
  methods: {
    open() {
      this.shown = true
      this.$emit('input', true)
      this.$emit('shown')
    },
    close(isDismiss) {
      if (this.$listeners.close) {
        this.$emit('close')
      } else {
        this.shown = false
        this.$emit('input', false)
        this.$emit('closed')
      }

      if (isDismiss) {
        this.$emit('dismiss')
      }
    },
    onOverlayClick() {
      if (!this.persistent) {
        this.close(true)
      }
    },
    onModalShown() {
      if (process.server) {
        return
      }
      // Page has background with opacity so to avoid seeing many modals
      // stakcing on each other. This is to hide all other modals if any
      const parentModal = Array.from(
        document.querySelectorAll('.base-modal-wrapper.active:not([invisible])')
      ).find((m) => m !== this.$refs.wrapper)

      if (parentModal && parentModal !== this.$refs.wrapper) {
        parentModal.setAttribute('invisible', '')
        this.parentModal = parentModal
      }

      if (!this.parentModal) {
        document.documentElement.classList.add('overflow-hidden')

        if (this.$screen.smDown) {
          document.documentElement.classList.add('invisible')
        }
      }
    },
    onModalHidden() {
      if (process.client) {
        if (this.parentModal) {
          this.parentModal.removeAttribute('invisible')
          this.parentModal = null
        } else {
          document.documentElement.classList.remove('overflow-hidden')
          document.documentElement.classList.remove('invisible')
        }
      }
    },
  },
}
</script>

<style lang="scss">
.base-modal {
  &-wrapper {
    @apply visible;

    &[invisible] {
      .base-modal,
      .fixed {
        @apply invisible;
      }
    }
  }

  &__container {
    @apply overscroll-contain;

    @media (min-width: 1024px) {
      max-height: calc(100vh - 64px);

      &.full-height {
        height: calc(100vh - 64px);
      }
    }
  }
}
</style>
