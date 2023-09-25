<template>
  <div class="flex rounded-xl bg-gray-100 overflow-hidden">
    <div class="w-12 text-center py-4 bg-gray-200 flex-shrink-0">
      <base-icon icon="info-circle" class="text-gray-500" />
    </div>

    <div class="flex-grow text-gray-500 px-5 py-4">
      <slot />
    </div>
  </div>
</template>
