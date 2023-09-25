<template>
  <base-table
    :columns="columns"
    :items="offers"
    @item-click="$refs.modal.open($event)"
  >
    <template #default>
      <company-offer-modal ref="modal" @withdraw="onWithdraw" />
    </template>

    <template #user="{ item }">
      <profile-brief
        :profile="item.user"
        body-class="text-gray-600"
        avatar-class="w-12 h-12"
      >
        <template #description>
          <div class="truncate">
            {{ item.application.occupation.shortDescription }}
          </div>
        </template>
      </profile-brief>
    </template>

    <template #status:user="{ itemText }">
      <div
        v-if="itemText"
        class="rounded-full px-3 py-1 text-white"
        :class="['bg-' + itemText.color]"
      >
        {{ itemText.text }}
      </div>

      <template v-else> — </template>
    </template>

    <template #status:company="{ itemText }">
      <div
        v-if="itemText"
        class="rounded-full px-3 py-1"
        :class="[
          'bg-' + itemText.color,
          itemText.action === 4 ? 'text-black' : 'text-white',
        ]"
      >
        {{ itemText.text }}
      </div>

      <template v-else> {{ textByAction.default }} </template>
    </template>

    <template #status:agency="{ itemText }">
      <div
        v-if="itemText"
        class="rounded-full px-3 py-1 text-white"
        :class="['bg-' + itemText.color]"
      >
        {{ itemText.text }}
      </div>
    </template>
  </base-table>
</template>

<script>
import { OfferLogText, JobLogColor, JobLogAction, UserType } from '~/constants'
export default {
  props: {
    offers: { type: Array, required: true },
  },
  data() {
    return {
      textByAction: OfferLogText,

      columns: [
        {
          name: 'Status update',
          key: 'updatedAt',

          transform: (d) => this.$dayjs(d).format('DD. MMMM YYYY'),
          getSortedValue: (d) => this.$dayjs(d).format('YYYYMMDDHHmm'),
        },
        {
          name: 'Name',
          key: 'user',
          minWidth: '200px',
          maxWidth: '350px',
          transform: (user) => [user.firstName, user.lastName].join(' '),
        },
        {
          name: 'Berufsbezeichnung',
          key: 'profession',
          minWidth: '120px',
          maxWidth: '300px',
          transform: (_, item) =>
            item.application.occupation?.profession?.title + '*',
        },
        {
          name: 'Status arbeitnehmer',
          key: 'status:user',
          maxWidth: '250px',
          transform: (_, item) => this.offersStatus[item.id].user,
          getSortedValue: (_, item) => this.offersStatus[item.id].user?.text,
        },
        {
          name: 'Status arbeitgeber',
          key: 'status:company',
          maxWidth: '250px',
          transform: (_, item) => this.offersStatus[item.id].company,
          getSortedValue: (_, item) => this.offersStatus[item.id].company?.text,
        },
        {
          name: 'Status Temporärbüro',
          key: 'status:agency',
          maxWidth: '250px',
          transform: (_, item) => this.offersStatus[item.id].agency,
          getSortedValue: (_, item) => this.offersStatus[item.id].agency?.text,
        },
      ],
    }
  },
  computed: {
    offersStatus() {
      const output = {}

      for (const offer of this.offers) {
        const { logs, userId, companyId, agencyId } = offer
        output[offer.id] = {
          user: this.getLatestAction(logs, userId, UserType.EMPLOYEE),
          company: this.getLatestAction(logs, companyId, UserType.COMPANY),
          agency: this.getLatestAction(logs, agencyId, UserType.AGENCY),
        }
      }

      return output
    },
  },
  methods: {
    onWithdraw(id) {
      const i = this.offers.findIndex((inte) => inte.id === id)
      if (i !== -1) {
        this.offers.splice(i, 1, {
          ...this.offers[i],
          logs: [
            ...(this.offers[i].logs || []),
            {
              action: JobLogAction.DELETE,
              createdAt: Date.now(),
              userId: this.$auth.companyId,
            },
          ],
        })
      }
    },
    getLatestAction(logs, userId, userType) {
      let action = null
      let tmp = null
      for (const log of logs) {
        if (log.userId !== userId) {
          continue
        }
        const d = this.$dayjs(log.createdAt)
        if (!tmp || d.isAfter(tmp)) {
          action = log.action
          tmp = d
        }
      }
      return action
        ? {
            action,
            text: OfferLogText[userType][action],
            color: JobLogColor[action],
          }
        : null
    },
  },
}
</script>
