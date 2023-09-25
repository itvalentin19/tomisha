<template>
  <base-modal v-model="shown" :title="title" back-icon>
    <div
      v-if="src"
      class="img-cropper bg-white rounded-xl overflow-hidden relative"
      :class="{ 'is-circle': circle }"
      :style="{
        height: mergedOpts.minCropBoxWidth / mergedOpts.aspectRatio + 40 + 'px',
      }"
    >
      <div class="absolute group inset-0">
        <div
          class="lg:group-hover:opacity-100 opacity-0 transition-opacity duration-300 absolute top-4 right-0 z-10"
        >
          <base-button icon="plus" class="zoom-button mb-2" @click="zoomIn" />

          <base-button icon="minus" class="zoom-button" @click="zoomOut" />
        </div>

        <img ref="img" :src="src" @load="onImgLoaded" />
      </div>
    </div>

    <template #footer>
      <base-button primary class="mb-6" @click="done"> Speichern </base-button>

      <base-button @click="open"> Bild ändern </base-button>
    </template>
  </base-modal>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  inheritAttrs: false,
  props: {
    title: { type: String, default: 'Bildgrösse und -position ändern' },

    circle: Boolean,

    // https://github.com/fengyuanchen/cropperjs/blob/master/README.md#getcroppedcanvasoptions
    outputOpts: { type: Object, default: () => ({ width: 180, height: 180 }) },
  },
  data() {
    return {
      shown: false,
      src: null,
      filename: null,

      cropper: null,
      opts: {},
      // https://github.com/fengyuanchen/cropperjs/blob/master/README.md#options
      defaultCropperOpts: Object.freeze({
        aspectRatio: 1 / 1,
        minCanvasWidth: 70,
        background: false,
        guides: false,
        viewMode: 0,
        autoCropArea: 0.8,
        cropBoxResizable: false,
        cropBoxMovable: false,
        dragMode: 'move',
        minCropBoxWidth: 140,
      }),
    }
  },
  computed: {
    mergedOpts() {
      return Object.assign({}, this.defaultCropperOpts, this.opts)
    },
  },
  methods: {
    async open(opts) {
      this.opts = opts || {}
      this.src = null

      const file = await this.$fileInput()
      this.filename = file.name

      if (file instanceof File) {
        this.shown = true
        this.src = await this.readFileAsUrl(file)
      }
    },
    onImgLoaded() {
      this.cropper = new Cropper(this.$refs.img, this.mergedOpts)
    },
    // direction is either 1 or -1 for zooming in and out accordingly
    zoom(direction = 1) {
      const ZOOM_STEP = 0.1
      const zoomRate = ZOOM_STEP * direction

      this.cropper.zoom(zoomRate)
    },
    zoomIn() {
      this.zoom(1)
    },
    zoomOut() {
      this.zoom(-1)
    },
    done() {
      const canvas = this.cropper.getCroppedCanvas(this.outputOpts)
      canvas.toBlob(async (blob) => {
        blob.lastModifiedDate = new Date()
        blob.name = this.filename

        this.$emit('done', await this.$upload(blob))

        this.shown = false
        this.src = null
      })
    },
    readFileAsUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },
  },
}
</script>

<style lang="scss">
.img-cropper {
  .cropper-view-box,
  .cropper-face {
    @apply rounded-xl;
  }

  &.is-circle {
    .cropper-view-box,
    .cropper-face {
      border-radius: 50%;
    }
  }

  .cropper-view-box {
    @apply bg-white;
  }

  .cropper-modal {
    @apply opacity-75 bg-black;
  }

  .cropper-face {
    @apply border-5 border-teal-400 bg-transparent opacity-100;
  }
}

.zoom-button {
  @apply relative text-white #{!important};

  transform: scale(0.8);
}
</style>
