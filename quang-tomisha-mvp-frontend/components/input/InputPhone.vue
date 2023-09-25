<template>
  <base-input
    :value="draft.number"
    :label="label"
    placeholder="079 124 31 78"
    type="tel"
    name="phone"
    :validation-value="value"
    :rules="[
      ...($attrs.rules || []),
      (v) => !v || v.length >= 12 || v.length <= 17,
    ]"
    input-class="border border-gray-400 rounded-xl pl-24 sm:pl-36"
    error-class="border-2 border-red-600 rounded-xl pl-24 sm:pl-36"
    v-bind="$attrs"
    @input="setNumber"
  >
    <template #prepend>
      <input-country
        :value="draft.prefix"
        placeholder="+41"
        item-text="p"
        :item-value="(item) => item.id + item.p"
        item-search="name"
        input-class="border-r border-gray-400 rounded-l-xl pl-9 sm:pl-12 pr-2 sm:pr-4"
        initial-scroll-item="ch+41"
        hide-append
        class="w-20 sm:w-28 md:w-32"
        @input="setPrefix"
      >
        <template #prepend>
          <div
            class="w-10 h-12 sm:w-12 flex justify-center items-center absolute left-0 top-0 pointer-events-none"
          >
            <base-flag
              v-if="flagId || !draft.prefix"
              :code="flagId || 'ch'"
              :class="[draft.prefix ? '' : 'opacity-25']"
            />
          </div>
        </template>

        <template #item-extend="{ item }">
          <span class="text-teal-400 whitespace-no-wrap ml-1">
            {{ item.p }}
          </span>
        </template>
      </input-country>
    </template>
  </base-input>
</template>

<script>
import { mapState } from 'vuex'
export default {
  inheritAttrs: false,
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: 'Persönliche Telefonnummer' },
    countryCode: { type: String, default: () => null },
  },
  data() {
    return {
      draft: {
        prefix: '',
        number: '',
      },
    }
  },
  computed: {
    ...mapState('tag', ['countries']),
    flagId() {
      if (!this.draft.prefix) {
        return null
      }
      const prefix = this.draft.prefix.substr(this.draft.prefix.indexOf('+'))
      const country = prefix && this.countries.find((c) => c.p === prefix)
      return country?.id?.toLowerCase?.() || null
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        if (!value) {
          return
        }
        const [prefix, number] = value.split(' ')
        if (prefix?.includes('+') && number) {
          this.draft.prefix = prefix
          this.draft.number = number
        } else {
          this.draft.prefix = this.draft.number = ''
        }
      },
    },

    countryCode(id) {
      if (!this.draft.prefix) {
        const c = this.countries.find((c) => c.id.toLowerCase() === id)
        this.draft.prefix = c ? c.id + c.p : ''
      }
    },
  },

  methods: {
    setPrefix(prefix) {
      this.draft.prefix = prefix
      this.resetValue()
    },

    setNumber(number) {
      this.draft.number = number
      this.resetValue()
    },

    resetValue() {
      const prefix = this.draft.prefix
      const number = this.draft.number?.trim()
      this.$emit('input', prefix && number ? prefix + ' ' + number : null)
    },
  },
}
</script>
