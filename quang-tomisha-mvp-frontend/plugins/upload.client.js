export default function (ctx, inject) {
  inject('upload', (file) => {
    const formData = new FormData()
    formData.append('file', file, file.name || '')

    return ctx.$axios
      .post('/asset', formData)
      .then(
        ({ src }) => process.env.NUXT_ENV_API_BROWSER_BASE_URL + 'public/' + src
      )
      .catch(() => null)
  })
}
