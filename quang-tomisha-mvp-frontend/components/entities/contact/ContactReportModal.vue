<template>
  <base-modal v-model="shown">
    <base-figure
      v-if="isReport"
      img="/img/report.svg"
      title="Melden"
      text="Bist du sicher, dass du dieses Profil melden möchtest?"
      class="mb-6"
    />

    <base-figure
      v-else
      img="/img/block.svg"
      title="Blockieren"
      text="Bist du sicher, dass du dieses Profil blockieren möchtest?"
      class="mb-6"
    />

    <base-input-radio-group
      v-model="draft.action"
      :items="[
        isReport
          ? { text: 'Melden', value: 'report' }
          : { text: 'Blockieren', value: 'block' },
        { text: 'Blockieren & Melden', value: 'both' },
      ]"
      label-class="font-semibold text-teal-600"
      class="mb-6"
    />

    <base-textarea
      v-if="draft.action && (isReport || draft.action === 'both')"
      v-model="draft.message"
      label="Nachricht"
      placeholder="Schreibe so genau wie möglich auf was dir Negatives aufgefallen ist."
    />

    <template #footer>
      <base-button primary class="mb-6" @click="$refs.reportModal.close()">
        Nicht {{ isReport ? 'melden' : 'blockieren' }}
      </base-button>

      <base-button
        danger
        :disabled="
          !draft.action || (draft.action !== 'block' && !draft.message)
        "
        @click="submit"
      >
        Jetzt {{ isReport ? 'melden' : 'blockieren' }}
      </base-button>
    </template>
  </base-modal>
</template>

<script>
export default {
  data() {
    return {
      shown: false,
      isReport: true,
      user: null,
      draft: {
        action: null, // report | block | both
        message: null,
      },
    }
  },
  methods: {
    open(user, isReport = true) {
      this.isReport = isReport
      this.user = user
      this.draft = {
        action: null,
        message: null,
      }
      this.shown = true
    },
    submit() {
      if (this.draft.action !== 'report') {
        this.$axios.post('contact/block/' + this.user.id)
      }
      if (this.draft.action !== 'block') {
        this.$axios.post('report', {
          url: '/' + this.user.slug,
          message: this.draft.message,
        })
      }

      this.$emit('done')

      this.$alert.success(
        this.isReport
          ? 'Katrin Shuster wurde gemeldet.'
          : 'Katrin Shuster wurde blockiert & gemeldet.'
      )

      this.shown = false
    },
  },
}
</script>
