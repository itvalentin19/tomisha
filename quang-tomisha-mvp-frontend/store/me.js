import { DegreeType, DocumentGroup } from '~/constants'

export const state = () => ({
  personalInfo: null,
  me: null,
  // statusesColor: {
  //   1: 'teal',
  //   2: 'yellow',
  //   3: 'orange',
  //   4: 'red',
  // },
})

export const actions = {
  fetchBriefMe({ commit }) {
    return this.$axios
      .get('/me/brief')
      .then((me) => commit('setState', { me }))
      .catch(() => {})
  },

  fetchPersonalInfo({ commit }) {
    return this.$axios.get('/me').then((me) => {
      commit('setState', { personalInfo: transformPersonalInfo(me) })
    })
  },

  updatePersonalInfo({ state, commit }, rawChanges) {
    const payload = detransformPersonalInfo(rawChanges)
    const me = detransformPersonalInfo(state.personalInfo || {})

    for (const key of Object.keys(payload)) {
      let isDiff = true
      const isArray = Array.isArray(payload[key])

      if (!(key in me)) {
        isDiff = true
      } else if (isArray && typeof payload[key][0] === 'object') {
        payload[key] = payload[key].map((item) => {
          if (!item.id) return item

          const initialItem = me[key].find(({ id }) => id === item.id)
          return !this.$utils.isModified(initialItem, item)
            ? { id: item.id }
            : item
        })

        isDiff =
          payload[key].length !== me[key].length ||
          payload[key].some((item) => !item.id || Object.keys(item).length > 1)
      } else if (payload[key] instanceof Date) {
        isDiff =
          !me[key] || new Date(me[key]).valueOf() !== payload[key].valueOf()
      } else if (payload[key] && typeof payload[key] === 'object' && !isArray) {
        isDiff =
          !me[key] ||
          !payload[key].id ||
          this.$utils.isModified(payload[key], me[key])
      } else {
        isDiff = payload[key] !== me[key]
      }

      if (!isDiff) {
        delete payload[key]
      }
    }

    if (!Object.keys(payload).length) return

    return this.$axios
      .patch('me', payload)
      .then((res) => {
        const changes = this.$utils.extract(res, Object.keys(payload))
        for (const key of Object.keys(changes)) {
          if (
            Array.isArray(changes[key]) &&
            typeof changes[key][0] === 'object'
          ) {
            changes[key] = changes[key].map((change) => {
              return Object.keys(change).length === 1
                ? me[key].find((item) => item.id === change.id)
                : change
            })
          }
        }
        commit('setState', {
          personalInfo: {
            ...state.personalInfo,
            ...transformPersonalInfo(changes),
          },
        })
        return changes
      })
      .catch((e) => this.$alert.error({ title: 'Error', text: e }))
  },
}

export const mutations = {
  setState(state, data) {
    Object.entries(data).forEach(([key, val]) => {
      state[key] = val
    })
  },
}

function transformPersonalInfo(me) {
  const { documents, hobbies, degrees = [], ...output } = me

  output.hobbies = hobbies || []

  if (documents) {
    output.residencePermit =
      documents.find((d) => d.group === DocumentGroup.RESIDENCE_PERMIT) || null
    output.vehicleRegistrations = documents.filter(
      (d) => d.group === DocumentGroup.VEHICLE_REGISTRATION
    )
  }

  output.languageCount = degrees.filter(
    (e) => e.type === DegreeType.LANGUAGE
  ).length
  output.schoolCount = degrees.filter(
    (e) => e.type === DegreeType.SCHOOL
  ).length
  output.trainingCount = degrees.filter(
    (e) => e.type === DegreeType.TRAINING
  ).length

  return output
}

function detransformPersonalInfo(payload) {
  const {
    // Need transformation
    residencePermit,
    vehicleRegistrations,

    // Exclude
    languages,
    schools,
    trainings,

    ...output
  } = payload

  if (residencePermit !== undefined || vehicleRegistrations) {
    output.documents = []
      .concat(addGroupEach(residencePermit, DocumentGroup.RESIDENCE_PERMIT))
      .concat(
        addGroupEach(vehicleRegistrations, DocumentGroup.VEHICLE_REGISTRATION)
      )
  }

  return output
}

function addGroupEach(arr, group) {
  return []
    .concat(arr)
    .filter(Boolean)
    .map((item) => {
      return Object.keys(item).length > 1 ? { ...item, group } : item
    })
}
