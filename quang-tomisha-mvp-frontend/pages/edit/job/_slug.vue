<template>
  <base-steps-wrapper
    ref="stepper"
    v-model="draft"
    storage-key="tom:job:draft"
    :unique-id="$route.params.slug"
    :off="isFinished"
    :steps="steps"
    title-prefix="Jobinserat"
    @done="done"
  >
    <template #step:1>
      <base-input
        v-model="draft.title"
        label="Jobtitel"
        placeholder="KV Angestellte mit sympathischer Telef"
        :rules="[$rules.required, $rules.maxLength(500), $rules.minLength(10)]"
      />
    </template>

    <template #step:2>
      <input-profession v-model="draft.profession" class="mb-8" />

      <template v-if="draft.profession">
        <base-rating v-model="draft.level" label="Mindestniveau" class="mb-6" />

        <base-progress
          v-model="draft.years"
          label="Mindestberufserfahrung (Jahren)"
          class="mb-6"
        />

        <base-input-checkbox-group
          :value="draft.genders"
          label="Berufsbezeichnung Geschlechter"
          :items="$store.state.tag.genders"
          item-value="id"
          :rules="[$rules.required]"
          @input="draft.genders = $event.sort((a, b) => a - b)"
        />
      </template>
    </template>

    <template #step:3>
      <input-job-experiences
        v-model="draft.experiences"
        :hidden-items="[draft.profession].filter(Boolean)"
      >
        <base-card
          v-if="draft.profession"
          dismiss-float
          disabled
          class="inline-flex max-w-full py-2 cursor-pointer"
          @dismiss="removePrimaryProfession"
        >
          <span class="truncate">
            {{ draft.profession.title }}
          </span>
        </base-card>
      </input-job-experiences>
    </template>

    <template #step:4>
      <base-progress
        :value="[draft.minWorkload, draft.maxWorkload]"
        label="Arbeitspensum (%)"
        class="mb-6"
        @input="
          Object.assign(draft, {
            minWorkload: $event[0],
            maxWorkload: $event[1],
          })
        "
      />
    </template>

    <template #step:5>
      <input-soft-skills
        v-model="draft.softSkills"
        note="Ergänze Zusatzinformationen zum gewünschten Soft Skill."
        has-description
      />
    </template>

    <template #step:6>
      <input-hard-skills
        v-model="draft.hardSkills"
        note="Ergänze Zusatzinformationen zum gewünschten Hard Skill."
        has-description
      />
    </template>

    <template #step:7>
      <input-job-languages v-model="draft.languages" />
    </template>

    <template #step:8>
      <base-textarea
        v-model="draft.detail"
        label="Aufgaben"
        placeholder="Was ist deine Jobaufgabe."
        :rules="[$rules.required, $rules.maxLength(5000)]"
        class="mb-6"
      />

      <base-textarea
        v-model="draft.benefit"
        label="Benefits"
        placeholder="Welche Vorteile bietet dein Unternehmen."
        :rules="[$rules.required, $rules.maxLength(5000)]"
        class="mb-6"
      />

      <base-textarea
        v-model="draft.requirement"
        label="Profil"
        placeholder="Welches Profil sollte der Wunsch Kandidat mitbringen."
        :rules="[$rules.required, $rules.maxLength(5000)]"
        class="mb-6"
      />
    </template>

    <template #step:9>
      <base-input-checkbox-group
        v-model="draft.relationships"
        label="Arbeisverhältnisse"
        :items="$store.state.tag.workingRelationships"
        item-value="id"
        :rules="[$rules.required]"
      />
    </template>

    <template #step:10>
      <base-button
        secondary
        icon="plus-circle"
        class="mb-6"
        @click="$refs.uploader.open()"
      >
        Bild hinzufügen
      </base-button>

      <div v-if="draft.cover" class="relative">
        <img
          :src="draft.cover"
          class="block mb-6 w-full select-none h-16 rounded-xl object-cover"
        />

        <base-delete-button @click="draft.cover = null" />
      </div>

      <input-cover-uploader
        ref="uploader"
        v-model="draft.cover"
        :items="Array.from({ length: 20 }, (_, i) => `/img/cover/${i + 1}.jpg`)"
      />
    </template>

    <template #step:11>
      <branch-editor
        :company-id="$auth.companyId"
        :headquater="!branches.length"
        class="mb-8"
        @done="$utils.mutateArrayItem(branches, $event, 'id')"
      />

      <branch-table
        v-if="branches.length"
        v-model="draft.branchId"
        selectable
        :items="branches"
        :company="company"
        class="md:-mx-10 lg:-mx-16"
      />
    </template>

    <template #step:12>
      <staff-table
        v-model="draft.staffId"
        selectable
        responsible-mode
        :items="staffs"
        class="md:-mx-10 lg:-mx-16"
      />
    </template>

    <template #step:13>
      <base-segmented-controls
        v-model="draft.public"
        label="Das Jobinserat ist sichtbar für ..."
        :items="[
          { text: 'Alle', value: true },
          { text: 'Privat', value: false },
        ]"
        class="mb-6"
      />

      <base-date-picker
        v-model="draft.publishAt"
        label="Veröffentlich Datum"
        placeholder="Sofort"
      />
    </template>

    <template #step:14>
      <job-card
        v-if="draft.profession"
        :job="detransformedJob"
        @click="preview"
      />
    </template>

    <template #default="{ step }">
      <base-modal ref="previewer" full-height>
        <job-detail
          :job="detransformedJob"
          :hide-branch="step < 11"
          :hide-staff="step < 12"
        />
      </base-modal>

      <base-bottom-actions :items="actions" />
    </template>
  </base-steps-wrapper>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  async asyncData({ route, $axios, $auth, $utils }) {
    const output = {}
    const promises = [
      $axios
        .get('/company/' + $auth.companyId)
        .then(({ branches, staffs, ...company }) => {
          output.branches = branches
          output.staffs = staffs
          output.company = company
        }),
    ]

    const { slug } = route.params
    if (slug && slug !== 'new') {
      promises.push(
        $axios.get('/job/' + slug).then(({ skills, ...job }) => {
          output.draft = $utils.extract(job, {
            id: undefined,
            title: '',
            profession: null,
            level: 1,
            years: 0,
            minWorkload: 0,
            maxWorkload: 100,
            genders: [],
            detail: '',
            benefit: '',
            requirement: '',
            relationships: [],
            cover: null,
            branchId: null,
            branch: null,
            staffId: null,
            staff: null,
            public: true,
            publishAt: null,
          })

          output.languages = skills.filter((s) => s.languageId)
          output.softSkills = skills
            .filter((s) => s.softSkillId)
            .map(({ softSkillId, ...s }) => ({ ...s, skillId: softSkillId }))
          output.hardSkills = skills
            .filter((s) => s.hardSkill)
            .map(({ hardSkill, ...s }) => ({ ...s, skill: hardSkill }))
          output.experiences = skills.filter((s) => s.profession)
        })
      )
    }

    await Promise.all(promises)

    return output
  },
  data() {
    return {
      staffs: [],
      branches: [],
      company: {},

      draft: {
        id: undefined,
        title: '',
        profession: null,
        level: 1,
        years: 0,
        minWorkload: 0,
        maxWorkload: 100,
        genders: [],
        experiences: [],
        softSkills: [],
        hardSkills: [],
        languages: [],
        detail: '',
        benefit: '',
        requirement: '',
        relationships: [],
        cover: null,
        branchId: null,
        staffId: null,
        branch: null,
        staff: null,
        public: true,
        publishAt: null,
      },
      isFinished: false,
      detailedJob: null,
      steps: [
        {
          title: 'Jobtitel',
          note: 'Verleih deinem Jobinserat den passenden Jobtitel. Sowie zum Beispiel:\n\n– KV Angestellte mit sympathischer Telefonstimme\n\n– Sanitärmonteur/in mit Erfahrung in GIS Installation\n\n– User Experience Designer mit Erfahrung Adobe XD',
        },
        {
          title: 'Berufsbezeichnung',
          note: 'Wähle die Berufsbezeichnung und die Geschlechter aus. Nur Frauen bzw. Männer in Stelleninseraten anzusprechen, ist gesetzlich nicht zulässig.',
        },
        {
          title: 'Berufserfahrung',
          note: 'Welche zusätzliche Berufserfahrungen, sind mindestens erforderlich.',
        },
        {
          title: 'Arbeitspensum',
          note: 'Wähle das gewünschte Arbeitspensum.',
        },
        {
          title: 'Soft Skills',
          note: 'Wähle die mindestens erforderlichen Soft Skills aus.',
        },
        {
          title: 'Hard Skills',
          note: 'Wähle die mindestens erforderlichen Hard Skills aus.',
        },
        {
          title: 'Sprachkenntnisse',
          note: 'Wähle die mindestens erforderlichen Sprachkenntnisse aus.',
        },
        {
          title: 'Jobbeschreibung',
          note: 'Hier kannst du eine Jobbeschreibung hinzufügen.',
        },
        {
          title: 'Arbeisverhältnis',
          note: 'Wähle alle gewünschte Arbeitsverhältnis aus.',
        },
        {
          title: 'Bild',
          note: 'Wähle dein gewünschtes Hintergrundbild aus.',
        },
        {
          title: 'Standort',
          note: 'Für welchem Standort such du neue Mitarbeiter?',
        },
        {
          title: 'Zuständig',
          note: 'Wähle die verantwortliche Person für dieses Jobinserat aus. Die zuständige Person entscheidet über die Bewerber.',
        },
        {
          title: 'Sichtbarkeit',
          note: 'Wähle aus, ob das Jobinserat für alle öffentlich sichtbar ist oder nicht.',
        },
        {
          title: 'Veröffentlichen',
          note: 'Hier kannst du dein Jobinserat anschauen. Klicke darauf um es zu vergrössern. Ist alles okay, so kannst du es jetzt veröffentlichen.',
        },
      ],
    }
  },
  computed: {
    ...mapGetters('tag', ['getGenderAbbrById']),

    actions() {
      const step = +this.$route.query.step

      const actions = [
        {
          text: step === this.steps.length ? 'Jetzt veröffentlichen' : 'Weiter',
          primary: true,
          handler: () => this.$refs.stepper.next(),
        },
        {
          text: 'Vorschau',
          icon: 'eye',
          secondary: true,
          handler: () => this.preview(),
        },
      ]

      if (step > 1) {
        actions.push({
          text: 'Zurück',
          handler: () => this.$refs.stepper.back(),
        })
      }

      return actions
    },

    detransformedJob() {
      const { softSkills, hardSkills, experiences, languages, ...draft } =
        this.draft

      draft.skills = softSkills
        .map(({ skillId, ...s }) => ({ ...s, softSkillId: skillId }))
        .concat(
          hardSkills.map(({ skill, ...s }) => ({
            ...s,
            hardSkill: skill,
          }))
        )
        .concat(experiences)
        .concat(languages)

      draft.branch =
        draft.branchId && this.branches.find((b) => b.id === draft.branchId)
      draft.staff =
        draft.staffId && this.staffs.find((s) => s.id === draft.staffId)

      return draft
    },
  },
  created() {
    this.draft.branchId = this.branches[0]?.id || null
    this.draft.branch = this.branches[0] || null
    this.draft.staffId = this.staffs[0]?.id || null
    this.draft.staff = this.staffs[0] || null
  },
  mounted() {
    if (!this.$auth.activePlan) {
      this.$confirm({
        img: '/img/noti_subscription.svg',
        title: 'Abonnement aktualisieren',
        text: 'Um Tomisha vollständig nutzen zu können, ist ein aktuelles Abonnement erforderlich. Klicke auf Shopping, dort kannst du dein Abonnement auf den aktuellen Stand bringen.',
        okText: 'Jetzt shoppen',
        done: () => this.$router.push('/edit/subscription'),
      })
    } else if (!this.$auth.remainingJobs) {
      this.$confirm({
        img: '/img/out_of_jobs.svg',
        title: 'Erstelle jetzt dein Jobinserat',
        text: 'Um ein Inserat zu veröffentlichen brauchst du ein Abo. Jetzt in den Shoppingbereich.',
        okText: 'Jetzt shoppen',
        cancelText: 'Dashboard',
        done: () => this.$router.push('/edit/subscription?job=true'),
        cancel: () => this.$router.push('/'),
      })
    }
  },
  methods: {
    removePrimaryProfession() {
      this.$refs.stepper.setStep(2)
      this.draft.profession = null
    },

    preview() {
      if (!this.draft.profession) {
        this.$confirm({
          img: '/img/job_preview_fail.svg',
          title: 'Jobinserat - Vorschau',
          icon: 'warning',
          iconColor: 'red-600',
          text: 'Aktuell hast du noch nichts hinzugefügt. Sobald du dein Jobinserat ausgefüllt hast, siehst du hier eine Vorschau.',
          cancelText: 'Zurück',
        })
      } else {
        this.$refs.previewer.open()
      }
    },

    async done() {
      const { branch, staff, publishAt, ...draft } = this.detransformedJob

      draft.companyId = this.$auth.companyId
      draft.publishAt = publishAt || new Date()

      const method = draft.id ? 'patch' : 'post'
      try {
        await this.$axios[method]('/job/' + (draft.id || ''), draft)
      } catch (e) {
        return this.$alert.error(e)
      }

      this.$auth.remainingJobs--

      this.isFinished = true
      this.$confirm({
        img: '/img/job_done.svg',
        tite: 'Erfolgreich veröffentlich',
        text: 'Du hast deine Jobinserate erfolgreich veröffentlicht. Alle Jobinserate findest du unter deinen "Jobinserate".',
        okText: 'Dashboard',
        cancelText: 'Jobinserate',
        done: () => this.$router.push('/'),
        cancel: () => this.$router.push('/company/jobs'),
      })
    },
  },
  middleware({ redirect, route, $auth }) {
    if (!$auth.companyId) {
      return redirect('/')
    }
    if (!route.params.slug) {
      return redirect('/edit/job/new')
    }
  },
  head() {
    return {
      title: 'Jobinserat',
    }
  },
}
</script>
