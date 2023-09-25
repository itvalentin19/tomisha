<template>
  <div>
    <base-button secondary icon="plus-circle" to="/edit/subscription?job=true">
      Zusätzliche Jobinserat kaufen
    </base-button>

    <base-button
      v-if="!$auth.activePlan"
      primary
      to="/edit/subscription"
      class="mt-6"
    >
      Abo aktivieren
    </base-button>

    <base-table :columns="columns" :items="subscriptions" class="mt-10">
      <template #title="{ itemText }">
        <span class="font-semibold capitalize">
          {{ itemText }}
        </span>
      </template>

      <template #status="{ item, itemText: isNotEnded }">
        <div
          class="inline-block rounded-full px-4 py-1 text-white"
          :class="[
            isNotEnded && (!item.jobAmount || item.remainingJobs)
              ? 'bg-teal-400'
              : 'bg-red-400',
          ]"
        >
          {{
            item.jobAmount && !item.planId
              ? `${item.jobAmount - item.remainingJobs}/${
                  item.jobAmount
                } Jobinserate`
              : isNotEnded
              ? 'Aktive'
              : 'Inaktive'
          }}
        </div>
      </template>

      <template #receiptId="{ itemText }">
        <a
          v-if="itemText"
          :href="itemText"
          target="_blank"
          rel="noreferrer noopener nofollow"
        >
          <base-chip icon="paper" :text="`Rechnung ${itemText}`" />
        </a>
      </template>
    </base-table>
  </div>
</template>

<script>
export default {
  asyncData({ $axios, $auth }) {
    return $axios
      .get('/subscription', { params: { companyId: $auth.companyId } })
      .then((subscriptions) => {
        const arr = []
        for (const s of subscriptions) {
          if (s.jobAmount && s.planId) {
            const jobAdSub = {
              id: 'job:' + s.id,
              ...s,
              total: Math.max(0, s.total - s.jobAmount * 12.9),
            }
            arr.push(jobAdSub)
            s.total -= jobAdSub.total
          }
          arr.push(s)
        }
        return { subscriptions: arr }
      })
  },
  data() {
    const now = this.$dayjs().endOf('day')
    return {
      subscriptions: [],
      now,
      columns: [
        {
          key: 'title',
          name: 'Artikel',
          transform: (_, item) =>
            item.jobAmount && !item.planId ? 'Jobinserat' : item.planId,
        },
        {
          key: 'status',
          name: 'Status',
          transform: (_, item) => this.$dayjs(item.endAt).isAfter(now),
        },
        {
          key: 'duration',
          name: 'Laufzeit',
          transform: (_, item) =>
            item.jobAmount
              ? '1 Jahr'
              : Math.round(
                  (this.$dayjs(item.endAt).valueOf() -
                    this.$dayjs(item.startAt).valueOf()) /
                    86400000
                ) + ' Tage',
        },
        {
          key: 'remainingDays',
          name: 'Restlaufzeit',
          transform: (_, item) =>
            Math.max(
              Math.round(
                (this.$dayjs(item.endAt).valueOf() - this.$dayjs().valueOf()) /
                  86400000
              ),
              0
            ) + ' Tage',
        },
        {
          key: 'startAt',
          name: 'Startet am',
          transform: (d) => this.$dayjs(d).format('DD. MMMM YYYY'),
          getSortedValue: (d) => this.$dayjs(d).format('YYYYMMMMDDHHmm'),
        },
        {
          key: 'endAt',
          name: 'Endet am',
          transform: (d) => this.$dayjs(d).format('DD. MMMM YYYY'),
          getSortedValue: (d) => this.$dayjs(d).format('YYYYMMMMDDHHmm'),
        },
        {
          key: 'total',
          name: 'Preis',
          transform: (total) => 'CHF ' + (+total || 0).toFixed(2),
        },
        { key: 'receiptId', name: 'Rechnung' },
      ],
    }
  },
  head: {
    title: 'Abos',
  },
}
</script>
