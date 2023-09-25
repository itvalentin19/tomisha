<template>
  <nuxt-child />
</template>

<script>
import { UserType } from '~/constants'
export default {
  layout: 'basic',
  middleware({ redirect, $auth }) {
    if (!($auth?.company?.type === UserType.AGENCY)) {
      return redirect('/')
    }
  },
}
</script>
