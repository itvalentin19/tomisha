<template>
  <nuxt-child />
</template>

<script>
export default {
  layout: 'basic',
  middleware({ redirect, $auth }) {
    if (!$auth?.companyId) {
      return redirect('/')
    }
  },
}
</script>
