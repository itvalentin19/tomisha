<template>
  <div class="bg-white min-h-screen">
    <header
      class="bg-white rounded-b-xl shadow-lg z-30 sticky top-0 lg:px-20 xl:px-26"
    >
      <div class="px-6 py-2 flex items-center justify-between">
        <base-logo />
      </div>
    </header>

    <main class="text-lg text-gray-700 p-6 max-w-lg mx-auto">
      <div class="select-none mb-6">
        <img src="/img/404.svg" class="w-full" />
      </div>

      <h2 class="font-semibold mb-6">Oops!</h2>

      <p class="mb-6">
        Wir können scheinbar die Seite, die du suchst, nicht finden.
      </p>

      <h1 class="font-semibold mb-6">
        Fehlercode: Ungültiger oder abgelaufener Link
      </h1>

      <p class="mb-6">Hier sind stattdessen einige hilfreiche Links:</p>

      <n-link
        to="/"
        class="text-teal-600 block text-center mb-10 hover:underline"
      >
        Home
      </n-link>
    </main>
  </div>
</template>

<script>
import { TokenType } from '~/constants'
const tokenTypeMap = {
  [TokenType.AUTH_REGISTER]: '/auth/create-account',
  [TokenType.AUTH_LOGIN]: '/auth/callback',
  [TokenType.AUTH_RESET_PW]: '/auth/reset-password',
  [TokenType.COMPANY_VERIFY_EMAIL]: '/edit/company',
}

export default {
  auth: false,
  async asyncData({ $axios, route, redirect }) {
    const { token, type } = route.query
    // Handle change email
    if (+type === TokenType.CHANGE_EMAIl) {
      try {
        await $axios.post('/auth/email/change', { token })
        return { emailChanged: true }
      } catch (_) {
        return redirect('/invalid')
      }
    }
  },
  data() {
    return {
      emailChanged: false,
    }
  },
  created() {
    if (this.emailChanged) {
      this.$router.push('/', () =>
        this.$alert.success('Your email address has been changed')
      )
    }
  },
  middleware({ route, redirect }) {
    const { token, type } = route.query
    if (token && tokenTypeMap[type]) {
      return redirect(tokenTypeMap[type] + '?token=' + token)
    }
  },
}
</script>
