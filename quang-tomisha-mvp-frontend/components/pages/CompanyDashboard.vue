<template>
  <div>
    <base-expand-group
      :items="[{ title: 'Deine Jobinserate' + (total ? ` (${total})` : '') }]"
    >
      <base-figure
        v-if="!jobs.length"
        img="/img/no_items.svg"
        title="Erstelle dein erstes Jobinserat"
        class="mb-12"
      />

      <base-button secondary icon="plus-circle" to="/edit/job/new">
        Jobinserat erstellen
      </base-button>

      <n-link
        v-for="item in jobs"
        :key="item.id"
        :to="`/company/job/detail?id=${item.id}`"
        class="block mt-6"
      >
        <job-card :job="item" />
      </n-link>
    </base-expand-group>
  </div>
</template>

<script>
export default {
  props: {
    jobs: { type: Array, default: () => [] },
    total: { type: Number, default: 0 },
  },
}
</script>
