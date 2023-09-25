<template>
  <div class="-mx-1">
    <slot v-if="!hideSearch" name="input">
      <div class="bg-white px-1 sticky z-10" :style="{ top: top + 'px' }">
        <base-input
          :value="searchText"
          v-bind="$attrs"
          autofocus
          @keydown="onActivatorKeydown"
          @input="setSearchText"
        />
      </div>
    </slot>

    <base-infinite-scroll
      :items="items"
      :total="maxTotal"
      :disabled="!loadItems"
      @load="callLoadItems"
    >
      <ul ref="list" class="px-1 py-1" lang="de">
        <li
          v-for="(item, i) in searchedItems"
          :key="i"
          :tabindex="item.disabled ? '-1' : '0'"
          class="bg-white text-teal-600 duration-200 mb-1"
          :class="{
            'bg-gray-200': tmpActiveIndex === i,
            'opacity-50': !!item.disabled,
            'hover:bg-teal-100 cursor-pointer focus:outline-none focus:shadow-outline':
              !item.disabled,
          }"
          @click="select(item)"
          @keyup.space.exact="select(item)"
        >
          <slot name="item" :item="item">
            <div class="px-5 py-3 flex text-lg">
              <base-icon
                v-if="itemIcon"
                :icon="itemIcon"
                class="mr-3 flex-shrink-0"
              />

              <span class="break-word hyphens-auto">
                {{ item[itemText] !== undefined ? item[itemText] : item }}
              </span>
            </div>
          </slot>
        </li>
      </ul>
    </base-infinite-scroll>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: { type: [String, Number, Object], default: null },
    items: { type: Array, default: () => [] },
    returnObject: Boolean,
    itemText: { type: String, default: 'text' },
    itemSearch: { type: String, default: null },
    itemValue: { type: [Function, String], default: 'value' },
    itemIcon: { type: String, default: null },
    hideSearch: Boolean,
    loadItems: { type: Function, default: null },
    total: { type: Number, default: 100 },
    hiddenItems: { type: Array, default: () => [] },
    initialScrollItem: { type: [String, Number], default: null },
  },
  data() {
    return {
      searchText: '',
      top: 0,
      tmpActiveIndex: -1,
      maxTotal: this.total,
    }
  },
  computed: {
    useLoadItems() {
      return (
        typeof this.loadItems === 'function' &&
        (!this.maxTotal || this.maxTotal > this.items.length)
      )
    },
    notHiddenItems() {
      const hiddenItemsValue = this.hiddenItems.map((item) =>
        this.getItemValue(item)
      )
      return !hiddenItemsValue.length
        ? this.items
        : this.items.filter(
            (item) => !hiddenItemsValue.includes(this.getItemValue(item))
          )
    },
    searchedItems() {
      if (!this.searchText || this.useLoadItems) {
        return this.notHiddenItems
      }

      const text = this.searchText.toLowerCase().trim()
      const searchAttr = this.itemSearch || this.itemText
      return this.notHiddenItems.filter((item) => {
        const t = this.isItemsPrimitive ? item : item[searchAttr]
        return t && (t + '').toLowerCase().startsWith(text)
      })
    },
    isItemsPrimitive() {
      return this.items.length && this.isPrimitive(this.items[0])
    },
  },
  watch: {
    total(total) {
      this.maxTotal = Math.max(total, this.maxTotal)
    },
  },
  created() {
    this.useLoadItems && !this.items.length && this.callLoadItems()
  },
  mounted() {
    const $scrollParent = this.findScrollParent(this.$el.parentNode)
    this.top = $scrollParent === this.$el.parentNode ? 0 : this.$el.offsetTop

    const val = this.value || this.initialScrollItem
    if (val) {
      const value = this.getItemValue(val)
      const i = this.notHiddenItems.findIndex(
        (item) =>
          (this.isItemsPrimitive
            ? item
            : typeof this.itemValue === 'function'
            ? this.itemValue[item]
            : item[this.itemValue]) === value
      )

      if (~i) {
        this.ensureActiveIndexVisibility(i, true)
      }
    } else if ($scrollParent) {
      $scrollParent.scrollTop = 0
    }
  },
  methods: {
    select(item) {
      if (!item.disabled) {
        this.$emit('input', this.returnObject ? item : this.getItemValue(item))
      }
    },
    onEnter() {
      if (this.searchedItems.length) {
        this.select(this.searchedItems[Math.max(0, this.tmpActiveIndex)])
      }
    },
    setSearchText(text = '') {
      this.searchText = text
      this.$el.parentNode.scrollTop = 0
      this.useLoadItems && this.$utils.debounce(() => this.callLoadItems())
    },
    async callLoadItems(reset = true) {
      const fitler = {}
      if (this.searchText?.trim()) {
        fitler[this.itemText] = this.searchText.toLowerCase().trim()
      }
      if (this.items.length && reset !== true) {
        fitler.skip = this.items.length
      }
      await this.loadItems(fitler)
    },
    findScrollParent(node) {
      if (node == null || !(node instanceof HTMLElement)) {
        return document.documentElement
      }

      const { overflowY } = window.getComputedStyle(node)
      if (overflowY === 'auto' || overflowY === 'scroll') {
        return node
      } else {
        return this.findScrollParent(node.parentNode)
      }
    },
    onActivatorKeydown(e) {
      let captured = true

      switch (e.keyCode) {
        case 13: // Enter
          this.onEnter()
          break
        case 38: // Up
          this.moveActiveIndex(-1)
          break
        case 40: // Down
          this.moveActiveIndex(1)
          break
        default:
          captured = false
          break
      }

      if (captured) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    moveActiveIndex(step) {
      const max = this.items.length

      this.tmpActiveIndex = max ? (max + this.tmpActiveIndex + step) % max : -1

      this.ensureActiveIndexVisibility()
    },
    ensureActiveIndexVisibility(i, top) {
      this.$nextTick(() => {
        const index = i || this.tmpActiveIndex

        if (!this.$refs.list || index < 0 || index >= this.items.length) {
          return
        }

        const $list = this.$refs.list
        const $container = this.findScrollParent($list.parentNode)
        const $item = $list.querySelector(`li:nth-child(${index + 1})`)
        const itemOffsetTop = $item.offsetTop - $list.offsetTop

        if (top || $container.scrollTop > itemOffsetTop) {
          $container.scrollTop = itemOffsetTop
        } else if (
          $container.scrollTop + $container.clientHeight <
          $item.offsetTop + $item.offsetHeight
        ) {
          $container.scrollTop =
            $item.offsetTop + $item.offsetHeight - $container.clientHeight
        }
      })
    },
    isPrimitive(val) {
      return (
        typeof val === 'number' ||
        typeof val === 'string' ||
        val instanceof Date ||
        val === null
      )
    },
    getItemValue(item) {
      return this.isPrimitive(item)
        ? item
        : typeof this.itemValue === 'function'
        ? this.itemValue(item)
        : item[this.itemValue]
    },
  },
}
</script>

<style>
.hyphens-auto {
  hyphens: auto;
}
</style>
