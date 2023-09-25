<template>
  <div class="border border-gray-400 rounded-xl">
    <div
      v-for="(item, i) in sortedLogs"
      :key="item.id"
      class="p-6 flex justify-between items-center"
      :class="{ 'border-t border-gray-400': !!i }"
    >
      <div class="flex-shrink-0 mr-2">
        {{ $dayjs(item.createdAt).format('DD. MMMM YYYY') }}
      </div>

      <div class="flex-shrink-0">
        <template v-if="!item.action">
          {{ item.text }}
        </template>

        <div
          v-else
          class="rounded-full px-3 py-1"
          :class="[
            'bg-' + colorsByAction[item.action],
            item.action === 4 ? 'text-black' : 'text-white',
          ]"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { JobLogColor } from '~/constants'
export default {
  props: {
    items: { type: Array, required: true },
  },
  data() {
    return {
      colorsByAction: JobLogColor,
    }
  },
  computed: {
    sortedLogs() {
      return [...this.items].sort(
        (a, b) =>
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
      )
    },
  },
}
</script>
