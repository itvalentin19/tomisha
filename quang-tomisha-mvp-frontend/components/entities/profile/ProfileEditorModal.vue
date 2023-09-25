<template>
  <base-modal v-model="shown" title="Profil bearbeiten">
    <base-note class="mb-6">
      Klicken auf den gewünschten Bereich, den du bearbeiten möchtest.
    </base-note>

    <section class="mb-18">
      <h2 class="text-xl mb-6">Dein Profil</h2>

      <base-button
        v-for="step in steps"
        :key="step.path"
        secondary
        :to="`/edit/profile/${step.path}`"
        class="mb-6"
      >
        {{ step.title }}
      </base-button>
    </section>

    <section v-if="$auth.user.occupations.length" class="mb-6">
      <h2 class="text-xl mb-6">Dein Berufe</h2>

      <base-chip
        v-for="occupation in occupations"
        :key="occupation.id"
        icon="card"
        class="cursor-pointer"
        @click="showOcupationSelection(occupation)"
      >
        {{ occupation.profession.title }}*

        <!-- <base-delete-button /> -->
      </base-chip>
    </section>

    <template #footer>
      <base-button @click="shown = false">Zurück</base-button>
    </template>

    <base-modal
      :value="!!activeOccupation"
      title="Beruf bearbeiten"
      @closed="activeOccupation = null"
    >
      <template v-if="activeOccupation" #default>
        <base-note class="mb-6">
          Klicken auf den gewünschten Bereich, den du bearbeiten möchtest.
        </base-note>

        <h2 class="text-xl mb-6">{{ activeOccupation.profession.title }}*</h2>

        <base-button
          v-for="(step, i) in occupationSteps"
          :key="step.path"
          secondary
          :to="`/edit/occupation/${activeOccupation.slug}?step=${i + 1}`"
          class="mb-6"
        >
          {{ step.title }}
        </base-button>
      </template>

      <template #footer>
        <base-button @click="activeOccupation = null">Zurück</base-button>
      </template>
    </base-modal>

    <!-- <base-modal v-model="detailShown"></base-modal> -->
  </base-modal>
</template>

<script>
export default {
  props: {
    profile: { type: Object, required: true },
  },
  data() {
    return {
      shown: false,
      detailShown: false,
      activeStep: null,
      activeOccupation: null,
      steps: [
        {
          title: 'Meine Personalien',
          path: 'basic-info',
        },
        {
          title: 'Sprachkenntnisse',
          path: 'languages',
          note: 'Füge deine Sprachkenntnisse hinzu. Jede Sprache, die du sprichst, ist wertvoll.',
        },
        {
          title: 'Schulbildung',
          path: 'education',
          note: 'Ergänze deine Schulbildung, falls dies für deinen Beruf erforderlich ist. Es wird immer empfohlen.',
        },
        {
          title: 'Aus- und Weiterbildung',
          path: 'training',
          note: 'Vervollständige deine Aus- und Weiterbildung, klicke auf "Aus- / Weiterbildung hinzufügen".',
        },
        {
          title: 'Hobbys',
          path: 'hobbies',
          note: 'Hobbys machen dich persönlich sympathisch. Füge die geeigneten Hobbys hinzu.',
        },
        {
          title: 'Soft Skills',
          path: 'soft-skills',
          note: 'Der englische Ausdruck Soft Skills bedeutet übersetzt "weiche Fähigkeiten". Die Definition umfasst all jene Charaktereigenschaften und Fähigkeiten. Klicke jetzt auf "Soft Skills hinzufügen" und du siehst die Top Ten der Soft Skills.',
        },
        {
          title: 'Referenzen',
          path: 'references',
          note: 'Ergänze deine Referenzen. Gute Referenzen schaffen Vertrauen und führen schnell zu einer neuen Stelle. Erkundige dich immer bei deiner Referenzperson, ob du die Informationen für die Bewerbung verwenden darfst.',
        },
        {
          title: 'Zusätzliche Dateien',
          path: 'additional-files',
          note: 'Hier kannst du zusätzliche Dateien hinzufügen. Dateien, die dein Arbeitgeber benötigt. So wie zum Beispiel Strafregisterauszug oder Betreibungsauszug.',
        },
        {
          title: 'Status',
          path: 'status',
          note: 'Dein Status zeigt an, ob du auf Jobsuche bist oder nicht. Dein Profilrand zeigt dir deinen aktuellen Status an. Zur Änderung, klicke auf die entsprechende Farbe.',
        },
      ],

      occupationSteps: [
        {
          title: 'Profil',
          note: 'Füge den Beruf hinzu, auf den du dich bewerben möchtest.',
        },
        {
          title: 'Special Skill',
          note: 'Was ist deine special skill, hier kannst du dich von der Mehrheit herausheben, worin du besonders gut. Beschreibe diese besondere Fähigkeit.',
        },
        {
          title: 'Präferenzen',
          note: 'Was gefällt dir an deiner Berufstätigkeit als Berufsfahrer* und was passt weniger zu dir?',
        },
        {
          title: 'Hard Skills',
          note: 'Füge alle Hard Skills hinzu, die du für die von dir gesuchten Job erworben hast.',
        },
        {
          title: 'Kurzprofil',
          note: 'Schreibe in deinem Kurzprofil, was Dich in deinem Beruf besonders macht, warum sie Dich auswählen sollten.',
        },
        {
          title: 'Erfahrungen',
          note: 'Super du hast schon 500+ wertvolle Erfahrungstage als Berufsfahrer gesammelt. Hast du noch weitere Erfahrungen in selben oder in einem Weitern Beruf, so füge diesen alle hinzu.',
        },
      ],
    }
  },
  computed: {
    occupations() {
      return this.profile.occupations.map((occu) => ({
        profession: occu.profession,
      }))
    },
  },
  methods: {
    async showOcupationSelection(oc) {
      this.activeOccupation = await this.$axios.get('/occupation/' + oc.slug)
    },

    open() {
      this.shown = true
    },
  },
}
</script>
