<template>
  <div
    class="min-h-screen lg:min-h-auto flex flex-col lg:block max-w-xl mx-auto lg:mx-0"
  >
    <header class="flex-shrink-0 lg:mb-6">
      <h1
        class="relative text-3xl text-center lg:text-left px-16 lg:px-0 py-8 leading-tight"
      >
        <span class="align-text-top">Hast du dein Passwort vergessen?</span>

        <n-link
          to="/login"
          class="lg:hidden absolute top-0 left-0 h-full px-6 flex justify-center items-center"
        >
          <base-icon icon="back" class="text-base" />
        </n-link>
      </h1>
    </header>

    <main class="px-6 lg:px-0 flex-grow lg:mb-10">
      <p class="mb-6 lg:mb-16 text-gray-600">
        Wir verstehen es, Dinge passieren. Gib einfach deine E-Mail-Adresse
        unten ein und wir senden dir einen Link via E-Mail, um dein Passwort
        zurückzusetzen!
      </p>

      <base-form ref="form" @submit="submit">
        <base-input
          v-model="email"
          label="Private E-Mail-Adresse"
          placeholder="angelina.federer@mail.com"
          type="email"
          autocomplete="yes"
          :rules="[$rules.required, $rules.email]"
          class="mb-6"
        />
      </base-form>
    </main>

    <footer class="flex-shrink-0 px-6 lg:px-0 mt-12 lg:mt-16 lg:py-2">
      <base-button
        primary
        disabled-on-loading
        class="mb-6"
        @click="$refs.form.submit()"
      >
        Link zum Zurücksetzen senden
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
      email: '',
    }
  },
  methods: {
    submit() {
      this.$axios
        .post('auth/password/forgot', { email: this.email })
        .then(() =>
          this.$alert.success(
            `Wir haben dir an ${this.email} einen Link gesendet, mit dem du dein Passwort zurücksetzen kannst.`
          )
        )
        .catch((e) => this.$alert.error(e))
    },
  },
  head: {
    title: 'Hast du dein Passwort vergessen',
  },
}
</script>
