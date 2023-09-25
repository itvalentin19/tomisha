<template>
  <div
    class="flex"
    :class="[tags.legnth ? 'flex-wrap -m-1' : 'justify-around']"
  >
    <template v-if="!tags.length">
      <base-button
        v-for="item in views"
        :key="item.value"
        :icon="item.icon"
        inline
        class="flex justify-center items-center"
        @click="showView(item)"
      >
        {{ item.btnText }}
      </base-button>
    </template>

    <template v-else>
      <base-button
        icon="filter"
        inline
        class="px-6 m-1"
        @click="showView(views[0])"
      />

      <div
        v-for="(tag, i) in tags"
        :key="i"
        class="border border-gray-400 rounded-xl px-6 py-2 font-semibold m-1 cursor-default"
      >
        {{ tag }}
      </div>
    </template>

    <base-modal v-model="shown" :title="activeView.text" full-height>
      <template v-if="views.length > 1" #header-bottom>
        <base-segmented-controls
          :value="activeView.value"
          :items="views"
          @input="switchView"
        />
      </template>

      <template v-if="activeView.value === 1" #actions>
        <span
          inline
          class="text-teal-600 text-base font-semibold cursor-pointer hover:underline"
          @click="$emit('reset')"
        >
          Löschen
        </span>
      </template>

      <template v-if="activeView.value === 1">
        <slot name="filter" />
      </template>

      <template v-else>
        <slot name="sort" />
      </template>

      <template v-if="$slots[footerSlotName]" #footer>
        <slot :name="footerSlotName" />
      </template>
    </base-modal>
  </div>
</template>

<script>
export default {
  props: {
    hideSort: Boolean,
    tags: { type: Array, default: () => [] },
  },
  data() {
    return {
      shown: false,
      activeView: null,
    }
  },
  computed: {
    views() {
      const views = [
        { text: 'Filtert nach', btnText: 'Filtert', icon: 'filter', value: 1 },
      ]

      if (!this.hideSort) {
        views.push({
          text: 'Sortieren nach',
          btnText: 'Sortieren',
          icon: 'sort',
          value: 2,
        })
      }

      return views
    },

    footerSlotName() {
      return `${this.activeView.value === 1 ? 'filter' : 'sort'}:footer`
    },
  },
  created() {
    this.activeView = this.views[0]
  },
  methods: {
    showView(view) {
      this.$emit('before-show')
      this.activeView = view
      this.shown = true
    },

    close() {
      this.shown = false
    },

    switchView(val) {
      const view = this.views.find((item) => item.value === val)
      this.showView(view)
    },
  },
}
</script>
