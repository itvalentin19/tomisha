<template>
  <common-filter-modal-wrapper
    ref="wrapper"
    @reset="reset()"
    @before-show="syncQuery"
  >
    <template #filter>
      <base-input
        v-model="draft.title"
        label="Suchen"
        placeholder="Job / Arbeitgeber"
        class="mb-6"
      />

      <input-address
        v-model="draft.location"
        city-only
        label="Arbeitsort"
        placeholder="Zürich"
        class="mb-6"
      />

      <base-progress
        :value="[draft.minWorkload, draft.maxWorkload]"
        label="Arbeitspensum (%)"
        class="mb-6"
        @input="
          Object.assign(draft, {
            minWorkload: $event[0],
            maxWorkload: $event[1],
          })
        "
      />

      <div class="mb-6">
        <label class="text-sm text-gray-600 block mb-3"> Anstellungsart </label>

        <div
          v-for="item in $store.state.tag.workingRelationships"
          :key="item.id"
          class="mb-4 flex items-center justify-between max-w-xs pl-6"
        >
          <label
            :for="'_rel_' + item.id"
            class="text-sm text-gray-500 block flex-grow"
          >
            {{ item.text }}
          </label>

          <base-checkbox
            :id="'_rel_' + item.id"
            :checked="draft.relationships.includes(item.id)"
            class="flex-shrink-0"
            @change="$utils.toggleArrayItem(draft.relationships, item.id)"
          />
        </div>
      </div>

      <div class="mb-20 lg:mb-0">
        <label class="text-sm text-gray-600 block mb-3">
          Unternehmensarten
        </label>

        <div
          v-for="item in companySizes"
          :key="item.value"
          class="mb-4 flex items-center justify-between max-w-xs pl-6"
        >
          <label
            :for="'_g_' + item.value"
            class="text-sm text-gray-500 block flex-grow"
          >
            {{ item.text }}
          </label>

          <base-checkbox
            :id="'_g_' + item.value"
            :checked="draft.sizes.includes(item.value)"
            class="flex-shrink-0"
            @change="$utils.toggleArrayItem(draft.sizes, item.value)"
          />
        </div>
      </div>

      <base-bottom-actions :items="actions" />
    </template>

    <template #sort>
      <base-input-radio-group
        :checked="draft.asc ? 'asc' : 'desc'"
        :items="[
          { text: 'Neustes zuerst', value: 'asc' },
          { text: 'Ältestes zuerst', value: 'desc' },
        ]"
        label-class="font-semibold text-teal-600"
        @change="setOrder($event === 'asc')"
      />
    </template>
  </common-filter-modal-wrapper>
</template>

<script>
import InputAddress from '../../input/InputAddress'
export default {
  components: { InputAddress },
  data() {
    return {
      draft: {
        title: '',
        location: {},
        minWorkload: 0,
        maxWorkload: 100,
        relationships: [],
        sizes: [],
        asc: true,
      },
      companySizes: [
        { text: 'Kleine Unternehmen', value: '1_9' },
        { text: 'Mittlere Unternehmen', value: '10_49' },
        { text: 'Grosse Unternehmen', value: '50_249' },
        { text: 'Temporärbüros', value: '250_1000000' },
      ],
    }
  },
  computed: {
    actions() {
      const total = this.$store.state.job.total
      return [
        {
          text: `${total || ''} Jobangebote`,
          primary: true,
          handler: () => this.done(),
        },
      ]
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
      this.draft = this.$utils.extract(this.$route.query, [
        {
          from: 'title',
          transform: (title) => decodeURIComponent(title || ''),
        },
        {
          from: 'location',
          transform: (location) => location || {},
        },
        {
          from: 'minWorkload',
          default: 0,
          transform: (w) => +w || 0,
        },
        {
          from: 'maxWorkload',
          default: 100,
          transform: (w) => +w || 100,
        },
        {
          from: 'relationships',
          default: [],
          transform: (r) =>
            decodeURIComponent(r || '')
              .split(',')
              .map((r) => +r),
        },
        {
          from: 'sizes',
          default: [],
          transform: (s) => decodeURIComponent(s || '').split(','),
        },
        {
          from: 'asc',
          default: true,
          transform: (a) => a === 'true',
        },
      ])
    },
    setOrder(asc) {
      this.draft.asc = asc
      this.done()
    },
    done() {
      this.$router.push(
        {
          path: this.$route.path,
          query: this.$utils.filterObject({
            ...this.$route.query,
            ...this.$utils.extract(this.draft, [
              {
                from: 'title',
                transform: (title) => encodeURIComponent(title?.trim?.() || ''),
              },
              'location',
              'minWorkload',
              'maxWorkload',
              {
                from: 'relationships',
                transform: (r) => encodeURIComponent(r.join(',')),
              },
              {
                from: 'sizes',
                transform: (r) => encodeURIComponent(r.join(',')),
              },
              {
                from: 'asc',
                transform: (a) => (a ? 'true' : 'false'),
              },
            ]),
          }),
        },
        () => this.$emit('done')
      )

      this.$refs.wrapper.close()
    },

    reset(isDone) {
      this.draft = {
        title: '',
        location: {},
        minWorkload: 0,
        maxWorkload: 100,
        relationships: [],
        sizes: [],
        asc: true,
      }

      isDone && this.done()
    },
  },
}
</script>
