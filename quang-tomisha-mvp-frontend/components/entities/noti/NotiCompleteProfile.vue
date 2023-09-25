<template>
  <base-card disabled>
    <base-figure
      img="/img/noti_complete_profile.svg"
      title="Beende dein Profil"
      text="Um sich zu bewerben zu können, musst du zuerst dein Profil vollständig ausfüllen."
      class="mb-12"
    />

    <base-button
      primary
      :to="
        $auth.user.progress < 100
          ? '/edit/profile?continue=auto'
          : '/edit/occupation/new'
      "
    >
      Jetzt vervollständigen
    </base-button>
  </base-card>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>
