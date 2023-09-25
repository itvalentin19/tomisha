<template>
  <base-segmented-controls
    v-bind="$attrs"
    label="Geschlecht"
    full-label="Dein Geschlecht"
    :items="$store.state.tag.genders"
    item-value="id"
    v-on="$listeners"
  />

  <!-- <base-select
    v-bind="$attrs"
    title="Länder"
    search-label="Gewünschtes Land eintippen"
    :items="$store.state.tag.genders"
    item-value="id"
    v-on="$listeners"
  >
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>

    <template #search>
      <div></div>
    </template>

    <template #item="{ item }">
      <div class="px-6 py-2 flex items-center text-lg">
        <base-icon icon="plus-circle" class="text-base mr-3 flex-shrink-0" />

        <span>{{ item.text }}</span>

        <slot name="item-extend" :item="item" />
      </div>
    </template>
  </base-select> -->
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>
