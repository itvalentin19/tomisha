<template>
  <div>
    <branch-editor
      ref="editor"
      :company-id="company && company.id"
      :create-company-token="createCompanyToken"
      :headquater="!company || !company.branches || !company.branches.length"
      class="mb-8 max-w-lg"
      @done="onBranchEditorDone"
    />

    <branch-table
      v-if="company.branches.length"
      :items="value"
      :company="company"
      :class="{ 'md:-mx-10 lg:-mx-16': !wide }"
      @item-click="$refs.editor.open($event)"
    />
  </div>
</template>

<script>
import BranchEditor from '~/components/entities/branch/BranchEditor'
import BranchTable from '~/components/entities/branch/BranchTable'
export default {
  components: {
    BranchEditor,
    BranchTable,
  },
  props: {
    company: { type: Object, default: null },
    value: { type: Array, default: () => [] },
    createCompanyToken: { type: String, default: null },
    wide: Boolean,
  },
  methods: {
    onBranchEditorDone(branch) {
      if (branch.isHeadquater) {
        this.$emit(
          'input',
          this.value.map((b) => ({ ...b, isHeadquater: false }))
        )
      }

      setTimeout(() => {
        this.$utils.mutateArrayItem(this.value, branch, 'id')
        this.$emit('input', this.value)
      })
    },
  },
}
</script>
