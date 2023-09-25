<template>
  <div>
    <section v-if="job.branch || job.cover" class="mb-10">
      <div class="rounded-xl border border-gray-400 overflow-hidden">
        <div v-if="job.cover" class="w-full pb-1/4 relative bg-gray-200">
          <div
            class="absolute inset-0 bg-cover bg-center"
            :style="{
              backgroundImage: `url(${job.cover})`,
            }"
          />
        </div>

        <base-description
          v-if="job.branch"
          :text="job.branch.description"
          class="p-6 mb-0"
        />
      </div>
    </section>

    <section class="mb-10">
      <div class="rounded-xl bg-gray-200 px-6 py-3">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-2xl font-extrabold mr-3">
            {{ job.title }}
          </h4>

          <div class="text-gray-600">
            {{ workloads }}
          </div>
        </div>

        <div class="text-sm text-gray-600">
          {{ job.profession.title }}
          <template v-if="job.genders && job.genders.length">
            ({{ job.genders.map(getGenderAbbrById).join('/') }})
          </template>
        </div>
      </div>
    </section>

    <section v-if="job.detail" class="mb-10">
      <h3 class="text-xl mb-6">Deine Aufgabe</h3>

      <base-card disabled>
        <base-description :text="job.detail" />
      </base-card>
    </section>

    <section v-if="job.requirement" class="mb-10">
      <h3 class="text-xl mb-6">Deine Profil</h3>

      <base-card disabled>
        <base-description :text="job.requirement" />
      </base-card>
    </section>

    <section v-if="experiences.length" class="mb-8">
      <h4 class="text-gray-600">Erfahrungen</h4>

      <div v-for="(item, i) in experiences" :key="i" class="mt-6">
        <base-card disabled class="inline-block">
          <div class="text-sm text-gray-600">
            {{ item.years }} Jahre oder mehr
          </div>

          <base-rating
            v-if="item.level"
            :value="item.level"
            disabled
            hide-label
            class="mt-1"
          />

          <div class="mt-4">
            <base-chip :text="item.profession.title + '*'" />
          </div>
        </base-card>
      </div>
    </section>

    <section v-if="softSkills.length" class="mb-8">
      <h4 class="text-gray-600 mb-6">Soft Skills</h4>

      <div v-for="(item, i) in softSkills" :key="i" class="mt-6">
        <skill-card
          :level="item.level"
          :title="getSoftSkillTextById(item.softSkillId)"
          :description="item.description"
          disabled
        />
      </div>
    </section>

    <section v-if="hardSkills.length" class="mb-10">
      <h4 class="text-gray-600 mb-6">Hard Skills</h4>

      <div v-for="(item, i) in hardSkills" :key="i" class="mb-6">
        <skill-card
          :level="item.level"
          :title="item.hardSkill.title"
          :description="item.description"
          disabled
        />
      </div>
    </section>

    <section v-if="languages.length" class="mb-10">
      <h4 class="text-gray-600 mb-6">Sprachkenntnisse</h4>

      <div v-for="(item, i) in languages" :key="i" class="mb-6">
        <skill-card
          :level="item.level"
          :levels="languageLevels"
          :title="languageNameById[item.languageId]"
          disabled
        />
      </div>
    </section>

    <section v-if="job.benefit" class="mb-10">
      <h3 class="text-xl mb-6">Benefits</h3>

      <base-card disabled>
        <base-description :text="job.benefit" />
      </base-card>
    </section>

    <section v-if="!hideBranch && job.branch" class="mb-10">
      <h3 class="text-xl mb-6">Arbeitgeber</h3>

      <branch-card :branch="job.branch" />
    </section>

    <section v-if="!hideStaff && job.staff && job.staff.user">
      <h3 class="text-gray-600 mb-6">Verantwortlich</h3>

      <staff-card :staff="job.staff" />
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    job: { type: Object, default: () => null },
    hideBranch: Boolean,
    hideStaff: Boolean,
  },
  computed: {
    ...mapState('tag', ['languageLevels']),
    ...mapGetters('tag', [
      'getSoftSkillTextById',
      'languageNameById',
      'getGenderAbbrById',
    ]),
    workloads() {
      return [this.job.minWorkload, this.job.maxWorkload]
        .filter(Boolean)
        .map((w) => w + '%')
        .join(' – ')
    },
    languages() {
      return this.job.skills.filter((s) => s.languageId)
    },
    softSkills() {
      return this.job.skills.filter((s) => s.softSkillId)
    },
    hardSkills() {
      return this.job.skills.filter((s) => s.hardSkill)
    },
    experiences() {
      return this.job.skills.filter((s) => s.profession)
    },
  },
}
</script>
