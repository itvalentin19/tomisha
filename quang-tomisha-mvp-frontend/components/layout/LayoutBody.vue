<template>
  <main
    class="layout-body"
    :class="[
      wide
        ? 'is-wide lg:mr-8 xl:mr-24 px-6 lg:ml-88 xl:ml-120 py-8 xl:py-14'
        : full
        ? 'is-full lg:ml-80 xl:ml-96'
        : 'mx-auto lg:ml-120 xl:ml-auto max-w-lg px-6 pt-8 pb-24 lg:py-14',
    ]"
  >
    <slot />
  </main>
</template>

<script>
export default {
  props: {
    wide: Boolean,
    full: Boolean,
  },
}
</script>

<style lang="scss">
.layout-body {
  .layout-body {
    &:not(.is-wide):not(.is-full) {
      padding: 1.5rem;

      @media screen and (min-width: 1024px) {
        margin-left: 20rem;
        transform: translateX(-10rem);
      }

      @media screen and (min-width: 1280px) {
        margin-left: auto;
        transform: translateX(-12.5rem);
      }
    }

    &.is-wide {
      @media screen and (min-width: 1024px) {
        margin-left: 2rem;
      }

      @media screen and (min-width: 1280px) {
        padding-top: 2rem;
        padding-bottom: 2rem;
        margin-left: 6rem;
      }
    }
  }
}
</style>
