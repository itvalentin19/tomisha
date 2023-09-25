<template>
  <base-card v-bind="$attrs" disabled class="mb-6" v-on="$listeners">
    <profile-brief
      :profile="refUser"
      class="mb-6"
      body-class="text-sm text-gray-600"
    />

    <label class="block mb-1 text-gray-600 text-sm"> Beurteilung </label>
    <template v-for="criteria in referenceCriterias">
      <div v-if="criterias[criteria.key]" :key="criteria.key" class="mb-5">
        <base-rating :value="criterias[criteria.key]" disabled class="mb-1" />

        <h6 class="font-semibold">{{ criteria.text }}</h6>
      </div>
    </template>

    <base-description :text="reference.description" quote />
  </base-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  inheritAttrs: false,
  props: {
    reference: { type: Object, required: true },
    user: { type: Object, default: null },
  },
  computed: {
    ...mapState('tag', ['referenceCriterias']),

    refUser() {
      return this.user || this.reference.refUser
    },

    criterias() {
      const { criterias } = this.reference || {}
      return typeof criterias === 'string'
        ? this.$utils.parseJSON(criterias)
        : criterias || {}
    },
  },
}
</script>
