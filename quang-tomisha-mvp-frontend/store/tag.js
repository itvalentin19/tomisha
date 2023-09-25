import { TagType } from '~/constants'

const cachedParams = {}

export const state = () => ({
  genders: Object.freeze(
    [
      'Weiblich',
      'Männlich',
      'Divers',
      'Intersexuell',
      'Transsexuell',
      'Anders',
      'Egal weiches Geschlecht beziehungsweise nicht definiert',
      'Geschlechtsneutral',
      'Asterisk',
    ].map((text, i) => ({ text, id: i + 1 }))
  ),

  gendersAbbr: Object.freeze(['w', 'm', 'd', 'i', 't', 'a', 'x', 'gn', '*']),

  languages: [],
  languageLevels: [
    'A1 Grundkenntnisse',
    'A2 erweiterte Grundkenntnisse',
    'B1 konversationssicher',
    'B1 flissend',
    'C1 flissend in Word und Schriff',
    'C2 cerhandlungssicher in Word und Schriff',
    'Muttersprache',
  ],

  countries: [],

  totalHobbies: 0,
  hobbies: [],

  totalProfessions: 0,
  professions: [],

  totalHardSkills: 0,
  hardSkills: [],

  softSkills: Object.freeze(
    [
      'Selbstvertrauen',
      'Selbstdisziplin',
      'Selbstreflexion',
      'Engagement',
      'Motivation',
      'Neugier',
      'Belastbarkeit',
      'Eigenverantwortung',
      'Teamfähigkeit',
      'Einfühlungsvermögen (Empathie)',
      'Menschenkenntnis',
      'Kommunikationsfähigkeit',
      'Integrationsbereitschaft',
      'Kritikfähigkeit',
      'Umgangsstil',
      'Präsentationstechniken',
      'Umgang mit Neuen Medien',
      'Analytische Fähigkeiten',
      'Problemlösungskompetenz',
      'Stressresistenz',
      'Organisationstalent',
      'Zeitmanagement',
      'Eigeninitiative',
      'Interkulturelle Kompetenz',
      'Gesprächs- und Verhandlungsführung',
      'Anpassungsfähigkeit',
      'Zuverlässigkeit',
      'Einsatzbereitschaft',
      'Flexibilität',
      'Selbständigkeit',
      'Entscheidungsfähigkeit',
      'Präsentieren und öffentliches Sprechen',
      'Unternehmerisches Denken und Handeln',
      'Team- und Mitarbeiterführung',
      'Kreativität',
      'Dynamische Arbeitsweise',
      'Funktionsübergreifende Kompetenzen',
      'Mitarbeiterführung ',
      'Leistungsbereitschaft',
      'Begeisterungsfähigkeit',
      'Verantwortungsbereitschaft',
      'Leistungsorientiert',
      'Kontaktstärke',
      'Lernbereitschaft',
      'Selbstreflexionsbereitschaft',
      'Soziale Sensibilität',
      'Konfliktlösungsfähigkeit',
      'Kooperationsfähigkeit',
      'Offenheit',
      'Analytisches Denken',
      'Konzeptionelle Fähigkeiten',
      'Strukturierendes Denken',
      'Mitarbeiterführung',
      'Pünktlichkeit',
      'Loyalität',
      'Sozialkompetenz',
    ].map((text, i) => ({ id: i + 1, text }))
  ),

  maritalStatuses: Object.freeze(
    [
      'ledig',
      'verheiratet',
      'verwitwet',
      'geschieden',
      'in eingetragener Lebenspartnerschaft',
      'in aufgehobene Lebenspartnerschaft',
    ].map((text, i) => ({ id: i + 1, text }))
  ),

  residencePermits: Object.freeze(
    [
      'Ausweis B (Aufenthaltsbewilligung)',
      'Ausweis B EU/EFTA (Aufenthaltsbewilligung)',
      'Ausweis C (Niederlassungsbewilligung)',
      'Ausweis C EU/EFTA (Niederlassungsbewilligung)',
      'Ausweis Ci (Aufenthaltsbewilligung mit Erwerbstätigkeit)',
      'Ausweis Ci EU/EFTA (Aufenthaltsbewilligung mit Erwerbstätigkeit)',
      'Ausweis F (Vorläufig aufgenommene Ausländerinnen, Ausländer)',
      'Ausweis G (Grenzgängerbewilligung)',
      'Ausweis G EU/EFTA (Grenzgängerbewilligung)',
      'Ausweis L (Kurzaufenthaltsbewilligung)',
      'Ausweis L EU/EFTA (Kurzaufenthaltsbewilligung)',
      'Ausweis N (Asylsuchende)',
      'Ausweis S (Schutzbedürftige)',
    ].map((text, i) => ({ id: i + 1, text }))
  ),

  preferences: Object.freeze(
    [
      'Teamfähigkeit',
      'Selbstständigkeit',
      'Kundengespräche',
      'Vertragserstellung',
      'Unternehmerisches Denken und Handeln',
      'Kommunikative',
      'Anpassungsfähigkeit',
      'Soziale Kompetenz',
      'Aufgeschlossenheit',
      'Organisationsfähigkeit',
    ].map((text, i) => ({ id: i + 1, text }))
  ),

  vehicleRegistrations: Object.freeze(
    [
      'Kategorie A1',
      'Kategorie A beschränkt',
      'Kategorie A',
      'Kategorie B',
      'Kategorie B1',
      'Kategorie C',
      'Kategorie C1',
      'Kategorie D',
      'Kategorie D1',
      'Kategorie BE',
      'Kategorie CE',
      'Kategorie C1E',
      'Kategorie DE',
      'Kategorie D1E',
      'Kategorie F',
      'Kategorie G',
      'Kategorie M',
      'Flurförderzeuge (Staplerschein)',
    ].map((text, i) => ({ id: i + 1, text }))
  ),

  workingRelationships: Object.freeze(
    ['Lehrstelle', 'Praktikum', 'Festanstellung', 'Temporär', 'Try & Hire'].map(
      (text, i) => ({ id: i + 1, text })
    )
  ),

  referenceCriterias: [
    { key: 'responsiblity', text: 'Arbeitseinsatz' },
    { key: 'independence', text: 'Selbstständigkeit' },
    { key: 'competence', text: 'Initiative/ Kompetenz' },
    { key: 'costAwareness', text: 'Kostenbewusstsein' },
    { key: 'safety', text: 'Sicherheitsverhalten' },
    { key: 'copperation', text: 'Kooperation/ Teamfähigkeit' },
    { key: 'resilience', text: 'Belastbarkeit' },
    { key: 'quality', text: 'Arbeitsqualität, -menge' },
    { key: 'delegation', text: 'Delegation' },
    { key: 'team', text: 'Teamfähigkeit' },
  ],
})

export const mutations = {
  setState(state, data) {
    Object.entries(data).forEach(([key, val]) => {
      state[key] = val
    })
  },
}

export const actions = {
  fetchLanguages({ commit, state }) {
    if (!state.languages.length) {
      return this.$axios.get('/public/tag/languages.json').then((languages) => {
        commit('setState', { languages })
      })
    }
  },

  fetchCountries({ commit, state }) {
    if (!state.countries.length) {
      return this.$axios.get('/public/tag/countries.json').then((countries) => {
        commit('setState', { countries })
      })
    }
  },

  fetchHobbies({ dispatch, commit, state }, filter = {}) {
    return dispatch('fetchTags', {
      filter,
      type: TagType.HOBBY,
      items: state.hobbies,
    }).then(({ total, items }) => {
      commit('setState', {
        totalHobbies: total,
        hobbies: items,
      })
    })
  },

  fetchHardSkills({ state, commit, dispatch }, filter = {}) {
    return dispatch('fetchTags', {
      filter,
      type: TagType.HARD_SKILL,
      items: state.hardSkills,
    }).then(({ total, items }) => {
      commit('setState', {
        totalHardSKills: total,
        hardSkills: items,
      })
    })
  },

  fetchProfessions({ state, commit, dispatch }, filter = {}) {
    return dispatch('fetchTags', {
      filter,
      type: TagType.PROFESSION,
      items: state.professions,
    }).then(({ total, items }) => {
      commit('setState', {
        totalProfessions: total,
        professions: items,
      })
    })
  },

  fetchTags(_, { items, filter = {}, type }) {
    const params = this.$utils.extract(filter, ['title'])
    if (!this.$utils.isModified(filter?.title, cachedParams[type]?.title)) {
      params.skip = items.length
    }
    cachedParams[type] = params

    return this.$axios
      .get('/tag', { params: { ...params, type } })
      .then(({ total, items: newItems }) => ({
        total,
        items: params.skip ? items.concat(newItems) : newItems,
      }))
  },
}

export const getters = {
  getGenderTextById: (state) => (id) => {
    return state.genders[id - 1]?.text
  },

  getSoftSkillTextById: (state) => (id) => {
    return state.softSkills[id - 1]?.text
  },

  getResidencePermitTextById: (state) => (id) => {
    return state.residencePermits[id - 1]?.text
  },

  getVehicleRegistrationTextById: (state) => (id) => {
    return state.vehicleRegistrations[id - 1]?.text
  },

  getMaritalStatusTextById: (state) => (id) => {
    return state.maritalStatuses[id - 1]?.text
  },

  getPreferenceTextById: (state) => (id) => {
    return state.preferences[id - 1]?.text
  },

  languageNameById(state) {
    return state.languages.reduce(
      (obj, cur) => Object.assign(obj, { [cur.id]: cur.name }),
      {}
    )
  },

  getCountryNameById: (state) => (code) => {
    return state.countries.find((c) => c.id === code)?.name
  },

  getReferenceCriteriaText: (state) => (key) => {
    return state.referenceCriterias.find((r) => r.key === key)?.text
  },

  getGenderAbbrById: (state) => (id) => {
    return state.gendersAbbr[id - 1] || ''
  },
}
