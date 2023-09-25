const profilePages = [
  '/profile/steps',
  '/profile/edit/personal-info',
  '/profile/edit/languages',
  '/profile/edit/education',
  '/profile/edit/training',
  '/profile/edit/hobbies',
  '/profile/edit/soft-skills',
  '/profile/edit/experiences',
  '/profile/edit/references',
  '/profile/edit/additional-files',
  '/profile/edit/status',
]

const companyPages = [
  '/company/search',
  '/company/edit/basic-info',
  '/company/edit/locations',
  '/company/edit/staffs',
]

export default function ({ $auth, redirect, route }) {
  if (!$auth.isAuthenticated) return

  const { progress, type } = $auth.user

  const max =
    type === 2 ? profilePages.length + companyPages.length : profilePages.length
  if (progress >= max) {
    return
  }

  const i = profilePages.indexOf(route.path)
  if (i !== -1 && progress >= i) {
    return
  }

  const j = companyPages.indexOf(route.path)
  if (type === 2) {
    if (j !== -1 && progress - profilePages.length >= j) {
      return
    }
  } else if (j !== -1) {
    return redirect('/')
  }

  const page = profilePages.concat(companyPages)[progress]
  if (page) {
    return redirect(page)
  }
}
