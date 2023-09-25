<template>
  <base-expand-group
    :items="[
      { title: 'Verlauf', key: 'logs' },
      { title: `Vorstellungsgespräch: ${interview.id}`, key: 'interview' },
    ]"
  >
    <template #logs>
      <log-list :items="logs" />
    </template>

    <template #interview>
      <interview-summary
        v-if="interview"
        :interview="interview"
        :application="interview.application"
        :job="interview.job"
        :user="interview.user"
        :staff="interview.staff"
      />
    </template>
  </base-expand-group>
</template>

<script>
import { InterviewLogText } from '~/constants'
export default {
  props: {
    interview: { type: Object, required: true },
  },
  computed: {
    logs() {
      return [
        { createdAt: this.interview.createdAt, text: InterviewLogText.default },
        ...this.interview.logs.map((log) => ({
          createdAt: log.createdAt,
          action: log.action,
          text: InterviewLogText[log.action],
        })),
      ]
    },
  },
}
</script>
