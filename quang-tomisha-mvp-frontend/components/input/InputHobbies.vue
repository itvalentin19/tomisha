<template>
  <div>
    <base-select
      v-bind="$attrs"
      title="Hobby hinzufügen"
      :items="hobbies"
      :hidden-items="value"
      :load-items="fetchHobbies"
      :total="totalHobbies"
      return-object
      item-text="title"
      item-value="id"
      item-icon="plus-circle"
      search-label="Gewünschte Hobby eintippen"
      class="mb-8"
      @input="value.push($event)"
    >
      <template #activator>
        <base-button secondary icon="plus-circle">
          Hobbys hinzufügen
        </base-button>
      </template>
    </base-select>

    <div v-for="(item, i) in value" :key="i" class="mb-3">
      <span
        class="rounded-xl border border-gray-400 inline-block px-6 py-2 font-semibold trucate align-text-top relative"
      >
        {{ item.title }}

        <base-delete-button @click="value.splice(i, 1)" />
      </span>
    </div>

    <slot />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  inheritAttrs: false,
  props: {
    value: { type: Array, default: () => [] },
  },
  computed: mapState('tag', ['hobbies', 'totalHobbies']),
  methods: mapActions('tag', ['fetchHobbies']),
}
</script>
