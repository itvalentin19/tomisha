<template>
  <common-filter-modal-wrapper
    ref="wrapper"
    :tags="tags"
    @reset="reset()"
    @before-show="syncQuery"
  >
    <template #filter>
      <base-input
        v-model="draft.firstName"
        label="Vorname"
        placeholder="Angelina"
        :rules="[$rules.required]"
        class="mb-6"
      />

      <base-input
        v-model="draft.lastName"
        label="Familienname"
        placeholder="Federer"
        :rules="[$rules.required]"
        class="mb-6"
      />

      <input-address
        v-model="draft.location"
        city-only
        label="Ort"
        placeholder="Zürich"
        class="mb-6"
      />

      <base-progress
        v-model="draft.km"
        label="Umkreis (km)"
        :max="200"
        class="mb-6"
      />
    </template>

    <template #sort>
      <base-input-radio-group
        v-model="draft.order"
        :items="[
          { text: 'Neustes zuerst', value: 'createdAt' },
          { text: 'Alphabetisch', value: 'name' },
        ]"
        label-class="font-semibold text-teal-600"
        @change="done"
      />
    </template>

    <template #filter:footer>
      <base-button primary @click="done">
        {{ $store.state.user.total }} Kontakte
      </base-button>
    </template>
  </common-filter-modal-wrapper>
</template>

<script>
export default {
  data() {
    return {
      draft: {
        firstName: '',
        lastName: '',
        location: null,
        km: 0,
        order: 'createdAt',
      },
    }
  },
  computed: {
    tags() {
      const { firstName, lastName, location, km } = this.draft
      const tags = [
        [firstName, lastName].filter(Boolean).join(' '),
        location?.city,
        km ? km + ' km' : null,
      ].filter(Boolean)
      return tags
    },
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler: 'syncQuery',
    },
  },
  methods: {
    syncQuery() {
      const draft = this.$utils.extract(this.$route.query, [
        {
          from: 'firstName',
          default: '',
          transform: (s) => decodeURIComponent(s || ''),
        },
        {
          from: 'lastName',
          default: '',
          transform: (s) => decodeURIComponent(s || ''),
        },
        {
          from: 'km',
          default: 0,
          transform: (k) => +k || 0,
        },
        {
          from: 'order',
          default: 'createdAt',
        },
      ])

      const { city, country } = this.$route.query
      if (city && country) {
        draft.location = {
          city: decodeURIComponent(city),
          country: decodeURIComponent(country),
        }
      }

      this.draft = draft
    },
    done() {
      this.$router.push(
        {
          path: this.$route.path,
          query: this.$utils.filterObject({
            ...this.$utils.extract(this.draft, [
              {
                from: 'firstName',
                transform: (s) => encodeURIComponent(s?.trim?.() || ''),
              },
              {
                from: 'lastName',
                transform: (s) => encodeURIComponent(s?.trim?.() || ''),
              },
              {
                from: 'location',
                to: 'city',
                transform: (a) => a?.city,
              },
              {
                from: 'location',
                to: 'country',
                transform: (a) =>
                  this.$utils.parseJSON(a?.components)?.country?.long,
              },
              'km',
              'order',
            ]),
          }),
        },
        () => this.$emit('done')
      )

      this.$refs.wrapper.close()
    },

    reset() {
      this.draft = {
        firstName: '',
        lastName: '',
        location: null,
        km: 0,
        order: 'createdAt',
      }
    },
  },
}
</script>
