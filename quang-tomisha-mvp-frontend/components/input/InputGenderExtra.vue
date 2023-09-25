<template>
  <base-modal
    v-model="shown"
    :title="title || label"
    small-spacing
    class="relative"
    @shown="$refs.error && $refs.error.reset()"
  >
    <template #activator>
      <slot
        name="activator"
        :text="selectedText"
        :reset="() => $refs.error && $refs.error.reset()"
      >
        <div
          ref="toggler"
          :tabindex="disabled ? '-1' : '0'"
          class="border-gray-400 rounded-b-xl min-h-12 flex justify-center items-center font-semibold py-3 px-4 focus:outline-none select-none"
          :class="[
            value
              ? 'text-teal-100 bg-teal-300 hover:bg-teal-300'
              : 'text-teal-600',
            disabled ? '' : 'cursor-pointer hover:bg-teal-100 duration-200',
          ]"
        >
          {{ value ? value[itemText] : 'oder' }}
          <base-icon icon="chevron-down" class="text-xs ml-2 mt-1" />
        </div>
      </slot>

      <base-validation-error
        v-if="!!$scopedSlots.activator"
        ref="error"
        :value="value"
        :rules="rules"
        class="absolute top-full"
      />
    </template>

    <template v-if="$slots['header-bottom']" #header-bottom>
      <slot name="header-bottom" />
    </template>

    <base-autocomplete
      :value="value"
      :label="searchLabel"
      :placeholder="searchPlaceholder"
      :items="items"
      :item-text="itemText"
      :item-value="itemValue"
      :return-object="returnObject"
      v-bind="$attrs"
      @input="onChange"
    >
      <template v-if="$slots.search" #input>
        <slot name="search" />
      </template>

      <template v-if="$scopedSlots.item" #item="props">
        <slot name="item" v-bind="props" />
      </template>
    </base-autocomplete>
  </base-modal>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: { type: [String, Number, Object, Array], default: null },
    title: { type: String, default: '' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    inputClass: { type: String, default: undefined },
    searchLabel: { type: String, default: '' },
    searchPlaceholder: { type: String, default: '' },
    items: { type: Array, default: () => [] },
    itemText: { type: String, default: 'text' },
    itemValue: { type: [Function, String], default: 'value' },
    disabled: { type: Boolean, default: false },
    returnObject: Boolean,
    hideAppend: Boolean,
  },
  data() {
    return {
      shown: false,
    }
  },
  computed: {
    itemsValue() {
      if (!this.items.length) {
        return []
      }
      return this.items.map(this.getItemValue)
    },
    selectedText() {
      if (!this.value) {
        return
      }

      const value = this.getItemValue(this.value)
      const i = this.itemsValue.indexOf(value)
      const selected = this.items[i]

      return selected
        ? this.isPrimitive(selected)
          ? selected
          : selected[this.itemText]
        : ''
    },
  },
  methods: {
    open() {
      this.shown = true
    },
    onChange(v) {
      this.$emit('input', v)
      this.shown = false
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
