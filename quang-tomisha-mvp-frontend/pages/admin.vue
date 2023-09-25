<template>
  <nuxt-child />
</template>

<script>
export default {
  layout: 'admin',
  middleware({ route, redirect, $auth }) {
    if (!$auth.user?.isAdmin) {
      return redirect('/')
    } else if (route.name === 'admin') {
      return redirect('/admin/users')
    }
  },
}
</script>
