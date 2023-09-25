<template>
  <base-steps-wrapper
    ref="stepper"
    :steps="steps"
    :title-prefix="titlePrefix"
    @done="done"
  >
    <template #step:1>
      <company-branches
        :value="draft.branches"
        :company="draft"
        :create-company-token="$route.query.token"
        class="mb-12"
        @input="onBranchesChange"
      />

      <input-slug v-if="draft.id" v-model="draft.slug" copiable />

      <base-bottom-actions
        :items="[
          {
            text: 'Weiter',
            primary: true,
            disabled: !draft.id,
            handler: () => $refs.stepper.next(),
          },
        ]"
      />
    </template>

    <template #step:2>
      <company-staffs v-model="draft.staffs" :company="draft" />

      <base-bottom-actions
        :items="[
          {
            text: 'Weiter',
            primary: true,
            handler: () => $refs.stepper.next(),
          },
          {
            text: 'Zurück',
            secondary: true,
            handler: () => $refs.stepper.back(),
          },
        ]"
      />
    </template>
  </base-steps-wrapper>
</template>

<script>
import CompanyBranches from '~/components/entities/company/CompanyBranches'
import { UserStatus } from '~/constants'
export default {
  name: 'EditCompany',
  components: {
    CompanyBranches,
  },
  async asyncData({ $axios, $utils, $auth, redirect }) {
    let companyId = $auth.companyId
    if (!companyId) {
      const employment = $auth.user.employments?.find(
        (em) => em.company.status !== UserStatus.DEACTIVATED
      )
      if (employment) {
        companyId = employment.companyId
        $auth.setCompany(companyId)
      } else {
        return {}
      }
    }

    const company = await $axios
      .get('/company/' + companyId)
      .catch(() => redirect('/'))

    return {
      draft: $utils.extract(company, [
        'id',
        'email',
        'slug',
        { from: 'branches', default: [] },
        {
          from: 'staffs',
          default: [],
          transform: (staffs) =>
            staffs.map((staff) => ({
              ...staff,
              branch: company.branches.find((b) => b.id === staff.branchId),
            })),
        },
      ]),
    }
  },
  data() {
    return {
      draft: {
        id: undefined,
        slug: null,
        branches: [],
        staffs: [],
      },

      steps: [
        {
          title: 'Standorte',
          note: 'Füge die Standorte deines Unternehmens hinzu.',
        },
        {
          title: 'Mitarbeiter',
          note: 'Füge die Mitarbeiter die aktuell für deines Unternehmens arbeiten hinzu.',
        },
      ],
    }
  },
  computed: {
    titlePrefix() {
      const headquater = this.draft.branches?.find?.((b) => b.isHeadquater)
      return headquater?.name || ''
    },
  },
  methods: {
    onBranchesChange(branches = []) {
      Object.assign(this.draft, {
        branches,
        staffs: this.draft.staffs.map((staff) => ({
          ...staff,
          branch: branches.find((b) => b.id === staff.branchId),
        })),
      })

      // Only for first branch creation
      if (branches.length && !this.$auth.companyId) {
        const headquater = this.draft.branches[0]
        const company = headquater.company

        Object.assign(this.draft, {
          id: company.id,
          slug: company.slug,
          staffs:
            headquater.staffs?.map?.((staff) => ({
              ...staff,
              user: this.$auth.user,
              branch: this.$utils.extract(headquater, [
                'id',
                'name',
                'status',
                'picture',
              ]),
            })) || [],
        })

        this.$auth.updateUser({
          employments: [
            {
              ...headquater.staffs?.[0],
              companyId: company.id,
              headquater,
              subscriptions: [
                {
                  planId: 'trial',
                  endAt: this.$dayjs().add(1, 'month').toDate(),
                },
                {
                  jobAmount: 1,
                  remainingJobs: 1,
                  endAt: this.$dayjs().add(1, 'year').toDate(),
                },
              ],
            },
          ],
        })
        this.$auth.setCompany(company.id)
      }
    },

    done() {
      this.$confirm({
        img: '/img/company_end.svg',
        title: 'Erstelle jetzt dein Jobinserat',
        text: 'Erstelle jetzt dein erstes kostenlose Jobinserat.',
        okText: 'Jetzt Jobinserat erstellen',
        cancelText: 'Dashboard',
        done: () => this.$router.push('/edit/job/new'),
        cancel: () => this.$router.push('/'),
      })
    },

    updateSlug(newSlug) {
      return this.$axios.patch('/company/' + this.$route.params.id, {
        slug: newSlug,
      })
    },
  },
  head() {
    return {
      title: 'Edit company',
    }
  },
}
</script>
