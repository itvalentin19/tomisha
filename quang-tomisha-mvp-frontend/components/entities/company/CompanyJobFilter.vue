<template>
  <common-filter-modal-wrapper
    ref="wrapper"
    @reset="reset()"
    @before-show="syncQuery"
  >
    <template #filter>
      <base-input
        v-model="draft.title"
        label="Berufsbezeichnung"
        placeholder="Maurer"
        class="mb-6"
      />

      <div v-if="branches.length" class="mb-6">
        <label class="text-sm text-gray-600 block mb-3"> Ort </label>

        <div
          v-for="item in branches"
          :key="item.id"
          class="mb-4 flex items-center justify-between max-w-xs pl-6"
        >
          <label
            :for="'_rel_' + item.id"
            class="text-sm text-gray-500 block flex-grow"
          >
            {{ item.name }}, {{ item.address.zip }} {{ item.address.city }}
          </label>

          <base-checkbox
            :id="'_rel_' + item.id"
            :checked="draft.branchIds.includes(item.id)"
            class="flex-shrink-0"
            @change="$utils.toggleArrayItem(draft.branchIds, item.id)"
          />
        </div>
      </div>

      <base-bottom-actions :actions="actions" />
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

    <template #filter:footer>
      <base-button primary @click="done">
        {{ $store.state.job.jobs.total }} Jobinserate
      </base-button>
    </template>
  </common-filter-modal-wrapper>
</template>

<script>
export default {
  props: {
    companyId: { type: String, default: null },
    branchId: { type: String, default: null },
    branches: { type: Array, default: () => [] },
  },
  data() {
    return {
      query: {},
      draft: {
        title: '',
        branchIds: [],
        asc: true,
      },
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
  methods: {
    syncQuery() {
      this.draft = this.$utils.extract(this.query, {
        title: '',
        branchIds: [],
        asc: true,
      })
    },
    setOrder(asc) {
      this.draft.asc = asc
      this.done()
    },
    done() {
      const { title, asc, branchIds } = this.draft
      this.$store.dispatch('job/findJobs', {
        companyId: this.companyId,
        asc,
        title: title && decodeURIComponent(title),
        branchIds: this.branchId || encodeURIComponent(branchIds.join(',')),
      })

      this.query = { title, asc, branchIds }

      this.$refs.wrapper.close()
    },

    reset() {
      this.draft = {
        title: '',
        branchIds: [],
        asc: false,
      }
    },
  },
}
</script>
