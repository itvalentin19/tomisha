<template>
  <base-form
    ref="form"
    class="-mb-32 md:mb-0 pb-6 md:pb-0"
    alert-on-error
    @submit="onSubmit"
  >
    <div
      class="-mx-6 md:-mx-10 lg:-mx-16 -mt-6 md:-mt-8 lg:-mt-10 mb-6 rounded-t-xl overflow-hidden"
    >
      <input-cover-image v-model="draft.cover" />

      <input-avatar
        v-model="draft.picture"
        placeholder="/img/user_placeholder.svg"
        :rules="[$rules.required]"
        class="-mt-18"
      />
    </div>

    <input-gender
      v-model="draft.gender"
      :rules="[$rules.required]"
      class="mb-6"
    />

    <base-input
      v-model="draft.firstName"
      label="Vorname"
      placeholder="Angelina"
      :rules="[$rules.required, $rules.maxLength(250)]"
      class="mb-6"
    />

    <base-input
      v-model="draft.lastName"
      label="Familienname"
      placeholder="Federer"
      :rules="[$rules.required, $rules.maxLength(250)]"
      class="mb-6"
    />

    <input-address
      v-model="draft.address"
      label="Adresse"
      placeholder="Adresse"
      :rules="[$rules.required]"
      class="mb-6"
    />

    <input-phone
      v-model="draft.phone"
      :country-code="countryCode"
      :rules="[$rules.required]"
      class="mb-6"
    />

    <base-date-picker
      v-model="draft.dob"
      label="Geburtsdatum"
      placeholder="28. September 1953"
      :rules="[$rules.required]"
      :initial-scroll-year="2000"
      class="mb-6"
    />

    <input-address
      v-model="pob"
      city-only
      label="Geburtsort"
      placeholder="Bern BE"
      :rules="[$rules.required]"
      class="mb-6"
    />

    <input-country
      v-model="draft.nationality"
      label="Nationalität"
      placeholder="Schweiz"
      :rules="[$rules.required]"
      initial-scroll-item="ch"
      class="mb-6"
    />

    <input-marital-status
      v-model="draft.maritalStatus"
      :rules="[$rules.required]"
      class="mb-6"
    />

    <input-residence-permit
      ref="permit"
      v-model="draft.residencePermit"
      class="mb-6"
    />

    <input-vehicle-registration
      ref="registration"
      v-model="draft.vehicleRegistrations"
      class="mb-6"
    />

    <slot :data="draft" />
  </base-form>
</template>

<script>
export default {
  inheritAttrs: false,
  scrollToTop: true,
  props: {
    profile: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      draft: this.$utils.clone(
        this.$utils.extract(this.profile, {
          cover: null,
          picture: '/img/user_placeholder.svg',
          gender: null,
          firstName: null,
          lastName: null,
          address: null,
          phone: '',
          dob: null,
          pob: null,
          nationality: null,
          maritalStatus: null,
          residencePermit: null,
          vehicleRegistrations: [],
        })
      ),
    }
  },
  computed: {
    pob: {
      get() {
        return { text: this.draft.pob }
      },
      set(addr) {
        this.draft.pob = addr?.text || null
      },
    },

    countryCode() {
      const components = this.$utils.parseJSON(this.draft.address?.components)
      return components?.country?.short?.toLowerCase()
    },
  },
  created() {
    this.$store.dispatch('tag/fetchCountries')
  },
  methods: {
    submit() {
      this.$refs.form.submit()
    },
    onSubmit() {
      const me = this.profile
      const { residencePermit, vehicleRegistrations, ...draft } = this.draft

      draft.residencePermit =
        me.residencePermit && residencePermit
          ? { ...residencePermit, id: me.residencePermit.id }
          : residencePermit

      const removedRegistrations = me.vehicleRegistrations.filter((item) => {
        return !vehicleRegistrations.some((r) => r.id === item.id)
      })
      let tmp = 0

      draft.vehicleRegistrations = removedRegistrations.length
        ? vehicleRegistrations.map((registration) => {
            const reg =
              registration.id || !removedRegistrations[tmp]
                ? registration
                : { id: removedRegistrations[tmp].id, ...registration }

            tmp++

            return reg
          })
        : vehicleRegistrations

      this.$emit('done', draft)

      this.$auth.updateUser({
        picture: this.draft.picture,
        cover: this.draft.cover,
      })
    },
  },
}
</script>
