<template>
  <base-modal ref="modal">
    <base-figure
      title="Melden"
      img="/img/report.svg"
      text="Was ist dir Negatives aufgefallen?"
      class="mb-6"
    />

    <base-textarea
      v-model="draftMessage"
      label="Nachricht"
      placeholder="Schreibe so genau wie möglich auf was dir Negatives aufgefallen ist."
    />

    <template #footer>
      <base-button
        primary
        :disabled="!draftMessage"
        disabled-on-loading
        @click="submit"
      >
        Senden
      </base-button>
    </template>
  </base-modal>
</template>

<script>
export default {
  data() {
    return {
      draftMessage: '',
    }
  },
  methods: {
    open() {
      this.draftMessage = ''
      this.$refs.modal.open()
    },
    submit() {
      this.$axios.$post('report', {
        message: this.draftMessage,
        url: this.$route.path,
      })

      this.$refs.modal.close()

      this.$confirm({
        img: '/report_done.svg',
        title: 'Danke',
        text: 'Danke für deine Nachricht, wir werden uns so schnell wie möglich darum kümmern.',
        actions: [
          {
            text: 'Zurück',
            primary: true,
            handler: () =>
              this.$alert.success('Das Jobinserat wurde gemeldet.'),
          },
        ],
      })
    },
  },
}
</script>
