<template>
  <div
    ref="nav"
    class="fixed z-40 top-full left-0 w-full pointer-events-none"
    :class="{
      'transform duration-300': !touching,
      'opacity-0': !actionsMode && !expanded,
    }"
    :style="{
      transform: `translateY(${
        expanded
          ? 'calc(-100% + ' + -translateY + 'px)'
          : -translateY - offsetY + 'px'
      })`,
    }"
    @click="hide"
  >
    <box-container
      transparent
      class="overflow-x-hidden pointer-events-auto relative z-30 pt-1 -mt-1"
      :class="{ 'lg:max-w-full': fullWidth }"
    >
      <div
        class="shadow-top rounded-t-xl"
        :class="[bodyClass, fullWidth ? 'lg:rounded-t-none' : '']"
        :style="{ minHeight: offsetY ? offsetY + 'px' : '' }"
        @mousedown="onDragStart($event)"
        @mousemove="onDragMove($event)"
        @mouseleave="onDragEnd($event)"
        @mouseup="onDragEnd($event)"
        @touchstart.prevent.stop="onDragStart($event.touches[0])"
        @touchmove="onDragMove($event.touches[0])"
        @touchend="onDragEnd($event)"
        @click.stop
      >
        <div v-if="disabled" key="_d" class="h-6" />

        <div
          v-else
          class="flex justify-center items-center h-7 text-center cursor-pointer"
        >
          <span class="inline-block h-1 w-12 bg-gray-300" />
        </div>

        <div class="px-6 z-100">
          <slot :expanded="expanded" />
        </div>
      </div>
    </box-container>

    <fade-transition>
      <div
        v-if="expanded && overlay"
        class="fixed left-0 right-0 z-20 bg-overlay pointer-events-auto"
        style="bottom: 0; height: 200vh"
        @click="toggle"
      />
    </fade-transition>
  </div>
</template>

<script>
export default {
  props: {
    bodyClass: { type: String, default: 'bg-white' },
    fullWidth: Boolean,
    actionsMode: Boolean,
    overlay: Boolean,
    disabled: Boolean,
  },
  data() {
    return {
      expanded: false,
      touching: false,
      moved: false,
      touchStartAt: 0,
      translateY: 0,
    }
  },
  computed: {
    offsetY() {
      return this.actionsMode ? (this.disabled ? 80 : 85) : 0
    },
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded
      return this.expanded
    },
    hide() {
      setTimeout(() => {
        this.expanded = false
      })
    },
    onDragStart({ clientY }) {
      this.translateY = 0
      this.touching = true
      this.touchStartAt = clientY
    },
    onDragMove({ clientY }) {
      if (!this.touching) {
        return
      }
      this.moved = true

      const height = this.$refs.nav.offsetHeight - this.offsetY

      const flux = this.touchStartAt - clientY

      if (this.expanded) {
        this.translateY = Math.min(0, Math.max(flux, -height))
      } else {
        this.translateY = Math.max(0, Math.min(height, flux))
      }
    },
    onDragEnd(e) {
      if (e.target.children.length > 2) return
      if (!this.touching) {
        return
      }

      if (!this.moved) {
        let href = ''
        if (e.path) {
          for (let index = 0; index < e.path?.length; index++) {
            const path = e.path[index]
            try {
              if (path.getAttribute && path.getAttribute('href')) {
                href = path.getAttribute('href')
                break
              }
              if (path.getAttribute && path.getAttribute('type') === 'button') {
                path.click()
                break
              }
            } catch (e) {
              console.log(e)
            }
          }
        } else {
          let ele = e.target
          let tag = ele.tagName
          if (tag === 'path') {
            ele = ele.parentNode
            tag = ele.tagName
          }
          let classes = ele.getAttribute('class')
          if (tag !== 'path') {
            classes = classes.split(' ')
            if (classes.filter((cls) => cls.includes('href-')).length > 0) {
              classes = classes.filter((cls) => cls.includes('href-'))
              href = classes[0].replace('href-', '')
            }
          }
        }

        if (href) {
          this.$router.push({
            path: href,
          })
        }
        return
      }

      this.expanded = this.moved
        ? this.expanded
          ? this.translateY > -15
          : this.translateY > 15
        : !this.expanded

      this.moved = false
      this.touching = false
      this.translateY = 0
    },
  },
}
</script>
