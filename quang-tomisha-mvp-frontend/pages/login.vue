<template>
  <div class="min-h-screen w-full flex flex-col lg:min-h-auto max-w-xl mx-auto">
    <header class="flex-shrink-0">
      <h1
        class="relative text-3xl text-center px-16 lg:px-0 py-8 leading-tight"
      >
        <span class="align-text-top">Willkommen Zurück!</span>

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

      <base-form ref="form" @submit="submit">
        <base-input
          v-model="credentials.email"
          label="Private E-Mail-Adresse"
          placeholder="angelina.federer@mail.com"
          name="email"
          type="email"
          autocomplete="on"
          :rules="[$rules.required, $rules.email]"
          :disabled="loading"
          class="mb-6"
        />

        <input-password
          id="password"
          v-model="credentials.password"
          :rules="[$rules.required, $rules.minLength(8), $rules.maxLength(250)]"
          autocomplete=""
          class="mb-6"
        />

        <base-checkbox
          v-model="shouldRemain"
          label="Ich möchte angemeldet bleiben"
          label-class="font-semibold text-teal-600"
          :disabled="true"
        />
      </base-form>
    </main>

    <footer class="flex-shrink-0 px-6 lg:px-0 mt-12 lg:mt-20">
      <div class="pb-6 border-b border-gray-400">
        <base-button primary :loading="loading" @click="$refs.form.submit()">
          Anmelden
        </base-button>
      </div>

      <div class="py-3 text-center">
        <n-link
          to="/register"
          class="font-semibold text-teal-600 hover:underline py-3 block"
        >
          Erstelle ein Account!
        </n-link>

        <n-link
          to="/auth/forgot-password"
          class="font-semibold text-teal-600 hover:underline py-3 block"
        >
          Passwort vergessen
        </n-link>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  auth: 'guest',
  data() {
    return {
      credentials: {
        email: '',
        password: '',
      },
      shouldRemain: true,
    }
  },
  computed: {
    loading() {
      return this.$nuxt.$loading && this.$nuxt.$loading.show
    },
  },
  methods: {
    loginFB() {
      window.location =
        process.env.NUXT_ENV_API_BROWSER_BASE_URL + 'auth/facebook'
    },
    submit() {
      this.$axios
        .post('auth/login', this.credentials)
        .then(async ({ accessToken }) => {
          await this.$auth.login({
            token: accessToken,
          })
          this.$router.push('/')
        })
        .catch((e) => {
          this.$alert.error(e)
        })
    },
  },
  head: {
    title: 'Anmelden',
  },
}
</script>
