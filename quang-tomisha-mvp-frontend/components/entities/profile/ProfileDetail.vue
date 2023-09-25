<template>
  <div>
    <section class="mb-8">
      <profile-cover-card :profile="profile" disabled>
        <div v-if="profile.address" class="my-2">
          <base-icon icon="location" />
          {{ profile.address.city }},
          {{ getCountryNameById(profile.address.country) }}
        </div>

        <div v-if="profile.contactCount" class="mb-2">
          <base-icon icon="people" />
          {{ profile.contactCount || 0 }} Kontakte
        </div>

        <base-rating
          v-if="profile.rating"
          :value="profile.rating"
          hide-label
          class="mb-3"
        />

        <div v-if="profile.referenceCount" class="text-sm text-gray-500 mt-3">
          {{ profile.referenceCount }} Job Feedback
        </div>
      </profile-cover-card>
    </section>

    <section v-if="occupations.length" class="mb-10">
      <h3 class="text-xl mb-4">Sucht einen Job als</h3>

      <div
        v-for="(occupation, i) in occupations"
        :key="occupation.id"
        class="rounded-xl bg-gray-200 px-6 py-3"
        :class="{ 'mt-4': !!i }"
      >
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-2xl font-semibold leading-tight mr-3">
            {{ occupation.profession.title }}*
          </h4>

          <div class="text-gray-600">{{ occupation.maxWorkload }}%</div>
        </div>

        <div class="text-sm text-gray-600">
          ({{ occupation.duration }} Erfahrungstage)
        </div>
      </div>
    </section>

    <section class="mb-10">
      <h3 class="text-xl mb-4">Persönliche Angaben</h3>

      <base-card disabled>
        <template v-for="(info, i) in personalInfos">
          <div v-if="info.value" :key="i" :class="{ 'mt-8': !!i }">
            <div class="text-sm mb-2">{{ info.label }}</div>

            <base-description :text="info.value" />
          </div>
        </template>

        <div v-if="residencePermit" class="mt-8">
          <div class="text-sm mb-2">Nationalität</div>

          <div class="flex justify-between">
            <div class="mr-2 flex-shrink-0">
              {{ getCountryNameById(profile.nationality) }}
            </div>

            <base-chip
              icon="card"
              :text="getResidencePermitTextById(residencePermit.type)"
            />
          </div>
        </div>

        <div v-if="vehicleRegistrations.length" class="mt-8">
          <div class="text-sm mb-2">Fahrausweis</div>

          <div v-for="item in vehicleRegistrations" :key="item.id" class="mb-2">
            <base-chip :text="getVehicleRegistrationTextById(item.type)" />
          </div>
        </div>
      </base-card>
    </section>

    <section v-if="shortDescriptions.length" class="mb-10">
      <h3 class="text-xl">Kurzprofil</h3>

      <base-description
        v-for="(des, i) in shortDescriptions"
        :key="i"
        class="rounded-xl border border-gray-400 p-6 mt-6"
        :text="des"
      />
    </section>

    <section
      v-if="specialSkills.length || skillGroups.some((g) => g.items.length)"
      class="mb-10"
    >
      <h3 class="text-xl mb-8">Skills & Präferenzen</h3>

      <section v-if="specialSkills.length" class="mb-8">
        <h4 class="text-gray-600 mb-6">Special Skill</h4>

        <div
          v-for="(item, i) in specialSkills"
          :key="i"
          class="rounded-xl bg-gray-200 px-6 py-3 mb-6"
        >
          <h5 class="text-xl font-semibold flex items-center">
            <base-icon icon="star-circle" class="mr-3" />
            <span class="align-text-bottom">{{ item.specialSkill }}</span>
          </h5>

          <base-description
            v-if="item.skillDescription"
            class="mb-0 mt-3 text-gray-600 text-sm"
            :text="item.skillDescription"
          />
        </div>
      </section>

      <section v-for="(skillGroup, i) in skillGroups" :key="i" class="mb-8">
        <h4 class="text-gray-600">
          {{ skillGroup.title }}
        </h4>

        <div v-for="item in skillGroup.items" :key="item.id" class="mt-6">
          <skill-card
            :level="item.level"
            :title="skillGroup.getText(item)"
            disabled
          />
        </div>
      </section>
    </section>

    <section v-for="group in experienceGroups" :key="group.group" class="mb-10">
      <h3 class="text-xl">
        {{ group.title }}
      </h3>

      <div v-for="item in group.items" :key="item.id" class="mt-6">
        <experience-card
          :item="item"
          v-bind="group.props ? group.props(item) : {}"
          disabled
        />
      </div>
    </section>

    <section v-if="profile.hobbies.length" class="mb-10">
      <h3 class="text-xl mb-6">Hobbys</h3>

      <div class="-m-2">
        <div
          v-for="(item, i) in profile.hobbies"
          :key="i"
          class="m-2 border border-gray-400 inline-block rounded-xl px-6 py-2"
        >
          {{ item.title }}
        </div>
      </div>
    </section>

    <section v-if="profile.files && profile.files.length" class="mb-10">
      <h3 class="text-xl mb-6">Zusätzliche Dateien</h3>

      <div class="-m-3">
        <div v-for="(item, i) in profile.files" :key="i" class="p-3">
          <base-chip icon="document" @click="$refs.pdfModal.open(item)">
            {{ item.name }}
          </base-chip>
        </div>

        <pdf-viewer-modal ref="pdfModal" />
      </div>
    </section>

    <base-infinite-scroll
      v-if="$auth.isAuthenticated && profile.referenceCount"
      :items="references"
      :total="profile.referenceCount"
      class="mb-10"
      @load="fetchReferences"
    >
      <h3 class="text-xl mb-6">Referenzen</h3>

      <base-switch
        v-if="$auth.isAuthenticated && profile.id === $auth.user.id"
        v-model="profile.publicRef"
        label="Referenzen auf Anfrage"
        class="mb-6"
        @input="changePublicRef"
      />

      <base-button
        v-else-if="!profile.publicRef && !profile.canViewReferences"
        primary
        disabled
        icon="lock-circle"
        class="mb-6"
        @click="requestViewReferences"
      >
        Referenzen anfordern
      </base-button>

      <reference-card
        v-for="item in references"
        :key="item.id"
        :reference="item"
        class="mb-6"
      />
    </base-infinite-scroll>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { DocumentGroup, DegreeType } from '~/constants'
export default {
  props: {
    profile: { type: Object, required: true },
  },
  data() {
    return {
      references: [],
      requestViewReferencesSent: false,
    }
  },
  computed: {
    ...mapState('tag', ['languageLevels']),
    ...mapGetters('tag', [
      'getCountryNameById',
      'getMaritalStatusTextById',
      'getResidencePermitTextById',
      'getVehicleRegistrationTextById',
      'getPreferenceTextById',
      'getSoftSkillTextById',
      'languageNameById',
    ]),
    occupations() {
      return this.profile.occupations.map((occu) => ({
        profession: occu.profession,
        maxWorkload: occu.maxWorkload,
        duration: occu.employments.reduce((sum, cur) => {
          if (!cur.startedAt) {
            return sum
          }

          return (
            Math.round(
              Math.max(
                0,
                (cur.endedAt ? new Date(cur.endedAt).valueOf() : Date.now()) -
                  new Date(cur.startedAt).valueOf()
              ) / 86400000
            ) + sum
          )
        }, 0),
      }))
    },
    shortDescriptions() {
      return this.profile.occupations
        .map((o) => o.shortDescription)
        .filter(Boolean)
    },
    specialSkills() {
      return this.profile.occupations.reduce(
        (arr, cur) =>
          arr.concat({
            specialSkill: cur.specialSkill,
            skillDescription: cur.skillDescription,
          }),
        []
      )
    },
    skillGroups() {
      const { occupations, softSkills } = this.profile

      return [
        {
          title: 'Präferenzen',
          items: occupations.reduce(
            (arr, cur) => arr.concat(cur.preferences || []),
            []
          ),
          getText: (item) => this.getPreferenceTextById(item.preferenceId),
        },
        {
          title: 'Soft Skills',
          items: softSkills,
          getText: (item) => this.getSoftSkillTextById(item.skillId),
        },
        {
          title: 'Hard Skills',
          items: occupations.reduce(
            (arr, cur) => arr.concat(cur.hardSkills || []),
            []
          ),
          getText: (item) => item.skill.title,
        },
      ].filter((g) => g.items.length)
    },
    experienceGroups() {
      const { occupations, degrees } = this.profile

      return [
        {
          title: 'Berufliche Tätigkeiten',
          items: occupations.reduce(
            (arr, cur) => arr.concat(cur.employments || []),
            []
          ),
        },
      ]
        .concat(
          [
            {
              title: 'Weiterbildung',
              type: DegreeType.TRAINING,
            },
            {
              title: 'Sprachkenntnisse',
              type: DegreeType.LANGUAGE,
              props: (item) => ({
                levels: this.languageLevels,
                tite: this.languageNameById[item.languageId],
              }),
            },
            {
              title: 'Schulbildung',
              type: DegreeType.SCHOOL,
            },
          ].map((g) =>
            Object.assign(g, {
              items: degrees.filter((exp) => exp.type === g.type),
            })
          )
        )
        .filter((g) => g.items.length)
    },
    residencePermit() {
      return this.profile.documents.find(
        (d) => d.group === DocumentGroup.RESIDENCE_PERMIT
      )
    },
    vehicleRegistrations() {
      return this.profile.documents.filter(
        (d) => d.group === DocumentGroup.VEHICLE_REGISTRATION
      )
    },
    personalInfos() {
      const { firstName, lastName, address, dob, pob, phone, martialStatus } =
        this.profile

      return [
        { label: 'Vorname Familiename', value: firstName + ' ' + lastName },
        {
          label: 'Adresse',
          value: !address
            ? null
            : [
                this.$utils.getAddressStreet(address),
                address.zip + ' ' + address.city,
                this.getCountryNameById(address.country),
              ].join('\n'),
        },
        {
          label: 'Telefonnummer',
          value: phone,
        },
        {
          label: 'Geburtdatum',
          value: dob
            ? (typeof dob === 'number'
                ? dob
                : this.$dayjs(dob).format('DD. MMMM YYYY')) +
              (pob ? ' in ' + pob : '')
            : '',
        },
        {
          label: 'Zivilstand',
          value: this.getMaritalStatusTextById(martialStatus),
        },
      ].filter((info) => info.value)
    },
  },
  created() {
    this.$store.dispatch('tag/fetchCountries')
  },
  methods: {
    async fetchReferences() {
      if (
        this.$auth.isAuthenticated &&
        !this.references.length &&
        this.profile.referenceCount &&
        (this.profile.publicRef ||
          this.profile.canViewReferences ||
          this.profile.id === this.$auth.user.id)
      ) {
        this.references = await this.$axios.get(
          '/reference/user/' + this.profile.id
        )
      }
    },

    requestViewReferences() {
      if (!this.$auth.isAuthenticated) {
        return this.$router.push('/login')
      }

      if (!this.requestViewReferencesSent) {
        this.requestViewReferencesSent = true
        this.$axios.post('/reference/request', { userId: this.profile.id })
      }

      this.$alert.success(
        'Leider sind diese Daten derzeit für dich nicht abrufbar. Sobald du den Kandidaten zum Vorstellungsgespräch eingeladen hast, hast du Zugang zu diesen Daten.'
      )
    },

    changePublicRef(publicRef = false) {
      this.$utils.debounce(() => this.$axios.patch('me', { publicRef }), 500)
      Object.assign(this.profile, { publicRef })
      this.$emit('change', { publicRef })
    },
  },
}
</script>
