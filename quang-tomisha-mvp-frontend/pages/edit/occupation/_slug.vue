<template>
  <base-steps-wrapper
    ref="stepper"
    v-model="draft"
    storage-key="tom:occupation:draft"
    :unique-id="$route.params.slug"
    :off="isFinished"
    :steps="steps"
    :title-prefix="draft.profession ? draft.profession.title : 'Dein Beruf'"
    @done="done"
  >
    <template #step:1>
      <input-profession
        v-model="draft.profession"
        :hidden-items="$auth.user.occupations.map((o) => o.profession.id)"
        class="mb-8"
      />

      <template v-if="draft.profession">
        <base-rating
          v-model="draft.level"
          label="Wähle dein Niveau"
          optional
          class="mb-6"
        />

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

        <base-input-checkbox-group
          v-model="draft.relationships"
          label="Arbeisverhältnisse"
          :items="$store.state.tag.workingRelationships"
          item-value="id"
          :rules="[$rules.required]"
        />
      </template>
    </template>

    <template #step:2>
      <base-input
        v-model="draft.specialSkill"
        label="Gewünschte Special Skill eintippen"
        placeholder="Telefone Gespräche"
        class="mb-6"
      />

      <base-textarea
        v-model="draft.skillDescription"
        label="Beschreibung"
        placeholder="Am Telefone verkaufe ich mehr als meine lieben Arbeitskollegen."
        class="mb-6"
      />
    </template>

    <template #step:3>
      <input-preferences v-model="draft.preferences" />
    </template>

    <template #step:4>
      <input-hard-skills v-model="draft.hardSkills" />
    </template>

    <template #step:5>
      <base-textarea
        v-model="draft.shortDescription"
        label="Kurzprofil"
        placeholder="Ich bin selbstständig, zuverlässig, belastbar und halte stets meine Termine ein."
        class="mb-6"
      />
    </template>

    <template #step:6>
      <input-experiences v-model="draft.employments">
        <div class="rounded-xl bg-gray-200 px-6 py-3 text-gray-600 mb-6">
          <div class="flex items-center justify-between mb-3">
            <h4 v-if="draft.profession" class="text-xl mr-3">
              {{ draft.profession.title }}
            </h4>

            <div>{{ totalWorkloads }}</div>
          </div>

          <div class="text-sm">({{ totalDays }} Erfahrungstage)</div>
        </div>
      </input-experiences>
    </template>

    <template #default>
      <base-modal
        v-if="isFinished"
        :value="true"
        :dismissible="false"
        title="Vorschau Bewerbung / Profil"
      >
        <base-note class="mb-6">
          Nun hast du dein Profil vollständig ausgefüllt. Wir gratulieren dir,
          super-gemacht. Jetzt kannst du den passenden Job finden mit dem
          erstellten Beruf. Oder du fügst noch weitere Berufe hinzu. Wenn du
          eine Bewerbung sendest, sind deine Daten geschützt. Sobald der
          Arbeitgeber sich für dich entscheidet, werden alle Informationen
          freigegeben.
        </base-note>

        <!-- <base-button
          secondary
          icon="plus-circle"
          class="mb-8"
          disabled-on-loading
          @click="createAnotherOccupation"
        >
          Weitere Berufe hinzufügen
        </base-button> -->

        <profile-card :profile="$auth.user" @click="preview">
          <template #top>
            <div class="mb-3">
              <base-chip :text="draft.profession.title + '*'" />
            </div>
          </template>

          <base-button class="mt-6">Öffnen</base-button>
        </profile-card>

        <base-modal :value="!!detailedProfile" @close="detailedProfile = null">
          <profile-detail :profile="detailedProfile" />
        </base-modal>

        <template #footer>
          <base-button primary to="/">Dashboard</base-button>
        </template>
      </base-modal>

      <base-bottom-actions :items="actions" />
    </template>
  </base-steps-wrapper>
</template>

<script>
export default {
  asyncData({ route, $axios }) {
    const { slug } = route.params
    if (slug && slug !== 'new') {
      return $axios.get('/occupation/' + slug).then((draft) => ({ draft }))
    }

    return {}
  },
  data() {
    return {
      draft: {
        id: undefined,
        profession: null,
        level: 1,
        relationships: [],
        minWorkload: 0,
        maxWorkload: 100,
        specialSkill: '',
        skillDescription: '',
        shortDescription: '',
        preferences: [],
        hardSkills: [],
        employments: [],
      },
      isFinished: false,
      detailedProfile: null,
      prevRoute: null,
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from
    })
  },
  computed: {
    steps() {
      return [
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
          note: `Super du hast schon <strong>${
            this.totalDays
          }+</strong> wertvolle Erfahrungstage als <strong>${
            this.draft.profession?.title || ''
          }</strong> gesammelt. Hast du noch weitere Erfahrungen in selben oder in einem Weitern Beruf, so füge diesen alle hinzu.`,
        },
      ]
    },

    totalWorkloads() {
      return [this.draft.minWorkload, this.draft.maxWorkload]
        .filter(Boolean)
        .map((w) => w + '%')
        .join(' – ')
    },

    totalDays() {
      return this.draft.employments.reduce((sum, cur) => {
        if (!cur.startedAt || !cur.endedAt) {
          return sum
        }

        return (
          Math.round(
            Math.max(
              0,
              new Date(cur.endedAt).valueOf() -
                new Date(cur.startedAt).valueOf()
            ) / 86400000
          ) + sum
        )
      }, 0)
    },

    actions() {
      console.log('stepper', this.$refs.stepper)
      const actions = [
        {
          text: 'Speichern',
          primary: true,
          disabled: !this.draft.profession,
          handler: () => this.$refs.stepper.next(),
        },
        {
          text: 'Zurück',
          secondary: true,
          handler: () =>
            this.$refs.stepper.step === 1
              ? this.$router.push(this.prevRoute.path)
              : this.$refs.stepper.back(),
        },
      ]

      const step = +this.$route.query.step
      if (step > 1 && step < this.steps.length) {
        actions.push({
          text: 'Überspringen',
          handler: () => this.$refs.stepper.next(),
        })
      }

      return actions
    },
  },
  methods: {
    dismiss() {
      this.$confirm({
        img: '/img/profile_end.svg',
        title: 'Du bist super, erstelle jetzt dein Berufsprofil',
        text: 'In einem Berufsprofil geht es um deine zukünftige Tätigkeit. Ein kleiner Schritt und du kannst deine erste Bewerbung absenden, wir freuen uns darauf. Mache weiter so, dann schaffst du auch die letzten 2 Minuten.',
        okText: 'Jetzt Berufsprofil erstellen',
        cancelText: 'Dashboard',
        cancel: () => this.$router.push('/'),
      })
    },

    done() {
      this.$axios[this.draft.id ? 'patch' : 'post'](
        '/occupation/' + (this.draft.id || ''),
        this.draft
      )
        .then((newOccupation) => {
          this.isFinished = true
          this.draft.id = newOccupation.id
          if (this.$route.params.slug === 'new') {
            const occupations = this.$auth.user.occupations || []
            this.$auth.updateUser({
              occupations: [
                ...occupations,
                {
                  id: newOccupation.id,
                  profession: this.draft.profession,
                },
              ],
            })
          }
        })
        .catch((e) => this.$alert.error(e))
    },
    createAnotherOccupation() {
      Object.assign(this.$data, this.$options.data())
      this.$router.replace('/edit/occupation/new')
    },
    async preview() {
      if (!this.detailedProfile) {
        this.detailedProfile = await this.$axios.get(
          '/user/' + this.$auth.user.slug,
          {
            params: {
              occupationId: this.draft.id,
            },
          }
        )
      } else {
        this.detailedProfile.occupations = [this.draft]
      }
    },
  },
  middleware({ redirect, route }) {
    if (!route.params.slug) {
      return redirect('/edit/occupation/new')
    }
  },
  head() {
    return {
      title: 'Edit occupation',
    }
  },
}
</script>
