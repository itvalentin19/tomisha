<template>
  <div
    v-show="!finished"
    class="min-h-screen flex flex-col lg:min-h-auto max-w-xl mx-auto lg:mx-auto"
  >
    <header class="">
      <h1
        class="relative text-3xl text-center lg:text-left py-8 px-6 lg:px-0 leading-tight"
      >
        Erstelle ein Passwort für dein Tomisha Account
      </h1>
    </header>

    <main class="px-6 lg:px-0 flex-grow">
      <base-form ref="form" @submit="$refs.accountType.show()">
        <input-new-password v-model="password" autofocus />
      </base-form>
    </main>

    <footer class="flex-shrink-0 px-6 lg:px-0 mt-12 lg:mt-20">
      <base-button
        primary
        disabled-on-loading
        class="mb-6"
        @click="$refs.form.submit()"
      >
        Speichern
      </base-button>
    </footer>

    <account-type-selector ref="accountType" @done="onAccountTypeSelected" />
  </div>
</template>

<script>
import { UserType } from '~/constants'
export default {
  layout: 'auth',
  auth: 'guest',
  data() {
    return {
      password: '',
      finished: false,
    }
  },
  middleware({ redirect, route }) {
    if (process.client) return

    if (!route.query.token) {
      return redirect('/')
    }
  },
  methods: {
    async onAccountTypeSelected({ captcha, type }) {
      try {
        const { accessToken } = await this.$axios.post('auth/register', {
          password: this.password,
          token: this.$route.query.token,
          captcha,
          type,
        })

        await this.$auth.login({ token: accessToken })
      } catch (e) {
        return this.$alert.error(e)
      }

      if (type === UserType.EMPLOYEE) {
        this.$confirm({
          img: '/img/step_done.svg',
          title: 'Einmalige Aufbereitung grosser Erfolg',
          text: 'Um einen der grössten Vorteile von Tomisha zu erleben. Erstellen wir gemeinsam deinen Lebenslauf. Das dauert etwa 5 Minuten. Der Vorteil ist, dass du den Lebenslauf einmal erstellst und ihn mit einem Klick an alle Arbeitgeber senden kannst. Es lohnt sich also, sich diese Zeit zu nehmen.\n\nWir wünschen dir viel Erfolg.',
          okText: 'Jetzt Lebenslauf erstellen',
          cancelText: 'Dashboard',
          closeOnDone: false,
          persistent: true,
          done: () => {
            this.$router.push('/edit/profile/basic-info')
          },
          cancel: () => this.$router.push('/'),
        })
      } else {
        this.finished = true
        this.$router.push('/edit/profile/basic-info?basic=true')
      }
    },
  },
  head: {
    title: 'Passwort',
  },
}
</script>
