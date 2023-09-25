<template>
  <div class="base-input-radio-group">
    <slot name="label">
      <label v-if="label" class="mb-6 text-sm text-gray-600 block">
        {{ label }}
      </label>
    </slot>

    <base-checkbox
      v-for="(item, i) in items"
      :key="item.id || i"
      v-bind="$attrs"
      :checked="checked === item[itemValue]"
      :label="item[itemText]"
      :label-class="labelClass"
      :title="item[itemValue]"
      class="mb-6"
      :class="[itemClass]"
      v-on="$utils.except($listeners, 'change')"
      @change="$emit('change', item[itemValue])"
    />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    labelClass: {
      type: String,
      default: 'text-sm text-gray-500',
    },
    items: { type: Array, default: () => [] },
    itemText: { type: String, default: 'text' },
    itemValue: { type: String, default: 'value' },
    itemClass: { type: String, default: '' },
  },
}
</script>
