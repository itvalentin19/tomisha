<template>
  <div
    class="min-h-screen w-full relative flex flex-col lg:min-h-auto max-w-xl mx-auto"
  >
    <header class="flex-shrink-0">
      <h1
        class="relative text-3xl text-center px-16 lg:px-0 py-8 leading-tight"
      >
        <span class="align-text-top">Erstelle ein Account!</span>

        <n-link
          to="/"
          class="absolute top-0 left-0 h-full px-6 flex justify-center items-center lg:hidden"
        >
          <base-icon icon="close" class="text-lg" />
        </n-link>
      </h1>
    </header>

    <main class="px-6 lg:px-0 flex-grow">
      <!-- <base-button secondary class="mb-6" @click="loginFB">
        <base-icon icon="facebook" /> Facebook
      </base-button>

      <base-or-divider class="mb-5" /> -->

      <base-form ref="form" @submit="submit()">
        <base-input
          v-model="credentials.firstName"
          label="Vorname"
          placeholder="Angelina"
          name="firstname"
          autocomplete="on"
          :rules="[$rules.required]"
          class="mb-6"
        />

        <base-input
          v-model="credentials.lastName"
          label="Familienname"
          placeholder="Federer"
          name="lastname"
          autocomplete="on"
          :rules="[$rules.required]"
          class="mb-6"
        />

        <base-input
          v-model="credentials.email"
          label="Private E-Mail-Adresse"
          placeholder="angelina.federer@mail.com"
          name="email"
          type="email"
          autocomplete="on"
          :rules="[$rules.required, $rules.email]"
          class="mb-6"
        />

        <p class="text-gray-500 text-sm">
          Du erklärst dich mit der Nutzungsvereinbarung, der
          <n-link to="/privacy-policy" tabindex="-1" class="hover:underline">
            Datenschutzrichtlinie
          </n-link>
          und der
          <n-link to="/cookie-policy" tabindex="-1" class="hover:underline">
            Cookie-Richtlinie
          </n-link>
          von Tomisha einverstanden.
        </p>
      </base-form>
    </main>

    <footer class="flex-shrink-0 px-6 lg:px-0 bg-white mt-12 lg:mt-20">
      <div class="pb-6 border-b border-gray-400">
        <base-button primary disabled-on-loading @click="$refs.form.submit()">
          Kostenlos Registrieren
        </base-button>
      </div>

      <div class="py-3 text-center">
        <n-link
          to="/login"
          class="font-semibold text-teal-600 hover:underline py-3 block"
        >
          Du hast bereits ein Account? Anmelden!
        </n-link>
      </div>
    </footer>

    <common-email-sent-popup ref="sentPopup" @resend="resend" />
  </div>
</template>

<script>
export default {
  layout: 'auth',
  auth: 'guest',
  data() {
    return {
      credentials: {
        firstName: '',
        lastName: '',
        email: '',
      },
    }
  },
  methods: {
    loginFB() {
      window.location =
        process.env.NUXT_ENV_API_BROWSER_BASE_URL + 'auth/facebook'
    },
    async submit(shouldAlert) {
      await this.$axios
        .post('auth/verify-email', this.credentials)
        .then(() => {
          const { email } = this.credentials
          if (shouldAlert === true) {
            this.$alert.success(
              `Wir haben dir an ${email} einen Link gesendet, mit dem du dein Passwort zurücksetzen kannst.`
            )
          }

          const text = `Du hast eine E-Mail mit einem Bestätigungslink erhalten. Bitte öffnen dein Postfach (von der E-Mail-Adresse ${email}) und klicke auf den Link, um die Registrierung abzuschliessen und dein Account zu aktivieren.\n\nWenn du in den nächsten Minuten keine E-Mail erhältst, schau bitte in deinem Spam-Ordner nach.`
          this.$refs.sentPopup.show({ text, email })
        })
        .catch((e) => {
          this.$alert.error(e)
        })
    },
    resend(newEmail) {
      if (newEmail) {
        this.credentials.email = newEmail
      }

      this.submit(true)
    },
  },
  head: {
    title: 'Register',
  },
}
</script>
