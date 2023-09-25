<template>
  <base-card disabled dismissible @dismiss="$emit('no', data)">
    <div class="p-6 select-none">
      <img src="/img/add_friend.svg" class="w-full" />
    </div>

    <h2 class="text-2xl leading-none mb-4">Freunde hinzufügen</h2>

    <p class="text-lg text-gray-600 mb-6">
      Verknüpfe dich mit denen Freunde. Nütze die Power von denen freunde um dir
      zu helfen einen neuen Job zu finden. So findest du schneller einen neuen
      Job.
    </p>

    <base-button secondary icon="plus-circle" to="/network/new">
      Freunde hinzufügen
    </base-button>
  </base-card>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>
