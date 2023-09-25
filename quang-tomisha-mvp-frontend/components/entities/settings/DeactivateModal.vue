<template>
  <div>
    <!-- Step 1: confirm -->
    <base-modal v-model="confirmShown">
      <base-figure
        img="/img/deactivate.svg"
        title="Konto deaktivieren"
        :text="`Es tut uns leid, dass Du uns verlassen. Wenn Du dein Konto deaktivieren, verlierst Du auch die Möglichkeit, sich ${
          $auth.company
            ? 'Es tut uns leid, dass Du uns verlassen. Wenn Du dein Konto deaktivieren, verlierst Du auch die Möglichkeit, sich auf Tomisha als Arbeitgeber zu präsentieren.'
            : 'zu bewerben'
        }.`"
        class="mb-6"
      />

      <label class="mb-1 text-sm text-gray-600 block">
        Dieses Profil deaktivieren
      </label>

      <profile-card v-if="$auth.company" :profile="$auth.company" />

      <template #footer>
        <base-button primary class="mb-6" @click="confirmShown = false">
          Nicht deaktivieren
        </base-button>

        <base-button danger :disabled="!passwordShown" @click="onConfirmDone">
          Weiter
        </base-button>
      </template>
    </base-modal>

    <!-- Step 2: reason -->
    <base-modal v-model="reasonShown" title="Konto deaktivieren">
      <base-note class="mb-10">
        Hier siehst du deine gesperrten Profile, diese Profile können dich nicht
        mehr kontaktieren. Du kannst das gewünscht Profil jederzeit entsperren.
      </base-note>

      <base-input-radio-group
        v-model="draft.reason"
        :items="reasons"
        label-class="font-semibold text-teal-600"
        class="mb-6"
      />

      <base-textarea
        v-if="draft.reason === 2"
        v-model="draft.message"
        placeholder="Beschreibe, warum du dein Konto deaktivieren möchtest."
      />

      <template #footer>
        <base-button primary class="mb-6" @click="reasonShown = false">
          Nicht deaktivieren
        </base-button>

        <base-button danger @click="onReasonSelected"> Weiter </base-button>
      </template>
    </base-modal>

    <!-- Step 4: Password -->
    <base-modal v-model="passwordShown">
      <base-figure
        img=""
        title="Wir werden dich vermissen!"
        html="Schade, dass du uns verlässt. Wir freuen uns schon jetzt auf deinen Besuch bei uns.<br><br>Bestätige die Deaktivierung mit deinem Passwort."
        class="mb-6"
      />

      <input-password v-model="draft.password" placeholder="************" />

      <template #footer>
        <base-button primary class="mb-6" @click="passwordShown = false">
          Nicht deaktivieren
        </base-button>

        <base-button danger :disabled="!passwordShown" @click="deactivate">
          Deaktivieren
        </base-button>
      </template>
    </base-modal>

    <base-button
      secondary
      class="mb-6"
      disabled-on-loading
      @click="confirmShown = true"
    >
      Mein Konto deaktivieren
    </base-button>
  </div>
</template>

<script>
import { UserStatus } from '~/constants'
export default {
  data() {
    return {
      confirmShown: false,
      reasonShown: false,
      passwordShown: false,

      draft: {
        reason: null,
        message: '',
        password: '',
      },

      reasons: [
        { text: 'Ich habe bereits einen Job gefunden.', value: 1 },
        { text: 'andere', value: 2 },
      ],
    }
  },
  methods: {
    // Step 2
    onConfirmDone() {
      this.draft = {
        reason: null,
        message: '',
        password: '',
      }
      this.confirmShown = false
      this.reasonShown = true
    },

    // Step 3
    onReasonSelected() {
      this.reasonShown = false
      this.$confirm({
        img: '/img/deactivate_2.svg',
        icon: 'warning',
        iconColor: 'red-600',
        title: 'Datenverlust',
        text: 'Tomisha ist ein kostenloses Produkt. Wenn du es jetzt deaktivierst, verlierst du deine Daten und auch deine Bewertungen.',
        actions: [
          {
            text: 'Nicht deaktivieren',
            primary: true,
          },
          {
            text: 'Weiter',
            danger: true,
            handler: () => {
              this.reasonShown = false
              this.passwordShown = true
            },
          },
        ],
      })
    },

    async deactivate() {
      await this.$axios
        .post('me/deactivate', this.draft)
        .catch((e) => this.$alert.error(e))
      this.passwordShown = false
      if (this.$auth.company) {
        Object.assign(this.$auth.company, { status: UserStatus.DEACTIVATED })
        this.$auth.setCompany(null)
      } else {
        this.$auth.logout()
      }
    },
  },
}
</script>
