<template>
  <base-storage-wrapper
    v-bind="$attrs"
    class="min-h-screen flex flex-col lg:block"
    v-on="$listeners"
    @reset="setStep(1)"
  >
    <aside class="sticky z-20 top-1.125 left-0 right-0 flex-shrink-0">
      <box-container class="lg:max-w-full">
        <base-progress-top-bar
          :title="title"
          :value="step"
          :total="steps.length"
        />
      </box-container>
    </aside>

    <main
      class="px-6 md:px-10 lg:px-16 pt-6 md:pt-8 lg:pt-10 pb-32 lg:pb-10 lg:min-h-160 lg:mt-6 lg:mb-32 lg:rounded-xl lg:border lg:border-solid w-full max-w-full sm:max-w-xl mx-auto bg-white flex-grow lg:flex-grow-0"
    >
      <base-note v-if="activeStep.note" class="mb-6">
        <base-description v-html="activeStep.note" />
      </base-note>

      <base-form ref="form" class="mt-1" @submit="next">
        <slot :name="`step:${activeStep.key || step}`">
          <span class="absolute w-0 h-0" />
        </slot>
      </base-form>

      <slot :step="step" :active-step="activeStep" :next="next" :back="back" />
    </main>
  </base-storage-wrapper>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    // { title: string, note: string }
    steps: { type: Array, required: true },
    titlePrefix: { type: String, default: '' },
  },
  computed: {
    step() {
      return Math.max(
        1,
        Math.min(this.steps.length, +this.$route.query.step || 1)
      )
    },

    activeStep() {
      return this.steps[this.step - 1]
    },

    title() {
      return [this.activeStep?.title, this.titlePrefix]
        .filter(Boolean)
        .join(' – ')
    },
  },
  methods: {
    next() {
      if (!this.$refs.form.validate()) {
        this.$alert.error({
          title: 'Hoppla!',
          text: 'Leider wurden bei einem/einigen Eingabe(n) nicht wünschenswert ausgefüllt. Wir wissen, dass du das kannst! Versuch es erneut.',
        })
        return
      }

      if (this.step < this.steps.length) {
        this.setStep(this.step + 1)
      } else {
        this.$emit('done')
      }
    },

    back() {
      if (this.step === 1) {
        this.$emit('dismiss')
      } else {
        this.setStep(this.step - 1)
      }
    },
    setStep(step) {
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          step,
        },
      })
    },
  },
}
</script>
