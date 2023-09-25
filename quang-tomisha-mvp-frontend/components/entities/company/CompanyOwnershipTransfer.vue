<template>
  <base-modal v-model="shown" title="Bestätigung Übergabe Unternehmensprofil">
    <base-note class="mb-8">
      Bestätige, dass du dieses Unternehmensprofil als Eigentümer übernehmen
      willst. Als Eigentümer bist du auch für dieses Unternehmen und die
      Mitarbeiter verantwortlich.
    </base-note>

    <div class="mb-8">
      <label class="block mb-1 text-gray-600 text-sm">
        Unternehmensprofil
      </label>

      <profile-card :profile="branches.find((b) => b.isHeadquater)" />
    </div>

    <div class="mb-8">
      <label class="block mb-1 text-gray-600 text-sm">
        Aktueller Eigentümer
      </label>

      <profile-card :profile="$auth.user" />
    </div>

    <div class="mb-8">
      <label class="block mb-1 text-gray-600 text-sm">
        Zukünftiger Eigentümer
      </label>

      <profile-card v-if="user" :profile="user" />
    </div>

    <base-button secondary diasbled-on-loading @click="shown = false">
      nicht zustimmen
    </base-button>

    <base-button primary disabled-on-loading class="mb-2" @click="confirm">
      Zustimmen
    </base-button>

    <common-password-confirmation ref="confirmPassword" />
  </base-modal>
</template>

<script>
export default {
  props: {
    branches: { type: Array, required: true },
    user: { type: Object, default: null },
  },
  data() {
    return {
      shown: false,
      done: null,
    }
  },
  methods: {
    open(done) {
      this.done = done
      this.shown = true
    },
    close() {
      this.shown = false
    },
    confirm() {
      this.$refs.confirmPassword.open(async (password) => {
        try {
          await this.done(password)
        } catch (e) {
          return this.$alert.error(e)
        }

        this.shown = false
      })
    },
  },
}
</script>
