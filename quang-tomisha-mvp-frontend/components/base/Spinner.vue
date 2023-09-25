<template>
  <div class="base-spinner" :class="{ primary }">
    <div class="base-spinner__part top">
      <div class="base-spinner__rotator"></div>
    </div>
    <div class="base-spinner__part bottom">
      <div class="base-spinner__rotator"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    primary: Boolean,
  },
}
</script>

<style lang="scss">
.base-spinner {
  font-size: 2em;
  height: 1em;
  width: 1em;

  &.primary {
    .base-spinner__rotator {
      border-right-color: #319795;
      border-top-color: #319795;
    }
  }

  &__part {
    overflow: hidden;
    height: calc(1em / 2);
    width: 1em;

    &.bottom {
      transform: rotate(180deg) scale(-1, 1);
    }
  }

  &__rotator {
    width: 1em;
    height: 1em;
    border: calc(1em / 6) solid transparent;
    border-right-color: white;
    border-top-color: white;
    border-radius: 50%;
    box-sizing: border-box;
    animation: base-spinner-animation 3s ease-in-out infinite;
    transform: rotate(-200deg);
  }
}

@keyframes base-spinner-animation {
  0% {
    border-width: calc(1em / 6);
  }
  25% {
    border-width: calc(1em / 12);
  }
  50% {
    transform: rotate(115deg);
    border-width: calc(1em / 6);
  }
  75% {
    border-width: calc(1em / 12);
  }
  100% {
    border-width: calc(1em / 6);
  }
}
</style>
