<template>
  <header class="bg-white rounded-b-xl shadow-lg z-30">
    <div class="flex items-center justify-between px-6 lg:px-20 xl:px-26 py-2">
      <base-logo />

      <div
        class="inline-flex flex-shrink-0 group ml-4 hover:pl-0 cursor-pointer"
        @click="$refs.switcher.open()"
      >
        <base-avatar
          v-for="profile in navProfiles"
          :key="profile.id"
          :src="profile.picture"
          :status="profile.status"
          v-bind="
            profile.isCompany
              ? { placeholder: '/img/company_placeholder.svg' }
              : {}
          "
          custom-class="w-10 h-10 sm:w-12 sm:h-12"
          class="duration-300 flex-shrink-0"
          :class="{ '-ml-3 group-hover:ml-1': navProfiles.length > 1 }"
        />
      </div>
    </div>

    <base-modal ref="switcher" :persistent="false" hide-header>
      <div class="mt-6 select-none">
        <img src="/img/step_employer_3.svg" class="w-full" />
      </div>

      <h2 class="text-2xl my-6 flex items-center">Profilwechsel</h2>

      <p class="text-gray-600 text-lg mb-6">
        Zu welchem Profil möchtest du gerne wechseln?
      </p>

      <div class="mb-6">
        <label class="block mb-1 text-gray-600 text-sm">
          Persönliches Profil
        </label>

        <profile-card :profile="$auth.user" @click="selectProfile($auth.user)">
          <base-button> Wechseln </base-button>
        </profile-card>
      </div>

      <div v-if="profiles.length > 1" class="mb-12">
        <label class="block mb-1 text-gray-600 text-sm">
          Unternehmensprofil
        </label>

        <profile-card
          v-for="(company, i) in profiles.filter((p) => p.isCompany)"
          :key="company.id"
          :profile="company"
          avatar-placeholder="/img/company_placeholder.svg"
          :class="{ 'mt-4': !!i }"
          @click="selectProfile(company)"
        >
          <base-button> Wechseln </base-button>
        </profile-card>
      </div>

      <base-button secondary icon="plus-circle" to="/staff/company-search">
        Unternehmensprofil hinzufügen
      </base-button>
    </base-modal>
  </header>
</template>

<script>
import { UserStatus } from '~/constants'
export default {
  data() {
    return {
      expanded: false,
    }
  },
  computed: {
    profiles() {
      if (!this.$auth.isAuthenticated) {
        return []
      }

      const profiles = [
        ...this.$auth.user.employments
          .filter((emp) => emp.company.status !== UserStatus.DEACTIVATED)
          .map((employment) => ({
            id: employment.companyId,
            isCompany: true,
            name: employment.company.headquater.name,
            picture: employment.company.headquater.picture,
            status: -1,
            address: employment.company.headquater.address,
          })),

        this.$auth.user,
      ]

      if (this.$auth.companyId) {
        const i = profiles.findIndex((p) => p.id === this.$auth.companyId)
        if (i !== -1) {
          profiles.push(profiles.splice(i, 1)[0])
        }
      }

      return profiles
    },

    navProfiles() {
      return this.$auth.companyId
        ? this.profiles
        : [this.profiles.find((p) => p.id === this.$auth.user.id)]
    },
  },
  methods: {
    selectProfile(profile) {
      this.$auth.setCompany(profile.isCompany ? profile.id : null)

      this.$store.commit('notification/setState', { notifications: [] })

      this.$refs.switcher.close()

      this.$router.push('/')
    },
  },
}
</script>
