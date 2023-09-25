<template>
  <base-card dismissible @dismiss="confirmViewState = !confirmViewState">
    <template v-if="!confirmViewState">
      <h4 class="font-semibold mb-6 pr-5">
        <span
          v-html="
            `${notification.fromUser.firstName} ${notification.fromUser.lastName}`
          "
        ></span>
        bittet dich, eine Referenz über ihn zu erstellen:
      </h4>

      <profile-brief :profile="notification.fromUser" class="mb-8" />

      <n-link
        :to="`/edit/reference?notificationId=${notification.id}`"
        class="block py-2 text-teal-600 font-semibold text-center cursor-pointer"
      >
        Referenz erstellen
      </n-link>
    </template>

    <template v-else>
      <h4 class="font-semibold mb-6">Referenzanfrage entfernen</h4>

      <p class="text-gray-600 mb-10">
        Bist du sicher, dass du die Referenzanfrage löschen möchtest? Du kannst
        sie später nicht mehr wider herstellen.
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
