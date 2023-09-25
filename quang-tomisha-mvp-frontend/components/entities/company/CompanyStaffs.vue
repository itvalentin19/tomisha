<template>
  <div>
    <staff-editor ref="editor" :company="company" class="mb-8 max-w-lg" />

    <staff-table
      v-if="value.length"
      :items="staffs"
      :company="company"
      :class="{ 'md:-mx-10 lg:-mx-16': !wide }"
    />
  </div>
</template>

<script>
import StaffEditor from '~/components/entities/staff/StaffEditor'
import StaffTable from '~/components/entities/staff/StaffTable'
export default {
  components: {
    StaffEditor,
    StaffTable,
  },
  props: {
    company: { type: Object, default: null },
    value: { type: Array, default: () => [] },
    wide: Boolean,
  },
  data() {
    return {
      staffs: [],
    }
  },
  created() {
    this.value.forEach(async (item) => {
      const profile = await this.$axios.get('/user/' + item.user.slug)
      if (profile?.occupations.length > 0) {
        item.profession = profile?.occupations[0]?.profession
      } else {
        item.profession = {
          title: '',
        }
      }
      this.staffs.push(item)
    })
  },
}
</script>
