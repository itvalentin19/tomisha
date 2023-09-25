<template>
  <div>
    <base-expand-group
      v-if="applications.length"
      :items="[{ title: 'Gesendete Bewerbungen' }]"
      class="mb-12"
    >
      <user-application-table :applications="applications" />
    </base-expand-group>

    <base-expand-group
      v-slot="{ item: group }"
      :items="
        jobGroups.map((g) => ({
          title:
            (g.title || (g.profession ? g.profession.title : 'Alle Jobs')) +
            ` (${g.total})`,
          items: g.items,
          profession: g.profession,
        }))
      "
    >
      <n-link
        v-for="(item, i) in group.items"
        :key="item.id"
        :to="`/job/${item.slug}`"
        class="block"
        :class="{ 'mt-6': !!i }"
      >
        <job-card :job="item" />
      </n-link>

      <base-button
        secondary
        icon="chevron-down-circle"
        :to="`/jobs${
          group.profession ? '?professionId=' + group.profession.id : ''
        }`"
        class="mt-6"
      >
        Weitere öffnen
      </base-button>
    </base-expand-group>
  </div>
</template>

<script>
export default {
  props: {
    applications: { type: Array, default: () => ({}) },
    jobGroups: { type: Array, default: () => ({}) },
  },
}
</script>
