<template>
  <base-modal :value="shown" hide-header persistent :dismissible="false">
    <div class="mb-6 py-6">
      <img src="/img/email_verification.svg" class="select-none mx-auto" />
    </div>

    <h2 class="text-2xl mb-6 text-gray-700">
      Bitte bestätige deine E-Mail-Adresse
    </h2>

    <p class="text-lg text-gray-600 whitespace-pre-wrap">{{ text }}</p>

    <template #footer>
      <base-button
        :disabled="disabled"
        disabled-on-loading
        class="mb-6"
        @click="resend"
      >
        Hast du die E-Mail nicht erhalten?
        <template v-if="remainingSecs"> ({{ remainingSecs }}) </template>
      </base-button>

      <base-button @click="changeEmailState = true">
        Falsche E-Mail-Adresse?
      </base-button>
    </template>

    <base-modal v-model="changeEmailState" @closed="captcha = null">
      <template #title>
        Ändere deine <span class="inline-block">E-Mail-Adresse</span>
      </template>

      <base-form ref="form" @submit="changeEmail">
        <base-note class="mb-6">
          Deine aktuelle E-Mail-Adresse lautet {{ email }}. Tippe deine neue
          E-Mail-Adresse ein.
        </base-note>

        <base-input
          v-model="newEmail"
          label="E-Mail-Adresse"
          type="email"
          :rules="[
            $rules.required,
            (v) => !v || v !== email || 'Must be different from ' + email,
            $rules.email,
          ]"
          class="mb-6"
        />

        <base-input
          v-model="newEmailConfirm"
          label="E-Mail-Adresse erneut eingeben"
          type="email"
          :rules="[
            $rules.required,
            $rules.email,
            $rules.equal(
              newEmail,
              'Must be the same as the above email address'
            ),
          ]"
          class="mb-6"
        />

        <hcaptcha
          @verify="captcha = $event"
          @expired="captcha = null"
          @error="captcha = null"
        />
      </base-form>

      <template #footer>
        <base-button
          primary
          :disabled="!captcha || !newEmail || !newEmailConfirm"
          @click="$refs.form.submit()"
        >
          Neue E-Mail-Adresse speichern
        </base-button>
      </template>
    </base-modal>
  </base-modal>
</template>

<script>
const COOL_OFF_DURATION = 30
export default {
  data: () => ({
    shown: false,
    lastSentAt: null,
    remainingSecs: COOL_OFF_DURATION,
    disabled: false,
    changeEmailState: false,
    email: '',
    newEmail: '',
    newEmailConfirm: '',
    text: '',
    captcha: null,
  }),
  methods: {
    show({ text, email }) {
      this.text = text
      this.email = email
      this.shown = true
      this.disabled = false
      this.lastSentAt = Date.now()
      this.count()
    },
    hide() {
      this.shown = false
    },
    count() {
      this.remainingSecs = COOL_OFF_DURATION
      clearInterval(this.countInterval)
      this.countInterval = setInterval(() => {
        if (--this.remainingSecs === 0) {
          clearInterval(this.countInterval)
        }
      }, 1000)
    },
    resend() {
      if (Date.now() - this.lastSentAt > COOL_OFF_DURATION * 1000) {
        this.$emit('resend')
      } else {
        this.disabled = true
        this.$alert.error({
          title: 'Einen Moment',
          text: `Schaue noch einmal in deinem E-Mail Account nach, ob du schon das E-Mail von uns erhalten hast. Du kannst nach ${
            this.remainingSecs - 1
          } Sekunden, erneut ein E-Mail zusenden lassen.`,
        })
        setTimeout(() => {
          this.disabled = false
        }, COOL_OFF_DURATION * 1000 - (Date.now() - this.lastSentAt))
      }
    },
    openChangeEmailModal() {
      this.changeEmailState = true
      this.captcha = null
    },
    changeEmail() {
      this.$emit('resend', this.newEmail)
      this.changeEmailState = false
      this.newEmail = this.newEmailConfirm = ''
    },
  },
}
</script>
