<template>
  <header>
    <div
      class="flex items-center justify-between text-xl -m-2 text-center"
      :class="{ 'mb-6': !!$slots.default }"
    >
      <div
        v-if="dismissible"
        class="cursor-pointer w-12 h-12 inline-flex justify-center items-center rounded-full flex-shrink-0 relative group"
        @click="$emit('dismiss')"
      >
        <base-icon :icon="backIcon ? 'back' : 'close'" />

        <span
          class="absolute top-full whitespace-no-wrap opacity-0 group-hover:opacity-100 duration-200 pointer-events-none select-none text-sm text-gray-600 hiddden lg:inline-block -mt-1"
        >
          {{ backIcon ? 'Zurück' : 'Schlissen' }}
        </span>
      </div>

      <h2
        v-if="title || $slots.title"
        class="text-2xl text-center flex-grow overflow-hidden"
        :class="{
          'pr-12': dismissible && !actions.length && !$slots.actions,
          'pl-12': !dismissible && (actions.length || !!$slots.actions),
        }"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </h2>

      <slot name="actions">
        <base-menu
          v-if="actions.length"
          :items="actions"
          class="ml-auto flex-shrink-0"
        />
      </slot>
    </div>

    <slot />
  </header>
</template>

<script>
export default {
  props: {
    title: { type: String, default: '' },
    dismissible: { type: Boolean, default: true },
    actions: { type: Array, default: () => [] },
    backIcon: Boolean,
  },
}
</script>
