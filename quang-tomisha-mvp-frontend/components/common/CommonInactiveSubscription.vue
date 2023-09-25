<template>
  <div v-once>
    <base-figure
      img="/img/sub_inactive.svg"
      title="Abo Inaktiv"
      text="Da dein Abo zurzeit inaktiv ist, ist es dir nicht möglich, auf diesen Bereich zuzugreifen."
      class="mb-12 max-w-lg"
    />

    <base-button primary to="/edit/subscription"> Abo aktivieren </base-button>
  </div>
</template>
