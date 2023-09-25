<template>
  <div class="w-full pb-1/4 relative bg-gray-200">
    <!-- Active cover -->
    <div
      class="absolute inset-0 bg-cover bg-center"
      :style="{
        backgroundImage: items.length ? `url(${items[active]})` : '',
      }"
    />

    <!-- Actions -->
    <div class="absolute inset-0 pb-10 flex justify-between text-teal-600">
      <div
        class="px-6 flex items-center cursor-pointer"
        @click="setActive(active - 1)"
      >
        <base-icon icon="back" />
      </div>

      <div class="flex items-center mx-auto">
        <h5
          class="text-teal-600 font-semibold cursor-pointer p-2 mb-6 select-none"
          @click="openUploader"
        >
          Hintergrund ändern
        </h5>
      </div>

      <div
        class="px-6 flex items-center cursor-pointer"
        @click="setActive(active + 1)"
      >
        <base-icon icon="next" />
      </div>
    </div>

    <!-- Cover uploader -->
    <input-cover-uploader
      ref="uploader"
      :value="value"
      :items="items"
      @input="setValue"
    />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: { type: String, default: '' },
  },
  data() {
    return {
      items: [this.value]
        .filter(Boolean)
        .concat(
          Array.from({ length: 20 }, (_, i) => `/img/cover/${i + 1}.jpg`)
        ),
    }
  },
  computed: {
    active: {
      get() {
        const i = this.items.indexOf(this.value)
        return ~i ? i : 7
      },
      set(i) {
        this.$emit('input', this.items[i])
      },
    },
  },
  created() {
    if (!this.value) {
      this.$emit('input', `/img/cover/7.jpg`)
    }
  },
  methods: {
    setActive(active) {
      this.active = active < 0 ? 59 : active > 59 ? 0 : active
    },
    openUploader() {
      this.$refs.uploader.open()
    },
    setValue(url) {
      const i = this.items.indexOf(url)
      if (i === -1) {
        this.items.unshift(url)
        this.active = 0
      } else {
        this.active = i
      }
    },
  },
}
</script>
