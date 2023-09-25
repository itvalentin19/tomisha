export default function ({ $axios }) {
  $axios.onResponse((response) => (response ? response.data : null))

  $axios.onResponseError((error) => {
    throw error.response ? error.response.data.message : error
  })
}
