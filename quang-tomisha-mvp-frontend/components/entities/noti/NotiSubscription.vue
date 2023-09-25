<template>
  <base-card disabled>
    <base-figure
      img="/img/noti_subscription.svg"
      title="Abonnement aktualisieren"
      text="Um Tomisha vollständig nutzen zu können, ist ein aktuelles Abonnement erforderlich. Klicke auf Shopping, dort kannst du dein Abonnement auf den aktuellen Stand bringen."
      class="mb-12"
    />

    <base-button primary to="/edit/subscription"> Jetzt shoppen </base-button>
  </base-card>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>
