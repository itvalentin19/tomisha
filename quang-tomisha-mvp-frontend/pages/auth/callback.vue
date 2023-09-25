<template>
  <div />
</template>

<script>
export default {
  auth: 'guest',
  async middleware({ $auth, redirect, route }) {
    try {
      await $auth.login({
        token: route.query.token,
      })
    } catch (e) {
      return redirect('/login')
    }
    return redirect('/')
  },
}
</script>
