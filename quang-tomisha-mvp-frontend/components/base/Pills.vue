<template>
  <div class="base-pills">
    <ul
      ref="nav"
      class="base-pills__nav p-4 py-6 bg-pills flex overflow-auto font-semibold select-none scrolling-touch relative"
      :class="{ 'cursor-grabbing': dragging }"
      @mousedown="onDragStart"
      @wheel="onMouseWheel"
    >
      <li v-for="(item, i) in items" :key="i" class="p-2">
        <div
          tabindex="0"
          class="rounded-xl focus:outline-none duration-300 flex-shrink-0 overflow-hidden whitespace-no-wrap cursor-pointer"
          :class="[
            (
              value === undefined
                ? item.to &&
                  currentPath === (exact ? item.to : item.to.split('?')[0])
                : item.value === value
            )
              ? 'bg-teal-300 text-white'
              : `bg-white text-teal-600 ${
                  dragging || ($nuxt.$loading && $nuxt.$loading.show)
                    ? ''
                    : 'hover:bg-teal-200'
                }`,
            dragging ? 'pointer-events-none' : 'focus:shadow-outline',
          ]"
          @click="onItemClick(item)"
          @keyup.enter="onItemClick(item)"
        >
          <n-link
            v-if="item.to"
            :to="item.to"
            class="py-3 px-6 block"
            @click.native.stop="scrollToActiveItem(item)"
          >
            {{ item.text }}
          </n-link>

          <div v-else class="py-3 px-6">
            {{ item.text }}
          </div>
        </div>
      </li>
    </ul>

    <div class="h-2 -mt-2 bg-white rounded-t-xl relative" />
  </div>
</template>

<script>
export default {
  props: {
    value: { type: [String, Number], default: undefined },
    items: { type: Array, default: () => [] },
    exact: Boolean,
  },
  data() {
    return {
      scrollLeftStartAt: 0,
      mouseStartAt: 0,
      pressing: false,
      dragging: false,
    }
  },
  computed: {
    currentPath() {
      return (this.exact ? this.$route.fullPath : this.$route.path).replace(
        /\/$/,
        ''
      )
    },
  },
  mounted() {
    this.scrollToActiveItem()
  },
  methods: {
    onItemClick(item) {
      if (!this.dragging && !item.to) {
        this.$emit('input', item.value)
        this.scrollToActiveItem(item)
      }
    },

    scrollToActiveItem(item) {
      this.$nextTick(() => {
        if (!this.$refs.nav) {
          return
        }
        const activeItem = item
          ? this.$refs.nav.children?.[this.items.indexOf(item)]
          : this.$refs.nav.querySelector('.bg-teal-300')?.parentNode
        if (!activeItem) {
          return
        }
        const nav = this.$refs.nav
        if (activeItem.offsetLeft < nav.scrollLeft + 80) {
          nav.scrollLeft = activeItem.offsetLeft - 80
        } else if (
          activeItem.offsetLeft + activeItem.offsetWidth >
          nav.scrollLeft + nav.clientWidth
        ) {
          nav.scrollLeft = activeItem.offsetLeft - activeItem.offsetWidth
        }
      })
    },

    onDragStart({ clientX }) {
      this.pressing = true
      this.mouseStartAt = clientX
      this.scrollLeftStartAt = this.$refs.nav.scrollLeft

      const listen = document.documentElement.addEventListener
      listen('mouseup', this.onDragEnd)
      listen('mousemove', this.onDragMove)
    },

    onDragMove({ clientX }) {
      if (!this.pressing) return

      this.dragging = this.dragging || Math.abs(this.mouseStartAt - clientX) > 5

      if (this.dragging) {
        this.$refs.nav.scrollLeft =
          this.scrollLeftStartAt - clientX + this.mouseStartAt
      }
    },

    onDragEnd() {
      if (!this.pressing) return

      setTimeout(() => {
        this.pressing = this.dragging = false
      }, 100)

      const stop = document.documentElement.removeEventListener
      stop('mouseup', this.onDragEnd)
      stop('mousemove', this.onDragMove)
    },

    onMouseWheel(e) {
      if (e.type !== 'wheel') {
        return
      }
      let delta = (e.deltaY || -e.wheelDelta || e.detail) >> 10 || 1
      delta = delta * -100
      this.$refs.nav.scrollLeft -= delta
      e.preventDefault()
    },
  },
}
</script>

<style lang="scss">
.base-pills {
  &__nav {
    &::-webkit-scrollbar {
      display: none;
    }

    scrollbar-width: none;
  }
}
</style>
