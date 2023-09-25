<template>
  <base-modal
    ref="container"
    v-model="shown"
    title="Daten aus Lebenslauf hinzufügen"
    :dismissible="!uploading"
    @closed="onClosed"
  >
    <div v-if="uploading" class="flex py-10">
      <base-spinner primary class="mx-auto" />
    </div>

    <div
      v-else
      class="rounded-xl p-6 text-center border cursor-pointer"
      :class="[
        dragging
          ? 'border-teal-400 bg-teal-400 text-white'
          : 'border-teal-600 text-teal-600 hover:border-teal-400 hover:bg-teal-400 hover:text-white',
        file ? 'py-10' : '',
      ]"
      @click="inputFile"
    >
      <template v-if="file">
        <base-icon icon="document" class="text-lg" />

        <h3 class="text-lg my-2">
          {{ file.name }}
        </h3>

        <p>ändern?</p>
      </template>

      <template v-else>
        <base-icon icon="upload" />

        <h3 class="text-lg my-2">Lebenslauf hinzufügen</h3>

        <p class="text-left">
          Ziehe deinen Lebenslauf hierher oder klicke auf diese Schaltfläche, um
          deine Unterlagen hinzuzufügen. Nur PDF- oder Word-Dokument.
        </p>
      </template>
    </div>

    <template v-if="!uploading && file" #footer>
      <base-button
        primary
        class="mb-6"
        disabled-on-loading
        @click="processFile"
      >
        Datei hochladen
      </base-button>

      <base-button
        secondary
        class="mb-6"
        disabled-on-loading
        @click="inputFile"
      >
        Datei ändern
      </base-button>

      <base-button @click="file = null"> Abbrechen </base-button>
    </template>
  </base-modal>
</template>

<script>
export default {
  data() {
    const removeEventBubbles = (evt) => {
      evt.preventDefault()
      evt.stopPropagation()
    }
    return {
      shown: false,

      file: null,

      dragging: false,

      uploading: false,

      droplisteners: {
        dragover: removeEventBubbles,
        dragenter: (e) => {
          removeEventBubbles(e)
          this.dragging = true
        },
        dragleave: (e) => {
          removeEventBubbles(e)
          this.dragging = !!e.relatedTarget
        },
        drop: (e) => {
          removeEventBubbles(e)
          this.dragging = false
          this.onFileDrop(e.dataTransfer.files[0])
        },
      },
    }
  },
  mounted() {
    const $el = this.$refs.container.$el
    for (const [evt, handler] of Object.entries(this.droplisteners)) {
      $el.addEventListener(evt, handler)
    }
  },
  methods: {
    show() {
      for (const [evt, handler] of Object.entries(this.droplisteners)) {
        document.body.addEventListener(evt, handler)
      }

      this.dragging = this.uploading = false
      this.file = null
      this.shown = true
    },

    onClosed() {
      for (const [evt, handler] of Object.entries(this.droplisteners)) {
        document.body.removeEventListener(evt, handler)
      }
    },

    onFileDrop(file) {
      if (file && file.type === 'application/pdf') {
        this.handleValidFile(file)
      }
    },

    async inputFile() {
      const file = await this.$fileInput({ accept: 'application/pdf' })
      if (file) {
        this.handleValidFile(file)
      }
    },

    handleValidFile(file) {
      this.file = file
    },

    processFile() {
      this.uploading = true

      this.$alert.error('Currently unavailable')

      // const pdfjs = await import('pdfjs-dist/build/pdf')
      // const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry')

      // pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

      // const binary = await this.readFileAsBinary(this.file)

      // const pdf = await pdfjs.getDocument(binary).promise

      // const promises = Array.from({ length: pdf._pdfInfo.numPages }, (_, i) => {
      //   return pdf
      //     .getPage(i + 1)
      //     .then((page) => page.getTextContent())
      //     .then((text) => text)
      // })

      // const text = await Promise.all(promises)
      // console.log(text)

      this.uploading = false
      this.$emit('done')
      this.shown = false
    },

    readFileAsBinary(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      })
    },
  },
}
</script>
