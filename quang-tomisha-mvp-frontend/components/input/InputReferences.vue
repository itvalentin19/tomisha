<template>
  <div>
    <reference-modal class="mb-8">
      <template #activator>
        <base-button secondary icon="plus-circle">
          Referenzen hinzufügen
        </base-button>
      </template>
    </reference-modal>

    <div
      v-for="(item, i) in items"
      :key="i"
      class="flex justify-between items-center mb-5"
    >
      <reference-card :reference="item" class="flex-grow relative" />
    </div>

    <slot />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  data() {
    return {
      items: [],
    }
  },
  async created() {
    this.items = await this.$axios.get('/reference/me')
  },
}
</script>
