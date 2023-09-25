<template>
  <div class="bg-white min-h-screen">
    <header
      class="bg-white rounded-b-xl shadow-lg z-30 sticky top-0 lg:px-20 xl:px-26"
    >
      <div class="px-6 py-2 flex items-center justify-between">
        <base-logo />
      </div>
    </header>

    <main class="text-lg text-gray-700 p-6 max-w-lg mx-auto">
      <div class="select-none mb-6">
        <img src="/img/404.svg" class="w-full" />
      </div>

      <h2 class="font-semibold mb-6">Oops!</h2>

      <p class="mb-6">
        Wir können scheinbar die Seite, die du suchst, nicht finden.
      </p>

      <h1 class="font-semibold mb-6">Fehlercode: 404</h1>

      <p class="mb-6">Hier sind stattdessen einige hilfreiche Links:</p>

      <n-link
        to="/"
        class="text-teal-600 block text-center mb-10 hover:underline"
      >
        Home
      </n-link>
    </main>
  </div>
</template>

<script>
export default {
  auth: false,
  layout: 'full',
  head: {
    title: 'Page not found',
  },
}
</script>
