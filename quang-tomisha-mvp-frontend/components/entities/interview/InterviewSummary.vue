<template>
  <div class="text-gray-600">
    <profile-detail-modal ref="profileModal" />
    <job-detail-modal ref="jobModal" />

    <template
      v-if="
        interview &&
        application &&
        job &&
        staff &&
        user &&
        interview.startAt &&
        interview.branch
      "
    >
      <label class="block mb-1 text-sm"> Datum </label>
      <div class="mb-6">
        {{ $dayjs(interview.startAt).format('DD.MM.YYYY') }}
      </div>

      <label class="block mb-1 text-sm"> Adresse </label>
      <div class="mb-6">{{ interview.branch.address.text }}</div>

      <label class="block mb-1 text-sm"> Neuer Mitarbeiter* </label>
      <profile-card
        :profile="user"
        class="mb-6"
        @click="$refs.profileModal.open(user.slug, application.occupationId)"
      />

      <template v-if="interview.agent">
        <label class="block mb-1 text-sm">Temporärbüro (Auftragnehmer)</label>
        <staff-card
          :staff="interview.agent"
          class="mb-6"
          @click="$refs.profileModal.open(interview.agent.user.slug)"
        />
      </template>

      <label class="block mb-1 text-sm"> Arbeitgeber (Auftraggeber) </label>
      <staff-card
        :staff="staff"
        class="mb-6"
        @click="$refs.profileModal.open(staff.user.slug)"
      />

      <label class="block mb-1 text-sm"> Jobinserat </label>
      <job-card
        :job="job"
        hide-actions
        class="mb-6"
        @click="$refs.jobModal.open(job.slug)"
      />

      <template v-if="interview.agentMessage || interview.message">
        <h3 class="text-lg mb-6">Mitteilung</h3>

        <template
          v-if="
            interview.agentMessage &&
            ($auth.user.id === interview.agentId ||
              $auth.companyId === interview.companyId)
          "
        >
          <label class="block mb-1 text-sm"> Temporärbüro </label>
          <base-textarea :value="interview.agentMessage" readonly />
        </template>

        <template
          v-if="
            interview.message &&
            ($auth.user.id === interview.user.id ||
              $auth.companyId === interview.companyId)
          "
        >
          <label class="block mb-1 text-sm">
            {{ $auth.companyId ? 'Kandidaten' : 'Vom Arbeitgeber' }}
          </label>
          <base-textarea :value="interview.message" readonly />
        </template>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    interview: { type: Object, required: true },
    user: { type: Object, required: true },
    application: { type: Object, required: true },
    staff: { type: Object, required: true },
    job: { type: Object, required: true },
  },
}
</script>
