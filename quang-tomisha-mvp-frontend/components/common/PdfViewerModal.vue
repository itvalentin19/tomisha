<template>
  <base-modal ref="modal" :title="name" :sticky-header="false">
    <template v-if="$slots.activator" #activator>
      <slot name="activator" />
    </template>

    <div
      class="relative w-full rounded-md overflow-hidden"
      style="padding-bottom: 141%"
    >
      <div class="absolute inset-0">
        <iframe
          v-if="url && isPdf"
          :src="`https://docs.google.com/gview?url=${url}&embedded=true`"
          class="w-full h-full"
          frameborder="0"
        />
        <img v-else-if="url" class="w-full" :src="url" alt="preview" />
      </div>
    </div>
  </base-modal>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      url: null,
      isPdf: false,
    }
  },
  methods: {
    open(file) {
      if (!file) {
        return
      }
      this.name = file.name
      this.isPdf = file.name.endsWith('.pdf')
      this.url = this.isPdf ? encodeURIComponent(file.url) : file.url
      this.$refs.modal.open()
    },
  },
}
</script>
