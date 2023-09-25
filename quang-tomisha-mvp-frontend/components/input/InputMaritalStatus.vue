<template>
  <base-select
    v-bind="$attrs"
    label="Zivilstand"
    placeholder="Ledig"
    item-icon="plus-circle"
    :items="$store.state.tag.maritalStatuses"
    item-value="id"
    v-on="$listeners"
  >
    <template #search>
      <base-note class="mb-6">
        Klicke deinen aktuellen Zivilstand an.
      </base-note>
    </template>
  </base-select>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>
