<template>
  <base-steps-wrapper
    v-if="company"
    ref="stepper"
    :value="$utils.except(draft, ['password', 'metadata', 'stripeToken'])"
    storage-key="tom:sub:draft"
    :unique-id="$auth.companyId + ':' + (buyJobOnly ? 1 : 0)"
    :steps="buyJobOnly ? steps.slice(3) : steps"
    :off="!!newSub"
    title-prefix="Shopping"
    @dismiss="$router.go(-1)"
    @done="done"
    @input="
      draft = { ...$event, password: '', metadata: null, stripeToken: null }
    "
  >
    <template #step:staffs>
      <base-progress
        v-model="draft.staffAmount"
        :min="1"
        :max="Math.max(100, company.staffs.length)"
        label="Mitarbeiter"
        class="mb-12"
      />

      <company-staffs v-model="company.staffs" :company="company" />

      <base-bottom-actions :items="actions" />
    </template>

    <template #step:branches>
      <base-progress
        v-model="draft.branchAmount"
        :min="company.branches.length"
        :max="Math.max(100, company.branches.length)"
        label="Standorte"
        class="mb-12"
      />

      <company-branches v-model="company.branches" :company="company" />

      <base-bottom-actions :items="actions" />
    </template>

    <template #step:plan>
      <input-subscription-plan
        v-model="draft.plan"
        class="mb-20"
        @done="$refs.stepper.next()"
      />

      <base-button @click="$refs.stepper.back()"> Zurück </base-button>
    </template>

    <template #step:jobs>
      <base-progress
        v-model="draft.jobAmount"
        label="Jobinserate"
        class="mb-6"
        :min="buyJobOnly ? 1 : 0"
      />

      <base-table
        :columns="columns.slice(0, 3)"
        :items="[{}]"
        class="md:-mx-10 lg:-mx-16"
      >
        <template #name> Jobinserate </template>

        <template #amount>
          {{ draft.jobAmount }}
        </template>

        <template #price>
          CHF {{ (12.9 * draft.jobAmount) | padRight }}
        </template>
      </base-table>

      <base-bottom-actions :items="actions" />
    </template>

    <template #step:preview>
      <input-credit-card
        v-if="isStripeLoaded"
        class="mb-6"
        @done="setCreditCard"
      />

      <base-table
        :columns="columns"
        :items="cartItems"
        class="mb-6 md:-mx-10 lg:-mx-16"
      >
        <template #price="{ item }">CHF {{ item.price | padRight }}</template>

        <template #total="{ item }">
          CHF {{ (item.price * item.amount) | padRight }}
        </template>
      </base-table>

      <div
        class="border-l border-t border-r border-gray-400 -mx-6 md:-mx-10 lg:-mx-16"
      >
        <div
          class="border-b border-gray-400 p-6 flex items-center justify-between"
        >
          <span class="font-semibold">Zwischentotal</span>
          <span>CHF {{ total | padRight }}</span>
        </div>

        <input-coupon
          v-model="draft.coupon"
          class="border-b border-gray-400 p-6 flex items-center justify-between font-semibold"
        >
          <div v-if="!draft.coupon">Angebotscode hinzufügen</div>
          <div v-else>
            <span class="uppercase mr-5">{{ draft.coupon.id }}</span>
            <span class="uppercase">{{ draft.coupon.name }}</span>
          </div>
          <div class="text-teal-600 ml-3">Hinzufügen</div>
        </input-coupon>

        <div
          class="border-b border-gray-400 p-6 flex items-center justify-between"
        >
          <span class="font-semibold">Mehrwertsteuer (7,7%)</span>
          <span>CHF {{ (total * 0.077) | padRight }}</span>
        </div>

        <div
          class="border-b border-gray-400 p-6 flex items-center justify-between"
        >
          <span class="font-semibold">Ge­samt­to­tal</span>
          <span>CHF {{ totalAndVat | padRight }}</span>
        </div>
      </div>

      <input-password
        v-model="draft.password"
        :rules="[$rules.required]"
        class="mt-6 mb-12"
      />

      <!-- Done modal -->
      <base-modal :value="!!newSub" persistent :dismissible="false" hide-header>
        <base-figure
          img="/img/subscription_done.svg"
          title="Danke für deine Bestellung"
          class="-mx-3 my-6"
        >
          <template #text>
            <div class="mt-5 whitespace-normal">
              Du erhältst in Kürze eine E-Mail mit der Bestellbestätigung von
              uns.
            </div>
            <div class="flex flex-row whitespace-normal my-8">
              <span>Auftrag:</span>
              <span class="text-teal-600">
                {{ newSub && newSub.receiptId }}
              </span>
            </div>
            <div class="whitespace-normal">
              Unter dem Link
              <n-link
                to="/company/settings/subscription"
                class="text-teal-600 hover:underline"
              >
                "Bestellungen"
              </n-link>
              in deinem Kundenkonto findest du eine Kopie deiner
              Bestellbestätigung.
            </div>
            <div class="whitespace-normal">
              Bei Fragen hierzu hilft unser Kundendienst gerne weiter.
            </div>
          </template>
        </base-figure>

        <base-button primary to="/edit/job/new" class="applyBtn -mx-3 mb-6">
          Jetzt Jobinserat erstellen
        </base-button>

        <base-button to="/">Dashboard</base-button>
      </base-modal>

      <base-bottom-actions
        :items="[
          {
            text: `Jetzt CHF ${totalAndVat.toFixed(2)} bezahlen`,
            primary: true,
            disabled: !draft.stripeToken || !draft.password,
            handler: () => $refs.stepper.next(),
          },
          { text: 'Zurück', handler: () => $refs.stepper.back() },
        ]"
      />
    </template>
  </base-steps-wrapper>
</template>

<script>
export default {
  filters: {
    padRight(num) {
      return typeof num === 'number' ? num.toFixed(2) : ''
    },
  },
  asyncData({ $axios, $auth }) {
    return $axios.get('/company/' + $auth.companyId).then((company) => ({
      company: {
        ...company,
        staffs: company.staffs.map((s) => ({
          ...s,
          branch: company.branches.find((b) => b.id === s.branchId),
        })),
      },
    }))
  },
  data() {
    return {
      isStripeLoaded: false,

      company: null,

      newSub: null,

      draft: {
        staffAmount: 1,
        branchAmount: 1,
        plan: null,
        jobAmount: 1,
        password: '',
        metadata: null,
        coupon: null,
        stripeToken: null,
      },

      steps: [
        {
          key: 'staffs',
          title: 'Mitarbeiter',
          note: 'Wie viele Mitarbeiter sind derzeit insgesamt an allen Standorten in deinem Unternehmen beschäftigt?',
        },
        {
          key: 'branches',
          title: 'Standorte',
          note: 'Wie viele Standorte möchtest du zu deinem Abo hinzufügen? Nur die ausgewählten Standorte, die du hinzufügen, kannst später Bewerber empfangen.',
        },
        {
          key: 'plan',
          title: 'Gültigkeitsdauer',
          note: 'Wähle die geeignete Gültigkeitsdauer für dein Unternehmen aus.',
        },
        {
          key: 'jobs',
          title: 'Inserate',
          note: 'Wie viele Jobinserate benötigt dein Unternehmen minimum pro Monat? Weitere kannst du noch zusätzlich erwerben.',
        },
        {
          key: 'preview',
          title: 'Übersicht',
          note: 'Hier siehst du eine Übersicht deines Shopping-Trip. Um deine Bestellung abzuschliessen, bestätige zuvor mit deinem Privatem Passwort.',
        },
      ],

      actions: [
        {
          text: 'Weiter',
          primary: true,
          handler: () => this.$refs.stepper.next(),
        },
        {
          text: 'Zurück',
          handler: () => this.$refs.stepper.back(),
        },
      ],

      columns: [
        { key: 'name', name: 'Artikel', class: 'font-semibold' },
        {
          key: 'amount',
          name: 'Anzahl',
          transform: (_, item) => item.jobAmount || item.amount,
        },
        { key: 'price', name: 'Preis' },
        { key: 'total', name: 'Total' },
      ],
    }
  },
  computed: {
    buyJobOnly() {
      return !!this.$route.query.job
    },
    total() {
      const { jobAmount, plan } = this.draft
      return (jobAmount || 0) * 12.9 + (plan ? plan.price * plan.months : 0)
    },
    totalAndVat() {
      return this.total * 1.077
    },
    cartItems() {
      const items = []
      const { plan, jobAmount } = this.draft
      if (plan) {
        items.push({ name: plan.name, amount: plan.months, price: plan.price })
      }
      if (jobAmount) {
        items.push({ name: 'Jobinserat', amount: jobAmount, price: 12.9 })
      }
      return items
    },
    summaryItems() {
      return [
        { text: 'Zwischentotal', value: this.total },
        { text: 'Angebotscode hinzufügen', value: '' },
        { text: 'Mehrwertsteuer (7,7%)', value: this.total * 0.077 },
        { text: 'Ge­samt­to­tal', value: this.totalAndVat },
      ]
    },
  },
  methods: {
    setCreditCard(creditCard) {
      const { stripeToken, ...metadata } = creditCard
      this.draft.stripeToken = stripeToken
      this.draft.metadata = metadata
    },

    async done() {
      const draft = this.$utils.extract(this.draft, [
        'stripeToken',
        'metadata',
        'jobAmount',
        'password',
        { from: 'plan', to: 'planId', transform: (plan) => plan?.id || null },
        { from: 'coupon', to: 'couponId', transform: (c) => c?.id },
      ])
      draft.companyId = this.$auth.companyId

      this.newSub = await this.$axios
        .post('/subscription/', draft)
        .catch((e) => this.$alert.error(e))
    },
  },
  middleware({ redirect, $auth, route }) {
    if (!$auth.companyId) {
      return redirect('/')
    }
  },
  head() {
    return {
      title: 'Shopping',
      script: [
        {
          hid: 'stripe',
          src: 'https://js.stripe.com/v3/',
          defer: true,
          callback: () => {
            this.isStripeLoaded = true
          },
        },
      ],
    }
  },
}
</script>

<style>
.applyBtn {
  width: calc(100% + 20px) !important;
}
</style>
