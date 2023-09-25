<template>
  <base-modal v-model="shown" title="Unternehmen finden">
    <base-note class="mb-6">
      Trage deine Geschäfts-E-Mail-Adresse ein, um eine Suche zu starten.
    </base-note>

    <base-form ref="form" @submit="submit">
      <base-input
        v-model="email"
        label="Geschäftliche E-Mail-Adresse"
        placeholder="angelina.federer@mail.com"
        autofocus
        :rules="[$rules.required, $rules.email]"
      />
    </base-form>

    <template #footer>
      <base-button primary :disabled="!email" @click="$refs.form.submit()">
        Suchen
      </base-button>
    </template>

    <common-email-sent-popup ref="sentPopup" @resend="resendEmail" />

    <support-no-domain-modal ref="supportModal" @done="$router.push('/')" />
  </base-modal>
</template>

<script>
export default {
  data: () => ({
    shown: false,
    email: '',
    freeProviders: [],
  }),
  methods: {
    async open() {
      this.email = ''
      this.shown = true
      this.freeProviders = await this.$axios
        .get('/public/free_email_provider_domains.txt')
        .then((res) => res.split('\n'))
        .catch(() => [])
    },
    async submit() {
      const isBusinessEmail = !this.freeProviders.some((p) => {
        return this.email.endsWith('@' + p)
      })

      if (!isBusinessEmail) {
        return this.$confirm({
          img: '/img/company_no_domain.svg',
          title: 'Keine eigene Domain',
          text: 'Die E-Mail-Adresse von Hotmail, Outlook, bluewin usw. sind nur mit Sondererlaubnis erlaubt. Hast du keine andere E-Mail-Adresse, so frage den Support um eine Sondererlaubnis.',
          okText: 'Neue Suche',
          cancelText: 'Support',
          done: () => this.$refs.form.focus(),
          cancel: () => this.$refs.supportModal.open({ email: this.email }),
        })
      }
      // send mail
      return await this.verifyEmail()

      // const company = await this.$axios
      //   .get('/company/search?email=' + this.email)
      //   .catch(() => {})

      // // company already has account
      // if (company?.id) {
      //   return this.$confirm({
      //     img: '/img/company_join.svg',
      //     title: 'Unternehmen gefunden',
      //     text:
      //       'Super, wir haben dein Unternehmen gefunden. Füge die detaillieren Informationen hinzu, über deine Beschäftigung in diesem Unternehmen.',
      //     okText: 'Hinzufügen',
      //     cancelText: 'Zurück',
      //     done: () =>
      //       this.$router.push(
      //         `/staff/request-join?companyId=${
      //           company.id
      //         }&headquater=${encodeURIComponent(
      //           JSON.stringify(company.headquater)
      //         )}`
      //       ),
      //   })
      // }

      // // company does not have account
      // this.$confirm({
      //   img: '/img/company_search_404.svg',
      //   title: 'Du bist schlau',
      //   text:
      //     'Du bist der Erste, der auf die schlaue Idee kam Tomisha einzusetzen, du bist super.',
      //   okText: 'Neues Konto erstellen',
      //   cancelText: 'Zurück',
      //   done: () => this.verifyEmail(),
      // })
    },
    async verifyEmail() {
      this.$refs.sentPopup.show({
        email: this.email,
        text: `Du hast eine E-Mail mit einem Bestätigungslink erhalten. Bitte öffnen dein Postfach (von der E-Mail-Adresse ${this.email}) und klicke auf den Link, um die Registrierung abzuschliessen und dein Account zu aktivieren.\n\nWenn du in den nächsten Minuten keine E-Mail erhältst, schau bitte in deinem Spam-Ordner nach.\n\nHast zu keinen zugriff auf die E-Mail Adresse, so klicke auf überspringen.`,
      })

      try {
        await this.$axios.post('/company/check-email', { email: this.email })
      } catch (e) {
        this.$refs.sentPopup.hide()
        return this.$alert.error(e)
      }
    },
    resendEmail(newEmail) {
      if (newEmail) {
        this.email = newEmail
      }

      this.verifyEmail()
    },
  },
}
</script>
