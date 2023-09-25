<template>
  <div class="-mx-6 lg:mx-0">
    <slot />

    <div class="overflow-auto w-full border-l border-r border-gray-400">
      <table class="min-w-full border-collapse border-gray-400">
        <thead
          class="whitespace-no-wrap border-t border-b border-gray-400 bg-gray-100 font-normal text-base"
        >
          <tr class="h-12 uppercase">
            <th v-if="selectable" class="font-normal text-sm max-w-23 min-w-23">
              <template v-if="isArrayValue">
                <div class="flex items-center">
                  <base-checkbox
                    :checked="value.length > 0"
                    class="mr-3"
                    @change="toggleSelected"
                  />

                  Alle
                </div>
              </template>
            </th>

            <!-- Columns head -->
            <th
              v-for="column in columns"
              :key="column.key"
              :style="{
                minWidth: column.minWidth,
                width: column.width,
                maxWidth: column.maxWidth,
              }"
              class="text-left select-none font-normal text-sm"
            >
              <div
                class="inline-flex items-center cursor-pointer select-none"
                @click="onColumnHeadClick(column)"
              >
                <span>{{ column.name }}</span>

                <base-icon
                  icon="chevron-down"
                  class="ml-3 duration-300 text-xs text-gray-600"
                  :class="{
                    'transform rotate-180': !asc,
                    'opacity-0 pointer-events-none': sortBy !== column,
                  }"
                />
              </div>
            </th>
          </tr>
        </thead>

        <tbody
          class="text-black-600"
          :class="{
            'cursor-pointer': !!$listeners['item-click'],
          }"
        >
          <!-- Rows -->
          <tr
            v-for="(item, i) in sortedItems"
            :key="item.id || item.index + 1"
            class="border-b border-gray-400 duration-150"
            :class="{
              group: !selectable,
              'bg-teal-100':
                selectable && isArrayValue && value.includes(item[itemValue]),
              'hover:bg-teal-100': !!$listeners['item-click'],
            }"
            @click="onItemClick(item)"
          >
            <td
              v-if="selectable"
              class="py-3"
              @click.stop="toggleItemSelection(item)"
            >
              <base-checkbox
                :checked="
                  isArrayValue
                    ? value.includes(item[itemValue])
                    : value === item[itemValue]
                "
                disabled
              />
            </td>

            <!-- Columns -->
            <td
              v-for="col in columns"
              :key="col.key"
              :style="{ minWidth: col.minWidth, maxWidth: col.maxWidth }"
              :width="(!i || !selectable) && col.width"
              class="truncate"
              :class="[col.class || '']"
            >
              <slot
                :name="col.key"
                :item="item"
                :item-text="itemsText[item.index][col.key]"
                :index="item.index"
              >
                {{ itemsText[item.index][col.key] || '—' }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: [String, Array, Number], default: null },
    data: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    items: { type: Array, default: () => [] },
    itemValue: { type: String, default: 'id' },
    selectable: Boolean,
    offline: { type: Boolean, default: true },
    pagination: { type: Object, default: null },
  },
  data() {
    const order = this.pagination?.[0]?.order
    const col = order && this.columns.find((c) => c.key === order)
    return {
      sortBy: col || this.columns[0],
      asc: this.pagination?.[0]?.asc ?? true,
    }
  },
  computed: {
    isArrayValue() {
      return Array.isArray(this.value)
    },
    itemsText() {
      return this.items.map((item) => {
        const itemTexts = {}
        for (const col of this.columns) {
          itemTexts[col.key] = this.getItemText(item, col)
        }
        return itemTexts
      })
    },
    itemSortedValues() {
      const itemsText = this.itemsText
      return this.items.map((item, i) => {
        const itemSortedValue = {}
        for (const col of this.columns) {
          itemSortedValue[col.key] =
            typeof col.getSortedValue === 'function'
              ? col.getSortedValue(item[col.key], item)
              : itemsText[i][col.key]
        }
        return itemSortedValue
      })
    },
    sortedItems() {
      const items = this.items.map((item, index) => ({ ...item, index }))
      if (!this.offline || !this.sortBy) {
        return items
      }
      const texts = this.itemSortedValues
      const key = this.sortBy.key
      const asc = this.asc ? 1 : -1

      return items.sort((a, b) => {
        const aText = texts[a.index][key]
        const bText = texts[b.index][key]
        const v =
          aText === bText
            ? 0
            : typeof aText === 'number'
            ? aText - bText
            : aText > bText
            ? 1
            : -1
        return v * asc
      })
    },
  },
  watch: {
    items() {
      this.$emit('input', this.isArrayValue ? [] : null)
    },
    columns(cols) {
      this.sortBy = cols[0]
    },
    pagination(pagi) {
      if (!pagi) {
        return
      }
      const { order, asc } = this.pagi
      const sortBy = order && this.columns.find((c) => c.key === order)
      this.sortBy = sortBy || this.columns[0]
      this.asc = asc ?? true
    },
  },
  methods: {
    toggleSelected() {
      this.$emit(
        'input',
        this.value.length < this.items.length
          ? this.items.map((item) => item[this.itemValue])
          : []
      )
    },
    onItemClick(item) {
      this.$emit('item-click', item)
    },
    onColumnHeadClick(column) {
      this.asc = this.sortBy === column ? !this.asc : this.asc
      this.sortBy = column

      this.$emit('pagination', { order: this.sortBy, asc: this.asc })
    },
    toggleItemSelection(item) {
      if (this.isArrayValue) {
        const itemValue = item[this.itemValue]
        const i = this.value.findIndex((value) => value === itemValue)
        if (i === -1) {
          this.value.push(itemValue)
        } else {
          this.value.splice(i, 1)
        }
      } else {
        this.$emit('input', item[this.itemValue])
      }
    },
    getItemText(item, col) {
      const val =
        typeof col.transform === 'function'
          ? col.transform(item[col.key], item)
          : item[col.key]
      return this.$utils.isEmpty(val) ? '' : val
    },
  },
}
</script>

<style lang="scss">
td,
th {
  max-width: 300px;
  @apply align-middle px-3 py-2;
}
</style>
