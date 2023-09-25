<template>
  <base-card dismissible @dismiss="confirmViewState = !confirmViewState">
    <template v-if="!confirmViewState">
      <h4 class="font-semibold mb-6">
        Bist du aktuell in diesem Unternehmen bestätigt?
      </h4>

      <profile-brief :profile="notification.fromBranch" class="mb-10" />

      <base-button
        :to="`/staff/accept-invitation?notificationId=${notification.id}`"
      >
        Bestätigen
      </base-button>
    </template>

    <template v-else>
      <h4 class="font-semibold mb-6">Unternehmen bestätigt entfernen</h4>

      <p class="text-gray-600 mb-10">
        Bist du sicher, dass du diese Unternehmen bestätigt löschen möchtest? Du
        kannst sie später nicht mehr wider herstellen.
      </p>

      <base-button danger class="mb-6" @click="$emit('no')">
        Bestätigen & Löschen
      </base-button>

      <base-button @click="confirmViewState = false"> Zurück </base-button>
    </template>
  </base-card>
</template>

<script>
export default {
  props: {
    notification: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      confirmViewState: false,
    }
  },
}
</script>
