<template>
  <base-card disabled dismissible @dismiss="$emit('no')">
    <h2 class="text-2xl leading-none mb-4">Willkommen</h2>

    <p class="text-lg text-gray-600 mb-6">
      Herzlich willkommen auf deinem Dashboard. Hier findest du alle wichtigsten
      Informationen.
    </p>

    <base-button secondary @click="$emit('yes')">
      Ich freue mich auch
    </base-button>
  </base-card>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>
