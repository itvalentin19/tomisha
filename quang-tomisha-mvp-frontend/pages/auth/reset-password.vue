<template>
  <div
    class="min-h-screen w-full flex flex-col lg:min-h-auto max-w-xl mx-auto lg:mx-0"
  >
    <header class="flex-shrink-0">
      <h1
        class="relative text-3xl text-center lg:text-left px-6 lg:px-0 py-8 leading-tight lg:mb-4"
      >
        Erstelle ein neues Passwort für dein Tomisha Account
      </h1>
    </header>

    <main class="px-6 lg:px-0 flex-grow">
      <base-form ref="form" @submit="onSubmit">
        <base-note class="mb-6 lg:mb-10">
          Aus Sicherheitsgründen wurdest du von allen Geräten abgemeldet.
        </base-note>

        <input-new-password
          v-model="draft.newPassword"
          label="Neues Passwort"
          class="mb-8 lg:mb-10"
        />

        <input-password
          v-model="draft.confirmedPassword"
          label="Neues Passwort erneut eingeben"
          :rules="[$rules.required, $rules.equal(draft.newPassword, 'Wrong')]"
          class="mb-6 lg:mb-10"
        />

        <hcaptcha
          @verify="draft.captcha = $event"
          @expired="draft.captcha = null"
          @error="draft.captcha = null"
        />
      </base-form>
    </main>

    <footer class="flex-shrink-0 px-6 lg:px-0 mt-12 lg:mt-16">
      <base-button
        primary
        :disabled="
          !draft.captcha || !draft.newPassword || !draft.confirmedPassword
        "
        disabled-on-loading
        class="mb-6"
        @click="$refs.form.submit()"
      >
        Speichern
      </base-button>
    </footer>
  </div>
</template>

<script>
export default {
  auth: 'guest',
  layout: 'auth',
  data() {
    return {
      draft: {
        captcha: null,
        newPassword: '',
        confirmedPassword: '',
      },
    }
  },
  middleware({ error, route }) {
    if (process.client) return

    if (!route.query.token) {
      return error({
        message: 'The token url is invalid',
        statusCode: 400,
      })
    }
  },
  methods: {
    onSubmit() {
      return this.$axios
        .post('auth/password/reset', {
          newPassword: this.draft.newPassword,
          token: this.$route.query.token,
        })
        .then(() => {
          this.$router.push('/login', () => {
            this.$alert.success(
              'Reset password successfully. Please sign in to continue.'
            )
          })
        })
        .catch((e) =>
          this.$alert.error({ title: 'Reset password error', text: e })
        )
    },
  },
  head: {
    title: 'Reset your password',
  },
}
</script>
