import repos from '~/repositories'

export default function (ctx, inject) {
  inject('repos', repos(ctx))
}
