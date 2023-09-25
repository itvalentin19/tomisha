<template>
  <base-card dismissible @dismiss="confirmViewState = !confirmViewState">
    <template v-if="!confirmViewState">
      <h4 class="font-semibold mb-10">
        Anfrage zur Einsicht deiner Referenzen.
      </h4>

      <profile-brief :profile="notification.fromUser" class="mb-10" />

      <base-button @click="allow"> Bestätigen </base-button>
    </template>

    <template v-else>
      <h4 class="font-semibold mb-10">Referenzanfrage entfernen</h4>

      <p class="text-gray-600 mb-12">
        Bist du sicher, dass du die Referenzanfrage löschen möchtest? Du kannst
        sie später nicht mehr wider herstellen.
      </p>

      <base-button danger class="mb-10" @click="$emit('no')">
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
  methods: {
    allow() {
      this.$axios.post('reference/allow', {
        viewerId: this.notification.fromUser.id,
      })

      this.$alert.success('Du hast die Referenzanfrage bestätigt.')

      this.$emit('yes')
    },
  },
}
</script>
