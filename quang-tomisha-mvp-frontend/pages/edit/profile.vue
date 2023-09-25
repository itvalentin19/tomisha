<template>
  <div class="min-h-screen flex flex-col lg:block">
    <aside v-if="!basicOnly" class="sticky z-20 left-0 right-0 top-1.125">
      <box-container class="sm:max-w-full">
        <base-progress-top-bar
          :title="title"
          :value="step + 1"
          :total="steps.length"
        />
      </box-container>
    </aside>

    <main
      class="px-6 md:px-10 lg:px-16 pt-6 md:pt-8 lg:pt-10 pb-32 lg:pb-10 min-h-160 lg:my-6 lg:rounded-xl lg:border lg:border-solid w-full max-w-full sm:max-w-xl mx-auto bg-white flex-grow lg:flex-grow-0"
    >
      <base-note v-if="note" class="mb-6">
        {{ note }}
      </base-note>

      <nuxt-child
        :me="personalInfo"
        :actions="defaultActions"
        @done="onStepDone"
      />
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  scrollToTop: true,
  fetch({ store }) {
    return store.dispatch('me/fetchPersonalInfo')
  },
  data() {
    return {
      basicOnly: this.$route.query.basic === 'true',
      steps: Object.freeze([
        {
          title: 'Meine Personalien',
          path: 'basic-info',
          note: null,
          point: 30,
          isDone: (me) =>
            [
              'cover',
              'picture',
              'gender',
              'firstName',
              'lastName',
              'address',
              'phone',
              'dob',
              'pob',
              'nationality',
              'maritalStatus',
              'residencePermit',
              'vehicleRegistrations',
            ].every((f) => !!me[f]),
        },
        {
          title: 'Sprachkenntnisse',
          path: 'languages',
          note: 'Füge deine Sprachkenntnisse hinzu. Jede Sprache, die du sprichst, ist wertvoll.',
          point: 10,
          isDone: (me) => me.languageCount > 0,
        },
        {
          title: 'Schulbildung',
          path: 'education',
          note: 'Ergänze deine Schulbildung, falls dies für deinen Beruf erforderlich ist. Es wird immer empfohlen.',
          point: 10,
          isDone: (me) => me.schoolCount > 0,
        },
        {
          title: 'Aus- und Weiterbildung',
          path: 'training',
          note: 'Vervollständige deine Aus- und Weiterbildung, klicke auf "Aus- / Weiterbildung hinzufügen".',
          point: 10,
          isDone: (me) => me.trainingCount > 0,
        },
        {
          title: 'Hobbys',
          path: 'hobbies',
          note: 'Hobbys machen dich persönlich sympathisch. Füge die geeigneten Hobbys hinzu.',
          point: 10,
          isDone: (me) => me.hobbies?.length > 0,
        },
        {
          title: 'Soft Skills',
          path: 'soft-skills',
          note: 'Der englische Ausdruck Soft Skills bedeutet übersetzt "weiche Fähigkeiten". Die Definition umfasst all jene Charaktereigenschaften und Fähigkeiten. Klicke jetzt auf "Soft Skills hinzufügen" und du siehst die Top Ten der Soft Skills.',
          point: 10,
          isDone: (me) => me.softSkills?.length > 0,
        },
        {
          title: 'Referenzen',
          path: 'references',
          note: 'Ergänze deine Referenzen. Gute Referenzen schaffen Vertrauen und führen schnell zu einer neuen Stelle. Erkundige dich immer bei deiner Referenzperson, ob du die Informationen für die Bewerbung verwenden darfst.',
          point: 10,
          isDone: (me) => me.referenceCount > 0,
        },
        {
          title: 'Zusätzliche Dateien',
          path: 'additional-files',
          note: 'Hier kannst du zusätzliche Dateien hinzufügen. Dateien, die dein Arbeitgeber benötigt. So wie zum Beispiel Strafregisterauszug oder Betreibungsauszug.',
          point: 10,
          isDone: (me) => me.fileCount > 0,
        },
        {
          title: 'Status',
          path: 'status',
          note: 'Dein Status zeigt an, ob du auf Jobsuche bist oder nicht. Dein Profilrand zeigt dir deinen aktuellen Status an. Zur Änderung, klicke auf die entsprechende Farbe.',
          point: 0,
        },
      ]),
    }
  },
  computed: {
    ...mapState('me', ['personalInfo']),
    step() {
      const { path } = this.$route
      return this.steps.findIndex((step) => path.endsWith('/' + step.path))
    },
    title() {
      const activeStep = this.steps[this.step]
      return `${activeStep ? activeStep.title + ' — ' : ''}Dein Profil`
    },
    note() {
      const { note } = this.steps[this.step] || {}
      return note || null
    },
  },
  created() {
    if (!process.client) {
      return
    }

    if (this.$route.query.continue === 'auto') {
      for (const step of this.steps) {
        if (!step.isDone?.(this.personalInfo)) {
          const stepPath = '/edit/profile/' + step.path
          if (!this.$route.path.startsWith(stepPath)) {
            this.$router.replace(stepPath)
          }
          return
        }
      }
    } else if (this.$route.name === 'edit-profile') {
      return this.$router.replace('/edit/profile/basic-info')
    }
  },
  methods: {
    defaultActions({ disabled = false, loading = false, done, skip } = {}) {
      return [
        {
          text: 'Speichern',
          primary: true,
          disabled,
          loading,
          handler: typeof done === 'function' ? done : () => this.onStepDone(),
        },
        {
          text: 'Überspringen',
          handler: typeof skip === 'function' ? skip : () => this.onStepDone(),
        },
      ]
    },

    async onStepDone(data) {
      let ok = true

      const payload = { ...data }

      const me = { ...this.personalInfo, ...data }

      const progress = Math.max(
        0,
        this.steps.reduce((sum, step) => {
          return sum + (!step.isDone || step.isDone(me) ? step.point : 0)
        }, 0)
      )

      if (progress !== this.$auth.user.progress) {
        payload.progress = progress
      }

      if (Object.keys(payload).length) {
        try {
          await this.$store.dispatch('me/updatePersonalInfo', payload)
        } catch (e) {
          this.$alert.error(e)
          ok = false
        }

        if (
          ok &&
          payload.progress &&
          payload.progress !== this.$auth.user.progress
        ) {
          this.$auth.updateUser({ progress: payload.progress })
        }
      }

      if (ok) {
        if (this.basicOnly) {
          return this.$router.push('/edit/profile/occupation?basic=true')
        }

        const nextStep = this.steps[this.step + 1]
        if (nextStep) {
          this.$router.push('/edit/profile/' + nextStep.path)
        } else {
          this.$confirm({
            img: '/img/profile_end.svg',
            title: 'Du bist super, erstelle jetzt dein Berufsprofil',
            text: 'In einem Berufsprofil geht es um deine zukünftige Tätigkeit. Ein kleiner Schritt und du kannst deine erste Bewerbung absenden, wir freuen uns darauf. Mache weiter so, dann schaffst du auch die letzten 2 Minuten.',
            okText: 'Jetzt Lebenslauf erstellen',
            cancelText: 'Dashboard',
            done: () => this.$router.push('/edit/occupation/new'),
            cancel: () => this.$router.push('/'),
          })
        }
      }
    },
  },
  head() {
    return { title: this.title }
  },
}
</script>
