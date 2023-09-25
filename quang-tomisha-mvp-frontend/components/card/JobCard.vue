<template>
  <base-card v-if="job" v-bind="$attrs" v-on="$listeners">
    <base-chip v-if="job.profession" class="mb-2">
      {{ job.profession.title }}
      <template v-if="job.genders && job.genders.length">
        ({{ job.genders.map(getGenderAbbrById).join('/') }})
      </template>
    </base-chip>

    <h4 class="font-semibold mb-4">
      {{ job.title }}
    </h4>

    <profile-brief
      v-if="job.branch"
      :profile="job.branch"
      body-class="text-sm text-gray-600"
    />

    <div v-if="!hideActions" class="mt-6 flex relative">
      <base-button inline class="mx-auto">Öffnen</base-button>

      <span
        v-if="new Date(job.publishAt).valueOf() > Date.now() - 43200000"
        class="absolute right-0 top-0 bg-blue-400 text-white rounded-xl px-3 py-1 select-none"
      >
        Neu
      </span>
    </div>
  </base-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  inheritAttrs: false,
  props: {
    job: { type: Object, default: () => null },
    hideActions: Boolean,
  },
  computed: mapGetters('tag', ['getGenderAbbrById']),
}
</script>
