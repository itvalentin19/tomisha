<template>
  <base-select
    v-bind="$attrs"
    title="Länder"
    search-label="Gewünschtes Land eintippen"
    :items="$store.state.tag.countries"
    :item-text="itemText"
    :item-value="itemValue"
    v-on="$listeners"
  >
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>

    <template #item="{ item }">
      <div class="px-6 py-2 flex items-center text-lg">
        <base-icon icon="plus-circle" class="text-base mr-3 flex-shrink-0" />

        <base-flag :code="item.id.toLowerCase()" class="mr-3 flex-shrink-0" />

        <span>{{ item.name }}</span>

        <slot name="item-extend" :item="item" />
      </div>
    </template>
  </base-select>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    itemText: { type: String, default: 'name' },
    itemValue: { type: [Function, String], default: 'id' },
  },
}
</script>
