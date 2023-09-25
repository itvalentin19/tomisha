<template>
  <base-input-wrapper v-bind="$attrs" class="base-textarea" v-on="$listeners">
    <template #default="{ attrs, listeners, inputClass }">
      <div class="relative">
        <textarea
          ref="textarea"
          class="bg-transparent w-full bg-white max-h-full text-black-700 px-5 py-3 resize-none block"
          :class="[inputClass, attrs.readonly ? 'cursor-default' : '']"
          :rows="rows"
          v-bind="attrs"
          v-on="listeners"
        />

        <div :class="[inputClass]" class="base-textarea__border" />
      </div>
    </template>
  </base-input-wrapper>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    autofocus: Boolean,
    rows: { type: [String, Number], default: 4 },
  },
  watch: {
    '$attrs.value': 'resetHeight',
  },
  mounted() {
    if (this.$refs.textarea) {
      if (this.autofocus) {
        this.$refs.textarea.focus()
      }
      this.resetHeight()
    }
  },
  methods: {
    resetHeight() {
      const $textarea = this.$refs.textarea
      if ($textarea) {
        $textarea.style.height = 'auto'
        $textarea.style.height =
          Math.max($textarea.scrollHeight + 2, $textarea.clientHeight) + 'px'
      }
    },
  },
}
</script>

<style lang="scss">
.base-textarea {
  textarea {
    @apply appearance-none;

    &:hover,
    &:focus {
      + .base-textarea__border {
        opacity: 1;
      }
    }
    &::-webkit-scrollbar {
      @apply hidden;
    }
  }

  &__border {
    @apply border-2 opacity-0 absolute h-full left-0 right-0 bottom-0 pointer-events-none duration-200;
  }
}
</style>
