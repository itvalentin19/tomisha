<template>
  <div>
    <base-note class="mb-6">
      <base-description
        :text="'Füge den Beruf hinzu, auf den du dich bewerben möchtest.'"
      />
    </base-note>

    <input-profession
      v-model="draft.profession"
      :hidden-items="$auth.user.occupations.map((o) => o.profession.id)"
      class="mb-8"
    />

    <template v-if="draft.profession">
      <base-rating
        v-model="draft.level"
        label="Wähle dein Niveau"
        optional
        class="mb-6"
      />

      <base-progress
        :value="[draft.minWorkload, draft.maxWorkload]"
        label="Arbeitspensum (%)"
        class="mb-6"
        @input="
          Object.assign(draft, {
            minWorkload: $event[0],
            maxWorkload: $event[1],
          })
        "
      />

      <base-input-checkbox-group
        v-model="draft.relationships"
        label="Arbeisverhältnisse"
        :items="$store.state.tag.workingRelationships"
        item-value="id"
        :rules="[$rules.required]"
      />
    </template>

    <base-bottom-actions :items="actions" />
  </div>
</template>

<script>
export default {
  props: {
    me: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      draft: {
        profession: null,
        level: 1,
        relationships: [],
        minWorkload: 0,
        maxWorkload: 100,
      },
      isFinished: false,
      detailedProfile: null,
    }
  },
  computed: {
    actions() {
      return [
        {
          text: 'Speichern',
          primary: true,
          disabled: !this.draft.profession,
          handler: async () => {
            const newOccupation = await this.$axios.post(
              '/occupation',
              this.draft
            )

            const occupations = this.$auth.user.occupations || []
            this.$auth.updateUser({
              occupations: [
                ...occupations,
                {
                  id: newOccupation.id,
                  profession: this.draft.profession,
                },
              ],
            })

            this.$router.push('/staff/company-search')
          },
        },
      ]
    },
  },
}
</script>
