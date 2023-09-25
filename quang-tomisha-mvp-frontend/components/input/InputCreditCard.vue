<template>
  <base-modal
    v-model="shown"
    title="Zahlungsmethode hinzufügen"
    @closed="destroyStripe"
    @shown="autofill"
  >
    <template #activator>
      <base-button v-if="!cardNumber" secondary icon="credit-card">
        Zahlungsmethode hinzufügen
      </base-button>

      <div
        v-else
        class="rounded-xl border border-gray-400 px-10 h-12 flex items-center select-none cursor-pointer"
      >
        <base-icon icon="credit-card" class="mr-4 text-teal-600" />

        <span class="text-gray-600"> **** **** **** {{ cardNumber }} </span>

        <span class="ml-auto text-teal-600"> Ändern </span>
      </div>
    </template>

    <base-note class="mb-6"> Füge deine Zahlungsmethode hinzu. </base-note>

    <base-form ref="form" @submit="submit">
      <base-input
        v-model="draft.firstName"
        :rules="[$rules.required]"
        label="Vorname"
        placeholder="Leah"
        class="mb-6"
      />

      <base-input
        v-model="draft.lastName"
        :rules="[$rules.required]"
        label="Familienname"
        placeholder="Freud"
        class="mb-6"
      />

      <input-address
        v-model="draft.address"
        :rules="[$rules.required]"
        label="Adresse"
        placeholder="Adresse"
        class="mb-6"
      />

      <base-input
        v-model="draft.email"
        :rules="[$rules.required, $rules.email]"
        label="Geschäftliche E-Mail-Adresse"
        placeholder="leah.freud@lyrenmann.ch"
        class="mb-6"
      />

      <input-phone
        v-model="draft.phone"
        :rules="[$rules.required]"
        label="Geschäftliche Telefonnummer"
        class="mb-6"
      />

      <base-input label="Kartennummer" class="mb-6">
        <template #input>
          <div
            id="card-number"
            class="bg-transparent h-12 max-h-full w-full px-5 text-black-800 placeholder-gray-400 disabled:bg-disabled focus:outline-none appearance-none duration-200 border border-gray-400 rounded-xl pt-3"
          />
        </template>
      </base-input>

      <div class="flex mb-4">
        <base-input label="Gültig bis" class="flex-shrink-0 flex-grow mr-3">
          <template #input>
            <div
              id="card-expiry"
              class="bg-transparent h-12 max-h-full w-full px-5 text-black-800 placeholder-gray-400 disabled:bg-disabled focus:outline-none appearance-none duration-200 border border-gray-400 rounded-xl pt-3"
            />
          </template>
        </base-input>

        <base-input
          label="Prüfzieffer"
          class="flex-shrink-0 flex-grow ml-3"
          @hook:mounted="initStripe"
        >
          <template #input>
            <div
              id="card-cvc"
              class="bg-transparent h-12 max-h-full w-full px-5 text-black-800 placeholder-gray-400 disabled:bg-disabled focus:outline-none appearance-none duration-200 border border-gray-400 rounded-xl pt-3"
            />
          </template>
        </base-input>
      </div>

      <div v-if="errorMsg" class="text-sm text-red-600">
        {{ errorMsg }}
      </div>
    </base-form>

    <template #footer>
      <base-button
        primary
        disabled-on-loading
        class="mt-12"
        @click="$refs.form.submit()"
      >
        Hinzufügen
      </base-button>
    </template>
  </base-modal>
</template>

<script>
export default {
  data() {
    return {
      shown: false,

      draft: {
        firstName: '',
        lastName: '',
        address: null,
        email: null,
        phone: null,
        stripeToken: null,
      },

      stripe: null,
      cardNumberEl: null,
      cardExpiryEl: null,
      cardCVCElement: null,
      errorMsg: null,

      cardNumber: null,
    }
  },
  computed: {
    disabled() {
      return Object.values(this.draft).some((v) => !v)
    },
  },
  created() {
    this.$store.dispatch('tag/fetchCountries')
  },
  beforeDestroy() {
    this.destroyStripe()
  },
  methods: {
    async autofill() {
      if (Object.values(this.draft).some(Boolean)) {
        return
      }

      await this.$store.dispatch('me/fetchPersonalInfo')
      this.draft = this.$utils.extract(this.$store.state.me.personalInfo, {
        firstName: '',
        lastName: '',
        address: null,
        email: null,
        phone: null,
        stripeToken: null,
      })
    },

    initStripe() {
      if (!window.Stripe) {
        return
      }
      if (!this.stripe) {
        this.stripe = window.Stripe(process.env.NUXT_ENV_STRIPE_PUBLISHABLE_KEY)
      }
      const elements = this.stripe.elements()
      this.cardNumberEl = elements.create('cardNumber')
      this.cardNumberEl.mount('#card-number', {
        style: { base: { height: '40px', color: 'white' } },
      })

      this.cardExpiryEl = elements.create('cardExpiry')
      this.cardExpiryEl.mount('#card-expiry')

      this.cardCvcEl = elements.create('cardCvc')
      this.cardCvcEl.mount('#card-cvc')
    },

    destroyStripe() {
      this.stripe = null
      this.cardNumberEl?.destroy?.()
      this.cardExpiryEl?.destroy?.()
      this.cardCvcEl?.destroy?.()
      this.cardNumberEl = this.cardExpiryEl = this.cardCvcEl = null
    },

    async submit() {
      this.errorMsg = null

      const res = await this.stripe.createToken(this.cardNumberEl)

      this.errorMsg = res?.error?.message || ''
      if (this.errorMsg) {
        return
      }

      this.cardNumber = res?.token?.card?.last4 || ''

      this.draft.stripeToken = res?.token?.id

      const { address, ...draft } = this.draft
      draft.address = address?.text || ''
      this.$emit('done', draft)

      this.shown = false
    },
  },
}
</script>
