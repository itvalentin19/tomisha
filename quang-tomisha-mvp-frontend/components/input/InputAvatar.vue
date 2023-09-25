<template>
  <div class="ml-6 md:ml-10 lg:ml-16">
    <div
      class="w-36 h-36 border-5 bg-gray-100 rounded-full relative overflow-hidden bg-center bg-no-repeat bg-cover"
      :class="{
        'pointer-events-none': disabled,
        [borderClass]: true,
      }"
      :style="{
        backgroundImage: `url(${value || placeholder})`,
      }"
    >
      <div
        class="absolute inset-0 bg-overlay flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 duration-200"
        @click="$refs.editor.open()"
      >
        <base-icon icon="camera" class="text-3xl text-white" />
      </div>

      <input-image-uploader ref="editor" circle @done="done" />
    </div>

    <base-validation-error
      v-if="rules.length"
      ref="error"
      :value="value"
      :rules="rules"
      class="text-base"
    />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: { type: String, default: null },
    disabled: Boolean,
    borderClass: { type: String, default: 'border-teal-400' },
    placeholder: { type: String, default: null },
    rules: { type: Array, default: () => [] },
  },
  methods: {
    done(src) {
      this.$refs.error?.reset()
      this.$emit('input', src)
    },
  },
}
</script>
