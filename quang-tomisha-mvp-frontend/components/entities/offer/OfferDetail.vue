<template>
  <base-expand-group
    :items="[
      { title: 'Verlauf', key: 'logs' },
      { title: `Jobangebot: ${offer.id}`, key: 'offer' },
    ]"
  >
    <template #logs>
      <log-list :items="logs" />
    </template>

    <template #offer>
      <interview-summary
        :interview="offer"
        :application="offer.application"
        :job="offer.job"
        :user="offer.user"
        :staff="offer.staff"
      />
    </template>
  </base-expand-group>
</template>

<script>
import { OfferLogText, UserType } from '~/constants'
export default {
  props: {
    offer: { type: Object, required: true },
  },
  computed: {
    logs() {
      return [
        { createdAt: this.offer.createdAt, text: OfferLogText.default },
        ...this.offer.logs.map((log) => {
          const userType =
            log.userId === this.offer.userId
              ? UserType.EMPLOYEE
              : log.userId === this.offer.agencyId
              ? UserType.AGENCY
              : UserType.COMPANY

          return {
            createdAt: log.createdAt,
            action: log.action,
            text: OfferLogText[userType][log.action],
          }
        }),
      ]
    },
  },
}
</script>
