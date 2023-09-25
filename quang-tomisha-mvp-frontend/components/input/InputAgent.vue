<template>
  <base-modal
    ref="modal"
    title="Temporärbüro auswählen"
    full-height
    @shown="onShown"
  >
    <template #activator>
      <base-button v-if="!value" secondary icon="plus-circle">
        Personalberater* hinzufügen
      </base-button>

      <staff-card
        v-else
        :staff="value"
        dismissible
        @dismiss="$emit('input', null)"
        @click="() => {}"
      />
    </template>

    <template #header-bottom>
      <base-input
        v-model="text"
        label="Gewünschtes Temporärbüro eintippen"
        placeholder="Tomisha"
        class="mt-12"
      />
    </template>

    <profile-card
      v-for="item in filteredBranches"
      :key="item.id"
      :profile="item"
      class="mb-6"
      @click="showStaffSelection(item)"
    >
      <base-button class="mt-8" @click.stop="$refs.branchModal.open(item)">
        Details
      </base-button>
    </profile-card>

    <!-- View public branch -->
    <branch-detail-modal ref="branchModal" />

    <!-- Agent selection -->
    <base-modal
      v-model="staffSelectionState"
      title="Personalberater * auswählen"
      full-height
      back-icon
    >
      <template #header-bottom>
        <profile-card
          :profile="selectedBranch"
          dismissible
          class="mb-6"
          @dismiss="hideStaffSelection"
        />

        <base-input
          v-model="staffText"
          label="Gewünschter Personalberater* eintippen"
          placeholder="Federer"
        />
      </template>

      <staff-card
        v-for="item in filteredStaffs"
        :key="item.id"
        :staff="item"
        class="mb-6"
        @click="selectStaff(item)"
      >
        <base-button
          class="mt-8"
          @click.stop="$refs.profileModal.open(item.user.slug)"
        >
          Details
        </base-button>
      </staff-card>

      <profile-detail-modal ref="profileModal" />
    </base-modal>
  </base-modal>
</template>

<script>
import { UserType } from '~/constants'
export default {
  props: {
    value: { type: Object, default: null },
  },
  data() {
    return {
      text: '',
      branches: [],
      staffs: [],
      selectedBranch: null,
      staffSelectionState: false,
      staffText: '',
    }
  },
  computed: {
    filteredBranches() {
      if (!this.text) {
        return this.branches
      }
      const text = this.text.trim().toLowerCase()
      return this.branches.filter((b) => b.name.toLowerCase().includes(text))
    },
    filteredStaffs() {
      if (!this.staffText) {
        return this.staffs
      }
      const text = this.staffText.trim().toLowerCase()
      return this.staffs.filter((b) =>
        (b.firstName + ' ' + b.lastName).toLowerCase().includes(text)
      )
    },
  },
  methods: {
    async onShown() {
      this.text = ''
      this.selectedBranch = null

      if (!this.branches.length) {
        this.branches = await this.$axios.get('/branch', {
          params: { type: UserType.AGENCY },
        })
      }
    },
    async showStaffSelection(branch) {
      this.selectedBranch = branch
      this.staffSelectionState = true

      this.staffs = await this.$axios.get('/employment', {
        params: { branchId: branch.id },
      })
    },
    hideStaffSelection() {
      this.staffSelectionState = false
      this.selectedBranch = null
      this.staffText = ''
      this.staffs = []
    },
    selectStaff(staff) {
      const value = {
        id: staff.id,
        user: staff.user,
        profession: staff.profession,
        companyId: this.selectedBranch.companyId,
        branch: this.selectedBranch,
      }
      this.$emit('input', this.$utils.clone(value))
      this.$refs.modal.close()
      this.staffSelectionState = false
    },
  },
}
</script>
