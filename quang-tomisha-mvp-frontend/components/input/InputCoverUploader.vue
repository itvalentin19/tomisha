<template>
  <base-modal v-model="shown" title="Hintergrundbild" back-icon>
    <base-note class="mb-6">
      Wähle dein gewünschtes Hintergrundbild aus.
    </base-note>

    <base-button
      ref="btn"
      secondary
      icon="plus-circle"
      class="mb-6"
      @click="
        $refs.editor.open({
          aspectRatio: 4 / 1,
          minCropBoxWidth: $refs.btn.$el.offsetWidth - 40,
        })
      "
    >
      Eigenes Bild hochladen
    </base-button>

    <input-image-uploader
      ref="editor"
      :output-opts="{
        width: 576,
        height: 144,
      }"
      @done="done"
    />

    <div
      v-for="(item, i) in items"
      :key="i"
      class="pb-1/4 relative w-full bg-gray-200 rounded-xl overflow-hidden mb-6 cursor-pointer"
    >
      <img
        :src="item"
        class="absolute inset-0 block select-none object-cover w-full"
        @click="done(item)"
      />
    </div>
  </base-modal>
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: { default: '' },
    items: { type: Array, default: () => [] },
  },
  data() {
    return {
      shown: false,
    }
  },
  methods: {
    open() {
      this.shown = true
    },
    done(img) {
      this.$emit('input', img)
      this.shown = false
    },
  },
}
</script>
