import profile from './profile'

export default function (context) {
  return {
    profile: profile(context),
  }
}
