<template>
  <div>
    <base-note class="mb-8">
      Mit Tomisha Browser-Benachrichtigungen kannst du erfahren, wann du eine
      wichtige neue Benachrichtigung oder Nachricht erhalten hast. Wir empfehlen
      dir dringend, diese zu aktivieren.<br /><br />
      Um Browser-Benachrichtigungen zu aktivieren, öffne deine
      Browsereinstellungen und erteile Tomisha Benachrichtigungsberechtigungen.
    </base-note>

    <div v-if="$auth.user.emailAdTypes" class="mb-6">
      <div class="flex justify-between">
        <label class="text-sm text-gray-600 block mb-3 flex-grow">
          Arbeitsverhältnis
        </label>

        <base-switch
          :value="$auth.user.emailAdTypes.length === emailAdTypes.length"
          class="inline-flex ml-auto flex-shrink-0"
          @input="toggleAllEmailAdTypes"
        />
      </div>

      <div
        v-for="item in emailAdTypes"
        :key="item.value"
        class="mb-4 flex items-center justify-between max-w-xs pl-6"
      >
        <label :for="item.value" class="text-sm text-gray-500 block flex-grow">
          {{ item.text }}
        </label>

        <base-checkbox
          id="setting-email-types"
          :checked="$auth.user.emailAdTypes.includes(item.value)"
          class="flex-shrink-0"
          @change="toggleEmailAdType(item.value)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { EmailAdType } from '~/constants'
export default {
  data() {
    return {
      emailAdTypes: [
        { text: 'Neue Jobinserat', value: EmailAdType.NEW_JOB },
        { text: 'Freundschaftsanfrage', value: EmailAdType.CONTACT_INVITATION },
      ],
    }
  },
  scrollToTop: true,
  created() {
    if (!this.$auth.user.emailAdTypes) {
      this.$auth.updateUser({ emailAdTypes: [] })
    }
  },
  methods: {
    toggleEmailAdType(type) {
      this.$utils.toggleArrayItem(this.$auth.user.emailAdTypes, type)
      this.$axios.patch('me', {
        emailAdTypes: this.$auth.user.emailAdTypes,
      })
    },

    toggleAllEmailAdTypes() {
      this.$auth.updateUser({
        emailAdTypes:
          this.$auth.user.emailAdTypes.length < this.emailAdTypes.length
            ? this.emailAdTypes.map((e) => e.value)
            : [],
      })
      this.$axios.patch('me', {
        emailAdTypes: this.$auth.user.emailAdTypes,
      })
    },
  },
  head: {
    title: 'Benachrichtigung',
  },
}
</script>
