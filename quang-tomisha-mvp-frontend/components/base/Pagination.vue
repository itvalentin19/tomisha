<template>
  <ul
    v-show="lastPossiblePage > 0"
    class="flex justify-end text-sm text-teal-600"
  >
    <li
      class="inline-flex w-10 h-10 items-center justify-center hover:bg-gray-200 cursor-pointer"
      :class="{ 'pointer-events-none opacity-50': value <= 0 }"
      @click="change(-1)"
    >
      <base-icon icon="back" />
    </li>

    <li
      v-for="page in pages"
      :key="page"
      class="inline-flex w-10 h-10 items-center justify-center hover:bg-gray-200 cursor-pointer"
      :class="{
        'bg-gray-200 text-black-700 hover:no-underline': page === value,
      }"
      @click="change(page)"
    >
      {{ page + 1 }}
    </li>

    <li
      class="inline-flex w-10 h-10 items-center justify-center hover:bg-gray-200 cursor-pointer"
      :class="{ 'pointer-events-none opacity-50': value >= lastPossiblePage }"
      @click="change(+1)"
    >
      <base-icon icon="back" />
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    value: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    limit: { type: Number, default: 20 },
    items: { type: Array, default: () => [] },
  },
  computed: {
    lastPossiblePage() {
      return Math.ceil(this.total / this.limit) - 1
    },
    pages() {
      const pages = []
      const page = this.value
      const addToLast = Math.max(0, 5 - page)
      const last = Math.min(this.lastPossiblePage, page + 4 + addToLast)
      const first = Math.max(0, last - 9)
      for (let i = first; i <= last; i++) {
        pages.push(i)
      }
      return pages
    },
  },
  methods: {
    change(page) {
      this.$emit('input', Math.max(0, Math.min(this.lastPossiblePage, page)))
    },
  },
}
</script>
