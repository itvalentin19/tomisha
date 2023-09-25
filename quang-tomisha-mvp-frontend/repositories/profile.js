export default (ctx) => ({
  fetchDegrees({ type } = {}) {
    return ctx.$axios.get('/degree', {
      params: ctx.$utils.filterObject({ type }),
    })
  },

  mutateDegree({ id, ...exp }) {
    return ctx.$axios[id ? 'patch' : 'post']('/degree/' + (id || ''), exp)
  },

  removeDegree({ id }) {
    return ctx.$axios.delete('/degree/' + id)
  },
})
