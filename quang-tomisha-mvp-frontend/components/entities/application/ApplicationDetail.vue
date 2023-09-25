<template>
  <base-expand-group
    :items="[
      { title: 'Verlauf', key: 'logs' },
      { title: 'Jobinserat', key: 'application' },
    ]"
  >
    <template #logs>
      <log-list :items="logs" />
    </template>

    <template #application>
      <profile-detail :profile="profile" />
    </template>
  </base-expand-group>
</template>

<script>
import { ApplicationLogText } from '~/constants'
export default {
  props: {
    application: { type: Object, required: true },
    profile: { type: Object, required: true },
  },
  computed: {
    logs() {
      return [
        {
          createdAt: this.application.createdAt,
          text: ApplicationLogText.default,
        },
        ...this.application.logs.map((log) => ({
          createdAt: log.createdAt,
          action: log.action,
          text: ApplicationLogText[log.action],
        })),
      ]
    },
  },
}
</script>
